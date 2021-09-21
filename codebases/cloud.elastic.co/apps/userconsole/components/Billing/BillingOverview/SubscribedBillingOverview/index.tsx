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

import React, { Component, Fragment, ReactElement } from 'react'

import { EuiSpacer } from '@elastic/eui'

import SelectSubscriptionModal from '../../SelectSubscription'
import SubscriptionOverviewPanel from '../SubscriptionOverviewPanel'
import NextBillPanel from '../NextBillPanel'
import PrepaidAccountDetailsPanel from '../PrepaidAccountDetailsPanel'

import ReviewSubscriptionChangesModal from '../../../Billing/ReviewSubscriptionChangesModal'

import { isPrepaidConsumptionCustomer } from '../../../../../../lib/billing'

import { UserProfile } from '../../../../../../types'
import { FeaturesUsage } from '../../../../../../lib/api/v1/types'

export type Props = {
  profile: UserProfile
  isLoading: boolean
  usageDetails: FeaturesUsage
}

type State = {
  isSelectSubscriptionModalOpen: boolean
  isConfirmationModalOpen: boolean
  isUsageModalOpen: boolean
  upgradeLevel: string | undefined // Determines whether or not user has selected Upgrade subscription, to correctly pre-select subscription
}

export default class SubscribedBillingOverview extends Component<Props, State> {
  state = {
    isSelectSubscriptionModalOpen: false,
    isConfirmationModalOpen: false,
    isUsageModalOpen: false,
    upgradeLevel: undefined,
  }

  render(): ReactElement {
    const { profile, isLoading, usageDetails } = this.props
    const { isSelectSubscriptionModalOpen, isUsageModalOpen, upgradeLevel } = this.state

    return (
      <div>
        {isSelectSubscriptionModalOpen && (
          <SelectSubscriptionModal
            upgradeLevel={upgradeLevel}
            closeModal={() =>
              this.setState({ isSelectSubscriptionModalOpen: false, upgradeLevel: undefined })
            }
            onSeeReviewChanges={() => {
              this.setState({ isSelectSubscriptionModalOpen: false, isUsageModalOpen: true })
            }}
          />
        )}

        {isUsageModalOpen && (
          <ReviewSubscriptionChangesModal
            usageDetails={usageDetails}
            closeModal={() => this.setState({ isUsageModalOpen: false })}
            onUpgrade={(level) =>
              this.setState({
                isUsageModalOpen: false,
                isSelectSubscriptionModalOpen: true,
                upgradeLevel: level,
              })
            }
          />
        )}

        <SubscriptionOverviewPanel
          isLoading={isLoading}
          profile={profile}
          onChangeSubscription={() => this.onChangeSubscription()}
        />

        <EuiSpacer />

        <NextBillPanel profile={profile} />

        {isPrepaidConsumptionCustomer(profile) && (
          <Fragment>
            <EuiSpacer />

            <PrepaidAccountDetailsPanel />
          </Fragment>
        )}

        <EuiSpacer size='xl' />
      </div>
    )
  }

  onChangeSubscription(): void {
    this.setState({ isSelectSubscriptionModalOpen: true })
  }
}
