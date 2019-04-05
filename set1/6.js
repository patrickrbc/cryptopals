const fs     = require('fs')
const assert = require('assert')
const XOR    = require('../lib/xor')
const Util   = require('../lib//util')

var keySize, blocks, fileDecoded, result
var keyScores = []

fileDecoded = Buffer.from(fs.readFileSync('../res/6.txt', 'utf-8'), 'base64')

keySize     = XOR.findKeySize(fileDecoded)

blocks      = transposeBlocks(divideInBlocks(fileDecoded, keySize), keySize)

result      = XOR.cipher(fileDecoded, findKey(blocks)).toString()

assert.equal(result.length, 2876)

console.log(result)

function findKey (transposedBlocks) {
  var keys = []
  transposedBlocks.forEach((block) => {
    var a = XOR.breakSingle(block)
    keys.push(a.key)
  })

  var KEY = ''
  for (let i = 0, len = keys.length; i < len; i++)
    KEY += String.fromCharCode(keys[i])

  return KEY
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
    for (let j = 0, len = blocks.length; j < len; j++)
      transposedBlockBuffer[j] = blocks[j][i]
    transposedBlocks.push(Buffer.from(transposedBlockBuffer))
  }

  return transposedBlocks
}
