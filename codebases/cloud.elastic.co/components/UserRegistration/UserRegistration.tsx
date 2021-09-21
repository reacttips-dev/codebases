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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer } from '@elastic/eui'

import OnPremPanel from './OnPremPanel'
import SignupForm from './Form'
import LandingPageContainer from '../LandingPageContainer/NewLandingPageContainer'

import UserAuthNotice from '../UserAuthNotice/UserAuthNotice'

import messages from './messages'

import { Theme } from '../../types'

import './userRegistration.scss'

interface Props {
  theme: Theme
  isGovCloud: boolean
  downloads: boolean
  source?: string
}

class UserRegistration extends PureComponent<Props> {
  render(): ReactElement {
    const { downloads, isGovCloud, source } = this.props

    return (
      <LandingPageContainer
        title={this.renderFormTitle()}
        subtitle={this.renderFormSubTitle()}
        type='login'
        verticalSpacing={true}
        infoMessage={downloads && <OnPremPanel />}
      >
        <UserAuthNotice source={source} />

        <EuiSpacer size='m' />

        <SignupForm isGovCloud={isGovCloud} />
      </LandingPageContainer>
    )
  }

  renderFormTitle(): ReactElement {
    const { isGovCloud, source } = this.props
    const useSecondaryTitle =
      source === `training` || source === `community` || source === `support`

    if (isGovCloud) {
      return (
        <div style={{ whiteSpace: 'normal' }}>
          <FormattedMessage
            id='govcloud-signup.panel.title'
            defaultMessage='Start your free Elastic Cloud trial on AWS GovCloud'
          />
        </div>
      )
    }

    if (useSecondaryTitle) {
      return (
        <FormattedMessage
          data-test-id='cloud-signup-page-secondary-title'
          {...messages.secondaryTitle}
        />
      )
    }

    return (
      <FormattedMessage data-test-id='cloud-signup-page-default-title' {...messages.defaultTitle} />
    )
  }

  renderFormSubTitle(): ReactElement | null {
    const { isGovCloud, source } = this.props

    if (isGovCloud) {
      return null
    }

    if (source === `training`) {
      return (
        <FormattedMessage
          data-test-id='cloud-signup-page-training-sub-title'
          {...messages.trainingSubTitle}
        />
      )
    }

    if (source === `community`) {
      return (
        <FormattedMessage
          data-test-id='cloud-signup-page-community-sub-title'
          {...messages.communitySubTitle}
        />
      )
    }

    if (source === `support`) {
      return (
        <FormattedMessage
          data-test-id='cloud-signup-page-support-sub-title'
          {...messages.supportSubTitle}
        />
      )
    }

    return (
      <FormattedMessage
        data-test-id='cloud-signup-page-default-sub-title'
        {...messages.defaultSubTitle}
      />
    )
  }
}

export default UserRegistration
