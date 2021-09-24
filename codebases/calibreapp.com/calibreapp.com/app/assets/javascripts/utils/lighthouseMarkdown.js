import DOMPurify from 'dompurify'

const markdown = (text = '') => {
  const html = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')

  return {
    __html: DOMPurify.sanitize(html, { ADD_ATTR: ['target'] })
  }
}

export default markdown
