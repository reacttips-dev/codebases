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

import { RefObject } from 'react'

import ChromeHeader from './ChromeHeader'

import connectAndForwardRef from '../../lib/connectAndForwardRef'

import { setTheme } from '../../actions/theme'

import { getProfile } from '../../apps/userconsole/reducers'

import { getTheme, getStackDeployment } from '../../reducers'

import { isFeatureActivated, getConfigForKey } from '../../selectors'

import { hasUserSettings } from '../UserSettings/helpers'

import {
  SAD_getAuthTokenUserId,
  SAD_getAuthTokenUsername,
  SAD_hasUnexpiredSession,
  SAD_hasUnexpiredSudo,
} from '../../lib/auth'

import Feature from '../../lib/feature'

import { CloudAppName, ProfileState, Theme, RoutableBreadcrumb } from '../../types'
import { DeploymentGetResponse } from '../../lib/api/v1/types'

type StateProps = {
  loggedIn: boolean
  sudoFeature: boolean
  hasSudo: boolean
  hasUserSettings: boolean
  theme: Theme
  appName: CloudAppName
  profile: ProfileState
  getStackDeploymentById: (id: string) => DeploymentGetResponse | null
  cloudPortalEnabled: boolean
  isHeroku: boolean
  usernameFromToken: string | null
  userIdFromToken: string | null
}

type DispatchProps = {
  setTheme: (theme: Theme) => void
}

type ConsumerProps = {
  breadcrumbs?: RoutableBreadcrumb[]
  hideTrialIndicator?: boolean
  showHelp?: boolean
  ref: RefObject<HTMLDivElement> | null
}

const mapStateToProps = (state): StateProps => {
  const appName = getConfigForKey(state, `APP_NAME`)!

  return {
    loggedIn: SAD_hasUnexpiredSession(),
    cloudPortalEnabled: isFeatureActivated(state, Feature.cloudPortalEnabled),
    sudoFeature: isFeatureActivated(state, Feature.sudo),
    hasSudo: SAD_hasUnexpiredSudo(),
    hasUserSettings: hasUserSettings(state),
    theme: getTheme(state),
    appName,
    profile: getProfile(state),
    getStackDeploymentById: (id) => getStackDeployment(state, id),
    isHeroku: getConfigForKey(state, `APP_FAMILY`) === `heroku`,
    usernameFromToken: SAD_getAuthTokenUsername(),
    userIdFromToken: SAD_getAuthTokenUserId(),
  }
}

const mapDispatchToProps: DispatchProps = {
  setTheme,
}

export default connectAndForwardRef<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    // Because we rely on `context` within ChromeHeader (via <Search />), we can't treat the
    // component as pure.
    pure: false,
  },
)(ChromeHeader)
