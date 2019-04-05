
const assert = require('assert')
const fs     = require('fs')

const AES    = require('../lib/aes')

const key    = 'YELLOW SUBMARINE'

var file = Buffer.from(fs.readFileSync('../res/7.txt', 'utf-8'), 'base64')

var result = AES.decrypt(file, key)

assert.equal(result.length, 2876)

console.log(result);
