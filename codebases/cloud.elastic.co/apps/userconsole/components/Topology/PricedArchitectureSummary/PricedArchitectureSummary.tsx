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

import React, { Component, ReactNode, ReactElement } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'

import ArchitectureSummary from '../../../../../components/Topology/DeploymentTemplates/components/ArchitectureViz/ArchitectureSummary'

import {
  getArchitecturePricingItems,
  SummaryItems,
} from '../../../../../lib/deployments/architecture'

import {
  AnyTopologyElement,
  AsyncRequestState,
  BasePrice,
  ProfileState,
  SnapshotDetails,
  UserSubscription,
  BillingSubscriptionLevel,
} from '../../../../../types'

import { InstanceConfiguration } from '../../../../../lib/api/v1/types'

export interface StateProps {
  showPrices: boolean
  profile: ProfileState
  basePrices: BasePrice[] | undefined
  subscription: UserSubscription
  fetchBasePricesRequest: AsyncRequestState
  showSubscriptionOptions?: boolean
  isSkuPicker?: boolean
}

export interface DispatchProps {
  fetchBasePrices: ({ regionId, level, marketplace }) => Promise<any>
}

export interface ConsumerProps {
  actionButton?: ReactNode
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: AnyTopologyElement[]
  regionId: string
  renderMap?: (prices: SummaryItems, args: Props) => ReactNode
  snapshotDetails?: SnapshotDetails
  isTrialConverting?: boolean
  shouldFetchPriceInTrial?: boolean
}

type ArchitectureProps = {
  actionButton?: ReactNode
  appendSummaryItems?: Array<{ title: ReactNode; description: string; id?: string }>
  deploymentName?: string
  deploymentVersion?: string
  hideArchitectureViz?: boolean
  instanceConfigurations: InstanceConfiguration[]
  isAutoscalingEnabled?: boolean
  nodeConfigurations: AnyTopologyElement[]
  regionId: string
  render?: (id: string, reactNode) => ReactElement
  snapshotDetails?: SnapshotDetails
  onChangeSubscription?: ({
    subscription,
    getMarketplacePrices,
  }: {
    subscription: BillingSubscriptionLevel
    getMarketplacePrices?: boolean
  }) => void
  selectedSubscription?: BillingSubscriptionLevel
  showSubscriptionOptions: boolean
  showMarketplacePrices?: boolean
  sticky?: boolean
}

export type State = {
  selectedSubscription: BillingSubscriptionLevel
}

export type Props = ConsumerProps &
  DispatchProps &
  StateProps &
  ArchitectureProps &
  WrappedComponentProps

class PricedArchitectureSummary extends Component<Props, State> {
  componentDidMount() {
    const {
      regionId,
      fetchBasePrices,
      selectedSubscription,
      shouldFetchPriceInTrial,
      isSkuPicker,
      showMarketplacePrices,
    } = this.props

    if (!isSkuPicker && (this.shouldRenderPricing() || shouldFetchPriceInTrial)) {
      fetchBasePrices({
        regionId,
        level: selectedSubscription,
        marketplace: showMarketplacePrices,
      })
    }
  }

  render() {
    const { renderMap = this.defaultRenderMap } = this.props
    const prices = this.getPrices()

    return renderMap(prices, this.props)
  }

  shouldRenderPricing() {
    const { showPrices, profile, isTrialConverting } = this.props

    if (isTrialConverting) {
      return true
    }

    if (!showPrices) {
      return false
    }

    return profile && !profile.inTrial
  }

  getPrices() {
    const {
      intl,
      regionId,
      instanceConfigurations,
      nodeConfigurations,
      basePrices,
      profile,
      selectedSubscription,
      isAutoscalingEnabled,
    } = this.props

    if (!profile || !this.shouldRenderPricing()) {
      return []
    }

    return getArchitecturePricingItems({
      intl,
      regionId,
      instanceConfigurations,
      nodeConfigurations,
      basePrices,
      level: selectedSubscription || profile.level,
      isAutoscalingEnabled,
    })
  }

  defaultRenderMap = (
    prices: SummaryItems,
    /* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
    {
      basePrices,
      renderMap,
      render,
      subscription,
      onChangeSubscription,
      selectedSubscription,
      showSubscriptionOptions,
      sticky,
      ...rest
    }: Props & ArchitectureProps,
  ): ReactNode => {
    if (!render) {
      return null
    }

    return (
      <ArchitectureSummary
        {...rest}
        sticky={sticky}
        render={render}
        selectedSubscription={selectedSubscription}
        onChangeSubscription={
          onChangeSubscription
            ? ({
                subscription,
                getMarketplacePrices,
              }: {
                subscription: BillingSubscriptionLevel
                getMarketplacePrices?: boolean
              }) => onChangeSubscription({ subscription, getMarketplacePrices })
            : undefined
        }
        showSubscriptionOptions={showSubscriptionOptions}
        appendSummaryItems={prices}
      />
    )
  }
}

export default injectIntl(PricedArchitectureSummary)
