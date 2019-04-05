
/* Source: http://www.oxfordmathcenter.com/drupal7/node/353 */
const charFrequency = {
  'e': 0.12702, 't': 0.09056, 'a': 0.08167, 'o': 0.07507, 'i': 0.06966,
  'n': 0.06749, 's': 0.06327, 'h': 0.06094, 'r': 0.05987, 'd': 0.04253,
  'l': 0.04025, 'c': 0.02782, 'u': 0.02758, 'm': 0.02406, 'w': 0.02360,
  'f': 0.02228, 'g': 0.02015, 'y': 0.01974, 'p': 0.01929, 'b': 0.01492,
  'v': 0.00978, 'k': 0.00772, 'j': 0.00153, 'x': 0.00150, 'q': 0.00095,
  'z': 0.00074, ' ': 1
}

function calculateFrequency (string) {
  return string.toLowerCase().split('')
    .reduce((sum, value) => sum + (charFrequency[value] || 0), 0)
}

function dec2bin (dec) {
  var binaryNum = (dec >>> 0).toString(2);
  var bitArr = []

  // fill 8 bit array with zeros
  for (let i = 8, j = 1 ; i > 0; i--, j++)
    bitArr[i] = binaryNum[binaryNum.length - j] || '0'

  return bitArr
}

function calculateDistance (m1, m2) {
  var distance = 0
  var first    = []
  var second   = []

  m1 = Buffer.from(m1 || '0', 'ascii')
  m2 = Buffer.from(m2 || '0', 'ascii')

  // create bit array
  for (let i = 0, len = m1.length; i < len; i++)
    first = first.concat(dec2bin(m1[i]))

  for (let i = 0, len = m2.length; i < len; i++)
    second = second.concat(dec2bin(m2[i]))

  // calculate different bits
  for (let i = 0, len = first.length; i < len; i++)
    if (first[i] ^ second[i])
      distance += 1

  return distance
}

module.exports = {
  calculateDistance: calculateDistance,
  calculateFrequency: calculateFrequency,
  dec2bin: dec2bin
}
