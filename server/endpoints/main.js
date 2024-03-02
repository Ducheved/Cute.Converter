const imageProcessor = require('../processors/imageProcessor');
const svgProcessor = require('../processors/svgProcessor');
const hostProcessor = require('../processors/hostProcessor');
const multiProcessor = require('../processors/multiProcessor');

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

  fastify.route({
    method: 'GET',
    url: '/api/v1/host',
    handler: hostProcessor.getHostInfo
  });

  fastify.route({
    method: 'POST',
    url: '/api/v1/images/process/multiple',
    handler: multiProcessor.processImages
  });
  
  done();
};