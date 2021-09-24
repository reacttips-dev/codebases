let emojis = []

function shuffleArray(arr) {
  const array = arr
  let m = array.length
  while (m) {
    m -= 1
    const i = Math.floor(Math.random() * m)
    const t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

function sortEmojis(e) {
  const allEmoji = e.slice()
  const topEmoji = allEmoji.splice(0, 2)
  const popEmoji = shuffleArray(allEmoji.splice(0, 14))
  emojis = topEmoji.concat(popEmoji).concat(allEmoji)
}

export function suggestEmoji(word, e) {
  sortEmojis(e)
  const partial = word.substring(word.lastIndexOf(':') + 1, word.length).toLowerCase()
  let suggestions = emojis.filter(emoji =>
    emoji.name.indexOf(partial) !== -1,
  )
  suggestions = suggestions.sort((emoji, otherEmoji) => {
    if (emoji.name.indexOf(partial) > otherEmoji.name.indexOf(partial)) return 1
    if (emoji.name.indexOf(partial) < otherEmoji.name.indexOf(partial)) return -1
    if (emoji.name.length > otherEmoji.name.length) return 1
    if (emoji.name.length < otherEmoji.name.length) return -1
    return 0
  })
  return suggestions
}

export default suggestEmoji

