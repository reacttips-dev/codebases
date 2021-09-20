const htmlNewLine = '&newline;'
const escapedBreakLine = '\\\\n'
const unescapedBreakLine = '\\n'
const htmlBreakLine = '<br\\s*/>'
const unicodeBreakLine = '\\u000a'
const unicodeLineSeparator = '\\u2028'

const lineBreakers = [
  htmlNewLine,
  escapedBreakLine,
  unescapedBreakLine,
  htmlBreakLine,
  unicodeBreakLine,
  unicodeLineSeparator,
]

const htmlBreak = '<br />'

const lineBreakRegex = new RegExp(lineBreakers.join('|'), 'gi')

const convertLineBreaksIntoBrs = (htmlText: string) => {
  return htmlText.replace(lineBreakRegex, htmlBreak)
}

export const sanitizerTools = {
  convertLineBreaksIntoBrs,
}

export const sanitizeHTML = (htmlText: string) => {
  return sanitizerTools.convertLineBreaksIntoBrs(htmlText)
}
