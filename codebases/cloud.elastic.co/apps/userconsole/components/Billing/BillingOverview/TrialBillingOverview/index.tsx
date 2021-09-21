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

import React, { Fragment, Component, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer, EuiText } from '@elastic/eui'

import BillingPanel from '../BillingPanel'
import SubscriptionOverviewPanel from '../SubscriptionOverviewPanel'
import TrialBillingFeatures from './TrialBillingFeatures'
import GovCloudBillingNotice from '../../GovCloudBillingNotice'

import { UserProfile } from '../../../../../../types'

export type Props = {
  isGovCloud?: boolean
  isLoading: boolean
  profile: UserProfile
}

type State = {
  isPopoverOpen: boolean
}

export default class TrialBillingOverview extends Component<Props, State> {
  state = {
    isPopoverOpen: false,
  }

  render(): ReactElement {
    const { isGovCloud, isLoading, profile } = this.props

    return (
      <Fragment>
        <SubscriptionOverviewPanel
          isLoading={isLoading}
          isGovCloud={isGovCloud}
          profile={profile}
          data-test-id='subscription-overview-panel'
        />

        <EuiSpacer />

        <BillingPanel
          data-test-id='trial-billing-panel'
          title={
            <FormattedMessage
              id='trial-billing-cycle.description'
              defaultMessage='Payment details'
            />
          }
          footer={<EuiText size='s'>{this.renderBillingPanelFooter()}</EuiText>}
        />
      </Fragment>
    )
  }

  renderBillingPanelFooter(): ReactElement | null {
    const { isGovCloud } = this.props

    if (isGovCloud) {
      return <GovCloudBillingNotice />
    }

    return <TrialBillingFeatures data-test-id='trial-billing-advertisement' />
  }
}
