import { EmbedSelector } from './embed'

export const embedSanitizer = (editor: HTMLElement): void => {
  // Embed created for the first time.
  const embeds = editor.querySelectorAll(EmbedSelector)
  if (embeds?.length > 0) {
    embeds.forEach(embed => {
      // Get the embed id.
      const embedSelector = embed.querySelector('[data-embed-id]')

      // Preview is there
      if (embedSelector) {
        embed.innerHTML = ''
        embed.setAttribute(
          'data-id',
          embedSelector.getAttribute('data-embed-id') ?? '',
        )
      } else {
        // Error State save.
        embed.outerHTML = ''
      }
    })
  }

  // data-type="embed" is not present on subsequent visits.
  const embedsInner = editor.querySelectorAll('div.embed')
  embedsInner.forEach(embed => {
    const embedId = embed.getAttribute('data-embed-id')
    if (embedId) {
      embed.outerHTML = `<div data-id="${embedId}" data-type="embed" class="embed"></div>`
    }
  })
}
