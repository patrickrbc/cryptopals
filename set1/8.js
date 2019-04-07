
const assert = require('assert')
const fs     = require('fs')
const Util   = require('../lib/util')

var ciphertexts = fs.readFileSync('../res/8.txt', 'utf-8').split('\n')

var results = []

ciphertexts.forEach((ciphertext, index) => {
  var cipherTextBlocks = Util.divideInBlocks(ciphertext, 16)

  cipherTextBlocks.forEach((block, i) => {
    results.push({
      line: index + 1,
      ciphertext: ciphertext,
      repetitions: Util.countRepetitions(block, cipherTextBlocks)
    })
  })
})

var result = results.reduce((x, y) => x.repetitions > y.repetitions ? x : y)

assert.equal(result.line, 133)
assert.equal(result.repetitions, 3)

console.log(result)
