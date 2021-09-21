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

import React, { PureComponent, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiText, EuiTextColor } from '@elastic/eui'

import FormattedUnit from '../FormattedUnit'
import CurrentHourlyRate from '../RatePanel/CurrentHourlyRate'
import MonthToDateUsage from '../RatePanel/MonthToDateUsage'

import { accountBillingUrl } from '../../../urls'
import { deploymentEditUrl } from '../../../../../lib/urlBuilder'
import { DeploymentCosts } from '../../../../../lib/api/v1/types'
import { AccountCostsSummary, Info } from '../../../../../types'

interface Props extends WrappedComponentProps {
  accountCostOverview: AccountCostsSummary
  deployments: DeploymentCosts[]
}

const messages = defineMessages({
  name: {
    id: `cost-analysis.trial-started.scale-down`,
    defaultMessage: `scale down`,
  },
})

class TrialStarted extends PureComponent<Props> {
  render(): ReactElement {
    return (
      <div className='cost-analysis-trial-started' data-test-id='cost-analysis-trial-started'>
        <EuiFlexGroup gutterSize='l'>
          <EuiFlexItem>
            <CurrentHourlyRate info={this.getHourlyRatePanelInfo()} rate={0} />
          </EuiFlexItem>
          <EuiFlexItem>{this.renderMonthToDateUsagePanel()}</EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }

  renderMonthToDateUsagePanel(): ReactElement {
    const {
      accountCostOverview: {
        isTrialConversionUser,
        paidUsage,
        trials,
        costs: { total },
      },
    } = this.props

    if (isTrialConversionUser) {
      return (
        <MonthToDateUsage
          rate={total}
          rates={[
            {
              name: (
                <EuiText color='subdued'>
                  <FormattedMessage
                    id='cost-analysis.trial-started.trial-usage'
                    defaultMessage='Trial usage'
                  />
                </EuiText>
              ),
              rate: trials,
            },
            {
              name: (
                <EuiText color='subdued'>
                  <FormattedMessage
                    id='cost-analysis.trial-started.paid-usage'
                    defaultMessage='Paid usage'
                  />
                </EuiText>
              ),
              rate: paidUsage,
            },
          ]}
        />
      )
    }

    return (
      <MonthToDateUsage
        rate={total}
        info={[
          { text: this.renderMonthlyCostInfo() },
          {
            text: (
              <FormattedMessage
                id='cost-analysis.trial-started.monthly-cost-after-trial-info'
                defaultMessage='Usage is based on your active deployment rates.'
                values={{
                  monthlyCost: <FormattedUnit value={total} dp={2} />,
                }}
              />
            ),
          },
        ]}
      />
    )
  }

  renderMonthlyCostInfo(): ReactElement {
    return (
      <FormattedMessage
        id='cost-analysis.trial-started.monthly-cost-info'
        defaultMessage='FREE during trial'
      />
    )
  }

  renderIconTip(): ReactElement {
    const {
      deployments,
      intl: { formatMessage },
    } = this.props
    const deployment = deployments ? deployments[0] : null

    return (
      <div style={{ width: '170px' }}>
        <FormattedMessage
          id='cost-analysis.trial-started-tip'
          defaultMessage='You can {scaleDown} your deployment to reduce costs. A {creditCard} is required if you want to scale up.'
          values={{
            creditCard: (
              <Link to={accountBillingUrl()}>
                <FormattedMessage
                  id='cost-analysis.trial-started.credit-card'
                  defaultMessage='credit card'
                />
              </Link>
            ),
            scaleDown: deployment ? (
              <Link to={deploymentEditUrl(deployment.deployment_id)}>
                {formatMessage(messages.name)}
              </Link>
            ) : (
              <EuiTextColor color='subdued' component='span'>
                {formatMessage(messages.name)}
              </EuiTextColor>
            ),
          }}
        />
      </div>
    )
  }

  getHourlyRatePanelInfo(): Info[] {
    const {
      accountCostOverview: {
        isTrialConversionUser,
        costs: { total },
      },
    } = this.props

    if (isTrialConversionUser) {
      return [
        {
          text: (
            <FormattedMessage
              id='cost-analysis.hourly-rate-for-deployment-capacity'
              defaultMessage='Hourly rate for all deployment capacity'
            />
          ),
        },
      ]
    }

    return [
      {
        text: (
          <FormattedMessage
            id='cost-analysis.free-during-trial'
            defaultMessage='FREE during trial'
          />
        ),
      },
      {
        text: (
          <FormattedMessage
            id='cost-analysis.trial-started.cost-after-trial'
            defaultMessage='{costAfterTrial} after trial period ends based on your current usage'
            values={{
              costAfterTrial: <FormattedUnit value={total} dp={2} />,
            }}
          />
        ),
        tip: { content: this.renderIconTip() },
      },
    ]
  }
}

export default injectIntl(TrialStarted)
