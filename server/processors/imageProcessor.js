// server/processors/imageProcessor.js
// Image processing logic
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage(request, reply) {
  const startTime = Date.now(); // Start the timer

  const data = await request.file();

  // Validate the file type
  const mimetype = data.mimetype;
  const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/tiff', 'image/gif'];
  if (!validMimeTypes.includes(mimetype)) {
    throw new Error('Invalid file type. Only png, jpg, jpeg, webp, tiff, gif');
  }

  const fileBuffer = await data.toBuffer();

  const params = request.query;
  const { version, object, method } = request.params;

  const metadata = await sharp(fileBuffer).metadata();
  const inputFormat = metadata.format;
  const inputSize = metadata.size;
  const inputDimensions = { width: metadata.width, height: metadata.height };

  // Save the input file
  const inputPath = path.resolve(__dirname, '..', 'temp', 'input', `${Date.now()}-${data.filename}`);
  fs.mkdirSync(path.dirname(inputPath), { recursive: true }); // Ensure the directory exists
  fs.writeFileSync(inputPath, fileBuffer);

  let outputFormat;
  if (['png', 'jpg', 'webp', 'tiff', 'jpeg', 'gif'].includes(params.format)) {
    outputFormat = params.format;
  } else {
    outputFormat = inputFormat; // default to the input format if the requested output format is not supported
  }

  const outputPath = path.resolve(__dirname, '..', 'temp', 'output', `${data.filename}-${Date.now()}.${outputFormat}`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // Ensure the directory exists

  let image = sharp(fileBuffer).toFormat(outputFormat);

  if (params.quality) {
    const quality = parseInt(params.quality, 10);
    if (isNaN(quality) || quality < 1 || quality > 100) {
      throw new Error('Quality must be an integer between 1 and 100');
    }
  
    if (outputFormat === 'jpeg') {
      image = image.jpeg({ quality });
    } else if (outputFormat === 'webp') {
      image = image.webp({ quality });
    } else if (outputFormat === 'png') {
      const compressionLevel = 9 - Math.floor(quality / 11); // convert quality to a scale of 0-9, with 9 being the lowest quality
      image = image.png({ compressionLevel });
    }
  }

  if (params.optimize) {
    image = image.flatten({ background: { r: 255, g: 255, b: 255 } }); // flatten the image
  }

  if (params.resize) {
    let { width, height } = JSON.parse(params.resize);
    if (width === 'auto') width = null;
    if (height === 'auto') height = null;
    image = image.resize(width, height);
  }

  const outputBuffer = await image.toBuffer();
  const outputMetadata = await sharp(outputBuffer).metadata();
  const outputSize = outputMetadata.size;
  const outputDimensions = { width: outputMetadata.width, height: outputMetadata.height };

  fs.writeFileSync(outputPath, outputBuffer);

  const processingTime = Date.now() - startTime; // Calculate the processing time

  const result = {
    input: {
      size: inputSize,
      dimensions: inputDimensions,
      format: inputFormat,
      quality: params.quality || 'not specified',
      name: data.filename
    },
    output: {
      size: outputSize,
      dimensions: outputDimensions,
      format: outputFormat,
      quality: params.quality || 'not specified',
      name: `${data.filename}.${outputFormat}`
    },
    optimization: {
      sizeReduction: ((inputSize - outputSize) / inputSize) * 100,
      qualityChange: params.quality ? params.quality - 100 : 'not specified'
    },
    processingTime,
    date: new Date()
  };

  try {
    reply
      .header('Content-Type', `image/${outputFormat}`)
      .header('X-Image-Data', JSON.stringify(result))
      .send(outputBuffer);
  } finally {
    // Delete the temporary files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  }
}

module.exports = {
  processImage
};