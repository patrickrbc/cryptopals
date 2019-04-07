
/**
* Computes the score of a string according to the frequency letters
* @param {String} string
* @return {Number} score
*/
function calculateFrequency (string) {

  /* Source: http://www.oxfordmathcenter.com/drupal7/node/353 */
  const charFrequency = {
    'e': 0.12702, 't': 0.09056, 'a': 0.08167, 'o': 0.07507, 'i': 0.06966,
    'n': 0.06749, 's': 0.06327, 'h': 0.06094, 'r': 0.05987, 'd': 0.04253,
    'l': 0.04025, 'c': 0.02782, 'u': 0.02758, 'm': 0.02406, 'w': 0.02360,
    'f': 0.02228, 'g': 0.02015, 'y': 0.01974, 'p': 0.01929, 'b': 0.01492,
    'v': 0.00978, 'k': 0.00772, 'j': 0.00153, 'x': 0.00150, 'q': 0.00095,
    'z': 0.00074, ' ': 1
  }

  return string.toLowerCase().split('')
    .reduce((sum, value) => sum + (charFrequency[value] || 0), 0)
}

/**
* Calculates the Hamming distance between two strings
* @param {String} string1
* @param {String} string2
* @return {Number} distance 
*/
function calculateDistance (string1, string2) {
  var distance = 0
  var first, second

  string1 = Buffer.from(string1 || '0', 'ascii')
  string2 = Buffer.from(string2 || '0', 'ascii')

  // compose the binary representation of the strings 
  for (let i = 0, len = string1.length; i < len; i++)
    first += dec2bin(string1[i])

  for (let i = 0, len = string2.length; i < len; i++)
    second += dec2bin(string2[i])

  // count the number of different bits
  for (let i = 0, len = first.length; i < len; i++)
    if (first[i] ^ second[i])
      distance++

  return distance
}

/**
* Converts a decimal number to a 8 char binary representation
* @param {Number} decimal number
* @return {String} binary representation
*/
function dec2bin (dec) {
  var binaryNum = (dec >>> 0).toString(2);
  while (binaryNum.length < 8)
    binaryNum = '0' + binaryNum
  return binaryNum
}

/**
* Divide a string into arrays of the given size
* @param {String} string
* @return {Number} size
*/
function divideInBlocks (string, size) {
  var blocks = []
  for (let i = 0, len = Math.floor(string.length / size); i < len; i++)
    blocks.push(Buffer.from(string).slice(i * size, (i * size) + size))
  return blocks
}

/**
* Transpose blocks: make a block that is the first byte of every block,
* and a block that is the second byte of every block, and so on.
* @param {String[]} array of strings ['abc', 'def', 'ghi']
* @return {String[]} array of strings transposed ['adg', 'beh', 'cfi']
*/
function transposeBlocks (blocks) {
  var transposedBlocks = []
  var transposedBlockBuffer = Buffer.alloc(blocks.length)
  var blockSize = blocks[0].length
  for (let i = 0, len = blockSize; i < len; i++) {
    for (let j = 0, len = blocks.length; j < len; j++)
      transposedBlockBuffer[j] = blocks[j][i]
    transposedBlocks.push(Buffer.from(transposedBlockBuffer))
  }

  return transposedBlocks
}

module.exports = {
  calculateDistance: calculateDistance,
  calculateFrequency: calculateFrequency,
  dec2bin: dec2bin,
  divideInBlocks: divideInBlocks,
  transposeBlocks: transposeBlocks
}
