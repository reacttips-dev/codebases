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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { CuiLink } from '../../cui'

import { trafficFiltersUrl } from '../../apps/userconsole/urls'

import { regionSecurityUrl, regionsUrl } from '../../lib/urlBuilder'

import { getConfigForKey } from '../../store'

type Props = {
  regionId?: string
}

const TrafficFiltersCreationLink: FunctionComponent<Props> = ({ regionId }) => (
  <FormattedMessage
    id='traffic-filters-creation-link.where-to-create'
    defaultMessage='Traffic filters can be created in {somewhereInTheApp}.'
    values={{
      somewhereInTheApp: getAppSpecificLink({ regionId }),
    }}
  />
)

function getAppSpecificLink({ regionId }: { regionId?: string }) {
  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

  if (isUserConsole) {
    return (
      <CuiLink to={trafficFiltersUrl()}>
        <FormattedMessage
          id='traffic-filters-creation-link.account-link'
          defaultMessage='your account'
        />
      </CuiLink>
    )
  }

  if (regionId) {
    return (
      <CuiLink to={regionSecurityUrl(regionId)}>
        <FormattedMessage
          id='traffic-filters-creation-link.platform-security-link'
          defaultMessage='Platform Security'
        />
      </CuiLink>
    )
  }

  return (
    <CuiLink to={regionsUrl()}>
      <FormattedMessage
        id='traffic-filters-creation-link.platform-link'
        defaultMessage='Platform'
      />
    </CuiLink>
  )
}

export default TrafficFiltersCreationLink
