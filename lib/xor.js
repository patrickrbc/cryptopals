
const Util = require('./util')

/**
 * XOR two buffers repeating the smallest
 * @param {Buffer} msg
 * @param {Buffer} key
 * @return {Buffer}
 */
function cipher (msg, key) {

  if (key.length > msg.length)
    [msg, key] = [key, msg]

  var result = Buffer.alloc(msg.length)

  for (var i = 0, j = 0, len = msg.length; i < len; i++, j++)
    result[i] = msg[i] ^ key[j % key.length]

  return result
}

/**
 * Break a single-byte XOR cipher and returns the message with the best score
 * @param {String} ciphertext
 * @return {Object} key, msg and score
 */
function breakSingleByte (ciphertext) {
  var plainText, tempBuffer
  var results = []

  for (let keyChar = 0, len = 256; keyChar < len; keyChar++) {

    tempBuffer = cipher(
      Buffer.from(ciphertext, 'hex'),
      Buffer.from(String.fromCharCode(keyChar))
    )

    plainText = tempBuffer.toString()

    if (!/[^\x00-\x7E]/g.test(plainText))
      results.push({
        key: keyChar,
        msg: plainText,
        score: parseFloat(Util.calculateFrequency(plainText).toFixed(6))
      })
  }

  return results.reduce((x, y) => (x && x.score > y.score) ? x : y, 0)
}

function fixed (input, key) {
  var inputBuffer, resultBuffer

  if (typeof key === 'number')
    key = Buffer.from(String.fromCharCode(key), 'ascii')
  else if (!Buffer.isBuffer(key))
    key = Buffer.from(key, 'hex')

  inputBuffer = Buffer.isBuffer(input) ? input : Buffer.from(input, 'hex')
  resultBuffer = cipher(inputBuffer, key)

  return resultBuffer.toString()
}

/**
* Test all key sizes from 2 to 40 and returns the best one
* @param {String} msg
* @return {Number} keysize
*/
function findKeySize (msg) {
  var results = []

  for (let keysize = 2, len = 40; keysize <= len; keysize++)
    results.push({
      keysize : keysize,
      score   : testKeySize(msg, keysize)
    })

  return results.reduce((x, y) => x.score < y.score ? x : y).keysize
}

/**
* Given a message and the size of a key, returns the average hamming distance
* of between chunks of that message
* @param {String} msg
* @param {Number} keysize
* @return {Number} distance
*/
function testKeySize (msg, keysize) {
  var first, second
  const TESTS = 50 // arbitrary
  var score   = 0

  for (let i = 0, len = TESTS; i < len; i++) {
    first  = msg.slice(keysize * i, keysize * (i + 1))
    second = msg.slice(keysize * (i + 2), keysize * (i + 3))
    score += Util.calculateDistance(first, second)
  }

  return score / (TESTS * keysize)
}

module.exports = {
  breakSingleByte: breakSingleByte,
  cipher: cipher,
  findKeySize: findKeySize,
  fixed: fixed
}
