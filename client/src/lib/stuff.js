let truncateString = (input) => {
  const vowles = ['a','e','i','o','u']
  let words = input.split(' ')

  if( words.length === 1 ) {
    let letters = words[0].split('')

    if(letters.length <= 3 )
      return input.toUpperCase()

    let vowlesRemoved = letters.filter( letter => {
      return !vowles.includes(letter)
    })

    return vowlesRemoved[0].toUpperCase() + vowlesRemoved[ Math.ceil(vowlesRemoved.length / 2 ) - 1 ].toUpperCase() + vowlesRemoved[vowlesRemoved.length - 1].toUpperCase()
  }

  return words.map((word, i) => {
    if(i === 0)
      return word.split('')[0]

    if(i === words.length -1)
      return word.split('')[0]

    if(i ===  Math.ceil(words.length / 2 ) - 1 )
      return word.split('')[0]
  }).join('').toUpperCase()
}


module.exports.truncateString = truncateString