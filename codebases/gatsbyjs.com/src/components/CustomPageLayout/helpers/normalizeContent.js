import { normalizeContentfulType } from "./normalizeContentfulType"

export function normalizeContent(data) {
  if (!data) {
    return null
  }

  return data.reduce((acc, item) => {
    const { id, name, component, __typename: type } = item

    // There are two ways of identifying a corresponding component for data
    // the default one, based on the native Contentful source plugin ___typename
    // the second one, based on what the editor set in 'component' data field.
    const componentName = component ? component : normalizeContentfulType(type)

    return [
      ...acc,
      {
        id,
        entryName: name,
        data: item,
        componentName,
      },
    ]
  }, [])
}
