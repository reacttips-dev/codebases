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

import { portalUrl, deploymentsUrl } from '../../../../lib/urlBuilder'

type Props = RouteComponentProps & {
  isPortalFeatureEnabled: boolean
}

class UserconsoleRootRoute extends Component<Props> {
  componentDidMount() {
    this.handleRootRoute()
  }

  render() {
    return null
  }

  handleRootRoute() {
    const { isPortalFeatureEnabled, location, history } = this.props

    if (handleLegacyRoutes({ location, history })) {
      return
    }

    if (isPortalFeatureEnabled) {
      history.replace(portalUrl())
      return
    }

    history.replace(deploymentsUrl())
  }
}

export default UserconsoleRootRoute

// We handle a few legacy UCv1 routes where hash-based routing was supported
export function handleLegacyRoutes({ location, history }): boolean {
  // TODO remove verifyRoute resetRoute once the new email template is in production
  const verifyRoute = new RegExp(`^#/?(?:verify)/(.*)`)
  const resetRoute = new RegExp(`^#/?(?:reset)/(.*)`)
  const watcherRoute = new RegExp(`^#/?watcher/whitelist/(.*)`)
  const partnerSignupRoute = new RegExp(`^#/partner/signup\\?(.*)`)
  const changeEmailRoute = new RegExp(`^#/?change-email/(.*)`)

  const { pathname, hash } = location

  if (pathname !== `/`) {
    return false
  }

  const matchVerify = verifyRoute.exec(hash)

  if (matchVerify) {
    history.replace(`/account/verify-email?${matchVerify[1]}`)
    return true
  }

  const matchReset = resetRoute.exec(hash)

  if (matchReset) {
    history.replace(`/account/reset-password?${matchReset[1]}`)
    return true
  }

  const matchWatcher = watcherRoute.exec(hash)

  if (matchWatcher) {
    history.replace(`/whitelist?${matchWatcher[1]}`)
    return true
  }

  const matchPartnerSignup = partnerSignupRoute.exec(hash)

  if (matchPartnerSignup) {
    history.replace(`/partner-signup?${matchPartnerSignup[1]}`)
    return true
  }

  const matchChangeEmail = changeEmailRoute.exec(hash)

  if (matchChangeEmail) {
    history.replace(`/change-email?${matchChangeEmail[1]}`)
    return true
  }

  return false
}
