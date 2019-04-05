
const assert = require('assert')
const XOR    = require('../lib/xor')
const buf    = Buffer.from('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', 'hex')

var result = XOR.breakSingle(buf)

assert.equal(result.message, 'Cooking MC\'s like a pound of bacon')

console.log(result);
