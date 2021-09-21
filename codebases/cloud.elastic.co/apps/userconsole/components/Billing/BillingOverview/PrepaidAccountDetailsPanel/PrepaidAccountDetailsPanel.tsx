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
import { FormattedDate, FormattedMessage } from 'react-intl'

import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert, CuiTable, CuiTableColumn } from '../../../../../../cui'

import ElasticConsumptionUnits from '../../../formatters/ElasticConsumptionUnits'
import DetailsGridPopover from './DetailsGridPopover'

import { shortDate } from '../../../../../../config/dates'

import { LineItem } from '../../../../../../lib/api/v1/types'
import { AsyncRequestState, UserProfile } from '../../../../../../types'

import './prepaidAccountDetailsPanel.scss'

interface Props {
  prepaidBalanceLineItems: LineItem[]
  fetchPrepaidBalanceLineItemsIfNeeded: () => Promise<any>
  fetchPrepaidBalanceLineItemsRequest: AsyncRequestState
  fetchProfileRequest: AsyncRequestState
  profile: UserProfile
}

interface State {
  activeBalancesOnly: boolean
}

class PrepaidAccountDetailsPanel extends PureComponent<Props, State> {
  isDataFetched = false

  state = {
    activeBalancesOnly: true,
  }

  componentDidMount(): void {
    const { fetchPrepaidBalanceLineItemsIfNeeded } = this.props
    fetchPrepaidBalanceLineItemsIfNeeded().then(() => {
      this.isDataFetched = true
    })
  }

  render(): ReactElement {
    const { fetchPrepaidBalanceLineItemsRequest, prepaidBalanceLineItems } = this.props
    const { activeBalancesOnly } = this.state
    const gridRows = this.getGridRows()

    if (fetchPrepaidBalanceLineItemsRequest.error) {
      return <CuiAlert type='error'>{fetchPrepaidBalanceLineItemsRequest.error}</CuiAlert>
    }

    if (this.isDataFetched && (!prepaidBalanceLineItems || !prepaidBalanceLineItems.length)) {
      return (
        <EuiPanel className='billing-panel'>
          {this.renderPanelTitle()}

          <EuiSpacer size='m' />

          {this.renderEmptyGridState()}
        </EuiPanel>
      )
    }

    return (
      <EuiPanel className='billing-panel'>
        <EuiFlexGroup alignItems='center'>
          <EuiFlexItem>{this.renderPanelTitle()}</EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiSwitch
              label={
                <FormattedMessage
                  id='billing-details-summary.active-only-label'
                  defaultMessage='Active only'
                />
              }
              checked={activeBalancesOnly}
              onChange={this.toggleActiveState}
            />
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        {this.isDataFetched && gridRows.length < 1 && this.renderEmptyGridState(activeBalancesOnly)}

        <CuiTable<LineItem>
          getRowId={(item) => item.id}
          initialLoading={
            !prepaidBalanceLineItems || fetchPrepaidBalanceLineItemsRequest.inProgress
          }
          rows={gridRows}
          columns={this.getGridColumns()}
          rowClass={this.getRowClass}
        />
      </EuiPanel>
    )
  }

  renderPanelTitle(): ReactElement {
    return (
      <EuiTitle size='xxxs'>
        <h2>
          <FormattedMessage
            id='billing-details-summary.prepaid-account-details'
            defaultMessage='Prepaid account details'
          />
        </h2>
      </EuiTitle>
    )
  }

  renderEmptyGridState(noActiveBalances?: boolean): ReactElement {
    if (noActiveBalances) {
      return this.renderEmptyStatePrompt(
        <FormattedMessage
          id='billing-details-summary.empty-grid.no-active-balances'
          defaultMessage='You have no active prepaid balances'
        />,
        <FormattedMessage
          id='billing-details-summary.empty-grid-body.no-active-balances'
          defaultMessage='Active prepaid balances will show up here.'
        />,
      )
    }

    return this.renderEmptyStatePrompt(
      <FormattedMessage
        id='billing-details-summary.empty-grid'
        defaultMessage='You have no prepaid balances'
      />,
      <FormattedMessage
        id='billing-details-summary.empty-grid-body'
        defaultMessage='Prepaid balances will show up here.'
      />,
    )
  }

  renderEmptyStatePrompt(title: ReactElement, body: ReactElement): ReactElement {
    return (
      <EuiEmptyPrompt
        title={
          <EuiText size='xs'>
            <h2>{title}</h2>
          </EuiText>
        }
        body={<EuiText size='s'>{body}</EuiText>}
      />
    )
  }

  renderBalanceColumn(value: number): ReactElement {
    return (
      <EuiText size='s' className='prepaid-account-details-ecu'>
        <ElasticConsumptionUnits unit='none' value={value} />
      </EuiText>
    )
  }

  getGridColumns(): Array<CuiTableColumn<any>> {
    return [
      {
        label: (
          <FormattedMessage
            id='prepaid-account-details.initial-balance'
            defaultMessage='Initial balance'
          />
        ),
        render: ({ ecu_quantity }) => this.renderBalanceColumn(ecu_quantity),
      },
      {
        label: (
          <FormattedMessage
            id='prepaid-account-details.amount-spent'
            defaultMessage='Amount spent'
          />
        ),
        render: ({ ecu_balance, ecu_quantity }) =>
          this.renderBalanceColumn(ecu_quantity - ecu_balance),
      },
      {
        label: (
          <FormattedMessage
            id='prepaid-account-details.remaining-balance'
            defaultMessage='Remaining balance'
          />
        ),
        render: ({ ecu_balance }) => this.renderBalanceColumn(ecu_balance),
      },
      {
        label: (
          <FormattedMessage
            id='prepaid-account-details.expiration-date'
            defaultMessage='Expiration date'
          />
        ),
        render: ({ end }) => <FormattedDate value={end} {...shortDate} />,
      },
      {
        label: (
          <FormattedMessage
            id='prepaid-account-details.contract-info'
            defaultMessage='Contract info'
          />
        ),
        render: (lineItem) => <DetailsGridPopover details={lineItem} />,
      },
    ]
  }

  getGridRows(): LineItem[] {
    const { prepaidBalanceLineItems } = this.props

    if (!prepaidBalanceLineItems) {
      return []
    }

    const { activeBalancesOnly } = this.state
    return prepaidBalanceLineItems.filter(({ active }) => (activeBalancesOnly ? active : true))
  }

  getRowClass({ active }: LineItem): string {
    return active ? 'prepaid-account-details-active-item' : 'prepaid-account-details-inactive-item'
  }

  toggleActiveState = (): void => {
    const { activeBalancesOnly } = this.state
    this.setState({ activeBalancesOnly: !activeBalancesOnly })
  }
}

export default PrepaidAccountDetailsPanel
