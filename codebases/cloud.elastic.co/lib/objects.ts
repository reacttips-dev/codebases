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

import { get } from 'lodash'

import { PlainHashMap } from '../types'

export function atPath(path: string | string[], defaultValue?: any) {
  return (obj) => get(obj, path, defaultValue)
}

export function collapseKeysRecursively(
  source: PlainHashMap,
  delimiter: string = `.`,
): PlainHashMap {
  const target: PlainHashMap = {}
  recurse(source)
  return target

  function recurse(source: PlainHashMap, prefix?: string) {
    for (const key of Object.keys(source)) {
      const value = source[key]
      const deeper = isPlainHashMap(value)
      const flatKey = prefix == null ? key : `${prefix}${delimiter}${key}`

      if (deeper) {
        recurse(value, flatKey)
      } else {
        target[flatKey] = value
      }
    }
  }
}

function isPlainHashMap(value): value is PlainHashMap {
  return value && typeof value === `object`
}
