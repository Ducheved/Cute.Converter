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
// fastify.register(require('@fastify/jwt'), {
//   secret: 'SYaxj|{QjlNjC#8#f1B~i{OiI}*huw?XAzTFnrXnw9F4mbRblDrA|Y}sNmIpD3Y06MXNds{CP5zO5dV|{DiF7?BRkc|oo{Zu'
// });

fastify.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 50 * 1024 * 1024
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

fastify.listen(port, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});