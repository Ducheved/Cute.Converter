const path = require('path');
const { optimize } = require('svgo');
const common = require('./modules/common');
const sharp = require('sharp');
const archiver = require('archiver');

async function processImages(request, reply) {
    console.log('Processing images...');
    const startTime = Date.now();
    let files = [];
    for await (const part of request.files()) {
        const file = {
            data: await part.toBuffer(),
            mimetype: part.mimetype,
            filename: part.filename
        };
        files.push(file);
    }

    const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/tiff', 'image/gif', 'image/svg+xml'];

    try {
        const archive = archiver('zip');
        reply.header('Content-Type', 'application/zip');
        reply.header('Content-Disposition', 'attachment; filename=images.zip');
        archive.pipe(reply.raw);

        const results = await Promise.all(files.map(async (file) => {
            console.log('Processing file:', file.filename);
            console.log('File MIME type:', file.mimetype);
            const fileBuffer = await common.validateAndConvertToBuffer(file, validMimeTypes);


            const params = request.query;

            let outputBuffer, outputMetadata, outputFormat;
            if (file.mimetype === 'image/svg+xml') {
                const cleanedSvg = await optimize(fileBuffer.toString(), { path: file.filename, ...params.svgoConfig });
                outputFormat = common.determineOutputFormat(params, 'svg', ['webp', 'png', 'jpg', 'tiff', 'svg', 'jpeg']);

                if (outputFormat === 'svg') {
                    outputBuffer = Buffer.from(cleanedSvg.data);
                    outputMetadata = { format: 'svg', width: null, height: null, size: outputBuffer.length };
                } else {
                    let image = sharp(Buffer.from(cleanedSvg.data)).toFormat(outputFormat);
                    image = common.setImageQualityAndFormat(image, fileBuffer, outputFormat, params);
                    image = common.optimizeImage(image, params);
                    image = common.resizeImage(image, params);

                    const result = await common.generateOutputBufferAndMetadata(image);
                    outputBuffer = result.outputBuffer;
                    outputMetadata = result.outputMetadata;
                }
            } else {
                const metadata = await sharp(fileBuffer).metadata();
                outputFormat = common.determineOutputFormat(params, metadata.format, ['png', 'jpg', 'webp', 'tiff', 'jpeg', 'gif']);

                let image = sharp(fileBuffer).toFormat(outputFormat);
                image = common.setImageQualityAndFormat(image, fileBuffer, outputFormat, params);
                image = common.optimizeImage(image, params);
                image = common.resizeImage(image, params);

                const result = await common.generateOutputBufferAndMetadata(image);
                outputBuffer = result.outputBuffer;
                outputMetadata = result.outputMetadata;
            }

            const input = common.createInputObject(file, fileBuffer, params);
            const output = common.createOutputObject(file, outputMetadata, outputFormat, params);
            const result = common.createResultObject(input, output, params, startTime);

            const resultData = Buffer.from(JSON.stringify(result)).toString('base64');
            archive.append(outputBuffer, { name: `${file.filename}.${outputFormat}` });
            //return { outputBuffer, outputFormat, resultData };
            
        }));

        archive.finalize();
    } catch (error) {
        console.error('Error processing images:', error);
        reply
            .header('Content-Type', 'application/json')
            .code(500)
            .send({ error: 'Internal Server Error', message: error.message });
    }
}
module.exports = {
    processImages
}