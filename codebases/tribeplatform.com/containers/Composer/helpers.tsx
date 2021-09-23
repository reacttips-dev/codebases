import { UNNECESSARY_HTML, UNNECESSARY_HTML_AFTER_EMBED } from './constants'

// @TODO - refactor dom node's type after Quill is properly typed
export const getTextContent = (domNode: any): string => {
  if (!domNode) return ''

  const directTextChild = domNode?.children?.find(({ type }) => type === 'text')

  if (directTextChild) {
    return directTextChild?.data
  }

  return getTextContent(domNode?.children?.[0])
}

export const getLinkContent = ({ data, type, name: TagName, ...rest }) => {
  if (type !== 'tag' && type !== 'text') return null

  if (data) return data

  // If it's a nested element (e.g: bolded link - <strong><a></a></strong>)
  return <TagName>{getTextContent(rest)}</TagName>
}

/**
 * Removes Quill's dirt from given HTML content
 * @param {string} inputHTML - Normal HTML
 * @returns {string} HTML without Quill's dirt
 */
export const eliminateUnnecessaryHTML = (inputHTML: string): string => {
  let outputHTML = inputHTML

  // Find a dirt within the content
  const unnecessaryHTML = UNNECESSARY_HTML_AFTER_EMBED.find(html => {
    const htmlIndex = outputHTML.lastIndexOf(html)

    // If found at the end of the given HTML content
    return htmlIndex !== -1 && htmlIndex === outputHTML.length - html.length
  })

  // If found, remove it from end
  if (unnecessaryHTML) {
    outputHTML = inputHTML.slice(0, -unnecessaryHTML.length)
  }

  // Our node version doesn't support `replaceAll`
  if (outputHTML.replaceAll) {
    UNNECESSARY_HTML.forEach(html => {
      outputHTML = outputHTML.replaceAll(html, '')
    })
  }

  return outputHTML
}
