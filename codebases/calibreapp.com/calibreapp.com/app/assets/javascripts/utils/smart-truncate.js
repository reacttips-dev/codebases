/**
 * smartTruncate - Smartly™ truncate a given string.
 *
 * @param  {String} string      A string with a minimum lenght of 4 chars.
 * @param  {Number} length      The length of the truncated result.
 * @param  {Number} [position]  The index of the ellipsis (zero based). Default is the end.
 * @return {String}             Return a truncated string w/ ellipsis.
 *
 * Example: smartTruncate('Steve Miller', 8) === 'Steve M…'.
 * Example: smartTruncate('Steve Miller', 9, 5) === 'Stev…ller'.
 */
export default function smartTruncate(string, length, position = length) {
  const ellipsisOffset = 1
  const minLength = 4
  let str = string

  if (typeof str === 'string') {
    str = str.trim()
  }

  const invalid =
    typeof str !== 'string' ||
    str.length < minLength ||
    typeof length !== 'number' ||
    length <= minLength ||
    length >= str.length - ellipsisOffset

  if (invalid) return string

  if (position >= length) {
    const start = str.substring(0, length - ellipsisOffset)
    return `${start}…`
  }

  const start = str.substring(0, position)
  const end = str.slice(position + ellipsisOffset - length)

  return `${start}…${end}`
}
