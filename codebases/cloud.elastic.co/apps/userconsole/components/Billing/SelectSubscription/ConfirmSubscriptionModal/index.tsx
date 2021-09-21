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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { capitalize } from 'lodash'

import {
  EuiOverlayMask,
  EuiModal,
  EuiModalFooter,
  EuiProgress,
  EuiText,
  EuiModalBody,
  EuiModalHeaderTitle,
  EuiModalHeader,
  EuiButtonEmpty,
  EuiButton,
} from '@elastic/eui'

import { getOutOfComplianceLevels, getOutOfComplianceLevelsText } from '../../../../../../lib/usage'

import lightTheme from '../../../../../../lib/theme/light'

import { BillingSubscriptionLevel, AsyncRequestState } from '../../../../../../types'

import messages from '../messages'

export type Props = {
  closeModal: () => void
  onConfirmSubscription: () => void
  selectedSubscription: BillingSubscriptionLevel
  updateBillingLevelRequest: AsyncRequestState
  isUpgrade: boolean
  firstBillingCycle: boolean
}

const { euiBreakpoints } = lightTheme

class ConfirmSubscriptionModal extends Component<Props> {
  render() {
    const { closeModal, onConfirmSubscription, selectedSubscription, updateBillingLevelRequest } =
      this.props

    return (
      <EuiOverlayMask>
        <EuiModal maxWidth={euiBreakpoints.s} onClose={closeModal}>
          {updateBillingLevelRequest.inProgress && (
            <EuiProgress data-test-id='update-billing-level-in-progress' size='xs' color='accent' />
          )}
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                {...messages.confirmSubscriptionTitle}
                values={{ selectedSubscription: capitalize(selectedSubscription) }}
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText data-test-id='confirm-message'>{this.renderConfirmationDescription()}</EuiText>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={() => closeModal()}>
              <FormattedMessage {...messages.confirmSubscriptionCancel} />
            </EuiButtonEmpty>
            <EuiButton
              data-test-id='confirm-subscription'
              fill={true}
              onClick={() => onConfirmSubscription()}
              disabled={updateBillingLevelRequest.inProgress}
            >
              <FormattedMessage {...messages.confirmSubscriptionConfirm} />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderConfirmationDescription() {
    // We allow users to freely upgrade or downgrade if they have not yet received their first
    // invoice. This is to avoid angry customers who default to Platinum but realized they don't
    // really need it.
    const { isUpgrade, firstBillingCycle, selectedSubscription } = this.props
    const outOfComplianceLevels = getOutOfComplianceLevels({
      subscriptionLevel: selectedSubscription,
    })
    const subscriptionLevelsText = getOutOfComplianceLevelsText(outOfComplianceLevels)

    if (firstBillingCycle) {
      return (
        <FormattedMessage
          data-test-id='first-billing-cycle-message'
          {...messages.firstBillingCycleConfirmSubscriptionDescription}
        />
      )
    }

    if (isUpgrade) {
      return (
        <FormattedMessage
          data-test-id='upgrade-message'
          {...messages.upgradeConfirmSubscriptionDescription}
        />
      )
    }

    return (
      <FormattedMessage
        data-test-id='downgrade-message'
        {...messages.downgradeConfirmSubscriptionDescription}
        values={{ subscriptionLevels: subscriptionLevelsText }}
      />
    )
  }
}

export default ConfirmSubscriptionModal
