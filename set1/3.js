
const buf = Buffer.from('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', 'hex')

var result = Buffer.alloc(buf.length)
var msg

for (let letter = 0, len = 256; letter < len; letter++) {
  for (let i = 0, len = buf.length; i < len; i++)
    result[i] = buf[i] ^ letter

  msg = result.toString()

  if (!/[^\x00-\x7E]/g.test(msg) && /\s/.test(msg))
    console.log(msg)
}
