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

import React, { PureComponent } from 'react'

import { EuiProgress } from '@elastic/eui'

import FirstDeploymentPrompt from './FirstDeploymentPrompt'
import TrialExpiredPrompt from './TrialExpiredPrompt'

import { withErrorBoundary } from '../../../../../cui'

import { isMarketPlaceUser, isUnSubscribedMarketPlaceUser } from '../../../../../lib/marketPlace'

import { ProfileState, AsyncRequestState } from '../../../../../types'

import './hasNoDeployments.scss'

export interface Props {
  profile: ProfileState
  fetchProfileRequest: AsyncRequestState
  theme: 'dark' | 'light'
}

class HasNoDeployments extends PureComponent<Props> {
  render() {
    const { fetchProfileRequest } = this.props
    const requestInProgress =
      fetchProfileRequest.inProgress && Boolean(fetchProfileRequest.meta.extend_trial)

    return (
      <div className='no-deployment-state'>
        {requestInProgress && <EuiProgress size='xs' color='accent' position='absolute' />}

        {this.renderPrompts(requestInProgress)}
      </div>
    )
  }

  renderPrompts(requestInProgress: boolean) {
    const { profile, theme } = this.props

    if (!profile) {
      return null
    }

    const { hasExpiredTrial, inTrial, trials } = profile

    if (hasExpiredTrial) {
      return <TrialExpiredPrompt disableButtons={requestInProgress} theme={theme} />
    }

    return (
      <FirstDeploymentPrompt
        inTrial={inTrial}
        trialStarted={trials && trials.length > 0}
        unSubscribed={isMarketPlaceUser(profile) && isUnSubscribedMarketPlaceUser(profile)}
      />
    )
  }
}

export default withErrorBoundary(HasNoDeployments)
