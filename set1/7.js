
const assert = require('assert')
const crypto = require('crypto')
const fs     = require('fs')

const key    = 'YELLOW SUBMARINE'

var file = Buffer.from(fs.readFileSync('../res/7.txt', 'utf-8'), 'base64')

var decipher = crypto.createDecipheriv('aes-128-ecb', key, null)

var result = decipher.update(file, 'base64', 'utf-8')
result += decipher.final('utf-8')

assert.equal(result.length, 2876)

console.log(result);
