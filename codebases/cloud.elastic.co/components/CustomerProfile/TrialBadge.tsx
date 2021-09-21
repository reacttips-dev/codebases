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

import { EuiBadge, EuiFlexItem } from '@elastic/eui'
import { getThemeColors } from '../../lib/theme'

type Props = {
  hasExpiredTrial: boolean
  trialDaysRemaining?: number
  className?: string
}

const TrialBadge: FunctionComponent<Props> = ({
  className,
  hasExpiredTrial,
  trialDaysRemaining,
}) => {
  const colors = getThemeColors()
  const { euiColorVis5 } = colors

  if (hasExpiredTrial) {
    return (
      <EuiFlexItem className={className} grow={false}>
        <EuiBadge>
          <FormattedMessage
            id='elasticsearch-service.title.trial-expired'
            defaultMessage='Trial expired'
          />
        </EuiBadge>
      </EuiFlexItem>
    )
  }

  return (
    <EuiFlexItem grow={false} className={className}>
      <EuiBadge color={euiColorVis5}>
        <FormattedMessage
          id='elasticsearch-service.title.trial-days-remaining'
          defaultMessage='Trial - {trialDaysRemaining} {trialDaysRemaining, plural, one {day} other {days}} left'
          values={{
            trialDaysRemaining,
          }}
        />
      </EuiBadge>
    </EuiFlexItem>
  )
}

export default TrialBadge
