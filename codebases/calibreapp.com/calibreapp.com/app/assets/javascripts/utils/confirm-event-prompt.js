// <a href="#delete the thing"
//    confirm-prompt="If you're sure you want to delete this, type 'german-for-black'"
//    confirm-value="german-for-black"
//    confirm-event="click"
//  >

NodeList.prototype.forEach = Array.prototype.forEach

const confirmPrompt = () => {
  const items = document.querySelectorAll('[confirm-prompt]')

  items.forEach(item => {
    const event = item.getAttribute('confirm-event') || 'click'
    const truthyValue = item.getAttribute('confirm-value')
    const message =
      item['confirm-prompt'] || `If you’re sure, type '${truthyValue}'`

    item.addEventListener(event, e => {
      const promptValue = window.prompt(message)

      if (promptValue !== truthyValue) {
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    })
  })
}

export default confirmPrompt
