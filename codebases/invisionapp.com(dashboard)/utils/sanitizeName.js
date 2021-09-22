/**
 * Sanitizes a space name
 * @param {string} name
 * @param {Object} options - Object containing `maxLength`, `doTrimTrailingSpaces`, or `doTrimTrailingPeriods`
 *
 * @return {string} The sanitized value of `name`
 */
function sanitizeName (name = '', options = {}) {
  if (typeof name !== 'string') return ''

  if (typeof options !== 'object') options = {}

  if (options.doTrimTrailingSpaces && !options.doTrimTrailingPeriods) name = name.replace(/([\s]+)$/, '')
  else if (!options.doTrimTrailingSpaces && options.doTrimTrailingPeriods) name = name.replace(/([.]+)$/, '')
  else if (options.doTrimTrailingSpaces && options.doTrimTrailingPeriods) name = name.replace(/([.|\s]+)$/, '')

  return name
    .replace(/^(\.|\s)+/, '')
    .replace(/[\\/:*?"<>|]+/g, '')
    .slice(0, options.maxLength || 100)
}

export default sanitizeName
