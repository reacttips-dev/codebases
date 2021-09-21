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

import React, { Fragment, Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { get, isEmpty } from 'lodash'

import { EuiLoadingContent, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiRouterLinkButtonEmpty } from '../../../../cui'

import AvailabilityZone from '../../../DeploymentConfigure/AvailabilityZone'
import Instances from '../../../DeploymentConfigure/Instances'
import MasterOnlyNodes from '../../../DeploymentConfigure/MasterOnlyNodes'
import Plugins from '../../../DeploymentConfigure/Plugins'
import Shards from '../../../DeploymentConfigure/Shards'
import ExtraUserSettings from '../../../DeploymentConfigure/ExtraUserSettings'
import Strategies from '../../../DeploymentConfigure/Strategies'
import Scripts2x from '../../../DeploymentConfigure/Scripts2x'
import Scripts5x from '../../../DeploymentConfigure/Scripts5x'

import FailoverOptions from '../FailoverOptions'
import AttemptInfo from '../AttemptInfo'
import SaveButton from '../SaveButton'

import {
  getEsPlan,
  getEsPlanFromGet,
  validateUpdateRequest,
  sanitizeUpdateRequestBeforeSend,
} from '../../../../lib/stackDeployments'

import { hasWatcher } from '../../../../lib/plan'
import { lt } from '../../../../lib/semver'
import { elasticsearchUrl } from '../../../../lib/urlBuilder'

import {
  PlanStrategy,
  StackVersionConfig,
  DeploymentUpdateRequest,
} from '../../../../lib/api/v1/types'

import {
  AsyncRequestState,
  ElasticsearchCluster,
  PluginDescription,
  Region,
  StackDeploymentUpdateRequest,
} from '../../../../types'

import { NodeConfigurationState } from '../../../../reducers/nodeConfigurations'

export type Props = {
  editorState: StackDeploymentUpdateRequest
  basedOnAttempt: boolean
  esCluster?: ElasticsearchCluster
  esVersions?: StackVersionConfig[]
  nodeConfigurations?: {
    [id: string]: NodeConfigurationState
  }
  hideExtraFailoverOptions: boolean
  fetchRegionIfNeeded: (regionId: string) => void
  fetchNodeConfigurations: (regionId: string) => void
  onEsPlanChange: (path: string[], value: any) => void
  onScriptingChange: (
    scriptingType: 'inline' | 'stored' | 'file',
    value: boolean | 'on' | 'off' | 'sandbox',
  ) => void
  onStrategyChange: (strategy: PlanStrategy) => void
  pluginDescriptions: PluginDescription[]
  regionId: string
  region: Region
  showInstanceCount: boolean
  showMasterOnlyNodes: boolean
  updateDeployment: (settings: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
  updateStackDeploymentRequest: AsyncRequestState
}

class EditClusterForm extends Component<Props> {
  componentDidMount() {
    const { fetchRegionIfNeeded, fetchNodeConfigurations, regionId } = this.props

    fetchRegionIfNeeded(regionId)
    fetchNodeConfigurations(regionId)
  }

  render() {
    const {
      basedOnAttempt,
      editorState,
      esCluster,
      esVersions,
      nodeConfigurations,
      hideExtraFailoverOptions,
      onEsPlanChange,
      onScriptingChange,
      onStrategyChange,
      pluginDescriptions,
      region,
      showInstanceCount = true,
      showMasterOnlyNodes = true,
      updateDeployment,
      updateStackDeploymentRequest,
    } = this.props

    const { regionId, id, deployment, deploymentUnderEdit } = editorState

    const lastSuccessfulPlan = getEsPlanFromGet({
      deployment: deploymentUnderEdit,
      state: `last_success`,
    })
    const pendingPlan = getEsPlan({ deployment })!

    const lastScripting = get(lastSuccessfulPlan, [`elasticsearch`, `system_settings`, `scripting`])
    const scripting = get(pendingPlan, [`elasticsearch`, `system_settings`, `scripting`])

    const lastZoneCount = get(lastSuccessfulPlan, [`zone_count`], 1)
    const zoneCount = getZoneCount()

    const version = get(pendingPlan, [`elasticsearch`, `version`])
    const strategy = get(pendingPlan, [`transient`, `strategy`])

    const ScriptsComponent = version && lt(version, `5.0.0`) ? Scripts2x : Scripts5x

    const save = () =>
      updateDeployment({
        regionId,
        deploymentId: id,
        deployment: sanitizeUpdateRequestBeforeSend({ deployment }),
      })

    const validationErrors = validateUpdateRequest({ deploymentUnderEdit, deployment })

    return (
      <Fragment>
        <AttemptInfo basedOnAttempt={basedOnAttempt} deployment={esCluster!} />

        <EuiSpacer size='m' />

        {region ? (
          <AvailabilityZone
            numberOfZones={zoneCount}
            previousNumberOfZones={lastZoneCount}
            availableNumberOfZones={get(region, [`allocators`, `zones`, `count`, `total`])}
            onUpdate={setZoneCount}
          />
        ) : (
          <EuiLoadingContent />
        )}

        <EuiSpacer size='m' />

        {nodeConfigurations ? (
          <Instances
            showInstanceCount={showInstanceCount}
            regionId={regionId}
            lastSuccessfulPlan={lastSuccessfulPlan}
            plan={pendingPlan}
            updatePlan={updateCapacity}
            validationErrors={validationErrors}
          />
        ) : (
          <EuiLoadingContent />
        )}

        {showMasterOnlyNodes && (
          <Fragment>
            <EuiSpacer size='m' />
            <MasterOnlyNodes
              lastSuccessfulPlan={lastSuccessfulPlan}
              plan={pendingPlan}
              updatePlan={onEsPlanChange}
            />
          </Fragment>
        )}

        <EuiSpacer size='m' />

        <Plugins
          lastSuccessfulPlan={lastSuccessfulPlan}
          pluginDescriptions={pluginDescriptions}
          versions={esVersions!}
          plan={pendingPlan}
          updatePlan={onEsPlanChange}
        />

        {version && lt(version, `6.0.0`) && (
          <Fragment>
            <EuiSpacer size='m' />
            <ScriptsComponent
              scripting={scripting}
              lastScripting={lastScripting}
              onUpdate={onScriptingChange}
              hasWatcher={hasWatcher(pendingPlan)}
              lastSuccessfulPlan={lastSuccessfulPlan}
            />
          </Fragment>
        )}

        {version && lt(version, `5.0.0`) && (
          <Fragment>
            <EuiSpacer size='m' />
            <Shards
              lastSuccessfulPlan={lastSuccessfulPlan}
              plan={pendingPlan}
              updatePlan={onEsPlanChange}
            />
          </Fragment>
        )}

        <EuiSpacer size='m' />

        <ExtraUserSettings
          plan={pendingPlan}
          updatePlan={onEsPlanChange}
          error={validationErrors.extraUserSettings}
        />

        <EuiSpacer size='m' />

        <Strategies strategy={strategy} onUpdate={onStrategyChange} />

        <EuiSpacer size='m' />

        <FailoverOptions
          deployment={deploymentUnderEdit}
          plan={pendingPlan}
          onChange={onEsPlanChange}
          hideExtraFailoverOptions={hideExtraFailoverOptions}
          basedOnAttempt={basedOnAttempt}
        />

        {updateStackDeploymentRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{updateStackDeploymentRequest.error}</CuiAlert>
          </Fragment>
        )}

        <EuiSpacer size='m' />

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <SaveButton
              disabled={!isEmpty(validationErrors)}
              save={save}
              updateStackDeploymentRequest={updateStackDeploymentRequest}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <CuiRouterLinkButtonEmpty to={elasticsearchUrl(id)} className='editCluster-cancel'>
              <FormattedMessage id='edit-cluster-simple.cancel' defaultMessage='Cancel' />
            </CuiRouterLinkButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    )

    function getZoneCount() {
      if (Array.isArray(pendingPlan.cluster_topology)) {
        for (const nodeConfiguration of pendingPlan.cluster_topology) {
          if (typeof nodeConfiguration.zone_count === `number`) {
            return nodeConfiguration.zone_count
          }
        }
      }

      return get(pendingPlan, [`zone_count`], 1)
    }

    function setZoneCount(zoneCount) {
      if (Array.isArray(pendingPlan.cluster_topology)) {
        for (let i = 0; i < pendingPlan.cluster_topology.length; i++) {
          onEsPlanChange([`cluster_topology`, String(i), `zone_count`], zoneCount)
        }
      }
    }

    function updateCapacity(path, value) {
      onEsPlanChange(path, value)
    }
  }
}

export default EditClusterForm
