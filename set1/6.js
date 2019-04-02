
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

  m1 = Buffer.from(m1, 'ascii')
  m2 = Buffer.from(m2, 'ascii')

  // create bit array
  for (let i = 0, len = m1.length; i < len; i++)
    first = first.concat(dec2bin(m1[i]))

  for (let i = 0, len = m2.length; i < len; i++)
    second = second.concat(dec2bin(m2[i]))

  // calculate different bits
  for (let i = 0, len = first.length; i < len; i++)
    if (first[i] !== second[i])
      distance += 1

  return distance
}

console.log(calculateDistance('this is a test','wokka wokka!!!'))
