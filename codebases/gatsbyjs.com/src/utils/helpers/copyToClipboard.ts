export default function copyToClipboard(content: string): Promise<void> {
  if (!window || !window.navigator) {
    return Promise.resolve()
  }
  const clipboard = window.navigator.clipboard
  /*
   * fallback to older browsers (including Safari)
   * if clipboard API not supported
   */
  if (!clipboard || typeof clipboard.writeText !== `function`) {
    clipboardWriteTextFallback(content)

    return Promise.resolve()
  }

  return clipboard.writeText(content)
}

function clipboardWriteTextFallback(content: string): void {
  const textarea = document.createElement(`textarea`)
  textarea.value = content
  textarea.setAttribute(`readonly`, `true`)
  textarea.setAttribute(`contenteditable`, `true`)
  textarea.style.position = `absolute`
  textarea.style.left = `-9999px`

  document.body.appendChild(textarea)
  textarea.select()

  const range = document.createRange()
  const sel = window.getSelection()

  if (!sel) {
    return
  }

  sel.removeAllRanges()
  sel.addRange(range)
  textarea.setSelectionRange(0, textarea.value.length)
  document.execCommand(`copy`)

  document.body.removeChild(textarea)
}
