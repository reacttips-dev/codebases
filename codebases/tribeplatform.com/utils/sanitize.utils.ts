export const sanitizeJSON = text =>
  text
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<script/gi, '<\\script')
    // eslint-disable-next-line no-useless-escape
    .replace(/\<\!\-\-/gi, '<\\!--')

export const sanitizeHTML = html => {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '')
}
