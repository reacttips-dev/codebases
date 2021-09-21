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

import { EuiText, EuiTextColor } from '@elastic/eui'

import { getPlatformNameByRegionId } from '../../lib/platform'

import { TrafficFilterRulesetInfo } from '../../lib/api/v1/types'

type Props = {
  ruleset: TrafficFilterRulesetInfo
}

const TrafficFilterType: FunctionComponent<Props> = ({ ruleset }) => {
  if (ruleset.type === `vpce` || ruleset.type === `azure_private_endpoint`) {
    return (
      <EuiText size='s'>
        <FormattedMessage
          id='manage-traffic-filters.ruleset-type-privatelink'
          defaultMessage='Private link endpoint'
        />

        <div>
          <EuiTextColor color='subdued'>{getPlatformNameByRegionId(ruleset.region)}</EuiTextColor>
        </div>
      </EuiText>
    )
  }

  return (
    <EuiText size='s'>
      <FormattedMessage
        id='manage-traffic-filters.ruleset-type-ip-filter'
        defaultMessage='IP filtering rule set'
      />

      <div>
        <EuiTextColor color='subdued'>
          <FormattedMessage
            id='manage-traffic-filters.ruleset-type-ip-filter-platform'
            defaultMessage='{ruleCount} {ruleCount, plural, one {rule} other {rules}}'
            values={{ ruleCount: ruleset.rules.length }}
          />
        </EuiTextColor>
      </div>
    </EuiText>
  )
}

export default TrafficFilterType
