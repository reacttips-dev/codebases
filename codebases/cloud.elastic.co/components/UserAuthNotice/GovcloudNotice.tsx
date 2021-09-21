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

import { EuiCallOut, EuiText } from '@elastic/eui'

type Props = {
  isSignup?: boolean
}

const GovcloudNotice: FunctionComponent<Props> = ({ isSignup }) => (
  <div className='info-message'>
    <EuiCallOut
      iconType='pinFilled'
      size='s'
      title={
        <FormattedMessage
          data-test-id='gov-cloud-info-message'
          id='info-message.title.gov-cloud'
          defaultMessage='You are accessing a system with U.S. government information'
        />
      }
    >
      <EuiText size='xs'>
        {
          <FormattedMessage
            id='info-message.gov-cloud.description'
            defaultMessage='{value}, you acknowledge that information system usage may be monitored, recorded, and subject to audit. Unauthorized use of the information system is prohibited and subject to criminal and civil penalties. Use of the information system indicates consent to monitoring and recording.'
            values={{
              value: isSignup ? (
                <FormattedMessage
                  data-test-id='gov-cloud-text-create-account'
                  id='gov-cloud-banner.signup.text'
                  defaultMessage='By creating an account'
                />
              ) : (
                <FormattedMessage
                  data-test-id='gov-cloud-text-login'
                  id='gov-cloud-banner.login.text'
                  defaultMessage='By logging in'
                />
              ),
            }}
          />
        }
      </EuiText>
    </EuiCallOut>
  </div>
)

export default GovcloudNotice
