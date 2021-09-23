export const getQuillModules = modules => {
  return {
    ...modules,
    clipboard: {
      allowed: {
        tags: [
          'a',
          'b',
          'i',
          'p',
          'br',
          'ul',
          'ol',
          'li',
          'pre',
          'span',
          'h1',
          'h2',
          'div',
        ],
        attributes: ['href', 'rel', 'target'],
      },
      keepSelection: true,
      magicPasteLinks: false,
    },
    toolbar: [
      ['bold', 'italic', 'link'],
      [{ header: 1 }, { header: 2 }, 'blockquote', 'code-block'],
      [{ align: ['', 'center', 'right', 'justify'] }],
    ],
  }
}
