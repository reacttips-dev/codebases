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

import React, { Fragment, FunctionComponent } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText, EuiTextColor, EuiTitle } from '@elastic/eui'

import { CuiLink } from '../../../../../cui'
import UsageBreakdownTitle from './UsageBreakdownTitle'

import { formatTimePeriod } from '../lib'
import { isPrepaidConsumptionCustomer } from '../../../../../lib/billing'

import { getConfigForKey } from '../../../../../store'

import { SelectedItems as SelectedFilterItems, TimePeriod, UserProfile } from '../../../../../types'

interface Props extends WrappedComponentProps {
  profile: UserProfile
  selectedFilterItems: SelectedFilterItems
  timePeriod?: TimePeriod
}

const messages = defineMessages({
  breakdownInfo: {
    id: `cost-analysis-breakdown-info`,
    defaultMessage: `View a breakdown of usage by time range. This is not your final bill, as it does not include credits, prepaids, or any other discounts.
            Check your {invoice} for the final bill.`,
  },
  breakdownInfoEssp: {
    id: `cost-analysis-breakdown-essp-info`,
    defaultMessage: `View a breakdown of usage by time range. This is not your final bill, as it does not include credits, prepaids, or any other discounts.`,
  },
})

const CostsGridIntro: FunctionComponent<Props> = ({ profile, selectedFilterItems, timePeriod }) => {
  const isPrivate = getConfigForKey(`APP_FAMILY`) === `essp`

  return (
    <Fragment>
      <EuiTitle size='xs' data-test-id='cost-analysis-usage-breakdown-title'>
        <h3>
          <UsageBreakdownTitle profile={profile} />
        </h3>
      </EuiTitle>

      <EuiSpacer size='m' />

      <EuiText size='s'>
        {isPrivate ? (
          <FormattedMessage {...messages.breakdownInfoEssp} />
        ) : (
          <FormattedMessage
            {...messages.breakdownInfo}
            values={{
              invoice: (
                <CuiLink to='/account/billing-history'>
                  {!isPrepaidConsumptionCustomer(profile) ? (
                    <FormattedMessage id='cost-analysis-invoice-link' defaultMessage='invoice' />
                  ) : (
                    <FormattedMessage
                      id='cost-analysis-usage-statement-link'
                      defaultMessage='usage statement'
                    />
                  )}
                </CuiLink>
              ),
            }}
          />
        )}
      </EuiText>

      <EuiSpacer size='m' />

      {selectedFilterItems.selectedViewByOption === 'deployment' && (
        <EuiText size='s' data-test-id='cost-analysis.usage-breakdown.text'>
          <strong>
            <EuiFlexGroup alignItems='center' gutterSize='s' responsive={false}>
              <EuiFlexItem grow={false}>
                <FormattedMessage
                  id='cost-analysis.usage-breakdown.time-range'
                  defaultMessage='Time range'
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiTextColor
                  color='subdued'
                  data-test-id='cost-analysis-current-balance-time-period'
                >
                  {formatTimePeriod({ timePeriod })}
                </EuiTextColor>
              </EuiFlexItem>
            </EuiFlexGroup>
          </strong>
        </EuiText>
      )}
    </Fragment>
  )
}

export default injectIntl(CostsGridIntro)
