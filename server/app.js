const fastify = require('fastify')({ logger: true });
const routes = require('./endpoints/main.js');
const static = require('@fastify/static');
const path = require('path');
const helmet = require('@fastify/helmet');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');
const metricsPlugin = require('fastify-metrics');
const metricsUtils = require('./utils/metrics');
require('dotenv').config();

const { ADDRESS = 'localhost', PORT = '33250' } = process.env;

fastify.register(require('@fastify/multipart'), {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: 100 * 1024 * 1024,
    files: 10,
    headerPairs: 2000,
    parts: 1000
  }
});
fastify.register(helmet);
fastify.register(metricsPlugin, {
  endpoint: '/metrics',
  onRequest: (request, reply, done) => {
    metricsUtils.handleRequest(fastify.metrics)(request, reply, done);
  },
  onResponse: (request, reply, done) => {
    metricsUtils.handleResponse(fastify.metrics)(request, reply, done);
  },
});
fastify.register(cors, {
  origin: ["*", "http://frnt", "https://frnt", "http://localhost"],
  methods: ["GET","POST"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Image-Data"],
  exposedHeaders: ["Content-Type", "Authorization", "X-Image-Data"],
});
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});
fastify.register(routes);
fastify.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})