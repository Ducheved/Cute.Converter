// server/endpoints/main.js
const imageProcessor = require('../processors/imageProcessor');
const svgProcessor = require('../processors/svgProcessor');

module.exports = function (fastify, opts, done) {
  fastify.route({
    method: 'POST',
    url: '/api/v1/images/process',
    handler: imageProcessor.processImage
  });

  fastify.route({
    method: 'POST',
    url: '/api/v1/svg/process',
    handler: svgProcessor.processSvg
  });

  done();
};