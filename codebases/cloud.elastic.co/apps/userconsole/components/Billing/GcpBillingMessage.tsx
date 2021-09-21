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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'
import DocLink from '../../../../components/DocLink'

const GcpBillingMessage: FunctionComponent = () => (
  <EuiFlexGroup className='partnerSignupMessage'>
    <EuiFlexItem>
      <EuiCallOut
        data-test-id='gcp-billing-message'
        color='primary'
        iconType='help'
        title={<FormattedMessage id='partner-signupMessage.warning' defaultMessage='Warning' />}
      >
        <p>
          <FormattedMessage
            id='partner-signupMessage.gcpResubscribe'
            defaultMessage='Changes to the Billing Account associated with your GCP project may require you to re-enable your Elastic subscription within the Google Cloud Console. {learnMore}'
            values={{
              learnMore: (
                <DocLink link='accountBillingGcpDocLink'>
                  <FormattedMessage
                    id='partner-signupMessage.learnMore'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </p>
      </EuiCallOut>
      <EuiSpacer size='s' />
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default GcpBillingMessage
