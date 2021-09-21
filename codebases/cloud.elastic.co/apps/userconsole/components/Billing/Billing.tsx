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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiLoadingContent, EuiSpacer, EuiTitle } from '@elastic/eui'

import BillingOverview from './BillingOverview'
import GcpBillingMessage from './GcpBillingMessage'
import SuggestedContentPanel from './BillingOverview/SuggestedContentPanel'

import { isGCPUser } from '../../../../lib/marketPlace'

import { UserProfile } from '../../../../types'

export type Props = {
  profile: UserProfile
}

const Billing: FunctionComponent<Props> = ({ profile }) => {
  if (profile === null || profile.inTrial === null) {
    return <EuiLoadingContent />
  }

  const { organization_id: organizationId } = profile

  return (
    <Fragment>
      {organizationId && (
        <Fragment>
          <EuiSpacer size='m' />

          <EuiTitle size='xxxs'>
            <h4>
              <FormattedMessage
                id='billing-details-summary.title'
                data-test-id='billing-details-summary.title'
                defaultMessage='Account ID: {organizationId}'
                values={{ organizationId }}
              />
            </h4>
          </EuiTitle>
        </Fragment>
      )}

      <EuiSpacer size='m' />

      {isGCPUser(profile) && (
        <Fragment>
          <GcpBillingMessage />

          <EuiSpacer size='m' />
        </Fragment>
      )}

      <EuiFlexGroup>
        <EuiFlexItem data-test-id='billing-details-summary.overview'>
          <BillingOverview />
        </EuiFlexItem>

        <EuiFlexItem style={{ maxWidth: 385 }}>
          <SuggestedContentPanel data-test-id='billing-details-summary.suggested-content' />
        </EuiFlexItem>
      </EuiFlexGroup>
    </Fragment>
  )
}

export default Billing
