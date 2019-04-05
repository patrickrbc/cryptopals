
const crypto = require('crypto')

function decrypt (input, key) {
  var decipher = crypto.createDecipheriv('aes-128-ecb', key, null)
  var out = decipher.update(input, 'base64', 'utf-8')
  out += decipher.final('utf-8')

  return out
}

module.exports = {
  decrypt: decrypt
}
