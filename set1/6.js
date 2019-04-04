const fs = require('fs')

/* Source: http://www.oxfordmathcenter.com/drupal7/node/353 */
const charFrequency = {
  'e': 0.12702, 't': 0.09056, 'a': 0.08167, 'o': 0.07507, 'i': 0.06966,
  'n': 0.06749, 's': 0.06327, 'h': 0.06094, 'r': 0.05987, 'd': 0.04253,
  'l': 0.04025, 'c': 0.02782, 'u': 0.02758, 'm': 0.02406, 'w': 0.02360,
  'f': 0.02228, 'g': 0.02015, 'y': 0.01974, 'p': 0.01929, 'b': 0.01492,
  'v': 0.00978, 'k': 0.00772, 'j': 0.00153, 'x': 0.00150, 'q': 0.00095,
  'z': 0.00074, ' ': 1
}

var keySize, blocks, file, fileDecoded
var keyScores = []

file = fs.readFileSync('6.txt', 'utf-8')
fileDecoded = Buffer.from(file, 'base64')

keySize = findKeySize(fileDecoded)
blocks = transposeBlocks(divideInBlocks(fileDecoded, keySize), keySize)
decrypt(findKey(blocks))

function decrypt (KEY) {
  var buf = Buffer.alloc(fileDecoded.length)

  for (let i = 0, j = 0, len = fileDecoded.length; i < len; i++, j++)
     buf[i] = fileDecoded[i] ^ KEY.charCodeAt(j % KEY.length)

  console.log(buf.toString());
}

function findKey (transposedBlocks) {
  var keys = []
  transposedBlocks.forEach((block) => {
    var a = bruteForceSingleByteXOR(block)
    keys.push(a.key)
  })

  var KEY = ''
  for (let i = 0, len = keys.length; i < len; i++)
    KEY += String.fromCharCode(keys[i])

  return KEY
}

function findKeySize (fileDecoded) {
  var results = []
  var res

  for (let keySize = 2, len = 40; keySize <= len; keySize++) {
    results.push({
      keysize: keySize,
      score: testKeySize(fileDecoded, keySize)
    })
  }

  res = results.reduce((x, y) => x.score < y.score ? x : y)

  return res.keysize
}

function divideInBlocks (msg, KEYSIZE) {
  var blocks = []
  for (let i = 0, len = Math.floor(msg.length/KEYSIZE); i < len; i++)
    blocks.push(Buffer.from(msg).slice(i * KEYSIZE, (i * KEYSIZE) + KEYSIZE))
  return blocks
}

function transposeBlocks (blocks) {
  var transposedBlocks = []
  var transposedBlockBuffer = Buffer.alloc(blocks.length)
  var blockSize = blocks[0].length

  for (let i = 0, len = blockSize; i < len; i++) {
    for (let j = 0, len = blocks.length; j < len; j++) {
      transposedBlockBuffer[j] = blocks[j][i]
    }
    transposedBlocks.push(Buffer.from(transposedBlockBuffer))
  }

  return transposedBlocks
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
    score += calculateDistance(firstHalf, secondHalf)
  }

  distance = score / (nTestCases* keySize)

  possibleKeySizes.push({
    keysize: keySize,
    distance: distance
  })

  return possibleKeySizes
    .reduce((x, y) => x.distance < y.distance ? x : y).distance
}

function calculateFrequency (string) {
  return string.toLowerCase().split('')
    .reduce((sum, value) => sum + (charFrequency[value] || 0), 0)
}

function dec2bin (dec) {
  var binaryNum = (dec >>> 0).toString(2);
  var bitArr = []

  // fill 8 bit array with zeros
  for (let i = 8, j = 1 ; i > 0; i--, j++)
    bitArr[i] = binaryNum[binaryNum.length - j] || '0'
  
  return bitArr
}

function calculateDistance (m1, m2) {
  var distance = 0
  var first    = []
  var second   = []

  m1 = Buffer.from(m1 || '0', 'ascii')
  m2 = Buffer.from(m2 || '0', 'ascii')

  // create bit array
  for (let i = 0, len = m1.length; i < len; i++)
    first = first.concat(dec2bin(m1[i]))

  for (let i = 0, len = m2.length; i < len; i++)
    second = second.concat(dec2bin(m2[i]))

  // calculate different bits
  for (let i = 0, len = first.length; i < len; i++)
    if (first[i] ^ second[i])
      distance += 1

  return distance
}

function bruteForceSingleByteXOR (msgBuffer) {
  var tempBuffer, plainText
  var results = []
  
  for (let letter = 0, len = 256; letter < len; letter++) {

    tempBuffer = Buffer.alloc(msgBuffer.length)

    for (let i = 0, len = msgBuffer.length; i < len; i++)
      tempBuffer[i] = msgBuffer[i] ^ letter

    plainText = tempBuffer.toString()

    if (!/[^\x00-\x7E]/g.test(plainText))
      results.push({
        score: parseFloat(calculateFrequency(plainText).toFixed(6)),
        key: letter,
        message: plainText,
      })
  }

  return results.sort((x, y) => (x.score < y.score) ? 1 : -1).shift()
}
