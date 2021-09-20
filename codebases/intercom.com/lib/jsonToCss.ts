type Rule = Record<string, string | number>
type Selector = Record<string, Rule>
type MediaQuery = Record<string, Selector>
type Json = Selector | MediaQuery | undefined

export default function jsonToCss(json: Json): string {
  if (!json) return ''

  return Object.keys(json)
    .map((selector) => {
      const definition = json[selector]

      const definitionKeys = Object.keys(definition)
      if (typeof definition[definitionKeys[0]] === 'object') {
        return `${selector}{ ${jsonToCss(definition as Selector)} }`
      }

      const rules = Object.keys(definition)
        .map((rule) => `${rule}:${definition[rule]};`)
        .join('')
      return `${selector}{${rules}}`
    })
    .join('\n')
}
