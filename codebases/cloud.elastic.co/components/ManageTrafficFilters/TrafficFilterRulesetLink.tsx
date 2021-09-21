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

import { CuiLink } from '../../cui'

import { trafficFiltersUrl } from '../../apps/userconsole/urls'

import { regionSecurityUrl, regionsUrl } from '../../lib/urlBuilder'

import { getConfigForKey } from '../../store'

import { TrafficFilterRulesetInfo } from '../../lib/api/v1/types'

type Props = {
  regionId: string
  ruleset: TrafficFilterRulesetInfo
}

const TrafficFilterRulesetLink: FunctionComponent<Props> = ({ regionId, ruleset }) => (
  <CuiLink to={getAppSpecificLink({ regionId, ruleset })}>{ruleset.name}</CuiLink>
)

function getAppSpecificLink({
  regionId,
  ruleset,
}: {
  regionId: string
  ruleset: TrafficFilterRulesetInfo
}): string {
  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

  if (isUserConsole) {
    return `${trafficFiltersUrl()}?q=id:${ruleset.id}`
  }

  if (regionId) {
    return `${regionSecurityUrl(regionId)}?q=id:${ruleset.id}`
  }

  return regionsUrl()
}

export default TrafficFilterRulesetLink
