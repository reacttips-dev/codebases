import { normalizeContent } from "./normalizeContent"

export function normalizeData(data) {
  if (!data) {
    return null
  }

  const content = normalizeContent(data.content)

  const componentMap = {}
  content.forEach(item => {
    const { componentName } = item
    if (
      componentName in componentMap &&
      !Array.isArray(componentMap[componentName])
    ) {
      componentMap[componentName] = [componentMap[componentName], item]
    } else if (componentName in componentMap) {
      componentMap[componentName].push(item)
    } else {
      componentMap[componentName] = item
    }
  })

  const componentArray = Object.entries(componentMap).map(([name, data]) => {
    if (Array.isArray(data)) {
      return [name, data]
    } else {
      return [name, data.data]
    }
  })

  return Object.fromEntries(componentArray)
}
