const fs    = require('fs')

/* Source: http://www.oxfordmathcenter.com/drupal7/node/353 */
const charFrequency = {
  e: 0.12702, t: 0.09056, a: 0.08167, o: 0.07507, i: 0.06966, n: 0.06749,
  s: 0.06327, h: 0.06094, r: 0.05987, d: 0.04253, l: 0.04025, c: 0.02782,
  u: 0.02758, m: 0.02406, w: 0.02360, f: 0.02228, g: 0.02015, y: 0.01974,
  p: 0.01929, b: 0.01492, v: 0.00978, k: 0.00772, j: 0.00153, x: 0.00150,
  q: 0.00095, z: 0.00074
}

var file    = fs.readFileSync('4.txt', 'utf-8')
var lines   = file.split('\n')
var results = []

lines.forEach((line) => {
  bruteForceSingleByteXOR(line)
})

console.log(results.reduce((x, y) => x.score > y.score ? x : y))

function calculateFrequency (string) {
  return string.toLowerCase().split('')
    .reduce((sum, value) => sum + (charFrequency[value] || 0), 0)
}

function bruteForceSingleByteXOR (msg) {
  var msgBuffer  = Buffer.from(msg, 'hex')
  var tempBuffer = Buffer.alloc(msgBuffer.length)
  
  for (let letter = 0, len = 256; letter < len; letter++) {
    for (let i = 0, len = msg.length; i < len; i++)
      tempBuffer[i] = msgBuffer[i] ^ letter

    msg = tempBuffer.toString()

    if (!/[^\x00-\x7E]/g.test(msg) && /\s/.test(msg))
      results.push({
        message: msg, 
        score: calculateFrequency(msg)
      })
  }
}

