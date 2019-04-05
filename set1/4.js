
const assert = require('assert')
const fs     = require('fs')
const XOR    = require('../lib/xor')
const Util   = require('../lib//util')

var strings = fs.readFileSync('../res/4.txt', 'utf-8').split('\n')

var decrypted = []

var result

strings.forEach(string => {
  var res = XOR.breakSingle(string)
  if (res) decrypted.push(res)
})

result = decrypted.reduce((x, y) => x.score > y.score ? x : y)

assert.equal(result.message, 'Now that the party is jumping\n')

console.log(result)
