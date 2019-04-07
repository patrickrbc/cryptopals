
const crypto = require('crypto')

/**
* Decrypts a AES ciphertext with a given key and algorithm
* @param {String} ciphertext
* @param {String} key
* @param {String} algorithm
* @return {String} msg
*/
function decrypt (ciphertext, key, alg) {
  var decipher = crypto.createDecipheriv(alg, key, null)
  var out = decipher.update(ciphertext, 'base64', 'utf-8')
  return out += decipher.final('utf-8')
}

module.exports = { decrypt: decrypt }
