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
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import FormattedUnit from '../FormattedUnit'
import ProductAndDtsCosts from '../ProductAndDtsCosts'
import {
  getDeploymentName,
  formatTimePeriod,
  getTimeRange,
  hasSelectedDateRangeChanged,
} from '../lib'
import {
  AccountCostTimePeriod,
  AsyncRequestState,
  TimePeriod,
  UserProfile,
} from '../../../../../types'
import { ItemsCosts } from '../../../../../lib/api/v1/types'

import './deploymentCostDetails.scss'

interface Props {
  deploymentId?: string
  deploymentName?: string
  profile: UserProfile
  isOpen: boolean
  totalCost?: number
  timePeriod: TimePeriod
  onClose: () => void
  deploymentItemsCostsByDeployment: ItemsCosts
  fetchDeploymentCostItemsByDeploymentRequest: AsyncRequestState
  fetchDeploymentCostItemsByDeployment: (args: {
    timePeriod: AccountCostTimePeriod
    deploymentId: string
    organizationId: string
  }) => any
}

class DeploymentCostDetails extends PureComponent<Props> {
  private hasPendingFetchCostsRequest: boolean = false

  componentDidMount(): void {
    this.fetchCosts()
  }

  componentDidUpdate(prevProps: Props): void {
    this.fetchCostsIfNeeded(prevProps)
  }

  render(): ReactElement | null {
    const { deploymentId, deploymentName, isOpen, fetchDeploymentCostItemsByDeploymentRequest } =
      this.props

    if (!isOpen) {
      return null
    }

    return (
      <EuiFlyout onClose={() => this.props.onClose()} aria-labelledby='flyoutTitle' size='l'>
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size='m'>
            <h2 id='flyoutTitle' data-test-id='deployment-cost-details-title'>
              {deploymentName}
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          {this.renderTotalCost()}

          <EuiSpacer size='xl' />

          <ProductAndDtsCosts
            showProductActivityPeriod={true}
            data-test-id='deployment-product-dts-cost-details'
            deploymentId={deploymentId}
            fetchRequest={fetchDeploymentCostItemsByDeploymentRequest}
          />
        </EuiFlyoutBody>
      </EuiFlyout>
    )
  }

  renderTotalCost(): ReactElement {
    const { deploymentId, deploymentName, timePeriod, totalCost } = this.props

    return (
      <div className='deployment-details-total-cost-title'>
        <EuiTitle size='s'>
          <h3>
            <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false}>
              <EuiFlexItem grow={false}>
                <FormattedMessage
                  id='deployment-details.total-cost.title'
                  data-test-id='deployment-details-total-cost-title'
                  defaultMessage='Total cost "{deploymentName}"'
                  values={{
                    deploymentName: getDeploymentName({
                      deployment_id: deploymentId,
                      deployment_name: deploymentName,
                    }),
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>:</EuiFlexItem>
              <EuiFlexItem grow={false}>
                <FormattedUnit
                  data-test-id='deployment-details-total-cost-value'
                  value={totalCost || 0}
                  dp={2}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </h3>
        </EuiTitle>

        <EuiSpacer size='xs' />

        <EuiText color='subdued' size='s'>
          {formatTimePeriod({ timePeriod })}
        </EuiText>
      </div>
    )
  }

  shouldFetchCosts(prevProps: Props): boolean {
    const {
      deploymentId,
      fetchDeploymentCostItemsByDeploymentRequest,
      deploymentItemsCostsByDeployment,
      timePeriod: { from: selectedStartDate, to: selectedEndDate },
    } = this.props
    const { deploymentId: prevDeploymentId, timePeriod: prevTimePeriod } = prevProps

    if (!deploymentItemsCostsByDeployment) {
      return !fetchDeploymentCostItemsByDeploymentRequest.inProgress
    }

    if (!prevTimePeriod) {
      return true
    }

    const selectedDateRangeHasChanged = hasSelectedDateRangeChanged({
      selectedDateRange: { selectedStartDate, selectedEndDate },
      prevSelectedDateRange: {
        selectedStartDate: prevTimePeriod.from,
        selectedEndDate: prevTimePeriod.to,
      },
    })

    return (
      this.hasPendingFetchCostsRequest ||
      selectedDateRangeHasChanged ||
      deploymentId !== prevDeploymentId
    )
  }

  fetchCostsIfNeeded = (prevProps: Props): void => {
    if (this.shouldFetchCosts(prevProps)) {
      this.fetchCosts()
    }
  }

  fetchCosts = (): void => {
    const {
      deploymentId,
      fetchDeploymentCostItemsByDeployment,
      isOpen,
      timePeriod,
      profile: { organization_id },
    } = this.props

    if (!isOpen) {
      this.hasPendingFetchCostsRequest = true
      return
    }

    fetchDeploymentCostItemsByDeployment({
      organizationId: organization_id!,
      deploymentId: deploymentId!,
      timePeriod: { ...getTimeRange({ timePeriod }), id: timePeriod.id },
    })

    this.hasPendingFetchCostsRequest = false
  }
}

export default DeploymentCostDetails
