const common = require('./modules/common');
const sharp = require('sharp');

async function processImage(request, reply) {
  const startTime = Date.now();
  const data = await request.file();
  const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/tiff', 'image/gif', 'image/avif'];
  const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'gif', 'avif'];
  const fileBuffer = await common.validateAndConvertToBuffer(data, validMimeTypes);

  const params = request.query;
  const metadata = await sharp(fileBuffer).metadata();

  const outputFormat = common.determineOutputFormat(params, metadata.format, validFormats);

  let image = sharp(fileBuffer).toFormat(outputFormat);
  image = common.setImageQualityAndFormat(image, fileBuffer, outputFormat, params);
  image = common.resizeImage(image, params);

  const { outputBuffer, outputMetadata } = await common.generateOutputBufferAndMetadata(image);

  const input = common.createInputObject(data, fileBuffer, params, metadata);
  const output = common.createOutputObject(data, outputMetadata, outputFormat, params);
  const result = common.createResultObject(input, output, params, startTime);

  const resultData = Buffer.from(JSON.stringify(result)).toString('base64');
  reply
    .header('Content-Type', `image/${outputFormat}`)
    .header('X-Image-Data', resultData)
    .send(outputBuffer);
}

module.exports = {
  processImage
};