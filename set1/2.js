
const input = '1c0111001f010100061a024b53535009181c'

function xor (input) {
  var fixed = Buffer.from('686974207468652062756c6c277320657965', 'hex')
  var result = Buffer.alloc(fixed.length)

  input = Buffer.from(input, 'hex') 

  for (var i = 0, len = fixed.length; i < len; i++) {
    result[i] = input[i] ^ fixed[i]
  }
  return result
}

console.log(xor(input))
