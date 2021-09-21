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

// TS/ES are being very weird here — TS needs this, but ES is like nope we're not using it
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
import { match } from 'react-router-dom'
import { matchRoutes, RouteConfig } from 'react-router-config'

import { PlainHashMap } from '../../types'

type MatchParams = {
  exact?: boolean
}

export function matchRoute(
  routes: RouteConfig[],
  pathname: string,
  expected: string,
  params: MatchParams = {},
): boolean {
  const { exact = true } = params
  const route = findRoute(routes, pathname)

  if (!route) {
    return false
  }

  if (!exact) {
    return route.path.startsWith(expected)
  }

  return route.path === expected
}

export function findRoute<TRouteParams = PlainHashMap>(
  routes: RouteConfig[],
  pathname: string,
): match<TRouteParams> | void {
  const branch = matchRoutes<TRouteParams>(routes, pathname)

  if (!branch) {
    return
  }

  const lastLeaf = branch[branch.length - 1]

  if (!lastLeaf) {
    return
  }

  const { match } = lastLeaf

  return match
}

export function getRouteParams<TRouteParams = PlainHashMap>(
  routes: RouteConfig[],
  pathname: string,
): Partial<TRouteParams> {
  const route = findRoute<TRouteParams>(routes, pathname)

  if (!route) {
    return {}
  }

  const { params } = route
  return params
}
