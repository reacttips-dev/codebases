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

import React, { Fragment, PureComponent, ReactElement } from 'react'

import { pick } from 'lodash'

import { EuiSpacer } from '@elastic/eui'

import CostsGridIntro from './CostsGridIntro'
import ProductAndDtsCosts from '../ProductAndDtsCosts'
import DeploymentCostsGrid from '../DeploymentCostsGrid'

import { getTimeRange, hasSelectedDateRangeChanged } from '../lib'

import {
  AccountCostTimePeriod,
  AsyncRequestState,
  UserProfile,
  DeploymentItemsCosts,
  SelectedItems as SelectedFilterItems,
  TimePeriod,
} from '../../../../../types'

interface Props {
  onClickDeploymentName: (selectedDeploymentId: string) => void
  profile: UserProfile
  selectedFilterItems: SelectedFilterItems
  timePeriod: TimePeriod
  fetchDeploymentCostItemsRequest: AsyncRequestState
  deploymentItemsCosts: DeploymentItemsCosts
  fetchDeploymentCostItems: ({
    organizationId,
    timePeriod,
  }: {
    organizationId: string
    timePeriod: AccountCostTimePeriod
  }) => any
  resetFetchDeploymentCostItemsRequest: () => void
}

class CostsGrid extends PureComponent<Props> {
  private hasPendingFetchDeploymentItemsCostsRequest: boolean = false

  componentDidMount(): void {
    this.fetchDeploymentCostItemsIfNeeded()
  }

  componentDidUpdate(prevProps: Props): void {
    const {
      fetchDeploymentCostItemsRequest,
      resetFetchDeploymentCostItemsRequest,
      selectedFilterItems: { selectedViewByOption },
    } = this.props
    const {
      selectedFilterItems: { selectedViewByOption: prevSelectedViewByOption },
    } = prevProps

    if (
      selectedViewByOption === 'deployment' &&
      prevSelectedViewByOption === 'product' &&
      fetchDeploymentCostItemsRequest.error
    ) {
      resetFetchDeploymentCostItemsRequest()
    }

    this.fetchDeploymentCostItemsIfNeeded(prevProps)
  }

  render(): ReactElement {
    const {
      fetchDeploymentCostItemsRequest,
      onClickDeploymentName,
      profile,
      selectedFilterItems,
      timePeriod,
    } = this.props
    const { selectedDeployments } = selectedFilterItems
    const isProductView = this.isProductView()

    return (
      <Fragment>
        <CostsGridIntro
          profile={profile}
          selectedFilterItems={selectedFilterItems}
          timePeriod={timePeriod}
        />

        <EuiSpacer size='m' />

        {isProductView ? (
          <ProductAndDtsCosts
            selectedFilterItems={selectedFilterItems}
            timePeriod={timePeriod}
            fetchRequest={fetchDeploymentCostItemsRequest}
          />
        ) : (
          <DeploymentCostsGrid
            filterBy={selectedDeployments}
            onClickDeploymentName={onClickDeploymentName}
          />
        )}
      </Fragment>
    )
  }

  isProductView(): boolean {
    const { selectedFilterItems } = this.props
    return selectedFilterItems.selectedViewByOption === 'product'
  }

  shouldFetchDeploymentItemsCosts(prevProps?: Props): boolean {
    const { fetchDeploymentCostItemsRequest, deploymentItemsCosts, selectedFilterItems } =
      this.props
    const prevSelectedFilterItems = prevProps && prevProps.selectedFilterItems

    if (!deploymentItemsCosts) {
      return !fetchDeploymentCostItemsRequest.inProgress && !fetchDeploymentCostItemsRequest.error
    }

    if (!prevSelectedFilterItems) {
      return true
    }

    return (
      this.hasPendingFetchDeploymentItemsCostsRequest ||
      hasSelectedDateRangeChanged({
        selectedDateRange: pick(selectedFilterItems, ['selectedStartDate', 'selectedEndDate']),
        prevSelectedDateRange: pick(prevSelectedFilterItems, [
          'selectedStartDate',
          'selectedEndDate',
        ]),
      })
    )
  }

  fetchDeploymentCostItemsIfNeeded = (prevProps?: Props): void => {
    if (this.shouldFetchDeploymentItemsCosts(prevProps)) {
      this.fetchDeploymentCostItems()
    }
  }

  fetchDeploymentCostItems(): void {
    const {
      fetchDeploymentCostItems,
      deploymentItemsCosts,
      timePeriod,
      profile: { organization_id },
    } = this.props

    if (!this.isProductView()) {
      this.hasPendingFetchDeploymentItemsCostsRequest =
        !deploymentItemsCosts || timePeriod.id !== deploymentItemsCosts.timePeriod.id
      return
    }

    fetchDeploymentCostItems({
      organizationId: organization_id!,
      timePeriod: { ...getTimeRange({ timePeriod }), id: timePeriod!.id },
    })

    this.hasPendingFetchDeploymentItemsCostsRequest = false
  }
}

export default CostsGrid
