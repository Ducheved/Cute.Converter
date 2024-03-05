const { Telegraf, Markup, Scenes, session } = require('telegraf');
const axios = require('axios');
const getTypeFile = require('../utils/getTypeFile');
const ImageProcessor = require('../api/ImageProcessor');

const { FORMATS, OPTIMIZATIONS, QUALITIES, QUALITY_VALUES } = require('../constants');

class Bot {
  constructor(token) {
    this.bot = new Telegraf(token);
    this.bot.use(session());

    this.imageProcessingWizard = new Scenes.WizardScene('imageProcessing',
      this.step1.bind(this),
      this.step2.bind(this),
      this.step3.bind(this),
      this.step4.bind(this),
      this.step5.bind(this)
    );

    this.sendImageToServerScene = new Scenes.BaseScene('sendImageToServer', this.sendImageToServer.bind(this));
    this.stage = new Scenes.Stage([this.imageProcessingWizard, this.sendImageToServerScene]);
    this.bot.use(this.stage.middleware());

    this.bot.command('start', (ctx) => {
      ctx.session = {};
      ctx.scene.enter('imageProcessing');
    });

    if (process.env.USE_WEBHOOKS === true) {
      this.bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot${token}`);
    } else {
      this.bot.launch();
    }

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  step1(ctx) {
    ctx.reply('Отправьте изображение файлом, фотографией или стикером для обработки.');
    return ctx.wizard.next();
  }

  async step2(ctx) {
    try {
      const processingMessage = await ctx.reply('Файл обрабатывается...');
      let fileId;
      if (!ctx.message) {
        ctx.wizard.back();
        return ctx.reply('Сообщение не найдено. Пожалуйста, отправьте изображение.');
      }
      if (ctx.message.document) {
        fileId = ctx.message.document.file_id;
      } else if (ctx.message.photo) {
        fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      } else if (ctx.message.sticker) {
        fileId = ctx.message.sticker.file_id;
      } else if (ctx.message.animation) {
        fileId = ctx.message.animation.file_id;
      } else if (ctx.message.gif) {
        fileId = ctx.message.gif.file_id;
      }

      if (!fileId) {
        ctx.wizard.back();
        return ctx.reply('Файл не найден. Пожалуйста, отправьте файл.');
      }

      const fileLink = await ctx.telegram.getFileLink(fileId);
      if (!fileLink) {
        return ctx.reply('Ссылка на файл не найдена.');
      }
      let response;
      try {
        response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      await ctx.telegram.deleteMessage(ctx.chat.id, processingMessage.message_id);
      } catch (error) {
        if (error.code === 'ETIMEDOUT') {
          return ctx.reply('Время ожидания ответа от сервера истекло. Попробуйте еще раз позже.');
        }
        return ctx.reply('Произошла ошибка при скачивании файла.');
      }
      const buffer = Buffer.from(response.data, 'binary');

      const fileType = getTypeFile(buffer);
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/svg'].includes(fileType)) {
        return ctx.reply('Файл не является изображением.');
      }

      ctx.session.file = buffer;
      ctx.session.inputFormat = fileType;
      ctx.reply(`Тип файла: ${fileType}. В какой формат вы хотите перевести изображение?`, Markup.inlineKeyboard(
        FORMATS.map(format => Markup.button.callback(format, format))
      ));
      return ctx.wizard.next();
    } catch (error) {
      ctx.reply('Произошла ошибка при обработке файла.');
      return ctx.wizard.back();
    }
  }

  step3(ctx) {
    ctx.session.format = ctx.callbackQuery.data;
    ctx.reply('Нужна ли оптимизация?', Markup.inlineKeyboard(
      OPTIMIZATIONS.map(optimize => Markup.button.callback(optimize === 'optimize_yes' ? 'Да' : 'Нет', optimize))
    ));
    return ctx.wizard.next();
  }

  step4(ctx) {
    ctx.session.optimize = ctx.callbackQuery.data === 'optimize_yes';
    if (['JPEG', 'PNG', 'WEBP'].includes(ctx.session.format)) {
      ctx.reply('Выберите качество изображения:', Markup.inlineKeyboard(
        QUALITIES.map((quality, index) => Markup.button.callback(quality, QUALITY_VALUES[index].toString()))
      ));
      return ctx.wizard.next();
    } else {
      this.sendImageToServer(ctx);
    }
  }

  step5(ctx) {
    if (ctx.callbackQuery) {
      ctx.session.quality = parseInt(ctx.callbackQuery.data);
    }
    this.sendImageToServer(ctx);
  }

  async sendImageToServer(ctx) {
    try {
      const fileType = ctx.session.inputFormat;
      const quality = ctx.session.quality || 100;
      const startTime = Date.now();
      const processingMessage = await ctx.reply('Файл обрабатывается...');
      const imageProcessor = new ImageProcessor(ctx.session.file, fileType, ctx.session.format, ctx.session.optimize, ctx.session.quality);
      const response = await imageProcessor.sendToEndpoints();
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000 / 60;
      console.log('fileType:', fileType + ' | format:', ctx.session.format + ' | optimize:', ctx.session.optimize + ' | quality:', quality);
      if (response.status !== 200) {
        throw new Error('Server returned an error: ' + response.statusText);
      }
      await ctx.replyWithDocument({ source: Buffer.from(response.data), filename: `image.${ctx.session.format.toLowerCase()}` });
      await ctx.reply(`Файл успешно обработан за ${processingTime.toFixed(2)} минут.`);
      ctx.scene.enter('imageProcessing');
      await ctx.telegram.deleteMessage(ctx.chat.id, processingMessage.message_id);
    } catch (error) {
      console.error(error);
      ctx.reply('Произошла ошибка при отправке изображения на сервер.');
      ctx.scene.enter('imageProcessing');
    }
  }
}

module.exports = Bot;