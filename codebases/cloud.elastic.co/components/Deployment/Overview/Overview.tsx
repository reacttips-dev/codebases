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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiFlexGrid,
  EuiFlexItem,
  EuiHealth,
  EuiSpacer,
  EuiHideFor,
  EuiTitle,
  EuiFormLabel,
} from '@elastic/eui'

import StackDeploymentEndpointsWrapper from './StackDeploymentEndpointsWrapper'

import DeploymentAlias from '../DeploymentAlias'
import DeploymentVersion from '../DeploymentVersion'
import CcsEditRemoteDeployments from '../CcsEditRemoteDeployments'

import { AppSearchDeploymentPageNotice } from '../../DeprecationNotices/AppsearchNotices'

import StackDeploymentName from '../../StackDeployments/StackDeploymentName'
import StackDeploymentNodesVisualization from '../../StackDeployments/StackDeploymentNodesVisualization'
import StackDeploymentAdminActions from '../../StackDeployments/StackDeploymentAdminActions'

import ClusterLockingGate from '../../ClusterLockingGate'
import ResourceComments from '../../ResourceComments'

import { DeploymentHealthProblemsSummary } from '../../StackDeploymentHealthProblems/StackDeploymentHealthProblemsTitle'

import AutoscalingAvailableCallout from '../../Autoscaling/AutoscalingAvailableCallout'
import AutoscalingStatusCallout from '../../Autoscaling/AutoscalingStatusCallout'
import IlmDeploymentMigrationCallout from '../../IlmMigration/IlmDeploymentMigrationCallout'
import FleetAvailableCallout from '../../Fleet/FleetAvailableCallout'
import AppSearchToEnterpriseSearchMigrationFlyout from '../../AppSearchToEnterpriseSearchMigration/AppSearchToEnterpriseSearchMigrationFlyout'

import {
  getDeploymentHealthProblems,
  getDeploymentEuiHealthColor,
} from '../../../lib/healthProblems'

import { isCrossClusterSearch } from '../../../lib/deployments/ccs'
import {
  canEnableAutoscaling,
  isAutoscalingAvailable,
  isAutoscalingEnabledOnGet,
  isEveryResourceStarted,
} from '../../../lib/stackDeployments'
import { isSliderInstanceTypeSupportedInTemplate } from '../../../lib/sliders'

import {
  ApmCluster,
  ElasticsearchCluster,
  KibanaCluster,
  StackDeployment,
  AppSearchToEnterpriseSearchMigrationProgress,
} from '../../../types'
import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

import './overview.scss'
import CCSMigrationNotification from '../CCSMigrationNotification'

export type Props = {
  deployment: ElasticsearchCluster
  deploymentTemplate?: DeploymentTemplateInfoV2
  kibana?: KibanaCluster | null
  apm?: ApmCluster | null
  version: string
  hideClusterInsteadOfDelete: boolean
  hideClusterInsteadOfStop: boolean
  showNativeMemoryPressure: boolean
  stackDeployment?: StackDeployment | null
  appSearchToEnterpriseSearchProgress?: AppSearchToEnterpriseSearchMigrationProgress
  inTrial: boolean
}

const DeploymentOverview: FunctionComponent<Props> = ({
  deployment,
  deploymentTemplate,
  kibana,
  apm,
  hideClusterInsteadOfDelete,
  hideClusterInsteadOfStop,
  showNativeMemoryPressure,
  version,
  stackDeployment,
  appSearchToEnterpriseSearchProgress,
  inTrial,
}) => {
  const { regionId, plan, instances, deploymentTemplateId, isSystemOwned } = deployment

  // tally running ES, Kibana, and APM instances
  const esInstances = instances.record.length
  const kibanaTotal = kibana ? kibana.instances.count.total : 0
  const apmTotal = apm ? apm.instances.count.total : 0
  const totalInstances = esInstances + kibanaTotal + apmTotal

  const pendingEs = plan.isPending || plan.waitingForPending

  const [problems] = getDeploymentHealthProblems({
    deployment: stackDeployment!,
  })

  const deploymentHealthColor = getDeploymentEuiHealthColor({ deployment: stackDeployment! })

  const ccs = isCrossClusterSearch({
    deploymentTemplate,
    deploymentTemplateId,
    systemOwned: isSystemOwned,
  })

  const supportsAppsearch = isSliderInstanceTypeSupportedInTemplate(`appsearch`, deploymentTemplate)

  const deploymentOverviewKey = `deploymentOverview-${regionId}-${deployment.id}`

  const endpointsWrapper = <StackDeploymentEndpointsWrapper deployment={stackDeployment!} />

  const displayAutoscalingAvailable =
    !isAutoscalingEnabledOnGet({ deployment: stackDeployment! }) &&
    isEveryResourceStarted({ deployment: stackDeployment! }) &&
    canEnableAutoscaling({ deploymentTemplate, version, inTrial })

  const displayAutoscalingStatus =
    isAutoscalingAvailable(version) && isAutoscalingEnabledOnGet({ deployment: stackDeployment! })

  return (
    <div key={deploymentOverviewKey}>
      <IlmDeploymentMigrationCallout stackDeployment={stackDeployment} />
      <CCSMigrationNotification stackDeployment={stackDeployment} />

      {supportsAppsearch && (
        <Fragment>
          <AppSearchDeploymentPageNotice deployment={stackDeployment!} />
          <EuiSpacer size='m' />
        </Fragment>
      )}

      {appSearchToEnterpriseSearchProgress?.showUI && (
        <AppSearchToEnterpriseSearchMigrationFlyout deployment={stackDeployment!} />
      )}

      {displayAutoscalingAvailable && (
        <AutoscalingAvailableCallout
          stackDeployment={stackDeployment!}
          deploymentTemplate={deploymentTemplate}
        />
      )}

      {stackDeployment && deploymentTemplate && (
        <FleetAvailableCallout
          deployment={stackDeployment}
          deploymentTemplate={deploymentTemplate}
        />
      )}

      {displayAutoscalingStatus && <AutoscalingStatusCallout stackDeployment={stackDeployment!} />}

      <div>
        {pendingEs || (
          <Fragment>
            <EuiFlexGrid
              columns={3}
              className='overview-grid'
              data-test-id='deployment-overview-es-not-pending'
            >
              <EuiFlexItem>
                <StackDeploymentName deployment={stackDeployment!} />
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiFormLabel>
                  <FormattedMessage
                    id='deployment-manage-name.deployment-status'
                    defaultMessage='Deployment status'
                  />
                </EuiFormLabel>
                <EuiSpacer size='m' />
                <EuiHealth color={deploymentHealthColor}>
                  <DeploymentHealthProblemsSummary problems={problems} />
                </EuiHealth>
              </EuiFlexItem>
              <ClusterLockingGate>
                <EuiFlexItem>
                  <EuiHideFor sizes={['xs', 's']}>
                    <EuiSpacer size='l' />
                  </EuiHideFor>
                  <StackDeploymentAdminActions
                    deployment={stackDeployment!}
                    hideClusterInsteadOfDelete={hideClusterInsteadOfDelete}
                    hideClusterInsteadOfStop={hideClusterInsteadOfStop}
                  />
                </EuiFlexItem>
              </ClusterLockingGate>

              <EuiFlexItem>
                <DeploymentAlias deployment={stackDeployment!} />
              </EuiFlexItem>

              <EuiFlexItem>
                {!deployment.isStopped && version && (
                  <Fragment>
                    <EuiSpacer size='xs' />
                    <DeploymentVersion deployment={stackDeployment!} />
                  </Fragment>
                )}
              </EuiFlexItem>
              <EuiHideFor sizes={['xs', 's']}>
                <EuiFlexItem />
              </EuiHideFor>
              {endpointsWrapper}
            </EuiFlexGrid>
          </Fragment>
        )}
      </div>

      {ccs && (
        <Fragment>
          <EuiSpacer size='m' />
          <CcsEditRemoteDeployments regionId={regionId} deployment={stackDeployment!} />
        </Fragment>
      )}

      <EuiSpacer size='xl' />

      {totalInstances === 0 || (
        <StackDeploymentNodesVisualization
          title={
            <EuiTitle size='s'>
              <h3 data-test-id='deploymentOverview-zonesAndNodes'>
                <FormattedMessage id='deployment-info.instances' defaultMessage='Instances' />
              </h3>
            </EuiTitle>
          }
          deployment={stackDeployment!}
          showNativeMemoryPressure={showNativeMemoryPressure}
        />
      )}

      {/* eventually, we'll have _deployment level_ comments here,
       * and the ES ones will be relegated to just the ES cluster
       */}
      <ResourceComments
        spacerBefore={true}
        resourceType='elasticsearch'
        regionId={regionId}
        resourceId={deployment.id}
      />
    </div>
  )
}

export default DeploymentOverview
