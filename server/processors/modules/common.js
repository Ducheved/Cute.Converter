const sharp = require('sharp');

module.exports = {
  validateAndConvertToBuffer: async function (data, validMimeTypes) {
    const mimetype = data.mimetype;
    if (!validMimeTypes.includes(mimetype)) {
      throw new Error(`Invalid file type. Only ${validMimeTypes.join(', ')}`);
    }
    if (typeof data.toBuffer === 'function') {
      return await data.toBuffer();
    } else if (Buffer.isBuffer(data.data)) {
      return data.data;
    } else {
      throw new Error('Data must be a buffer or have a toBuffer method');
    }
  },

  determineOutputFormat: function (params, defaultFormat, validFormats) {
    return (validFormats.includes(params.format)) ? params.format : defaultFormat;
  },

  setImageQuality: function (image, outputFormat, params) {
    const optimize = params.optimize === 'true';
    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      return image.jpeg({ quality: params.quality, trellisQuantisation: optimize, overshootDeringing: optimize, progressive: optimize, mozjpeg: optimize, chromaSubsampling: '4:4:4' });
    } else if (outputFormat === 'webp') {
      return image.webp({ quality: params.quality, lossless: !optimize, smartSubsample: !optimize }); 
    } else if (outputFormat === 'png') {
      const invertedQuality = 100 - params.quality;
      const inverted = Math.round(invertedQuality / 11.1111111111);
      let effort = Math.round(params.quality / 10);
      effort = Math.max(1, Math.min(effort, 10));
      console.log('Inverted quality:', invertedQuality, 'inverted effort:', inverted, 'effort:', effort);
      return image.png({ compressionLevel: inverted, effort: effort, adaptiveFiltering: !optimize, progressive: optimize, palette: optimize });
    } else if (outputFormat === 'tiff') {
      return image.tiff({ quality: params.quality, compression: 'jpeg' });
    } else if (outputFormat === 'gif') {
      return image.gif({ quality: params.quality });
    } else if (outputFormat === 'avif') {
      return image.avif({ quality: params.quality });
    } 
    return image;
  },

  setImageQualityAndFormat: function (image, fileBuffer, outputFormat, params) {
    if (params.quality >= 95) {
      return image;
    }
  
    let processedImage = sharp(fileBuffer).toFormat(outputFormat);
    if (params.quality) {
      if (typeof params.quality === 'undefined') {
        throw new Error('Quality parameter is missing');
      }
      const quality = parseInt(params.quality, 10);
      if (isNaN(quality) || quality < 1 || quality > 100) {
        throw new Error('Quality must be an integer between 1 and 100');
      }
      processedImage = this.setImageQuality(processedImage, outputFormat, { ...params, quality });
    }
    return processedImage;
  },
  resizeImage: function (image, params) {
    if (params.resize) {
      let { width, height } = JSON.parse(params.resize);
      if (width === 'auto') width = null;
      if (height === 'auto') height = null;
      return image.resize(width, height);
    }
    return image;
  },

  generateOutputBufferAndMetadata: async function (image) {
    const outputBuffer = await image.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();
    return { outputBuffer, outputMetadata };
  },

  createResultObject: function (input, output, params, startTime) {
    const processingTime = Date.now() - startTime;
    return {
      input,
      output,
      optimization: {
        sizeReduction: ((input.size - output.size) / input.size) * 100,
        qualityChange: params.quality ? params.quality - 100 : 'not specified'
      },
      processingTime,
      date: new Date()
    };
  },
  createInputObject: function (data, fileBuffer, params, metadata) {
    return {
      size: metadata ? metadata.size : fileBuffer.length,
      dimensions: metadata ? { width: metadata.width, height: metadata.height } : undefined,
      format: metadata ? metadata.format : 'svg',
      quality: params.quality || 'not specified',
      name: data.filename
    };
  },

  createOutputObject: function (data, outputMetadata, outputFormat, params) {
    return {
      size: outputMetadata.size,
      dimensions: { width: outputMetadata.width, height: outputMetadata.height },
      format: outputFormat,
      quality: params.quality || 'not specified',
      name: `${data.filename}.${outputFormat}`
    };
  },

};