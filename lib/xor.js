
const Util = require('./util')

/*
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

function breakSingle (msg) {
  var plainText
  var results = []
  var msgBuffer  = Buffer.from(msg, 'hex')
  var tempBuffer = Buffer.alloc(msgBuffer.length)

  for (let keyChar = 0, len = 256; keyChar < len; keyChar++) {
    for (let i = 0, len = msg.length; i < len; i++)
      tempBuffer[i] = msgBuffer[i] ^ keyChar

    plainText = tempBuffer.toString()

    if (!/[^\x00-\x7E]/g.test(plainText))
      results.push({
        score: parseFloat(Util.calculateFrequency(plainText).toFixed(6)),
        key: keyChar,
        message: plainText,
      })
  }

  return results.sort((x, y) => (x.score < y.score) ? 1 : -1).shift()
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

function findKeySize (input) {
  var results = []
  var res

  for (let keySize = 2, len = 40; keySize <= len; keySize++)
    results.push({
      keysize: keySize,
      score: testKeySize(input, keySize)
    })

  res = results.reduce((x, y) => x.score < y.score ? x : y)

  return res.keysize
}

// test a given key size to a msg and returns the score
function testKeySize (msg, keySize) {
  var possibleKeySizes = []
  var firstHalf, secondHalf, distance
  var nTestCases = 50
  var score = 0

  for (let i = 0, len = nTestCases; i < len; i++) {
    firstHalf  = msg.slice(keySize * i, keySize * (i + 1))
    secondHalf = msg.slice(keySize * (i + 2), keySize * (i + 3))
    score += Util.calculateDistance(firstHalf, secondHalf)
  }

  distance = score / (nTestCases * keySize)

  possibleKeySizes.push({
    keysize: keySize,
    distance: distance
  })

  return possibleKeySizes
    .reduce((x, y) => x.distance < y.distance ? x : y).distance
}


module.exports = {
  breakSingle: breakSingle,
  cipher: cipher,
  findKeySize: findKeySize,
  fixed: fixed
}
