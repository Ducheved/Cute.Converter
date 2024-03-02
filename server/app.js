const fs = require('fs');
const path = require('path');
const Fastify = require('fastify');
const routes = require('./endpoints/main.js');
const helmet = require('@fastify/helmet');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');
const metricsPlugin = require('fastify-metrics');
const metricsUtils = require('./utils/metrics');
require('dotenv').config();

const { ADDRESS = 'localhost', PORT = '33250' } = process.env;

// Чтение сертификата SSL и ключа
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, process.env.SRVNAME + '.key')),
  cert: fs.readFileSync(path.join(__dirname, process.env.SRVNAME + '.crt'))
};

// Создание экземпляра Fastify
const fastify = Fastify({
  logger: true,
  https: httpsOptions,
  http2: true
});

// Остальной код остается без изменений...
fastify.register(require('@fastify/multipart'), {
  limits: {
    fieldNameSize: 1000,
    fieldSize: 1000,
    fields: 100,
    fileSize: 1000 * 1024 * 1024,
    files: 100,
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