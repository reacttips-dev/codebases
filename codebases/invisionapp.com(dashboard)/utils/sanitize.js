import DOMPurify from 'dompurify'

export const sanitize = str => {
  return DOMPurify.sanitize(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
