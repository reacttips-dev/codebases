/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

type HierarchicalData = {
  [id: string]: number | HierarchicalData | undefined
}

type Translations = { [id: string]: string }

export type Node = NodeWithValue | NodeWithChildren
export type NodeWithValue = { name: string; size: number }
export type NodeWithChildren = { name: string; children: Node[] }

/**
 * Translations a data structure like:
 *
 * <pre>
 * {
 *   foo: 1,
 *   bar: {
 *     baz: 2,
 *     quux: 3
 *   }
 * }
 * </pre>
 *
 * into a D3 hierarchy-friendly format for use with the Sunburst component:
 *
 * <pre>
 * {
 *   name: 'root',
 *   children: [
 *     {
 *       name: 'foo'
 *       size: 1
 *     },
 *     {
 *       name: 'bar',
 *       children: [
 *         {
 *           name: 'baz',
 *           size: 2
 *         },
 *         {
 *           name: 'quux',
 *           size: 3
 *         }
 *       ]
 *     }
 *   ]
 * }
 * </pre>
 *
 * The keys are internationalised using the supplied translations object, which must be a flat object
 * mapping keys to strings. Nested keys are concatenated with underscores.
 *
 * @param {Object} translations
 * @param {Object} data
 * @return {Object}
 */
export function buildHierarchy(translations: Translations, data: HierarchicalData): Node {
  return {
    name: `root`,
    children: traverseHierarchy({ translations, data, path: [] }),
  }
}

function traverseHierarchy({
  translations,
  data = {},
  path,
}: {
  translations: Translations
  data: HierarchicalData | undefined
  path: string[]
}): Node[] {
  return Object.keys(data).map((key) => {
    const newPath = path.concat(key)
    const name = translations[newPath.join(`_`)]

    const value = data[key]

    if (typeof value === `number`) {
      return {
        name,
        size: value,
      }
    }

    return {
      name,
      children: traverseHierarchy({ translations, data: value, path: newPath }),
    }
  })
}
