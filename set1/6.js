
const fs     = require('fs')
const assert = require('assert')
const XOR    = require('../lib/xor')
const Util   = require('../lib//util')

var key, keysize, blocks, msg, result
var keyScores = []

msg     = Buffer.from(fs.readFileSync('../res/6.txt', 'utf-8'), 'base64')
keysize = XOR.findKeySize(msg)
blocks  = Util.divideInBlocks(msg, keysize)
blocks  = Util.transposeBlocks(blocks, keysize)
key     = findKey(blocks)
result  = XOR.cipher(msg, key).toString()

assert.equal(result.length, 2876)

console.log(result)

function findKey (transposedBlocks) {
  var key = ''
  transposedBlocks.forEach(block => {
    key += String.fromCharCode(XOR.breakSingleByte(block).key)
  })

  return Buffer.from(key, 'ascii')
}
