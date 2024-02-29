const os = require('os');

const getHostInfo = (request, reply) => {
  const { UNIT = '1', TYPE = '1' } = process.env;
  const hostname = os.hostname();

  reply.send({ hostname, unit: UNIT, type: TYPE });
};

module.exports = {
  getHostInfo,
};