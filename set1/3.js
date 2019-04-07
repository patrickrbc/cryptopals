
const assert = require('assert')
const XOR    = require('../lib/xor')

var result = XOR.breakSingleByte('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736')

assert.equal(result.msg, 'Cooking MC\'s like a pound of bacon')

console.log(result);
