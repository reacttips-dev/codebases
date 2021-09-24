import { isIOS } from '../../lib/jello'

let node = null
let startIndex = -1
let endIndex = -1

export function getWordFromSelection() {
  const selection = document.getSelection()
  node = selection.anchorNode
  if (!node || node.nodeName !== '#text') return ''
  let text = node.textContent
  if (!text || !text.length) text = ' '
  const wordArr = text.split('')
  endIndex = selection.anchorOffset - 1
  if (endIndex < 0) endIndex = 0
  const letters = []
  let index = endIndex
  while (index > -1) {
    const letter = wordArr[index]
    index -= 1
    if (!letter) break
    if (letter.match(/\s/)) {
      break
    } else if (letter.match(/:/)) {
      letters.unshift(letter)
      break
    } else {
      letters.unshift(letter)
    }
  }
  startIndex = (endIndex - letters.length) + 1
  return letters.join('')
}

export function getPositionFromSelection() {
  const word = getWordFromSelection()
  if (!node || /^\s*$/.test(word)) { return null }
  const range = document.createRange()
  range.setStart(node, startIndex)
  range.setEnd(node, endIndex + 1)
  const pos = range.getBoundingClientRect()
  range.detach()
  return {
    top: isIOS() ? pos.top + window.pageYOffset : pos.top,
    left: pos.left,
    height: pos.height,
    width: pos.width,
  }
}

// export function getPositionOfCaret() {
//   const selection = document.getSelection()
//   if (node !== selection.anchorNode || selection.type !== 'Caret') {
//     return null
//   }
//   const range = selection.getRangeAt(0)
//   if (range.getClientRects().length) {
//     const pos = range.getClientRects()[0]
//     return {
//       top: pos.top,
//       left: pos.left,
//       height: pos.height,
//       width: pos.width,
//     }
//   }
//   // newline doesn't give us a good clientRect
//   return null
// }

export function replaceWordFromSelection(word) {
  getWordFromSelection()
  const range = document.createRange()
  if (node && node.nodeName !== '#text') { return }
  range.setStart(node, startIndex)
  range.setEnd(node, endIndex + 1)
  node = document.createTextNode(word)
  range.deleteContents()
  range.insertNode(node)
  range.setEndAfter(node)
  const selection = document.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  selection.collapseToEnd()
  range.detach()
}

export function replaceSelectionWithText(text) {
  const selection = document.getSelection()
  node = document.createTextNode(text)
  let range = null
  if (selection.type === 'Range') {
    range = selection.getRangeAt(0)
    range.deleteContents()
  } else {
    range = document.createRange()
    range.setStart(selection.anchorNode, selection.anchorOffset)
  }
  range.insertNode(node)
  range.selectNodeContents(node)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

// # perhaps better than above method, which seems to fail sometimes
export function placeCaretAtEnd(editable) {
  const range = document.createRange()
  range.selectNodeContents(editable)
  range.collapse(false)
  const sel = document.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

export function getLastWordPasted() {
  const selection = document.getSelection()
  node = selection.anchorNode
  const text = node && node.textContent ? node.textContent : ''
  if (!node || !text) return ''
  const nodeWords = text.split(' ')
  return nodeWords[nodeWords.length - 1]
}

// getBrowserAndVersion: ->
//   ua = navigator.userAgent
//   M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) or []
//   if /trident/i.test(M[1])
//     tem = /\brv[ :]+(\d+)/g.exec(ua) or []
//     return browser: 'IE', version: parseFloat(tem[1] || '')
//   if M[1] == 'Chrome'
//     tem = ua.match(/\bOPR\/(\d+)/)
//     return browser: 'Opera', version: parseFloat(tem[1]) if tem?
//   if M[2]
//     M = [ M[1], M[2] ]
//   else
//     M = [ navigator.appName, navigator.appVersion, '-?']
//   M.splice 1, 1, tem[1]  if (tem = ua.match(/version\/(\d+)/i))?
//   return browser: M[0], version: parseFloat(M[1])

export function getSelectionContainerElement() {
  if (document.selection && document.selection.createRange) {
    // IE case
    const range = document.selection.createRange()
    return range.parentElement()
  } else if (window.getSelection) {
    const sel = window.getSelection()
    let range
    if (sel.getRangeAt) {
      if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0)
      }
    } else {
      // Old WebKit selection object has no getRangeAt, so
      // create a range from other selection properties
      range = document.createRange()
      range.setStart(sel.anchorNode, sel.anchorOffset)
      range.setEnd(sel.focusNode, sel.focusOffset)

      // Handle the case when the selection was selected backwards (from the end
      // to the start in the document)
      if (range.collapsed !== sel.isCollapsed) {
        range.setStart(sel.focusNode, sel.focusOffset)
        range.setEnd(sel.anchorNode, sel.anchorOffset)
      }
    }

    if (range) {
      const container = range.commonAncestorContainer

      // Check if the container is a text node and return its parent if so
      return container.nodeType === 3 ? container.parentNode : container
    }
  }
  return null
}
