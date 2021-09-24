NodeList.prototype.forEach = Array.prototype.forEach

const dropdowns = document.querySelectorAll('.dropdown')

const closeMenu = event => {
  let els = []
  let element = event.target
  while (element.parentNode) {
    els.unshift(element.parentNode)
    element = element.parentNode
  }

  const withinDropdown = els.reverse().some(el => {
    if (el.classList) return el.classList.contains('dropdown')
  })

  if (!withinDropdown) {
    dropdowns.forEach(dropdown =>
      dropdown.classList.remove('dropdown--isActive')
    )
  }
}

const dropdown = () => {
  document.querySelector('body').addEventListener('click', closeMenu)

  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', () => {
      dropdown.classList.toggle('dropdown--isActive')
    })
  })
}

export default dropdown
