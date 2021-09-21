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
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui'

interface Props {
  onClickConfigure: () => void
}

const Configure: FunctionComponent<Props> = ({ onClickConfigure }) => (
  <EuiFlexGroup direction='column' gutterSize='s' responsive={false}>
    <EuiFlexItem>
      <EuiText size='s'>
        <FormattedMessage
          id='text-message-authentication-info'
          defaultMessage='Use your mobile phone to receive security codes'
        />
      </EuiText>
      <EuiSpacer size='s' />
    </EuiFlexItem>
    <EuiFlexItem>
      <EuiButton
        size='s'
        className='text-message-authentication-configure-button'
        onClick={onClickConfigure}
      >
        <FormattedMessage
          id='text-message-authentication-add-a-phone-number'
          defaultMessage='Add a phone number'
        />
      </EuiButton>
      <EuiSpacer size='s' />
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default Configure
