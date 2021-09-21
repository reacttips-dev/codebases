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

import { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { RouteConfig } from 'react-router-config'
import { withRouter } from 'react-router-dom'

import { findRoute } from '../../lib/router'

import autoFocus from '../../lib/autoFocus'
import { startRouteChange } from '../../lib/apm'

type Props = RouteComponentProps & {
  routes: RouteConfig[]
}

class AppRouterEvents extends Component<Props> {
  componentDidMount() {
    this.onRouteChange()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.onRouteChange()
    }
  }

  render() {
    return null
  }

  onRouteChange() {
    const { location, routes } = this.props

    window.scrollTo(0, 0)
    autoFocus()
    trackRouteChange({ location, routes })
  }
}

function trackRouteChange({
  location,
  routes,
}: {
  location: RouteComponentProps['location']
  routes: RouteConfig[]
}) {
  const route = findRoute(routes, location.pathname)

  if (!route) {
    return
  }

  const { path, params } = route

  startRouteChange(path, params)
}

export default withRouter(AppRouterEvents)
