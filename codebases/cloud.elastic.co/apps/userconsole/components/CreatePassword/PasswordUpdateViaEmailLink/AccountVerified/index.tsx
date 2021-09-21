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

import { EuiButton } from '@elastic/eui'

import LandingPageContainer from '../../../../../../components/LandingPageContainer/NewLandingPageContainer'

import history from '../../../../../../lib/history'
import { rootUrl } from '../../../../../../lib/urlBuilder'

interface Props {
  image: string
  darkImage: string
}

const AccountVerified: FunctionComponent<Props> = ({ image, darkImage }) => (
  <LandingPageContainer
    title={
      <FormattedMessage
        id='password-update-via-email.title.verification-success'
        defaultMessage='Your account has been verified'
      />
    }
    subtitle={
      <div data-test-id='account-verification-success'>
        <FormattedMessage
          id='password-update-via-email.success'
          defaultMessage={`Thanks for completing the registration process! You’re all set.`}
        />
      </div>
    }
    image={image}
    darkImage={darkImage}
  >
    <EuiButton
      className='open-elastic-cloud'
      fill={true}
      onClick={() => history.push(rootUrl())}
      fullWidth={true}
    >
      <FormattedMessage
        id='password-update-via-email.success.button'
        defaultMessage='Open Elastic Cloud'
      />
    </EuiButton>
  </LandingPageContainer>
)

export default AccountVerified
