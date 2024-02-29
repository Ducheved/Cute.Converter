const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
  validateAndConvertToBuffer: async function(data, validMimeTypes) {
    const mimetype = data.mimetype;
    if (!validMimeTypes.includes(mimetype)) {
      throw new Error(`Invalid file type. Only ${validMimeTypes.join(', ')}`);
    }
    return await data.toBuffer();
  },

  saveFile: function(data, fileData, dir) {
    const serverDir = path.resolve(__dirname, '..', '..');
    const filePath = path.join(serverDir, dir, `${Date.now()}-${data.filename}`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, fileData || '');
    return filePath;
  },


  determineOutputFormat: function(params, defaultFormat, validFormats) {
    return (validFormats.includes(params.format)) ? params.format : defaultFormat;
  },

  setImageQuality: function(image, outputFormat, quality) {
    if (outputFormat === 'jpeg') {
      return image.jpeg({ quality });
    } else if (outputFormat === 'webp') {
      return image.webp({ quality });
    } else if (outputFormat === 'png') {
      const compressionLevel = 9 - Math.floor(quality / 11);
      return image.png({ compressionLevel });
    } else if (outputFormat === 'jpg') {
      return image.jpeg({ quality });
    } else if (outputFormat === 'tiff') {
      return image.tiff({ quality });
    }
    return image;
  },

  setImageQualityAndFormat: function(image, fileBuffer, outputFormat, params) {
    let processedImage = sharp(fileBuffer).toFormat(outputFormat);
    if (params.quality) {
      const quality = parseInt(params.quality, 10);
      if (isNaN(quality) || quality < 1 || quality > 100) {
        throw new Error('Quality must be an integer between 1 and 100');
      }
      processedImage = this.setImageQuality(processedImage, outputFormat, quality);
    }
    return processedImage;
  },

  optimizeImage: function(image, params) {
    return params.optimize ? image.flatten({ background: { r: 255, g: 255, b: 255 } }) : image;
  },

  resizeImage: function(image, params) {
    if (params.resize) {
      let { width, height } = JSON.parse(params.resize);
      if (width === 'auto') width = null;
      if (height === 'auto') height = null;
      return image.resize(width, height);
    }
    return image;
  },

  generateOutputBufferAndMetadata: async function(image) {
    const outputBuffer = await image.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();
    return { outputBuffer, outputMetadata };
  },

  createResultObject: function(input, output, params, startTime) {
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
  createInputObject: function(data, fileBuffer, params, metadata) {
    return {
      size: metadata ? metadata.size : fileBuffer.length,
      dimensions: metadata ? { width: metadata.width, height: metadata.height } : undefined,
      format: metadata ? metadata.format : 'svg',
      quality: params.quality || 'not specified',
      name: data.filename
    };
  },

  createOutputObject: function(data, outputMetadata, outputFormat, params) {
    return {
      size: outputMetadata.size,
      dimensions: { width: outputMetadata.width, height: outputMetadata.height },
      format: outputFormat,
      quality: params.quality || 'not specified',
      name: `${data.filename}.${outputFormat}`
    };
  },
  
  // sendResponseAndDeleteTempFiles: function(reply, outputFormat, result, outputBuffer, inputPath, outputPath) {
  //   try {
  //     fs.unlinkSync(inputPath);
  //     fs.unlinkSync(outputPath);
  //   } finally {
  //     reply
  //       .header('Content-Type', `image/${outputFormat}`)
  //       .header('X-Image-Data', JSON.stringify(result))
  //       .send(outputBuffer);
  //   }
  // }
  sendResponseAndDeleteTempFiles: function(reply, outputFormat, result, outputBuffer, inputPath, outputPath) {
    try {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    } finally {
      const resultData = Buffer.from(JSON.stringify(result)).toString('base64');
      reply
        .header('Content-Type', `image/${outputFormat}`)
        .header('X-Image-Data', resultData)
        .send(outputBuffer);
    }
  }
};