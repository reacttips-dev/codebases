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

import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'

import RootHandler from './RootHandler'

import { isFeatureActivated } from '../../../../selectors'

import Feature from '../../../../lib/feature'
import {
  rootUrl,
  createDeploymentUrl,
  deploymentGettingStartedUrl,
} from '../../../../lib/urlBuilder'
import { isPortalUrl } from '../../../../lib/portal'

type StateProps = {
  isPortalUrl: boolean
  isPortalFeatureEnabled: boolean
  isCreateUrl: boolean
  isGettingStartedUrl: boolean
}

type DispatchProps = unknown

type ConsumerProps = RouteComponentProps

const mapStateToProps = (state, { location, match: { params } }): StateProps => {
  const { deploymentId } = params

  return {
    isPortalUrl: location.pathname === rootUrl() || isPortalUrl(location.pathname),
    isPortalFeatureEnabled: isFeatureActivated(state, Feature.cloudPortalEnabled),
    isCreateUrl: location.pathname === createDeploymentUrl(),
    isGettingStartedUrl: location.pathname === deploymentGettingStartedUrl(deploymentId),
  }
}

const mapDispatchToProps = (): DispatchProps => ({})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(RootHandler),
)
