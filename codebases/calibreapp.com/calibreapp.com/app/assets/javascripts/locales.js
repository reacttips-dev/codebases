import flatten from 'flat'
import en from 'json-loader!yaml-loader!../../../config/locales/en.yml'

// Convert rails values syntax `%{value}` to react-intl syntax `{value}
const flatLocales = flatten(en.en)
const locales = Object.keys(flatLocales).reduce((l, key) => {
  if (flatLocales[key]) {
    l[key] = flatLocales[key].replace(/%{/g, '{')
  } else {
    l[key] = ''
  }
  return l
}, {})

export default locales
