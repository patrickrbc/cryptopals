
const assert = require('assert')
const XOR    = require('../lib/xor')
const input  = Buffer.from('1c0111001f010100061a024b53535009181c', 'hex')
const key    = Buffer.from('686974207468652062756c6c277320657965', 'hex')

var result = Buffer.from(XOR.cipher(input, key), 'ascii')
  .toString('hex')

assert.equal(result, '746865206b696420646f6e277420706c6179')

console.log(result)
