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

import React, { Component, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { capitalize, noop } from 'lodash'

import {
  EuiOverlayMask,
  EuiModal,
  EuiModalFooter,
  EuiFlexItem,
  EuiFlexGroup,
  EuiButtonEmpty,
  EuiButton,
  EuiSpacer,
  EuiCallOut,
  EuiLink,
} from '@elastic/eui'

import SelectSubscriptionBody from './SelectSubscriptionBody'

import ConfirmSubscriptionModal from './ConfirmSubscriptionModal'

import { CuiAlert } from '../../../../../cui'

import { addUpdateBillingLevelToast, addPendingBillingLevelToast } from '../../../../../lib/toasts'
import { isSelectedSubscriptionOutOfCompliance, isSelectionUpgrade } from '../../../../../lib/usage'

import lightTheme from '../../../../../lib/theme/light'

import { UserProfile, BillingSubscriptionLevel, AsyncRequestState } from '../../../../../types'
import { FeaturesUsage } from '../../../../../lib/api/v1/types'
import { Subscription } from '../types'

import messages from './messages'

const { euiBreakpoints } = lightTheme

export type Props = {
  closeModal: () => void
  profile: UserProfile
  updateBillingLevel: ({ level }: { level: BillingSubscriptionLevel }) => Promise<void>
  updateBillingLevelRequest: AsyncRequestState
  onSeeReviewChanges?: () => void
  usageDetails: FeaturesUsage
  fetchUsageDetails: () => void
  fetchUsageDetailsRequest: AsyncRequestState
  upgradeLevel?: string
}

type State = {
  selectedSubscription: BillingSubscriptionLevel
  isConfirmationModalOpen: boolean
}

class SelectSubscriptionModal extends Component<Props, State> {
  state: State = {
    selectedSubscription: this.getSelectedSubscription(),
    isConfirmationModalOpen: false,
  }

  componentDidMount(): void {
    const { usageDetails, fetchUsageDetails } = this.props

    if (!usageDetails) {
      fetchUsageDetails()
    }
  }

  render(): ReactElement | null {
    const {
      closeModal,
      profile,
      updateBillingLevelRequest,
      onSeeReviewChanges,
      usageDetails,
      fetchUsageDetailsRequest,
    } = this.props

    if (fetchUsageDetailsRequest.inProgress) {
      return null
    }

    const { selectedSubscription, isConfirmationModalOpen } = this.state
    const { usage_level: usageLevel } = usageDetails
    const selectionOutOfCompliance = isSelectedSubscriptionOutOfCompliance({
      selectedSubscription,
      usageLevel,
    })
    const isUpgrade = isSelectionUpgrade({
      selectedSubscription,
      currentSubscription: profile.level,
    })

    if (isConfirmationModalOpen) {
      return (
        <ConfirmSubscriptionModal
          firstBillingCycle={usageDetails.first_billing_cycle}
          isUpgrade={isUpgrade}
          updateBillingLevelRequest={updateBillingLevelRequest}
          selectedSubscription={selectedSubscription}
          onConfirmSubscription={() => this.onSaveBillingLevel()}
          closeModal={() => this.setState({ isConfirmationModalOpen: false })}
        />
      )
    }

    return (
      <EuiOverlayMask>
        <EuiModal
          style={{ maxWidth: euiBreakpoints.l }}
          className='updateSubscriptionModal'
          onClose={closeModal}
        >
          <SelectSubscriptionBody
            selectedSubscription={selectedSubscription}
            onSelectSubscription={(subscription) => this.onSelectSubscription(subscription)}
            onSeeReviewChanges={onSeeReviewChanges}
          />
          <EuiModalFooter>
            <EuiFlexGroup gutterSize='xs' direction='column' responsive={false}>
              {selectionOutOfCompliance && (
                <EuiFlexItem>
                  <EuiCallOut
                    data-test-id='usage-warning'
                    iconType='alert'
                    color='warning'
                    title={
                      <FormattedMessage
                        {...messages.usageWarning}
                        values={{
                          usageLevel: capitalize(usageLevel),
                          seeRequiredChanges: (
                            <EuiLink
                              onClick={onSeeReviewChanges ? () => onSeeReviewChanges() : noop}
                            >
                              <FormattedMessage {...messages.seeRequiredChanges} />
                            </EuiLink>
                          ),
                        }}
                      />
                    }
                  />
                </EuiFlexItem>
              )}

              <EuiFlexItem>
                <EuiFlexGroup justifyContent='flexEnd'>
                  <EuiFlexItem grow={false}>
                    <EuiButtonEmpty onClick={() => closeModal()}>
                      <FormattedMessage {...messages.cancel} />
                    </EuiButtonEmpty>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      disabled={selectionOutOfCompliance}
                      data-test-id='save-subscription'
                      onClick={() => this.setState({ isConfirmationModalOpen: true })}
                      fill={true}
                    >
                      <FormattedMessage {...messages.save} />
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>

              {updateBillingLevelRequest.error && (
                <EuiFlexItem>
                  <EuiSpacer size='m' />
                  <CuiAlert data-test-id='update-billing-level-error' type='danger'>
                    {updateBillingLevelRequest.error}
                  </CuiAlert>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  getSelectedSubscription(): BillingSubscriptionLevel {
    const { profile, upgradeLevel } = this.props

    return (
      (upgradeLevel as BillingSubscriptionLevel) ||
      profile.pending_level ||
      profile.level ||
      `platinum`
    )
  }

  onSaveBillingLevel(): void {
    const { updateBillingLevel, closeModal } = this.props
    const { selectedSubscription } = this.state

    updateBillingLevel({ level: selectedSubscription })
      .then(() => {
        const { profile } = this.props

        closeModal()
        this.setState({ isConfirmationModalOpen: false })

        if (profile.pending_level) {
          addPendingBillingLevelToast()
        } else {
          addUpdateBillingLevelToast()
        }
      })
      .catch(() => {
        this.setState({ isConfirmationModalOpen: false })
      })
  }

  onSelectSubscription(subscription: Subscription): void {
    this.setState({ selectedSubscription: subscription.value })
  }
}

export default SelectSubscriptionModal
