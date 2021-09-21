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
          id='google-authenticator-info'
          defaultMessage='Use the Google authenticator app to generate one time security codes'
        />
      </EuiText>
      <EuiSpacer size='s' />
    </EuiFlexItem>
    <EuiFlexItem>
      <EuiButton
        size='s'
        data-test-id='google-authenticator-configure-button'
        className='google-authenticator-configure-button'
        onClick={onClickConfigure}
      >
        <FormattedMessage id='google-authenticator-configure-button' defaultMessage='Configure' />
      </EuiButton>
      <EuiSpacer size='s' />
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default Configure
