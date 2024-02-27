// server/endpoints/main.js
// API ROUTES
const imageProcessor = require('../processors/imageProcessor');
module.exports = function (fastify, opts, done) {
  fastify.route({
    method: 'POST',
    url: '/api/v1/images/process',
    handler: imageProcessor.processImage
  });

  done();
}