const fs = require('fs')

module.exports = function getTypeFile(input) {
  let buffer;
  
  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else {
    buffer = fs.readFileSync(input);
  }

  const type = buffer.toString('hex', 0, 4)

  switch (type) {
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
      return 'image/jpeg'
    case '89504e47':
      return 'image/png'
    case '52494646':
      return 'image/webp'
    case '47494638':
      return 'image/gif'
    case '3c3f786d':
      return 'image/svg+xml'
    default:
      return 'Unknown'
  }
}