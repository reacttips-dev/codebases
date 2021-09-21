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

import { forEachRight } from 'lodash'

import React, { ComponentType, FunctionComponent } from 'react'
import { RouteConfig } from 'react-router-config'

import { withTransaction } from '@elastic/apm-rum-react'

import { withChildRoutes } from './withChildRoutes'
import { withRouteProps } from './withRouteProps'
import { withTitle } from './withTitle'
import { isBlessed } from './blessing'

import { getDisplayName, getStrippedDisplayName } from '../getDisplayName'

type AnyProps = { [key: string]: any }

type WrapperComponentDefinition<TProps> = ComponentType<TProps> | [ComponentType<TProps>, AnyProps?]

export function hydrateRouteConfig(route: RouteConfig): RouteConfig {
  if (typeof route.exact !== `undefined` && route.exact !== true) {
    throw new Error(
      `Route definitions should *never* rely on \`exact: false\`. Use \`withRouteChain\` instead.`,
    )
  }

  // `AppRoot`, `FullStoryTracking`, and `NotFound` are blessed,
  // but there are no good reasons to bless other components.
  if (typeof route.path === `undefined` && route.component && !isBlessed(route.component)) {
    console.error('This route is causing problems.', { route })

    throw new Error(
      `Route definitions should *never* define a component without a path. Use \`withRouteChain\` instead.`,
    )
  }

  route.exact = true

  if (route.component) {
    if (Array.isArray(route.routes)) {
      route.routes = route.routes.map(hydrateRouteConfig)
      route.component = withChildRoutes(route.component)
    }

    if (route.title !== undefined) {
      route.component = withTitle(route.component, route.title)
    }

    if (route.props) {
      route.component = withRouteProps(route.component)
    }

    route.component = withApmTransaction(route.component)
  }

  return route
}

function withApmTransaction(
  RouteComponent: NonNullable<RouteConfig['component']>,
): NonNullable<RouteConfig['component']> {
  return withTransaction(getStrippedDisplayName(RouteComponent), `route`)(RouteComponent)
}

/* Using `react-router-config` with `exact: false` routes is an anti-pattern,
 * because it unnecessarily complicates our routing strategy and prevents us from
 * having straightforward catch-all handlers like the Not Found page.
 *
 * Whenever we need `exact: false` in a route definition,
 * we should use `withRouteChain()` instead.
 */
export function withRouteChain<TProps = any>(
  ...WrapperComponents: Array<WrapperComponentDefinition<TProps>>
) {
  const wrapRouteComponent = withRouteComponentChain<TProps>(...WrapperComponents)

  return wrapRoute

  function wrapRoute(route: RouteConfig): RouteConfig {
    if (route.component) {
      route.component = wrapRouteComponent(route.component)
    }

    return route
  }
}

export function withRouteComponentChain<TProps = any>(
  ...WrapperComponents: Array<WrapperComponentDefinition<TProps>>
) {
  return wrapRouteComponent

  function wrapRouteComponent(RouteComponent: RouteConfig['Component']) {
    let ComponentChain = RouteComponent

    forEachRight(WrapperComponents, (wrapper) => {
      const [WrapperComponent, wrapperProps] = Array.isArray(wrapper) ? wrapper : [wrapper]

      ComponentChain = getNextChainComponent<TProps>({
        WrapperComponent,
        wrapperProps,
        ComponentChain: ComponentChain!,
      })
    })

    return ComponentChain
  }

  function getNextChainComponent<TProps>({
    WrapperComponent,
    wrapperProps = {},
    ComponentChain,
  }: {
    WrapperComponent: ComponentType<TProps>
    wrapperProps?: AnyProps
    ComponentChain: ComponentType<TProps>
  }) {
    const WrapperChildrenForwarder: FunctionComponent<TProps> = (props) => (
      <WrapperComponent {...props} {...wrapperProps}>
        <ComponentChain {...props} />
      </WrapperComponent>
    )

    const innerNameMaybeChained = getDisplayName(ComponentChain)

    // Avoid repeating "RouteChain(…)" multiple times
    const innerName = innerNameMaybeChained.startsWith('RouteChain(')
      ? innerNameMaybeChained.slice(11, -1) // "RouteChain(…)" becomes "…"
      : innerNameMaybeChained

    const outerName = getDisplayName(WrapperComponent)

    // Preserve a single "RouteChain(…)" at the beginning
    WrapperChildrenForwarder.displayName = `RouteChain(${outerName}(${innerName}))`

    return WrapperChildrenForwarder
  }
}
