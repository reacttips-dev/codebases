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

import { get } from 'lodash'
import { ComponentType } from 'react'
import { connect } from 'react-redux'

import EditStackDeploymentEditor from './EditStackDeploymentEditor'

import PricedArchitectureSummary from '../../../apps/userconsole/components/Topology/PricedArchitectureSummary'

import { resetUpdateDeployment } from '../../../actions/stackDeployments'
import { fetchVersion } from '../../../actions/elasticStack'

import {
  fetchVersionRequest,
  getInstanceConfigurations,
  getRegion,
  getVersionStacks,
} from '../../../reducers'

import pluginDescriptions from '../../../config/plugins.json'

import { withStackDeploymentRouteParams, WithStackDeploymentRouteParamsProps } from '../routing'
import { getConfigForKey, isFeatureActivated } from '../../../selectors'

import Feature from '../../../lib/feature'

import { StackVersionConfig, InstanceConfiguration } from '../../../lib/api/v1/types'
import { Region, AsyncRequestState, PluginDescription, ReduxState } from '../../../types'
import { EditFlowConsumerProps } from '../types'

type StateProps = {
  convertLegacyPlans: boolean
  esVersions?: StackVersionConfig[] | null
  esVersionsRequest: AsyncRequestState
  hideAdvancedEdit: boolean
  hideConfigChangeStrategy: boolean
  inTrial: boolean
  pluginDescriptions: PluginDescription[]
  region: Region
  architectureSummary?: ComponentType<any>
  instanceConfigurations: InstanceConfiguration[]
}

type DispatchProps = {
  fetchVersion: (version: string, regionId: string) => void
  resetUpdateDeployment: (regionId: string, stackDeploymentId: string) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps & EditFlowConsumerProps

const mapStateToProps = (state: ReduxState, { regionId }: ConsumerProps): StateProps => ({
  hideAdvancedEdit: !isFeatureActivated(state, Feature.showAdvancedEditor),
  region: getRegion(state, regionId)!,
  esVersions: getVersionStacks(state, regionId),
  esVersionsRequest: fetchVersionRequest(state, regionId),
  pluginDescriptions,
  inTrial: get(state, [`profile`, `inTrial`], false),
  hideConfigChangeStrategy: isFeatureActivated(state, Feature.hideConfigChangeStrategy),
  convertLegacyPlans: isFeatureActivated(state, Feature.convertLegacyPlans),
  architectureSummary:
    getConfigForKey(state, `CLOUD_UI_APP`) === `saas-userconsole`
      ? PricedArchitectureSummary
      : undefined,
  instanceConfigurations: getInstanceConfigurations(state, regionId),
})

const mapDispatchToProps: DispatchProps = {
  fetchVersion,
  resetUpdateDeployment,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(EditStackDeploymentEditor),
)
