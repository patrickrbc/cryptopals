
const assert = require('assert')
const fs     = require('fs')

var ciphertexts = fs.readFileSync('../res/8.txt', 'utf-8').split('\n')

var results = []

ciphertexts.forEach((ciphertext, index) => {
  var cipherTextBlocks = divideInBlocks(ciphertext, 16)

  cipherTextBlocks.forEach((block, i) => {
    results.push({
      line: index + 1,
      ciphertext: ciphertext,
      repetitions: countRepetitions(block, cipherTextBlocks)
    })
  })
})

console.log(results.sort((x, y) => x.repetitions > y.repetitions ? -1 : 1).shift())

function countRepetitions (block, cipherTextBlocks) {
  var sum = 0
  for (let i = 0, len = cipherTextBlocks.length; i < len; i++)
    if (cipherTextBlocks[i] === block)
      sum += 1

  return sum - 1
}

function divideInBlocks (msg, KEYSIZE) {
  var blocks = []
  for (let i = 0, len = Math.floor(msg.length / KEYSIZE); i < len; i++)
    blocks.push(msg.slice(i * KEYSIZE, (i * KEYSIZE) + KEYSIZE))

  return blocks
}
