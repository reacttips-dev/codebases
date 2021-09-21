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

import React, { PureComponent, Fragment } from 'react'

import { isEmpty } from 'lodash'

import { EuiPanel, EuiSpacer } from '@elastic/eui'

import ElasticsearchServiceTileTitle from './ElasticsearchServiceTileTitle'
import CreateDeploymentLinkPopover from './CreateDeploymentLinkPopover'

import PortalDeployments from '../PortalDeployments'
import HasNoDeployment from '../PortalDeployments/HasNoDeployments'

import TrialStatusCallout from '../TrialStatusCallout'
import UnSubscribedMarketPlaceUserCallout from '../../../MarketPlace/UnSubscribedMarketPlaceUserCallout'

import DeploymentsSchedule from '../../../StackDeploymentSearch/DeploymentsSchedule'

import { withErrorBoundary } from '../../../../cui'

import LocalStorageKey from '../../../../constants/localStorageKeys'

import { isMarketPlaceUser, isUnSubscribedMarketPlaceUser } from '../../../../lib/marketPlace'
import { inActiveTrial } from '../../../../lib/trial'
import { isEsStopped } from '../../../../lib/stackDeployments/selectors'
import { AsyncRequestState, UserProfile } from '../../../../types'
import { DeploymentSearchResponse } from '../../../../lib/api/v1/types'

import './elasticsearchServiceTile.scss'

export interface Props {
  deployments: DeploymentSearchResponse[] | null
  profile?: UserProfile | null
  search: () => void
  searchResultsRequest: AsyncRequestState
}

type State = {
  trialEndingCalloutDismissed: boolean
}

class ElasticsearchServiceTile extends PureComponent<Props, State> {
  isScheduledDeploymentSearch: boolean = false

  state: State = {
    trialEndingCalloutDismissed: false,
  }

  render() {
    const { profile } = this.props

    return (
      <EuiPanel hasShadow={true} grow={false} className='cloud-portal-elastic-search-service-tile'>
        <ElasticsearchServiceTileTitle profile={profile} />

        {this.renderDeploymentsSchedule()}

        <EuiSpacer size='m' />

        <div data-test-id='cloud-portal-elastic-search-service-tile-content'>
          {this.renderUnSubscribedMarketPlaceUserCallout()}
          {this.renderDeployments()}
        </div>
      </EuiPanel>
    )
  }

  renderUnSubscribedMarketPlaceUserCallout() {
    const { profile } = this.props

    if (!profile || !isMarketPlaceUser(profile) || !isUnSubscribedMarketPlaceUser(profile)) {
      return null
    }

    return (
      <Fragment>
        <UnSubscribedMarketPlaceUserCallout profile={profile} />

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderDeployments() {
    const { deployments, profile } = this.props

    const hasNoDeployments = (deployments && isEmpty(deployments)) || false

    if (hasNoDeployments) {
      return <HasNoDeployment />
    }

    return (
      <Fragment>
        {profile && (
          <CreateDeploymentLinkPopover
            hasNoDeployments={hasNoDeployments}
            inTrial={profile.inTrial}
            hasExpiredTrial={profile.hasExpiredTrial}
            unSubscribed={isMarketPlaceUser(profile) && isUnSubscribedMarketPlaceUser(profile)}
          />
        )}

        {this.renderTrialStatusCallout()}
        {this.renderDeploymentsTable()}
      </Fragment>
    )
  }

  renderDeploymentsTable() {
    const { deployments } = this.props
    const hasNoDeployments = (deployments && isEmpty(deployments)) || false

    if (hasNoDeployments) {
      return null
    }

    return <PortalDeployments deployments={deployments} />
  }

  renderDeploymentsSchedule() {
    const { searchResultsRequest } = this.props

    return <DeploymentsSchedule search={this.search} busy={searchResultsRequest.inProgress} />
  }

  renderTrialStatusCallout() {
    const { profile } = this.props

    if (!profile) {
      return null
    }

    if (!inActiveTrial({ profile })) {
      return null
    }

    const trialDaysRemaining = profile.trialDaysRemaining || 0
    const trialEndingCalloutDismissedStorageKey = this.makeTrialEndingCalloutDismissedStorageKey()
    const trialEndingCalloutDismissed = trialEndingCalloutDismissedStorageKey
      ? localStorage.getItem(trialEndingCalloutDismissedStorageKey) === 'true'
      : undefined

    if (trialEndingCalloutDismissed) {
      return null
    }

    if (trialDaysRemaining > 3) {
      return null
    }

    return (
      <Fragment>
        <TrialStatusCallout
          onDismiss={this.dismissTrialEndingCallout}
          deploymentActive={!this.isDeploymentTerminated()}
        />

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  dismissTrialEndingCallout = () => {
    const trialEndingCalloutDismissedStorageKey = this.makeTrialEndingCalloutDismissedStorageKey()

    if (!trialEndingCalloutDismissedStorageKey) {
      return
    }

    localStorage.setItem(trialEndingCalloutDismissedStorageKey, 'true')
    this.setState({
      trialEndingCalloutDismissed: true,
    })
  }

  makeTrialEndingCalloutDismissedStorageKey() {
    const { profile } = this.props

    if (!profile) {
      return null
    }

    const { currentTrial } = profile

    if (!currentTrial) {
      return null
    }

    return `${LocalStorageKey.trialEndingCalloutDismissed}_${currentTrial.txid}`
  }

  isDeploymentTerminated() {
    const { deployments } = this.props
    return Boolean(deployments && deployments.some((deployment) => isEsStopped({ deployment })))
  }

  search = () => {
    if (!this.isScheduledDeploymentSearch) {
      this.isScheduledDeploymentSearch = true
    }

    this.props.search()
  }
}

export default withErrorBoundary(ElasticsearchServiceTile)
