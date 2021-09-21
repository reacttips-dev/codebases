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

import { isEmpty } from 'lodash'
import cx from 'classnames'
import PropTypes from 'prop-types'

import React, { PureComponent, Fragment } from 'react'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import { withErrorBoundary } from '../../../../cui'

import BlogsTile from '../BlogsTile'
import CloudStatusTile from '../CloudStatusTile'
import DocumentationTile from '../DocumentationTile'
import ElasticsearchServiceTile from '../ElasticsearchServiceTile'
import PortalErrors from '../PortalErrors'
import PortalPage from '../PortalPage'
import TrainingTile from '../TrainingTile'
import WebinarsTile from '../WebinarsTile'
import SupportTile from '../SupportTile'

import IntercomChat from '../../../../apps/userconsole/components/IntercomChat'

import searchDeploymentsQuery from '../../../StackDeploymentSearch/searchDeploymentsQuery'

import scheduler from '../../../../lib/scheduler'

import { AsyncRequestState, ProfileState } from '../../../../types'
import { DeploymentsSearchResponse, SearchRequest } from '../../../../lib/api/v1/types'

export interface Props {
  hasCloudStatusTile: boolean
  deletedDeploymentIds: string[]
  searchDeployments: (query: SearchRequest) => void
  fetchProfile: () => Promise<any>
  profile: ProfileState
  pollingInterval: number
  searchResults: DeploymentsSearchResponse | null
  fetchProfileRequest: AsyncRequestState
  searchResultsRequest: AsyncRequestState
  intercomChatFeature: boolean
  isRouteFSTraced?: boolean
}

export interface State {
  scheduler: {
    start: () => void
    stop: () => void
  }
}

class PortalLandingPage extends PureComponent<Props, State> {
  state: State = {
    scheduler: scheduler({
      interval: this.props.pollingInterval,
    }),
  }

  static childContextTypes: { scheduler: any }

  getChildContext() {
    return {
      scheduler: this.state.scheduler,
    }
  }

  componentDidMount() {
    const { fetchProfile } = this.props

    fetchProfile()
    this.search()

    if (this.isPollingEnabled()) {
      this.state.scheduler.start()
    }
  }

  componentWillUnmount() {
    this.state.scheduler.stop()
  }

  render() {
    const { intercomChatFeature, isRouteFSTraced } = this.props

    return (
      <Fragment>
        {intercomChatFeature && <IntercomChat />}

        <PortalPage className={cx({ 'fs-unmask': isRouteFSTraced }, 'cloud-portal-landing-page')}>
          <PortalErrors spacerAfter={true} />

          {this.renderPortalContents()}
        </PortalPage>
      </Fragment>
    )
  }

  renderPortalContents() {
    const { hasCloudStatusTile, profile, searchResultsRequest } = this.props

    const inTrial = profile ? profile.inTrial : undefined

    const deployments = this.getDeployments()

    return (
      <EuiFlexGroup gutterSize='l' responsive={true}>
        <EuiFlexItem grow={2}>
          <ElasticsearchServiceTile
            search={this.search}
            searchResultsRequest={searchResultsRequest}
            profile={profile}
            deployments={deployments}
          />

          <EuiSpacer size='l' />

          <EuiFlexGroup
            responsive={true}
            className={cx({
              'stretch-tile-height': !inTrial,
            })}
            gutterSize='l'
          >
            <EuiFlexItem grow={1}>
              <DocumentationTile inTrial={inTrial} />

              <EuiSpacer size='l' />

              <SupportTile />
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
              <WebinarsTile inTrial={inTrial} />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem className='cloud-portal-content-side-bar'>
          {hasCloudStatusTile && !isEmpty(deployments) && (
            <Fragment>
              <CloudStatusTile />

              <EuiSpacer size='l' />
            </Fragment>
          )}

          <BlogsTile />

          <EuiSpacer size='l' />

          <TrainingTile inTrial={inTrial} />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  isPollingEnabled() {
    return this.props.pollingInterval > 0
  }

  getDeployments() {
    const { searchResults } = this.props
    return searchResults ? searchResults.deployments : null
  }

  search = () => {
    const { searchDeployments, deletedDeploymentIds } = this.props
    const query = searchDeploymentsQuery({
      deletedDeploymentIds,
    })

    searchDeployments(query)
  }
}

PortalLandingPage.childContextTypes = {
  scheduler: PropTypes.object.isRequired,
}

export default withErrorBoundary(PortalLandingPage)
