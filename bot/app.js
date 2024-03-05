const fastify = require('fastify')({ logger: true })
require('dotenv').config()
const Bot = require('./class/Bot');
const bot = new Bot(process.env.BOT_TOKEN);

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

if (process.env.USE_WEBHOOKS === true) {
  fastify.post(`/bot${process.env.BOT_TOKEN}`, async (request, reply) => {
    bot.bot.handleUpdate(request.body, reply);
    return reply.sent = true;
  });
}

fastify.listen(process.env.BOT_PORT, '0.0.0.0', (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})