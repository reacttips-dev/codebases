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

import { clone, get, mergeWith as recursiveMerge, set } from 'lodash'
import { DeepPartial } from './ts-essentials'

interface IRoot {}

type Path = string[] | string

const shallowMarker = Symbol.for(`cloud.immutability.shallow-merge`)

export function mergeDeep<TDest = any, TSource = DeepPartial<TDest>>(
  dest: TDest,
  ...sources: TSource[]
): TDest {
  if (sources.length === 0) {
    return dest
  }

  if (Array.isArray(dest)) {
    throw new TypeError(`Due to stability concerns, mergeDeep() doesn't support Arrays.`)
  }

  if (dest && typeof dest === `object`) {
    const base = {}
    const result = recursiveMerge(base, dest, ...sources, mergeTransform)
    return result
  }

  const [firstSource, ...otherSources] = sources

  // @ts-ignore: dest is not an Array|Object, replace it entirely
  return mergeDeep(firstSource, ...otherSources)

  function mergeTransform(_target, next) {
    if (shouldShallowMerge(next)) {
      return next
    }
  }
}

function shouldShallowMerge(value): boolean {
  return Boolean(value && value[shallowMarker])
}

export function markShallow<T>(value: T): T {
  value[shallowMarker] = true
  return value
}

export function replaceIn<TRoot extends IRoot = any, TValue = any>(
  rootValue: TRoot,
  pathOrPaths: Path,
  value: TValue,
): TRoot {
  return updateIn<TRoot, TValue>(rootValue, pathOrPaths, () => value)
}

export function mergeIn<TRoot extends IRoot = any, TValue = any>(
  rootValue: TRoot,
  pathOrPaths: Path,
  ...values: Array<DeepPartial<TValue>>
): TRoot {
  return updateIn<TRoot, TValue>(rootValue, pathOrPaths, (currentValue) =>
    mergeDeep(currentValue, ...values),
  )
}

export function updateIn<TRoot extends IRoot = any, TValue = any>(
  obj: TRoot,
  pathOrPaths: Path,
  getNewValue: (oldValue: TValue) => TValue,
): TRoot {
  const path = parsePaths(pathOrPaths)

  if (path.length === 0) {
    throw new Error('Unsupported use case for `updateIn`. Consider `getNewValue(obj)` instead.')
  }

  const oldValue = get(obj, path)
  const newValue = getNewValue(oldValue)

  const newObj = cloneAlongPath(obj, path)

  set(newObj, path, newValue)

  return newObj
}

function cloneAlongPath<T>(obj: T, paths: string[]): T {
  const root = clone(obj)
  let node = root

  paths.forEach((path) => {
    node[path] = clone(node[path])
    node = node[path] || {}
  })

  return root
}

function parsePaths(pathOrPaths: Path): string[] {
  if (pathOrPaths == null) {
    return []
  }

  return Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]
}
