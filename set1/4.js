
const assert = require('assert')
const fs     = require('fs')
const XOR    = require('../lib/xor')
const Util   = require('../lib//util')

var strings = fs.readFileSync('../res/4.txt', 'utf-8').split('\n')

var decrypted = [], result

strings.forEach((string, index) => {
  result = XOR.breakSingleByte(string)

  if (result) {
    result.string = string
    result.line   = index + 1
    decrypted.push(result)
  }
})

result = decrypted.reduce((x, y) => x.score > y.score ? x : y)

assert.equal(result.message, 'Now that the party is jumping\n')

console.log(result)
