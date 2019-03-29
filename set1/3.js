
const input = Buffer.from('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', 'hex')

var result = Buffer.alloc(input.length)
var letter = 65

for (var i = 0, len = 23; i < len; i++) {
  for (var j = 0, len = input.length; j < len; j++)
    result[j] = input[j] ^ letter

  console.log(result.toString())
  letter++
}
