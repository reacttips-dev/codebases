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

import React, { FunctionComponent, ReactNode } from 'react'

import App from '../App'

type Props = {
  isPortalUrl: boolean
  isGettingStartedUrl: boolean
  isPortalFeatureEnabled: boolean
  isCreateUrl: boolean
  children: ReactNode
  isRouteFSTraced?: boolean
}

const RootHandler: FunctionComponent<Props> = ({
  isPortalUrl,
  isGettingStartedUrl,
  children,
  isPortalFeatureEnabled,
  isCreateUrl,
  isRouteFSTraced,
}) => (
  <App
    isGettingStartedUrl={isGettingStartedUrl}
    isCreateUrl={isCreateUrl}
    isPortalRoute={isPortalFeatureEnabled && isPortalUrl}
    isRouteFSTraced={isRouteFSTraced}
  >
    {children}
  </App>
)

export default RootHandler
