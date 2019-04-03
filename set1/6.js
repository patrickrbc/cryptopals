
const fs = require('fs')

/* Source: http://www.oxfordmathcenter.com/drupal7/node/353 */
const charFrequency = {
  e: 0.12702, t: 0.09056, a: 0.08167, o: 0.07507, i: 0.06966, n: 0.06749,
  s: 0.06327, h: 0.06094, r: 0.05987, d: 0.04253, l: 0.04025, c: 0.02782,
  u: 0.02758, m: 0.02406, w: 0.02360, f: 0.02228, g: 0.02015, y: 0.01974,
  p: 0.01929, b: 0.01492, v: 0.00978, k: 0.00772, j: 0.00153, x: 0.00150,
  q: 0.00095, z: 0.00074
}

var results = []
var file = new Buffer.from(fs.readFileSync('6.txt', 'utf-8'), 'base64')

var KEYSIZE = findKeySize(file)
console.log('KEYSIZE:', KEYSIZE)

//possibleKeySizes.forEach((value) => {

  //var KEYSIZE = value.keysize
  //var blocks = divideInBlocks(file, KEYSIZE)
  //console.log(blocks);

  ////var transposedBlocks = transposeBlocks(blocks, KEYSIZE)
  ////console.log(transposedBlocks);

  ////transposedBlocks.forEach((block) => {
    ////bruteForceSingleByteXOR(block)
  ////})

  //console.log('KEYSIZE:', KEYSIZE);
  ////console.log(results.reduce((x, y) => x.score > y.score ? x : y))
//})

//console.log(calculateDistance('this is a test','wokka wokka!!!'))

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

function bruteForceSingleByteXOR (msg) {
  var msgBuffer  = Buffer.from(msg, 'hex')
  var tempBuffer = Buffer.alloc(msgBuffer.length)
  
  for (let letter = 0, len = 256; letter < len; letter++) {
    for (let i = 0, len = msg.length; i < len; i++)
      tempBuffer[i] = msgBuffer[i] ^ letter

    msg = tempBuffer.toString()

    if (!/[^\x00-\x7E]/g.test(msg))
      results.push({
        message: msg, 
        score: calculateFrequency(msg)
      })
  }
}

function findKeySize (msg) {
  var possibleKeySizes = []
  for (let i = 0, keySize = 2, len = 40; i < len; i++, keySize++) {

    var blocks = divideInBlocks(file, keySize * 2)
    var distance   = 0

    blocks.forEach((block) => {
      var pairs = divideInBlocks(block, keySize)
      distance += calculateDistance(pairs[0], pairs[1])
    })

    //console.log(blocks, distance);
    console.log(distance/keySize);

    return keySize

    var firstHalf  =  msg.slice(0, keySize - 1)
    var secondHalf = msg.slice(keySize, keySize + keySize)

    for (let i = 0, len = msg; i < len; i++) {
    
      calculateDistance(firstHalf, secondHalf)
    }

    possibleKeySizes.push({
      keysize: keySize,
      distance: distance / keySize
    })
  }

  return possibleKeySizes
    .reduce((x, y) => x.distance < y.distance ? x : y).keysize
}

function divideInBlocks (msg, KEYSIZE) {
  var blocks = []
  var arr = []
  for (let i = 0, len = msg.length; i < len; i++) {
    if (i % KEYSIZE === 0 && i > 0) {
      blocks.push(arr.join(''))
      arr = []
    }
    arr.push(msg[i].toString(16))
  }
  return blocks
}

function transposeBlocks (blocks, KEYSIZE) {
  var transposedBlocks = []
  for (let i = 0, len = KEYSIZE; i < len; i++) {
    var newBlock = []
    blocks.forEach((block) => {
      newBlock.push(block[i])
    })
    transposedBlocks.push(newBlock.join(''))
  }
  return transposedBlocks
}
