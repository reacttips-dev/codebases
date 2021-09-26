NodeList.prototype.forEach = Array.prototype.forEach

const toggleItem = item => {
  if (item.type === 'checkbox') {
    const id = item.getAttribute('ng-toggle')
    const element = document.getElementById(id)
    if (item.checked) {
      element.removeAttribute('ng-cloak')
    } else {
      element.setAttribute('ng-cloak', '')
    }
  } else {
    const className = item.getAttribute('ng-toggle')
    document.querySelectorAll(`.${className}`).forEach(element => {
      if (element.getAttribute('id') === item.value) {
        element.removeAttribute('ng-cloak')
      } else {
        element.setAttribute('ng-cloak', '')
      }
    })
  }
}

const ngToggle = () => {
  const items = document.querySelectorAll('[ng-toggle]')
  items.forEach(item => {
    toggleItem(item)
    item.addEventListener('change', () => {
      toggleItem(item)
    })
  })
}

export default ngToggle
