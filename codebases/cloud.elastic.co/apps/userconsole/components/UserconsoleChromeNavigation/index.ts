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
import { RouteConfig } from 'react-router-config'

import UserconsoleChromeNavigation from './UserconsoleChromeNavigation'

import { withSmallErrorBoundary } from '../../../../cui'

import { fetchDeploymentTemplates } from '../../../../actions/topology/deploymentTemplates'

import { getCluster, getDeploymentTemplate, getStackDeployment } from '../../../../reducers'
import { getProfile } from '../../reducers'

import { getConfigForKey, isFeatureActivated } from '../../../../selectors'
import { getVersion, getDeploymentTemplateId } from '../../../../lib/stackDeployments'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../../../components/StackDeploymentEditor'

import { showApiKeys } from '../../../../components/UserSettings/helpers'
import { getHerokuCluster } from '../../../../lib/heroku'

import Feature from '../../../../lib/feature'

import { ElasticsearchCluster, ProfileState } from '../../../../types'
import { DeploymentGetResponse, DeploymentTemplateInfoV2 } from '../../../../lib/api/v1/types'

type StateProps = {
  deployment?: ElasticsearchCluster | null
  deploymentTemplate?: DeploymentTemplateInfoV2
  stackDeployment?: DeploymentGetResponse | null
  defaultRegionId?: string
  regionId?: string
  showApiKeys: boolean
  isHeroku: boolean
  isPortalFeatureEnabled: boolean
  showHelpPage: boolean
  showAccountActivity: boolean
  showSecurityPage: boolean
  showBillingPage: boolean
  profile: ProfileState
}

type DispatchProps = {
  fetchDeploymentTemplates: (params: { regionId: string; stackVersion: string }) => void
}

type OwnProps = {
  routes: RouteConfig[]
}

type ConsumerProps = WithStackDeploymentRouteParamsProps & OwnProps

const mapStateToProps = (
  state,
  { regionId: receivedRegionId, deploymentId, stackDeploymentId }: ConsumerProps,
): StateProps => {
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
  const herokuCluster = getHerokuCluster()

  const deployment =
    isHeroku && herokuCluster
      ? getCluster(state, herokuCluster.regionId, herokuCluster.id)
      : getCluster(state, receivedRegionId, deploymentId!)

  const regionId = isHeroku && herokuCluster ? herokuCluster.regionId : receivedRegionId

  const deploymentTemplate = resolveDeploymentTemplate()

  const stackDeployment = getStackDeployment(state, stackDeploymentId)

  return {
    regionId,
    deployment,
    deploymentTemplate,
    defaultRegionId: getConfigForKey(state, `DEFAULT_REGION`),
    isHeroku,
    profile: getProfile(state),
    showApiKeys: showApiKeys(state),
    stackDeployment,
    isPortalFeatureEnabled: isFeatureActivated(state, Feature.cloudPortalEnabled),
    showHelpPage: isFeatureActivated(state, Feature.showHelpPage),
    showAccountActivity: isFeatureActivated(state, Feature.showAccountActivity),
    showSecurityPage: isFeatureActivated(state, Feature.showSecurityPage),
    showBillingPage: isFeatureActivated(state, Feature.showBillingPage),
  }

  function resolveDeploymentTemplate() {
    // navigation inside a deployment, so use the template ID referenced in the deployment
    if (stackDeployment) {
      return getDeploymentTemplate(
        state,
        regionId,
        getDeploymentTemplateId({ deployment: stackDeployment })!,
        getVersion({ deployment: stackDeployment }),
      )
    }

    if (deployment && deployment.plan) {
      return getDeploymentTemplate(
        state,
        regionId,
        deployment.deploymentTemplateId!,
        deployment.plan.version,
      )
    }
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchDeploymentTemplates,
}

export default withSmallErrorBoundary(
  withStackDeploymentRouteParams<OwnProps>(
    connect<StateProps, DispatchProps, ConsumerProps>(
      mapStateToProps,
      mapDispatchToProps,
    )(UserconsoleChromeNavigation),
  ),
)
