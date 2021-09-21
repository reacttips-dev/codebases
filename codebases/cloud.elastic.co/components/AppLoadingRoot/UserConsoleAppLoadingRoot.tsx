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

import { EuiLoadingElastic, EuiSpacer, EuiText } from '@elastic/eui'

import LandingPageContainer from '../LandingPageContainer/NewLandingPageContainer'

import './userConsoleAppLoadingRoot.scss'

const UserConsoleAppLoadingRoot: FunctionComponent = () => (
  <LandingPageContainer
    isLoading={true}
    panelProps={{
      className: 'cloud-user-console-app-loading',
      hasShadow: false,
      hasBorder: false,
      style: { background: 'transparent' },
    }}
  >
    <EuiText textAlign='center'>
      <EuiLoadingElastic size='xxl' />

      <EuiSpacer />

      <strong>
        <FormattedMessage
          id='cloud-user-console-app-loading.processing'
          defaultMessage='Just a minute while we get set up...'
        />
      </strong>
    </EuiText>
  </LandingPageContainer>
)

export default UserConsoleAppLoadingRoot
