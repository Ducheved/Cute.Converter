require('dotenv').config()

const apiServer = process.env.API_SERVER;
const apiPort = process.env.API_PORT ? `:${process.env.API_PORT}` : '';

module.exports = `${apiServer}${apiPort}`;