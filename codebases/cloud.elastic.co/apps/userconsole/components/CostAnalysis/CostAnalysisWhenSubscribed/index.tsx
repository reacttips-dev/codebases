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

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import CurrentHourlyRate from '../RatePanel/CurrentHourlyRate'
import MonthToDateUsage from '../RatePanel/MonthToDateUsage'
import BalancePanel from './BalancePanel'
import RatePanel from '../RatePanel'

import { getDaysLeftInBillingCycle } from '../lib'
import {
  isAnnualCustomer,
  isMonthlyCustomer,
  isPrepaidConsumptionCustomer,
} from '../../../../../lib/billing'

import { UserProfile } from '../../../../../types'
import { CostsOverview } from '../../../../../lib/api/v1/types'

import './costAnalysisWhenSubscribed.scss'

interface Props {
  profile: UserProfile
  accountCostOverview: CostsOverview
}

const CostAnalysisWhenSubscribed: FunctionComponent<Props> = ({ accountCostOverview, profile }) => {
  const { balance } = accountCostOverview

  return (
    <EuiFlexGroup gutterSize='l' data-test-id='cost-analysis-subscribed-user'>
      <EuiFlexItem>
        <CurrentHourlyRate
          rate={accountCostOverview.hourly_rate}
          info={[
            {
              text: (
                <FormattedMessage
                  id='cost-analysis.hourly-rate-for-deployment-capacity'
                  defaultMessage='Hourly rate for all deployment capacity'
                />
              ),
            },
          ]}
        />
      </EuiFlexItem>

      <EuiFlexItem>
        <MonthToDateUsage
          rate={accountCostOverview.costs.total}
          info={[
            {
              text: (
                <FormattedMessage
                  id='cost-analysis.days-left-in-billing-cycle'
                  defaultMessage='{days} {days, plural, one {day} other {days}} left in billing cycle'
                  values={{ days: getDaysLeftInBillingCycle() }}
                />
              ),
            },
          ]}
        />
      </EuiFlexItem>

      {(isMonthlyCustomer(profile) || isAnnualCustomer(profile)) && (
        <EuiFlexItem>
          <RatePanel
            data-test-id='cost-analysis.credits-this-month'
            description={{
              text: (
                <FormattedMessage
                  id='cost-analysis.credits-this-month'
                  defaultMessage='Credits this month'
                />
              ),
            }}
            info={[
              {
                text: (
                  <FormattedMessage
                    id='cost-analysis.monthly-credit-deduction-info'
                    defaultMessage='This will be deducted from your bill this month'
                  />
                ),
              },
            ]}
            rate={balance?.available || 0}
            color='secondary'
          />
        </EuiFlexItem>
      )}

      {isPrepaidConsumptionCustomer(profile) && balance && (
        <EuiFlexItem>
          <BalancePanel balance={balance} />
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  )
}

export default CostAnalysisWhenSubscribed
