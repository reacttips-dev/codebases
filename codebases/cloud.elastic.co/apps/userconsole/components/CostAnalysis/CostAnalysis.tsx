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

import React, { PureComponent, Fragment, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { pick } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import CostOverview from './CostOverview'
import CostAnalysisFilter from './Filter'
import DeploymentCostDetails from './DeploymentCostDetails'
import CostsGrid from './CostsGrid'

import DocLink from '../../../../components/DocLink'

import { getTimeRange, hasSelectedDateRangeChanged, trialNotStarted } from './lib'
import { isPrepaidConsumptionCustomer } from '../../../../lib/billing'

import {
  AsyncRequestState,
  UserProfile,
  AccountCostTimePeriod,
  AccountCosts,
  SelectedItems as SelectedFilterItems,
  TimePeriod,
} from '../../../../types'

import './costAnalysis.scss'

interface Props {
  accountCosts?: AccountCosts
  fetchAccountCosts: ({
    organizationId,
    timePeriod,
  }: {
    organizationId: string
    timePeriod: AccountCostTimePeriod
  }) => void
  fetchAccountCostsRequest: AsyncRequestState
  fetchDeploymentCostItemsRequest: AsyncRequestState
  profile: UserProfile
  fetchProfileRequest: AsyncRequestState
}

interface State {
  flyoutIsOpen: boolean
  selectedDeploymentId?: string
  selectedFilterItems: SelectedFilterItems
}

class CostAnalysis extends PureComponent<Props, State> {
  private hasPendingFetchRequest: boolean = false

  state: State = this.getDefaultState()

  componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    const { profile } = this.props
    const { selectedFilterItems: prevSelectedFilterItems } = prevState

    if (!trialNotStarted(profile) && this.shouldFetch({ prevSelectedFilterItems })) {
      this.fetchCosts()
    }
  }

  render(): ReactElement {
    const { profile } = this.props

    return (
      <div className='account-cost-analysis'>
        <EuiSpacer size='m' />

        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiTitle size='xs'>
              <h3>
                <FormattedMessage
                  id='cost-analysis.page-sub-title'
                  defaultMessage='Current month'
                />
              </h3>
            </EuiTitle>
          </EuiFlexItem>

          {isPrepaidConsumptionCustomer(profile) && (
            <EuiFlexItem grow={false}>
              <EuiText>
                <FormattedMessage
                  id='cost-analysis.page-ecu-note'
                  defaultMessage='All values are shown in {ecu}'
                  values={{
                    ecu: (
                      <DocLink link='billingECU'>
                        <FormattedMessage
                          id='cost-analysis.page-ecu-unit'
                          defaultMessage='Elastic Consumption Units (ECU)'
                        />
                      </DocLink>
                    ),
                  }}
                />
              </EuiText>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        <CostOverview />

        {this.renderGridsAndFilters()}
      </div>
    )
  }

  renderGridsAndFilters(): ReactElement | null {
    const { accountCosts, fetchAccountCostsRequest, fetchDeploymentCostItemsRequest, profile } =
      this.props
    const deployments = (accountCosts && accountCosts.deployments) || null
    const { flyoutIsOpen, selectedFilterItems } = this.state
    const timePeriod = this.getSelectedPeriod()

    if (trialNotStarted(profile)) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer size='xxl' />

        <EuiFlexGroup
          alignItems='flexStart'
          justifyContent='flexStart'
          className='account-cost-analysis-content'
          data-test-id='account-cost-analysis-content'
        >
          <EuiFlexItem className='account-cost-analysis-grid'>
            <CostsGrid
              onClickDeploymentName={this.onClickDeploymentName}
              profile={profile}
              selectedFilterItems={selectedFilterItems}
              timePeriod={timePeriod}
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false} className='account-cost-analysis-filter'>
            <CostAnalysisFilter
              isDisabled={
                fetchAccountCostsRequest.inProgress || fetchDeploymentCostItemsRequest.inProgress
              }
              profile={profile}
              deployments={deployments}
              onFilter={this.onFilterResults}
              defaultTimePeriod={timePeriod}
            />
          </EuiFlexItem>
        </EuiFlexGroup>

        {accountCosts && accountCosts.deployments.length > 0 && (
          <DeploymentCostDetails
            profile={profile}
            isOpen={flyoutIsOpen}
            timePeriod={timePeriod!}
            {...this.getDeploymentCostInfo()}
            onClose={this.onCloseDeploymentDetails}
          />
        )}
      </Fragment>
    )
  }

  shouldFetch({
    prevSelectedFilterItems,
  }: {
    prevSelectedFilterItems: SelectedFilterItems
  }): boolean {
    const { accountCosts, fetchAccountCostsRequest } = this.props
    const { selectedFilterItems } = this.state
    const { timePeriodOptionItem } = selectedFilterItems
    const { timePeriodOptionItem: prevTimePeriodOptionItem } = prevSelectedFilterItems

    if (fetchAccountCostsRequest.inProgress) {
      return false
    }

    if (this.hasPendingFetchRequest) {
      return true
    }

    if (!prevTimePeriodOptionItem) {
      return !accountCosts // initial fetch request
    }

    if (!timePeriodOptionItem) {
      // a fetch will not occur until filter items are set
      return false
    }

    return hasSelectedDateRangeChanged({
      selectedDateRange: pick(selectedFilterItems, ['selectedStartDate', 'selectedEndDate']),
      prevSelectedDateRange: pick(prevSelectedFilterItems, [
        'selectedStartDate',
        'selectedEndDate',
      ]),
    })
  }

  getSelectedPeriod(): TimePeriod {
    const {
      selectedFilterItems: { timePeriodOptionItem, selectedStartDate, selectedEndDate },
    } = this.state

    if (!timePeriodOptionItem) {
      return { ...this.getTimePeriodFromAccountCosts() }
    }

    return {
      id: timePeriodOptionItem.id,
      from: selectedStartDate,
      to: selectedEndDate,
    }
  }

  getTimePeriodFromAccountCosts(): TimePeriod {
    const { accountCosts } = this.props

    if (!accountCosts) {
      return { id: 'currentMonth' } // Return the known default
    }

    return accountCosts.timePeriod
  }

  onFilterResults = (selectedFilterItems: SelectedFilterItems): void => {
    this.setState({ selectedFilterItems })
  }

  getDefaultState(): State {
    return {
      flyoutIsOpen: false,
      selectedDeploymentId: undefined,
      selectedFilterItems: {
        timePeriodOptionItem: undefined,
        selectedStartDate: undefined,
        selectedEndDate: undefined,
        selectedViewByOption: '',
        selectedDeployments: [],
      },
    }
  }

  fetchCosts(): void {
    const {
      fetchAccountCosts,
      profile: { organization_id },
    } = this.props
    const selectedPeriod = this.getSelectedPeriod()
    const timePeriod = { ...getTimeRange({ timePeriod: selectedPeriod }), id: selectedPeriod.id }

    if (!this.isDeploymentGridView()) {
      this.hasPendingFetchRequest = true
      return
    }

    fetchAccountCosts({ organizationId: organization_id!, timePeriod })

    this.hasPendingFetchRequest = false
  }

  isDeploymentGridView(): boolean {
    const { selectedFilterItems } = this.state
    return selectedFilterItems.selectedViewByOption !== 'product'
  }

  onClickDeploymentName = (selectedDeploymentId: string): void => {
    this.setState({ selectedDeploymentId, flyoutIsOpen: true })
  }

  getDeploymentCostInfo(): { deploymentId?: string; deploymentName?: string; totalCost?: number } {
    const { accountCosts } = this.props
    const deployments = (accountCosts && accountCosts.deployments) || []
    const { selectedDeploymentId } = this.state

    const selectedItem =
      deployments.filter(({ deployment_id }) => deployment_id === selectedDeploymentId)[0] || {}

    return {
      deploymentId: selectedDeploymentId,
      deploymentName: selectedItem.deployment_name,
      totalCost: selectedItem.costs?.total,
    }
  }

  onCloseDeploymentDetails = (): void => {
    this.setState({ flyoutIsOpen: false })
  }
}

export default CostAnalysis
