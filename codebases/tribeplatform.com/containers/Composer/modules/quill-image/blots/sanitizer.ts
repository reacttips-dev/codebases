import { ImageBlotClassName } from 'containers/Composer/constants'

export const imageSanitizer = (editor: HTMLElement): void => {
  const images = editor.querySelectorAll('img')

  // Image wasn't saved/error before save on the post was clicked.
  if (!images || images?.length === 0) {
    const container = editor.querySelector(`figure.${ImageBlotClassName}`)
    if (container) container.outerHTML = ''
    return
  }

  images.forEach(image => {
    // Do not save chakra class names on the backend.
    image.removeAttribute('class')
    const parent = image.closest(`figure.${ImageBlotClassName}`)
    if (parent) {
      parent.innerHTML = image.outerHTML
    } else {
      // This element was probably dragged and dropped.
      // TODO: Refactor this. Everything should be initialized from quill and not inserted directly.
      const node = `
        <figure class="${ImageBlotClassName}">
          <div class="${ImageBlotClassName}">
            <img src="${image.getAttribute('src')}" />
          </div>
        </figure>
      `
      const closestP = image.closest('p')
      if (closestP) closestP.innerHTML = node
    }
  })
}
