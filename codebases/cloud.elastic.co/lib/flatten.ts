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

function traverse(source: any, path: string[], callback: (path: string[], value: any) => void) {
  if (source != null && typeof source === `object`) {
    for (const key of Object.keys(source)) {
      traverse(source[key], path.concat(key), callback)
    }
  } else {
    callback(path, source)
  }
}

export function flatten(
  source: any,
  delimiter: string = `.`,
): { [path: string]: boolean | number | string | null } {
  if (source == null || typeof source !== `object`) {
    return source
  }

  const result = {}

  traverse(source, [], (path, value) => {
    result[path.join(delimiter)] = value
  })

  return result
}
