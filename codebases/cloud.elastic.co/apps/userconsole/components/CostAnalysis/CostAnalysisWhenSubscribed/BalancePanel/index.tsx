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
import { FormattedMessage } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem, EuiIconTip, EuiSpacer, EuiText } from '@elastic/eui'

import RatePanel, { Rate } from '../../RatePanel'
import ElasticConsumptionUnits from '../../../formatters/ElasticConsumptionUnits'
import BalanceLineItemsPopover from './BalanceLineItemsPopover'

import { Balance } from '../../../../../../lib/api/v1/types'

import './balancePanel.scss'

interface Props {
  balance: Balance
}

class BalancePanel extends PureComponent<Props> {
  render(): ReactElement {
    const {
      balance: { line_items },
    } = this.props

    return (
      <div className='cost-analysis-prepaid-balance'>
        <RatePanel
          description={{
            text: (
              <EuiFlexGroup gutterSize='s' responsive={false} alignItems='center'>
                <EuiFlexItem grow={false}>
                  <FormattedMessage
                    id='cost-analysis.prepaid-balance'
                    defaultMessage='Prepaid balance'
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <BalanceLineItemsPopover lineItems={line_items} />
                </EuiFlexItem>
              </EuiFlexGroup>
            ),
          }}
          rates={this.renderBalanceItems()}
        />
      </div>
    )
  }

  renderBalanceItems(): Rate[] {
    const {
      balance: { available, remaining },
    } = this.props

    return [
      {
        name: this.renderBalanceItemText({
          text: (
            <FormattedMessage
              id='cost-analysis.prepaid-balance.available-balance'
              defaultMessage='Initial balance'
            />
          ),
        }),
        description: this.renderBalance({ available }),
      },
      {
        name: this.renderBalanceItemText({
          text: (
            <FormattedMessage
              id='cost-analysis.prepaid-balance.remaining-balance'
              defaultMessage='Remaining balance'
            />
          ),
        }),
        description: this.renderBalance({ remaining }),
      },
      {
        name: <EuiSpacer />,
        description: <EuiSpacer />,
      },
    ]
  }

  renderBalance({
    available,
    remaining,
  }: {
    available?: number
    remaining?: number
  }): ReactElement {
    const balance = available || remaining || 0

    if (typeof remaining !== 'undefined' && remaining <= 0) {
      return (
        <EuiFlexGroup gutterSize='xs' justifyContent='flexEnd'>
          <EuiFlexItem grow={false}>
            <EuiText color='danger'>
              <ElasticConsumptionUnits unit='none' value={balance} />
            </EuiText>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiIconTip
              color='danger'
              content={
                <FormattedMessage
                  id='cost-analysis.prepaid-balance.add-funds'
                  defaultMessage='To add more funds, contact your account sales executive.'
                />
              }
              position='top'
              type='questionInCircle'
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    return (
      <EuiText color='secondary'>
        <ElasticConsumptionUnits unit='none' value={balance} />
      </EuiText>
    )
  }

  renderBalanceItemText({ text, info }: { text: ReactElement; info?: ReactElement }): ReactElement {
    if (!info) {
      return (
        <EuiText color='subdued' className='cost-analysis-prepaid-balance-name'>
          {text}
        </EuiText>
      )
    }

    return (
      <EuiFlexGroup gutterSize='xs' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiText color='subdued' className='cost-analysis-prepaid-balance-name'>
            {text}
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiIconTip color='subdued' content={info} position='top' type='iInCircle' />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }
}

export default BalancePanel
