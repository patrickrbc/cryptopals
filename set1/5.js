
const assert = require('assert')
const XOR    = require('../lib/xor')
const KEY    = 'ICE'

var msg = Buffer.from(
`Burning 'em, if you ain't quick and nimble
I go crazy when I hear a cymbal` , 'ascii')

var result = XOR.cipher(msg, KEY).toString('hex')

assert.equal(result, '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f')

console.log(result);
