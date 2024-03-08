const path = require('path');
const { optimize } = require('svgo');
const common = require('./modules/common');
const sharp = require('sharp');

async function processSvg(request, reply) {
  const startTime = Date.now();
  const data = await request.file();
  const fileBuffer = await common.validateAndConvertToBuffer(data, ['image/svg+xml']);

  const params = request.query;
  const cleanedSvg = await optimize(fileBuffer.toString(), { path: data.filename, ...params.svgoConfig });

  const outputFormat = common.determineOutputFormat(params, 'svg', ['webp', 'png', 'jpg', 'tiff', 'svg', 'jpeg']);

  let outputBuffer, outputMetadata;
  if (outputFormat === 'svg') {
    outputBuffer = Buffer.from(cleanedSvg.data);
    outputMetadata = { format: 'svg', width: null, height: null, size: outputBuffer.length };
  } else {
    let image = sharp(Buffer.from(cleanedSvg.data)).toFormat(outputFormat);
    image = common.setImageQualityAndFormat(image, fileBuffer, outputFormat, params);
    image = common.resizeImage(image, params);

    const result = await common.generateOutputBufferAndMetadata(image);
    outputBuffer = result.outputBuffer;
    outputMetadata = result.outputMetadata;
  }

  const input = common.createInputObject(data, fileBuffer, params);
  const output = common.createOutputObject(data, outputMetadata, outputFormat, params);
  const result = common.createResultObject(input, output, params, startTime);
  const resultData = Buffer.from(JSON.stringify(result)).toString('base64');
  reply
    .header('Content-Type', `image/${outputFormat}`)
    .header('X-Image-Data', JSON.stringify(resultData))
    .send(outputBuffer);
}

module.exports = {
  processSvg
};