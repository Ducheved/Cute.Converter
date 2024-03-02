const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

module.exports = {
  validateAndConvertToBuffer: async function(data, validMimeTypes) {
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

  processSvg: async function(data, params) {
    const fileBuffer = await this.validateAndConvertToBuffer(data, ['image/svg+xml']);
    const cleanedSvg = await optimize(fileBuffer.toString(), { path: data.filename, ...params.svgoConfig });
  
    const outputFormat = this.determineOutputFormat(params, 'svg', ['webp', 'png', 'jpg', 'tiff', 'svg', 'jpeg']);
  
    let outputBuffer, outputMetadata;
    if (outputFormat === 'svg') {
      outputBuffer = Buffer.from(cleanedSvg.data);
      outputMetadata = { format: 'svg', width: null, height: null, size: outputBuffer.length };
    } else {
      let image = sharp(Buffer.from(cleanedSvg.data)).toFormat(outputFormat);
      image = this.setImageQualityAndFormat(image, fileBuffer, outputFormat, params);
      image = this.optimizeImage(image, params);
      image = this.resizeImage(image, params);
  
      const result = await this.generateOutputBufferAndMetadata(image);
      outputBuffer = result.outputBuffer;
      outputMetadata = result.outputMetadata;
    }
  
    return { outputBuffer, outputMetadata };
  },

  cropImage: function(image, params) {
    if (params.crop) {
      let { top, left, width, height } = JSON.parse(params.crop);
      return image.extract({ top, left, width, height });
    }
    return image;
  },

  applyFilter: function(image, params) {
    if (params.filter) {
      if (params.filter === 'greyscale' || params.filter === 'grayscale') {
        return image.greyscale();
      } else if (params.filter === 'invert') {
        return image.negate();
      }
    }
    return image;
  },

  adjustBrightness: function(image, params) {
    if (params.brightness) {
      const brightness = parseFloat(params.brightness);
      return image.modulate({ brightness });
    }
    return image;
  },

  adjustContrast: function(image, params) {
    if (params.contrast) {
      const contrast = parseFloat(params.contrast);
      return image.modulate({ contrast });
    }
    return image;
  },

  processImage: async function(data, params) {
    const fileBuffer = await this.validateAndConvertToBuffer(data, ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/tiff', 'image/gif']);
  
    const metadata = await sharp(fileBuffer).metadata();
    const outputFormat = this.determineOutputFormat(params, metadata.format, ['png', 'jpg', 'webp', 'tiff', 'jpeg', 'gif']);
  
    let image = sharp(fileBuffer).toFormat(outputFormat);
    image = this.setImageQualityAndFormat(image, fileBuffer, outputFormat, params);
    image = this.optimizeImage(image, params);
    image = this.resizeImage(image, params);
  
    const result = await this.generateOutputBufferAndMetadata(image);
    const outputBuffer = result.outputBuffer;
    const outputMetadata = result.outputMetadata;
  
    return { outputBuffer, outputMetadata };
  },

saveFile: function(data, fileData, dir) {
  if (typeof data !== 'object' || typeof data.filename !== 'string') {
    throw new Error('Invalid data');
  }
  if (typeof fileData !== 'string' && !Buffer.isBuffer(fileData)) {
    throw new Error('Invalid fileData');
  }
  if (typeof dir !== 'string') {
    throw new Error('Invalid dir');
  }
  const serverDir = path.resolve(__dirname, '..', '..');
  const filePath = path.join(serverDir, dir, `${Date.now()}-${data.filename}`);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, fileData || '');
  } catch (err) {
    console.error('Error saving file:', err);
    throw err;
  }
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not saved');
    }
  } catch (err) {
    console.error('Error checking file:', err);
    throw err;
  }
  return filePath;
},


  determineOutputFormat: function(params, defaultFormat, validFormats) {
    return (validFormats.includes(params.format)) ? params.format : defaultFormat;
  },

  setImageQuality: function(image, outputFormat, quality) {
    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      return image.jpeg({ quality, chromaSubsampling: '4:4:4', progressive: true, mozjpeg: true });
    } else if (outputFormat === 'webp') {
      return image.webp({ quality, lossless: true });
    } else if (outputFormat === 'png') {
      return image.png({ quality: Math.round(quality / 100), compressionLevel: Math.round(quality / 100), progressive: true });
    } else if (outputFormat === 'tiff') {
      return image.tiff({ quality });
    }
    return image;
  },

  setImageQualityAndFormat: function(image, fileBuffer, outputFormat, params) {
    if (params.quality >= 95) {
      return image;
    }
  
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
    if (params.optimize === true) {
      console.log(params.optimize)
      return image.removeAlpha();
    }
    return image;
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

  createArchive: function(reply) {
    const archive = archiver('zip');
    reply.header('Content-Type', 'application/zip');
    reply.header('Content-Disposition', 'attachment; filename=images.zip');
    archive.pipe(reply.raw);
    return archive;
  },

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