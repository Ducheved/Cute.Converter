// server/app.js
// Entry Point
const fastify = require('fastify')({ logger: true });
const routes = require('./endpoints/main.js');
const static = require('@fastify/static');
const path = require('path');
const helmet = require('@fastify/helmet');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');
require('dotenv').config();

const port = process.env.PORT;

fastify.register(require('@fastify/multipart'), {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 10000000,  // For multipart forms, the max file size in bytes
    files: 10,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }
});

fastify.register(static, {
  root: path.join(__dirname, 'processors', 'images'),
  prefix: '/images/', 
});

fastify.register(helmet);

fastify.register(cors, {
  origin: "*",
  methods: ["GET","POST"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Image-Data"],
  exposedHeaders: ["Content-Type", "Authorization", "X-Image-Data"],
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

fastify.register(routes);

fastify.listen({ port: port }, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});