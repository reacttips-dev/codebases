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
import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui'
import { UserProfile } from '../../../../../types'

interface Props {
  profile: UserProfile
}

const UsageBreakdownTitle: FunctionComponent<Props> = ({ profile: { inTrial, trial_length } }) => {
  const title = (
    <FormattedMessage id='cost-analysis.usage-breakdown.title' defaultMessage='Usage breakdown' />
  )

  if (inTrial) {
    return (
      <EuiFlexGroup alignItems='center' gutterSize='m' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiTitle size='xs'>
            <h3>{title}</h3>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiBadge color='secondary' data-test-id='cost-analysis-current-balance-trial-badge'>
            <FormattedMessage
              id='cost-analysis.current-balance.free-trial-period'
              defaultMessage='Free {trial_length} day trial'
              values={{ trial_length }}
            />
          </EuiBadge>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  return title
}

export default UsageBreakdownTitle
