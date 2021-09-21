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

import { find, intersection, isEmpty, last, omit, remove } from 'lodash'
import moment from 'moment'
import React, { Fragment, ReactNode, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { EuiBadge, EuiCode, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { CuiLink } from '../../../cui/Link'
import { CuiTimeAgo } from '../../../cui/TimeAgo'
import DocLink from '../../../components/DocLink'

import CancelPlanButton from '../../../components/StackDeploymentConfigurationChange/CancelPlanButton'

import { parseConfigurationChangeError } from './configurationChangeError'

import { isCurrentPath } from '../../urls'
import {
  hostAllocatorUrl,
  deploymentActivityUrl,
  deploymentEditUrl,
  deploymentUrl,
  sliderActivityUrl,
  deploymentsUrl,
  securityUrl,
} from '../../urlBuilder'

import { describePlanAttemptSource, describePlanAttemptStep } from '../../plan'

import {
  countInstances,
  countShards,
  getClusterBlockingIssues,
  getEsNodeConfigurationsFromGet,
  getExpectedSliderVersion,
  getHiddenTimestamp,
  getIndexBlockingIssues,
  getInstancesWithNoMaster,
  getLastPlanAttempt,
  getLatestSnapshotSuccess,
  getMasterCount,
  getPendingSource,
  getPlanLog,
  getRecommendedVersion,
  getRemotes,
  getResourceVersion,
  getScheduledSnapshotTime,
  getVersion,
  hasBlockingIssues,
  hasCreatePlan,
  hasEnabledSnapshots,
  hasFailedCreatePlan,
  hasHealthyEsPlan,
  hasHealthyInstances,
  hasHealthyMasters,
  hasHealthyRemotes,
  hasHealthyResourcePlan,
  hasHealthyShards,
  hasHealthySnapshots,
  hasLatestSnapshotSuccess,
  hasOngoingConfigurationChange,
  hasOngoingResourceConfigurationChange,
  hasRecentSnapshotSuccess,
  hasScheduledSnapshot,
  hasSlm,
  hasSuspendedSnapshots,
  hasUnhealthyIlmMigrationPlan,
  isForceRestarting,
  isHidden,
  isHiddenResource,
  isLocked,
  isPendingInitialSnapshot,
  isRestarting,
  isStopped,
  isStopping,
  isSystemUpgradeRecommended,
  shouldUpgradeSliderVersion,
} from '../../stackDeployments'

import {
  getSliderIconType,
  getSliderPrettyName,
  isSliderInstanceType,
  getSupportedSliderInstanceTypes,
} from '../../sliders'

import { hasInconsistentUserSettings } from '../../deployments/userSettings'

import { createInstanceDisplayName } from '../../../reducers/clusters/createCluster'

import { getConfigForKey, isFeatureActivated } from '../../../store'

import {
  EuiHealthColor,
  getEuiHealthColor,
  PreparedProblems,
  prepareProblems,
  Problem,
  SeverityLevel,
} from '../problems'

import Feature from '../../feature'

import {
  AllocatorSearchResult,
  AnyResourceInfo,
  AsyncRequestState,
  DynamicSliderInstanceDefinitionParams,
  SliderInstanceType,
  StackDeployment,
} from '../../../types'

import {
  ElasticsearchClusterBlockingIssueElement,
  ElasticsearchResourceInfo,
  RemoteResources,
} from '../../api/v1/types'

import { isPermitted } from '../../../lib/requiresPermission'
import Permission from '../../../lib/api/v1/permissions'

type BlockingErrorDescription = {
  matches: (description: string) => boolean
  id: string
  level?: SeverityLevel
  message?: ReactElement
}

const blockingErrors: BlockingErrorDescription[] = [
  {
    matches: (description) => description.includes(`index preparing to close`),
    id: `index-preparing-to-close`,
    level: `warning`,
  },
  {
    matches: (description) => description === `index read-only / allow delete (api)`,
    id: `readonly-index`,
    level: `warning`,
    message: (
      <FormattedMessage
        id='deployment-health-problems.es-readonly-index'
        defaultMessage='An Elasticsearch index is in a read-only state and only allows deletes'
      />
    ),
  },
  {
    matches: (description) => description === `no master`,
    id: `no-master`,
    message: (
      <FormattedMessage
        id='deployment-health-problems.es-no-master'
        defaultMessage='No master node reported'
      />
    ),
  },
  {
    matches: (description) => description === `state not recovered / initialized`,
    id: `state-not-recovered`,
    message: (
      <FormattedMessage
        id='deployment-health-problems.es-state-not-recovered'
        defaultMessage='Instance state not recovered or initialized'
      />
    ),
  },
]

export function getDeploymentHealthProblems({
  deployment,
  cancelPlanRequests,
  hideLinks,
  hideActivityBits,
  deploymentAllocators,
  ccsSettings,
}: {
  deployment?: StackDeployment
  hideLinks?: boolean
  hideActivityBits?: boolean
  cancelPlanRequests?: {
    [sliderInstanceType: string]: AsyncRequestState
  }
  deploymentAllocators?: AllocatorSearchResult[]
  ccsSettings?: RemoteResources | null
}): PreparedProblems {
  const problems: Problem[] = []

  // no problems if there's no deployment to base problems off of
  if (!deployment) {
    return prepareProblems(problems)
  }

  const { resources } = deployment
  const [esResource] = resources.elasticsearch
  const [kibanaResource] = resources.kibana
  const [apmResource] = resources.apm
  const [appsearchResource] = resources.appsearch
  const mainResource = esResource || kibanaResource || apmResource || appsearchResource

  // no problems if there's no clusters to base problems off of
  if (!mainResource) {
    return prepareProblems(problems)
  }

  const hideActivity = hideActivityBits || hideLinks

  // creating the deployment shouldn't show up as an error nor be hidden
  const creationProblems = getCreationProblems({ deployment, hideLinks: hideActivity })

  if (!isEmpty(creationProblems)) {
    return prepareProblems(creationProblems!)
  }

  const overridingProblems = getOverridingProblems({ deployment })

  if (!isEmpty(overridingProblems)) {
    return prepareProblems(overridingProblems)
  }

  // generate resource-level problems
  const sliderInstanceTypes = getSupportedSliderInstanceTypes()
  const resourceTypes = Object.keys(resources)
  const supportedResourceTypes = intersection(resourceTypes, sliderInstanceTypes)

  for (const sliderInstanceType of supportedResourceTypes) {
    const [resource] = resources[sliderInstanceType]

    if (!resource) {
      continue // not every possible instance type will be populated with a resource
    }

    problems.push(
      ...getConfigurationChangeProblems({
        deployment,
        resource,
        sliderInstanceType,
        cancelPlanRequest: cancelPlanRequests && cancelPlanRequests[sliderInstanceType],
        hideActivity,
      }),
    )

    if (sliderInstanceType === `elasticsearch`) {
      problems.push(
        ...getElasticsearchHealthProblems({
          deployment,
          resource: esResource,
          hideLinks,
        }),
      )
    } else {
      problems.push(
        ...getSliderHealthProblems({
          deployment,
          sliderInstanceType,
          hideLinks,
        }),
      )
    }
  }

  if (isHidden({ deployment })) {
    const hiddenTimestamp = getHiddenTimestamp({ deployment })

    problems.push({
      sticky: true,
      kind: `deployment`,
      id: `deployment-hidden`,
      level: `warning`,
      iconType: `eyeClosed`,
      message: hiddenTimestamp ? (
        <FormattedMessage
          id='deployment-health-problems.deployment-hidden-since'
          defaultMessage='Deployment hidden {when}'
          values={{
            when: <CuiTimeAgo date={moment(hiddenTimestamp)} shouldCapitalize={false} />,
          }}
        />
      ) : (
        <FormattedMessage
          id='deployment-health-problems.deployment-hidden'
          defaultMessage='Deployment is hidden'
        />
      ),
      'data-test-id': 'clusterInfo-clusterHidden',
    })
  }

  if (isLocked({ deployment })) {
    problems.push({
      sticky: true,
      kind: `deployment`,
      id: `deployment-cluster-locking-enabled`,
      level: `warning`,
      iconType: `lock`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.deployment-cluster-locking-enabled'
          defaultMessage='Configuration changes have been temporarily disabled while we perform maintenance work'
        />
      ),
    })
  }

  if (ccsSettings) {
    problems.push(...getCCSProblems(ccsSettings, deployment))
  }

  problems.push(...getAllocatorHealthProblems(deploymentAllocators))

  return prepareProblems(problems)
}

function getCCSProblems(ccsSettings: RemoteResources, deployment: StackDeployment): Problem[] {
  const { resources } = ccsSettings
  const problems: Problem[] = []

  const messages = {
    trustManagement: (
      <FormattedMessage
        id='deployment-health-problems.trust-management'
        defaultMessage='Trust management'
      />
    ),
    deployments: (
      <Link to={deploymentsUrl()}>
        <FormattedMessage
          id='deployment-health-problems.deployment-page'
          defaultMessage='Deployments'
        />
      </Link>
    ),
    remoteClusterCompatibility: (
      <DocLink link='remoteClusterCompatibility'>
        <FormattedMessage
          id='deployment-health-problems.compatiblity-matrix'
          defaultMessage='compatible versions'
        />
      </DocLink>
    ),
    enableCCS: (
      <DocLink link='enableCCS'>
        <FormattedMessage
          id='deployment-health-problems.enable-ccs-learn-more'
          defaultMessage='Learn more'
        />
      </DocLink>
    ),
  }

  resources.forEach((resource) => {
    if (resource.info) {
      const { healthy, connected, compatible, trusted, trusted_back } = resource.info

      const numberOfIssues = Object.keys(resource.info).filter((key) => !resource.info![key])

      if (numberOfIssues.length > 0) {
        if (numberOfIssues.length > 1) {
          // If there's a number of things wrong, show them a big combined warning message
          problems.push({
            'data-test-id': `remote-multi-issues`,
            kind: `deployment`,
            id: `deployment-remote-multi-issues`,
            level: `warning`,
            message: (
              <FormattedMessage
                id='deployment-health-problems.remote-multi-issues'
                defaultMessage="Connection between this deployment and {remoteName} could not be established. Verify that the trust goes both ways (see this deployment's {thisTrustManagement} and {remoteName}'s {remoteTrustManagement}), that both deployments are healthy (see {deploymentsLink}), and that they are {compatibleVersions}"
                values={{
                  remoteName: <EuiCode>{resource.alias}</EuiCode>,
                  thisTrustManagement: (
                    <Link to={securityUrl(deployment.id)}>{messages.trustManagement}</Link>
                  ),
                  remoteTrustManagement: (
                    <Link to={securityUrl(resource.deployment_id)}>{messages.trustManagement}</Link>
                  ),
                  deploymentsLink: messages.deployments,
                  compatibleVersions: messages.remoteClusterCompatibility,
                }}
              />
            ),
          })
        } else {
          // If there's only one issue, show a specific error
          if (!healthy) {
            problems.push({
              'data-test-id': `remote-unhealthy`,
              kind: `deployment`,
              id: `deployment-remote-unhealthy`,
              level: `warning`,
              message: (
                <FormattedMessage
                  id='deployment-health-problems.remote-unhealthy'
                  defaultMessage='Connection between this deployment and {remoteName} could not be established. Verify that both deployments are healthy (see {deploymentsLink}).'
                  values={{
                    remoteName: <EuiCode>{resource.alias}</EuiCode>,
                    deploymentsLink: messages.deployments,
                  }}
                />
              ),
            })
          }

          if (!connected) {
            problems.push({
              'data-test-id': `remote-not-connected`,
              kind: `deployment`,
              id: `deployment-remote-not-connected`,
              level: `warning`,
              message: (
                <FormattedMessage
                  id='deployment-health-problems.remote-not-connected'
                  defaultMessage='Connection between this deployment and {remoteName} could not be established. Verify the configuration. {learnMore}'
                  values={{
                    remoteName: <EuiCode>{resource.alias}</EuiCode>,
                    learnMore: messages.enableCCS,
                  }}
                />
              ),
            })
          }
        }

        if (!compatible) {
          problems.push({
            'data-test-id': `remote-incompatible`,
            kind: `deployment`,
            id: `deployment-remote-incompatible`,
            level: `warning`,
            message: (
              <FormattedMessage
                id='deployment-health-problems.remote-incompatible'
                defaultMessage='Connection between this deployment and {remoteName} could not be established. The versions are not compatible. See the {compatibilityMatrix} chart.'
                values={{
                  remoteName: <EuiCode>{resource.alias}</EuiCode>,
                  compatibilityMatrix: messages.remoteClusterCompatibility,
                }}
              />
            ),
          })
        }

        if (!trusted) {
          problems.push({
            'data-test-id': `remote-untrusted`,
            kind: `deployment`,
            id: `deployment-remote-untrusted`,
            level: `warning`,
            message: (
              <FormattedMessage
                id='deployment-health-problems.remote-untrusted'
                defaultMessage='Connection between this deployment and {remoteName} could not be established. Make sure that this deployment trusts {remoteName} in {trustManagement}.'
                values={{
                  remoteName: <EuiCode>{resource.alias}</EuiCode>,
                  trustManagement: (
                    <Link to={securityUrl(deployment.id)}>{messages.trustManagement}</Link>
                  ),
                }}
              />
            ),
          })
        }

        if (!trusted_back) {
          problems.push({
            'data-test-id': `remote-untrusted-back`,
            kind: `deployment`,
            id: `deployment-remote-untrusted-back`,
            level: `warning`,
            message: (
              <FormattedMessage
                id='deployment-health-problems.remote-untrusted-back'
                defaultMessage='Connection between this deployment and {remoteName} could not be established. Make sure that {remoteName} trusts this deployment in {trustManagement}.'
                values={{
                  remoteName: <EuiCode>{resource.alias}</EuiCode>,
                  trustManagement: (
                    <Link to={securityUrl(resource.deployment_id)}>{messages.trustManagement}</Link>
                  ),
                }}
              />
            ),
          })
        }
      }
    }
  })

  return problems
}

function getAllocatorHealthProblems(deploymentAllocators?: AllocatorSearchResult[]): Problem[] {
  const problems: Problem[] = []

  if (!deploymentAllocators || deploymentAllocators.length === 0) {
    return problems
  }

  const unhealthyAllocators = deploymentAllocators.filter(({ healthy }) => !healthy)

  if (unhealthyAllocators.length === 0) {
    return problems
  }

  const allocatorsLinks = unhealthyAllocators.map(({ regionId, id }) =>
    isPermitted(Permission.getAllocator) ? (
      <Link key={id} to={hostAllocatorUrl(regionId, id)}>
        {id}
      </Link>
    ) : (
      id
    ),
  )

  const allocatorsLinksWithCommas = allocatorsLinks.reduce(
    (acc, curr) => [...acc, acc.length > 0 ? ', ' : '', curr],
    [],
  )

  problems.push({
    'data-test-id': `unhealthy-allocators`,
    kind: `deployment`,
    id: `deployment-unhealthy-allocators`,
    level: `danger`,
    message: (
      <FormattedMessage
        id='deployment-health-problems.unhealthy-allocators'
        defaultMessage='Some instances in this deployment are running on unhealthy allocators: {allocatorsLinks}'
        values={{
          allocatorsLinks: allocatorsLinksWithCommas,
        }}
      />
    ),
  })

  return problems
}

function getCreationProblems({
  deployment,
}: {
  deployment?: StackDeployment
  hideLinks?: boolean
}): Problem[] {
  const problems: Problem[] = []

  if (!deployment) {
    return problems
  }

  const creating = hasCreatePlan({ deployment })

  if (!creating) {
    return problems
  }

  // even if it's being created, an unhealthy plan needs a warning sign.
  if (!hasHealthyEsPlan({ deployment })) {
    return problems
  }

  // a new deployment has no business being `hidden`, thus we'll assume create failed.
  if (isHidden({ deployment })) {
    return problems
  }

  problems.push({
    kind: `deployment`,
    id: `deployment-being-created`,
    'data-test-id': `deployment-being-created`,
    level: `info`,
    iconType: `clock`,
    title: (
      <FormattedMessage
        id='deployment-health-problems.deployment-being-created-title'
        defaultMessage='Creating your deployment'
      />
    ),
    titleSummary: (
      <FormattedMessage
        id='deployment-health-problems.deployment-being-created-summary'
        defaultMessage='Being created'
      />
    ),
    message: (
      <FormattedMessage
        id='deployment-health-problems.deployment-being-created'
        defaultMessage='(takes about five minutes)'
      />
    ),
  })

  return problems
}

function getOverridingProblems({ deployment }: { deployment?: StackDeployment }): Problem[] {
  const problems: Problem[] = []

  if (!deployment) {
    return problems
  }

  if (hasOngoingConfigurationChange({ deployment })) {
    return problems
  }

  if (hasFailedCreatePlan({ deployment })) {
    problems.push({
      kind: `deployment`,
      id: `failed-initial-plan`,
      level: `danger`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.deployment-failed-initial-plan'
          defaultMessage='Something went wrong while creating this deployment'
        />
      ),
    })

    return problems
  }

  return problems
}

function getConfigurationChangeProblems({
  deployment,
  resource,
  sliderInstanceType,
  cancelPlanRequest,
  hideActivity,
}: {
  deployment: StackDeployment
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  cancelPlanRequest?: AsyncRequestState
  hideActivity?: boolean
}) {
  const problems: Problem[] = []

  if (!resource) {
    return problems
  }

  const clusterIconType = getClusterIcon(sliderInstanceType)
  const changeset = getConfigurationChangeset({ resource, sliderInstanceType, cancelPlanRequest })

  if (changeset === null) {
    return problems
  }

  const title = (
    <div data-test-id='configuration-change-in-progress'>
      <FormattedMessage
        id='deployment-health-problems.changing-deployment-configuration-title'
        defaultMessage='Configuration change in progress'
      />
    </div>
  )

  const titleSummary = (
    <FormattedMessage
      id='deployment-health-problems.changing-deployment-configuration-summary'
      defaultMessage='Changing configuration'
    />
  )

  const gotoActivity = (
    <CuiLink to={getClusterActivityLink({ deployment, sliderInstanceType })}>
      <FormattedMessage
        id='deployment-health-problems.go-to-activity'
        defaultMessage='Go to Activity'
      />
    </CuiLink>
  )

  const message = (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      <EuiFlexItem grow={false}>
        <div data-test-id='pendingPlan-message'>{changeset.description}</div>
      </EuiFlexItem>

      {hideActivity || (
        <Fragment>
          <EuiFlexItem grow={false}>{gotoActivity}</EuiFlexItem>

          <EuiFlexItem grow={false}>
            <CancelPlanButton
              deployment={deployment}
              resource={resource}
              resourceType={sliderInstanceType}
            />
          </EuiFlexItem>
        </Fragment>
      )}
    </EuiFlexGroup>
  )

  problems.push({
    kind: sliderInstanceType,
    id: changeset.id,
    level: `info`,
    iconType: clusterIconType,
    spinner: true,
    hidden: hideActivity,
    title,
    titleSummary,
    message,
    'data-test-id': changeset[`data-test-id`],
  })

  return problems
}

function getConfigurationChangeset({
  resource,
  sliderInstanceType,
  cancelPlanRequest,
}: {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  cancelPlanRequest?: AsyncRequestState
}): {
  id: string
  description: ReactNode
  'data-test-id': string
} | null {
  const version = getResourceVersion({ resource })

  const clusterKind = getClusterKindTitle({ sliderInstanceType, version })

  if (isForceRestarting({ resource })) {
    return {
      id: `force-restarting-${sliderInstanceType}`,
      description: (
        <FormattedMessage
          id='deployment-health-problems.force-restarting-deployment'
          defaultMessage='Force restarting {clusterKind}'
          values={{ clusterKind }}
        />
      ),
      'data-test-id': `deploymentStatus-forceRestartingPlan`,
    }
  }

  if (isRestarting({ resource })) {
    return {
      id: `restarting-${sliderInstanceType}`,
      description: (
        <FormattedMessage
          id='deployment-health-problems.restarting-deployment'
          defaultMessage='Restarting {clusterKind}'
          values={{ clusterKind }}
        />
      ),
      'data-test-id': `deploymentStatus-forceRestartingPlan`,
    }
  }

  if (isStopping({ resource })) {
    return {
      id: `terminating-${sliderInstanceType}`,
      description: (
        <FormattedMessage
          id='deployment-health-problems.terminating-deployment'
          defaultMessage='Terminating {clusterKind}'
          values={{ clusterKind }}
          data-test-id='terminating-deployment'
        />
      ),
      'data-test-id': `deploymentStatus-stoppingPlan`,
    }
  }

  if (hasOngoingResourceConfigurationChange({ resource })) {
    return {
      id: `changing-${sliderInstanceType}-configuration-now`,
      description: describePendingChange(),
      'data-test-id': `pendingPlan-progress`,
    }
  }

  return null

  function describePendingChange() {
    const isCancelled = cancelPlanRequest && cancelPlanRequest.isDone && !cancelPlanRequest.error

    if (isCancelled) {
      return (
        <FormattedMessage
          id='deployment-health-problems.cancelling-changes'
          defaultMessage='Cancelling changes to {clusterKind}'
          values={{ clusterKind }}
        />
      )
    }

    const messages = getPlanLog({ resource, state: `pending` })
    const lastMessage = last(messages)

    if (lastMessage) {
      const stepInfo = describePlanAttemptStep(lastMessage)
      return stepInfo.value
    }

    const pendingSource = getPendingSource({ resource })

    if (pendingSource) {
      const describedSource = describePlanAttemptSource({ source: pendingSource })

      if (describedSource !== null) {
        return describedSource
      }
    }

    return (
      <FormattedMessage
        id='deployment-health-problems.applying-changes'
        defaultMessage='Applying changes to {clusterKind}'
        values={{ clusterKind }}
      />
    )
  }
}

function getClusterActivityLink({
  deployment,
  sliderInstanceType,
}: {
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
}) {
  const { id } = deployment

  if (isSliderInstanceType(sliderInstanceType)) {
    return sliderActivityUrl(id, sliderInstanceType)
  }

  return deploymentActivityUrl(id)
}

function getClusterIcon(sliderInstanceType: SliderInstanceType) {
  const defaultIcon = `logoElasticsearch`
  return getSliderIconType({ sliderInstanceType }) || defaultIcon
}

function getClusterKindTitle({
  sliderInstanceType,
  ...dynamicSliderInstanceDefinitionParams
}: DynamicSliderInstanceDefinitionParams & { sliderInstanceType: SliderInstanceType }) {
  if (sliderInstanceType !== `elasticsearch` && isSliderInstanceType(sliderInstanceType)) {
    return (
      <FormattedMessage
        {...getSliderPrettyName({ sliderInstanceType, ...dynamicSliderInstanceDefinitionParams })}
      />
    )
  }

  return (
    <FormattedMessage
      id='deployment-health-problems.deployment-cluster-kind'
      defaultMessage='this deployment'
    />
  )
}

function getElasticsearchHealthProblems({
  deployment,
  resource,
  hideLinks,
}: {
  deployment: StackDeployment
  resource: ElasticsearchResourceInfo
  hideLinks?: boolean
}): Problem[] {
  const problems: Problem[] = []
  const hidePlanDetails = isFeatureActivated(Feature.hidePlanDetails)
  const { id } = deployment

  if (hasOngoingResourceConfigurationChange({ resource })) {
    return problems
  }

  if (isStopped({ resource })) {
    problems.push({
      kind: `deployment`,
      id: `deployment-terminated`,
      level: `warning`,
      iconType: `stopFilled`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.deployment-terminated'
          defaultMessage='Deployment is terminated'
        />
      ),
    })
  }

  const healthyMasters = hasHealthyMasters({ resource })
  const masterCount = getMasterCount({ resource })
  const instancesWithNoMaster = getInstancesWithNoMaster({ resource })

  if (!healthyMasters) {
    if (masterCount === 0) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-master-node-unhealthy-none`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-master-node-none'
            defaultMessage='There are no Elasticsearch master nodes'
          />
        ),
      })
    } else if (masterCount === 1) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-master-node-unhealthy-single`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-master-node-unhealthy'
            defaultMessage='The Elasticsearch master node is unhealthy'
          />
        ),
      })
    } else if (instancesWithNoMaster.length === 0) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-master-node-unhealthy-many`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-master-node-multiples'
            defaultMessage='There are {masterNodeCount} unhealthy Elasticsearch master nodes'
            values={{ masterNodeCount: masterCount }}
          />
        ),
      })
    } else if (instancesWithNoMaster.length === 1) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-master-node-without-master`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-node-without-master'
            defaultMessage='Instance {instanceName} has no master'
            values={{ instanceName: <EuiCode>{instancesWithNoMaster[0]}</EuiCode> }}
          />
        ),
      })
    } else {
      problems.push({
        kind: `elasticsearch`,
        id: `es-master-node-many-without-master`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.many-es-nodes-without-master'
            defaultMessage='Instances {instances} have no master'
            values={{
              instances: (
                <Fragment>
                  {instancesWithNoMaster.map((instanceWithNoMaster, index) => (
                    <Fragment>
                      {index === 0 ? null : ', '}
                      <EuiCode key={instanceWithNoMaster}>{instanceWithNoMaster}</EuiCode>
                    </Fragment>
                  ))}
                </Fragment>
              ),
            }}
          />
        ),
      })
    }
  }

  const instanceProblems = getInstanceProblems({
    kind: `elasticsearch`,
    kindName: (
      <FormattedMessage
        id='deployment-health-problems.es-instance-kind'
        defaultMessage='Elasticsearch'
      />
    ),
    resource,
  })

  problems.push(...instanceProblems)

  const nodeConfigurations = getEsNodeConfigurationsFromGet({ deployment })
  const inconsistentUserSettings = hasInconsistentUserSettings({ nodeConfigurations })

  if (inconsistentUserSettings) {
    problems.push({
      kind: `elasticsearch`,
      id: `es-user-settings-diff`,
      level: `warning`,
      'data-test-id': `user-settings-diff`,
      message: (
        <FormattedMessage
          id='stack-deployment-health-problems.user-settings-diff-message'
          defaultMessage='User settings are different across Elasticsearch instances. {learnMore}'
          values={{
            learnMore: (
              <DocLink link='esUserSettingsDocLink'>
                <FormattedMessage
                  id='stack-deployment-health-problems.user-settings.learn-more'
                  defaultMessage='Learn more'
                />
              </DocLink>
            ),
          }}
        />
      ),
      helpText: (
        <FormattedMessage
          id='stack-deployment-health-problems.user-settings-diff-help'
          defaultMessage='This could lead to issues with your deployment. {editLink}'
          values={{
            editLink: (
              <CuiLink to={deploymentEditUrl(deployment.id)}>
                <FormattedMessage
                  id='stack-deployment-health-problems.go-to-edit-page'
                  defaultMessage='Go to Edit page'
                />
              </CuiLink>
            ),
          }}
        />
      ),
    })
  }

  if (!hasHealthyResourcePlan({ resource })) {
    problems.push({
      stickyLast: true,
      kind: `elasticsearch`,
      id: `es-config-change-failed`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.es-config-change-failed'
          defaultMessage='Latest change to Elasticsearch configuration failed'
        />
      ),
      tooltip: hidePlanDetails
        ? null
        : getLatestPlanFailureMessage({ deployment, resource, resourceType: `elasticsearch` }),
    })
  }

  if (hasUnhealthyIlmMigrationPlan({ deployment })) {
    problems.push({
      'data-test-id': `es-ilm-migration-failed`,
      kind: `elasticsearch`,
      id: `es-ilm-migration-failed`,
      level: `danger`,
      sticky: true,
      title: (
        <FormattedMessage
          id='deployment-health-problems.migration-failed.title'
          defaultMessage='Index Lifecycle Management migration failed'
        />
      ),
      message: (
        <FormattedMessage
          id='deployment-health-problems.es-ilm-migration-failed'
          defaultMessage='A problem occurred while migrating your deployment to Index Lifecycle Management.'
        />
      ),
    })
  }

  if (!hasHealthyShards({ resource })) {
    const { unavailable } = countShards({ resource })

    if (unavailable > 0) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-shards-unavailable`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-shards-unavailable'
            defaultMessage='{count, plural, one {An} other {{count}}} Elasticsearch {count, plural, one {shard} other {shards}} unavailable'
            values={{ count: unavailable }}
          />
        ),
      })
    } else {
      problems.push({
        kind: `elasticsearch`,
        id: `es-shards-unhealthy`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-shards-unhealthy'
            defaultMessage='Some Elasticsearch shards are unhealthy'
          />
        ),
      })
    }
  }

  const snapshotProblems = getSnapshotProblems({ resource })

  problems.push(...snapshotProblems)
  problems.push(...getEsBlockingProblems({ resource }))

  if (hasHealthyRemotes({ resource })) {
    const remotes = getRemotes({ resource })
    const problemRemoteIds = remotes
      .filter((remote) => !remote.info?.compatible)
      .map((remote) => remote.deployment_id)

    if (problemRemoteIds.length) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-remote-cluster-compatibility-issues`,
        level: `warning`,
        iconType: `offline`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.remote-deployment-compatibility-issues'
            defaultMessage='Incompatible remote {amount, plural, one {deployment} other {deployments}}: {deployments} must be upgraded to include in search'
            values={{
              amount: problemRemoteIds.length,
              deployments: (
                <span>
                  {problemRemoteIds.map((deploymentId) => (
                    <EuiCode key={deploymentId}>
                      {hideLinks ? (
                        deploymentId.slice(0, 6)
                      ) : (
                        <CuiLink to={deploymentUrl(deploymentId)}>
                          {deploymentId.slice(0, 6)}
                        </CuiLink>
                      )}
                    </EuiCode>
                  ))}
                </span>
              ),
            }}
          />
        ),
      })
    }
  }

  if (isSystemUpgradeRecommended({ deployment })) {
    const recommendedVersion = getRecommendedVersion()
    const overviewUrl = deploymentUrl(id)

    problems.push({
      kind: `elasticsearch`,
      id: `es-system-upgrade-recommended`,
      level: `info`,
      iconType: `alert`,
      message: (
        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='deployment-health-problems.es-system-upgrade-recommended'
              defaultMessage='Upgrade Elasticsearch to version {recommendedVersion} or above'
              values={{ recommendedVersion }}
            />
          </EuiFlexItem>

          {!hideLinks && !isCurrentPath(overviewUrl) && (
            <EuiFlexItem grow={false}>
              <CuiLink to={overviewUrl}>
                <FormattedMessage
                  id='deployment-health-problems.deployment-upgrade-link'
                  defaultMessage='Go to the Overview page to upgrade'
                />
              </CuiLink>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      ),
    })
  }

  // these problems come from different sources.
  // "no masters overall" is more obvious than "no master according to (every instance)"
  if (find(problems, { id: `es-master-node-none` })) {
    remove(problems, { id: `es-cluster-locking-error-no-master` })
  }

  return problems
}

function getSliderHealthProblems({
  deployment,
  sliderInstanceType,
  hideLinks,
}: {
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
  hideLinks?: boolean
}): Problem[] {
  const hidePlanDetails = isFeatureActivated(Feature.hidePlanDetails)
  const problems: Problem[] = []

  const [resource] = deployment.resources[sliderInstanceType]

  if (hasOngoingResourceConfigurationChange({ resource })) {
    return problems
  }

  const version = getVersion({ deployment })

  const prettyName = <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />

  if (isHiddenResource({ resource })) {
    problems.push({
      kind: sliderInstanceType,
      id: `${sliderInstanceType}-hidden`,
      level: `warning`,
      iconType: `eyeClosed`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.slider-hidden'
          defaultMessage='{prettyName} is hidden'
          values={{ prettyName }}
        />
      ),
    })
  }

  const shouldUpgrade = shouldUpgradeSliderVersion({ deployment, sliderInstanceType })

  if (shouldUpgrade) {
    const overviewUrl = deploymentUrl(deployment.id)

    problems.push({
      kind: sliderInstanceType,
      id: `${sliderInstanceType}-upgrade-to-match-es`,
      level: `info`,
      iconType: `alert`,
      message: (
        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='deployment-health-problems.slider-needs-to-be-upgraded'
              defaultMessage='Deployment upgrade failed. Could not upgrade {prettyName} to {recommendedVersion}.'
              values={{
                prettyName,
                recommendedVersion: getExpectedSliderVersion({ deployment }),
              }}
            />
          </EuiFlexItem>

          {!hideLinks && !isCurrentPath(overviewUrl) && (
            <EuiFlexItem grow={false}>
              <CuiLink to={overviewUrl}>
                <FormattedMessage
                  id='deployment-health-problems.deployment-upgrade-link'
                  defaultMessage='Go to the Overview page to upgrade'
                />
              </CuiLink>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      ),
    })
  }

  const instanceProblems = getInstanceProblems({
    kind: sliderInstanceType,
    kindName: prettyName,
    resource,
  })

  problems.push(...instanceProblems)

  if (!hasHealthyResourcePlan({ resource })) {
    problems.push({
      stickyLast: true,
      kind: sliderInstanceType,
      id: `${sliderInstanceType}-config-change-failed`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.slider-config-change-failed'
          defaultMessage='Latest change to {prettyName} configuration failed'
          values={{ prettyName }}
        />
      ),
      tooltip: hidePlanDetails
        ? null
        : getLatestPlanFailureMessage({ deployment, resource, resourceType: sliderInstanceType }),
    })
  }

  return problems
}

export function getEsInstanceBlockingProblems({ resource, instance }): Problem[] {
  if (instance.kind !== `elasticsearch`) {
    return []
  }

  const blockingProblems = getEsBlockingProblems({ resource })
  const instanceProblems = blockingProblems.filter(affectsInstance)
  const problems = instanceProblems.map(toRelevantFields)

  return problems

  function affectsInstance(problem: Problem): boolean {
    return Boolean(
      problem._meta && problem._meta.instances && problem._meta.instances.includes(instance.name),
    )
  }

  function toRelevantFields(problem: Problem): Problem {
    return omit(problem, [`helpText`, `_meta`])
  }
}

function getEsBlockingProblems({ resource }: { resource: ElasticsearchResourceInfo }): Problem[] {
  const problems: Problem[] = []

  if (!hasBlockingIssues({ resource })) {
    return problems
  }

  const clusterBlocks = getClusterBlockingIssues({ resource })
  const indexBlocks = getIndexBlockingIssues({ resource })

  walkBlocks(clusterBlocks, `cluster`)
  walkBlocks(indexBlocks, `index`)

  return problems

  function walkBlocks(blocks: ElasticsearchClusterBlockingIssueElement[], type) {
    blocks.forEach((block, index) => {
      const blockInstances = block.instances || []
      const blockedInstances = blockInstances.map((blockInstance) =>
        createInstanceDisplayName(blockInstance),
      )
      const { description } = block

      const blockError: BlockingErrorDescription | undefined = find(
        blockingErrors,
        (blockingError) => blockingError.matches(description),
      )

      const blockSuffixId = blockError ? blockError.id : index
      const blockMessage = (blockError && blockError.message) || description
      const blockLevel = (blockError && blockError.level) || `danger`

      problems.push({
        kind: `elasticsearch`,
        id: `es-${type}-locked-error-${blockSuffixId}`,
        iconType: `crossInACircleFilled`,
        level: blockLevel,
        message: blockMessage,
        helpText: isEmpty(blockedInstances) ? null : (
          <EuiFlexGroup gutterSize='s' alignItems='center'>
            <EuiFlexItem grow={false}>
              <FormattedMessage
                id='deployment-health-problems.affected-instances'
                defaultMessage='Affects'
              />
            </EuiFlexItem>

            {blockedInstances.map((blockedInstance) => (
              <EuiFlexItem grow={false} key={blockedInstance.replace(/\s+/g, '-')}>
                <EuiBadge color='hollow'>{blockedInstance}</EuiBadge>
              </EuiFlexItem>
            ))}
          </EuiFlexGroup>
        ),
        _meta: {
          instances: blockInstances,
        },
      })
    })
  }
}

function getInstanceProblems({
  resource,
  kind,
  kindName,
}: {
  resource: AnyResourceInfo
  kind: SliderInstanceType
  kindName: ReactElement
}): Problem[] {
  const problems: Problem[] = []

  if (!hasHealthyInstances({ resource })) {
    const { notRunning, totalReported } = countInstances({ resource })

    if (notRunning > 0) {
      const noneRunning = totalReported - notRunning <= 0

      if (noneRunning) {
        problems.push({
          kind,
          id: `${kind}-all-instances-unhealthy`,
          level: `danger`,
          message: (
            <FormattedMessage
              id='deployment-health-problems.all-instances-unhealthy'
              defaultMessage='No {kindName} instances are running'
              values={{ kindName }}
            />
          ),
        })
      } else {
        problems.push({
          kind,
          id: `${kind}-precise-amount-instances-unhealthy`,
          level: `danger`,
          message: (
            <FormattedMessage
              id='deployment-health-problems.precise-amount-instances-unhealthy'
              defaultMessage='{instances, plural, one {One} other {{instances}}} {kindName} {instances, plural, one {instance is} other {instances are}} not running'
              values={{ kindName, instances: notRunning }}
            />
          ),
        })
      }
    } else {
      problems.push({
        kind,
        id: `${kind}-some-instances-unhealthy`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.some-instances-unhealthy'
            defaultMessage='Some {kindName} instances are unhealthy'
            values={{ kindName }}
          />
        ),
      })
    }
  }

  return problems
}

function getSnapshotProblems({ resource }: { resource: ElasticsearchResourceInfo }): Problem[] {
  const problems: Problem[] = []

  if (hasHealthySnapshots({ resource })) {
    return problems
  }

  const latestSuccess = getLatestSnapshotSuccess({ resource })

  if (!hasEnabledSnapshots({ resource })) {
    if (getConfigForKey(`APP_PLATFORM`) === `ece`) {
      return problems
    }

    problems.push({
      kind: `elasticsearch`,
      id: `es-snapshots-are-disabled`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.es-snapshots-are-disabled'
          defaultMessage='Snapshots are disabled'
        />
      ),
    })
  } else if (hasSlm({ resource }) && hasSuspendedSnapshots({ resource })) {
    problems.push({
      kind: `elasticsearch`,
      id: `es-snapshots-slm-unexpectedly-suspended`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.es-snapshots-slm-unexpectedly-suspended'
          defaultMessage='SLM unexpectedly disabled'
        />
      ),
    })
  } else if (!hasRecentSnapshotSuccess({ resource })) {
    if (latestSuccess) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-snapshots-out-of-date-with-last-success`,
        level: `warning`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-snapshots-out-of-date-with-last-success'
            defaultMessage='Last successful snapshot was {lastSuccess}'
            values={{
              lastSuccess: <CuiTimeAgo date={moment(latestSuccess)} shouldCapitalize={false} />,
            }}
          />
        ),
      })
    } else if (isPendingInitialSnapshot({ resource })) {
      if (hasScheduledSnapshot({ resource })) {
        problems.push({
          kind: `elasticsearch`,
          id: `es-no-snapshots-but-hopefully-soon`,
          level: `info`,
          iconType: `clock`,
          message: (
            <FormattedMessage
              id='deployment-health-problems.es-initial-snapshot-scheduled'
              defaultMessage='Initial snapshot scheduled for {nextSnapshotAt}'
              values={{
                nextSnapshotAt: (
                  <CuiTimeAgo
                    date={moment(getScheduledSnapshotTime({ resource })!)}
                    shouldCapitalize={false}
                  />
                ),
              }}
            />
          ),
        })
      } else {
        problems.push({
          kind: `elasticsearch`,
          id: `es-no-snapshots-at-all`,
          level: `info`,
          iconType: `clock`,
          message: (
            <FormattedMessage
              id='deployment-health-problems.es-no-initial-snapshot'
              defaultMessage='No initial snapshot yet'
            />
          ),
        })
      }
    } else {
      problems.push({
        kind: `elasticsearch`,
        id: `es-snapshots-out-of-date`,
        level: `warning`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-snapshots-out-of-date'
            defaultMessage='Snapshots out of date'
          />
        ),
      })
    }
  } else if (!hasLatestSnapshotSuccess({ resource })) {
    if (latestSuccess) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-failed-with-last-success`,
        level: `warning`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-latest-snapshot-failed-with-last-success'
            defaultMessage='Last successful snapshot was {lastSuccess}'
            values={{
              lastSuccess: <CuiTimeAgo date={moment(latestSuccess)} shouldCapitalize={false} />,
            }}
          />
        ),
      })
    } else {
      problems.push({
        kind: `elasticsearch`,
        id: `es-latest-snapshot-failed`,
        level: `warning`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-latest-snapshot-failed'
            defaultMessage='Latest snapshot attempt failed'
          />
        ),
      })
    }
  } else {
    problems.push({
      kind: `elasticsearch`,
      id: `es-snapshot-unhealthy`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.es-snapshots-are-unhealthy'
          defaultMessage='Snapshots are unhealthy'
        />
      ),
    })
  }

  return problems
}

export function isDeploymentHealthy({ deployment }: { deployment: StackDeployment }): boolean {
  const [problems] = getDeploymentHealthProblems({ deployment })
  const emptyProblems = problems.length === 0

  return emptyProblems
}

export function getDeploymentEuiHealthColor({
  deployment,
}: {
  deployment?: StackDeployment
}): EuiHealthColor {
  const [problems] = getDeploymentHealthProblems({ deployment })

  if (find(problems, { id: `deployment-hidden` })) {
    return `subdued`
  }

  if (find(problems, { id: `deployment-terminated` })) {
    return `subdued`
  }

  const color = getEuiHealthColor(problems)
  return color
}

function getLatestPlanFailureMessage({
  deployment,
  resourceType,
  resource,
}: {
  deployment: StackDeployment
  resourceType: SliderInstanceType
  resource: AnyResourceInfo
}): ReactNode {
  const planAttempt = getLastPlanAttempt({ deployment, sliderInstanceType: resourceType })

  if (!planAttempt) {
    return null
  }

  const parsedError = parseConfigurationChangeError({
    resourceType,
    resource,
    planAttempt,
    linkify: false,
  })

  if (!parsedError) {
    return null
  }

  const { description, title } = parsedError

  return description || title
}

export { parseConfigurationChangeError }
