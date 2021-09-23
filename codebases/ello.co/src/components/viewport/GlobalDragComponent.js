let isListening = false

/* eslint-disable no-param-reassign */
const setDragData = (e, data) => {
  e.dataTransfer.setData('application/json', JSON.stringify(data))
  e.dataTransfer.dropEffect = 'move'
}
/* eslint-enable no-param-reassign */

const onDragStart = (e) => {
  const target = e.target
  const classList = target.classList
  const nodeName = target.nodeName.toLowerCase()

  const avatar = classList.contains('Avatar') ? target : null
  if (avatar || classList.contains('DraggableUsername')) {
    const priority = target.getAttribute('data-priority')
    const userId = target.getAttribute('data-userid')
    const username = target.getAttribute('data-username')
    setDragData(e, { priority, userId, username })
    if (priority) {
      document.documentElement.setAttribute('data-dragging-priority', priority)
    }
    return
  }

  // @mention (from the pipeline)
  const mention = classList.contains('user-mention') ? target : null
  if (mention) {
    setDragData(e, { username: mention.innerHTML.substring(1) })
    return
  }

  // Emojis!
  const emoji = classList.contains('emoji') ? target : null
  if (emoji) {
    setDragData(e, { emojiCode: emoji.getAttribute('title') })
    return
  }

  // Ello logo
  const mark = classList.contains('NavbarMark') ? target : null
  if (mark) {
    setDragData(e, { username: 'ello' })
    return
  }

  // Images
  const image = nodeName === 'img' ? target : null
  if (image) {
    setDragData(e, { imgSrc: image.getAttribute('src') })
    return
  }

  // Links
  const link = nodeName === 'a' ? target : null
  if (link && link.getAttribute('href').indexOf('http') !== -1) {
    setDragData(e, { href: link.getAttribute('href'), linkText: link.innerHTML })
    return
  }

  // Cancel drag unless we found something we want to drag
  e.preventDefault()
  e.stopPropagation()
}

const onDragEnd = (e) => {
  if (e.target.getAttribute('data-priority')) {
    document.documentElement.removeAttribute('data-dragging-priority')
  }
}

export const addGlobalDrag = () => {
  if (isListening || !document || !document.body) { return }
  document.body.addEventListener('dragstart', onDragStart)
  document.body.addEventListener('dragend', onDragEnd)
  isListening = true
}

export const removeGlobalDrag = () => {
  if (!isListening || !document || !document.body) { return }
  document.body.removeEventListener('dragstart', onDragStart)
  document.body.removeEventListener('dragend', onDragEnd)
  isListening = false
}

