

module.exports = {

  decrypt: (input, key) => {
    var fixed = Buffer.from(key, 'hex')
    var result = Buffer.alloc(fixed.length)

    input = Buffer.from(input, 'hex') 

    for (var i = 0, len = fixed.length; i < len; i++) {
      result[i] = input[i] ^ fixed[i]
    }
    return result
  },

  bruteForceSingleByte: (msgBuffer) => {
    var tempBuffer, plainText
    var results = []
    
    for (let letter = 0, len = 256; letter < len; letter++) {

      tempBuffer = Buffer.alloc(msgBuffer.length)

      for (let i = 0, len = msgBuffer.length; i < len; i++)
        tempBuffer[i] = msgBuffer[i] ^ letter

      plainText = tempBuffer.toString()

      if (!/[^\x00-\x7E]/g.test(plainText))
        results.push({
          score: parseFloat(calculateFrequency(plainText).toFixed(6)),
          key: letter,
          message: plainText,
        })
    }

    return results.sort((x, y) => (x.score < y.score) ? 1 : -1).shift()
  }
}


// encrypt ( msg, key )


// decrypt ( msg, key )
//
//
// brute force single xor (msg)
