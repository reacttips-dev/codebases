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

import { find, get, isEmpty, last, omit, remove } from 'lodash'

import moment from 'moment'

import React, { Fragment, ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiBadge, EuiCode, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { CuiLink } from '../../cui/Link'
import { CuiTimeAgo } from '../../cui/TimeAgo'

import DocLink from '../../components/DocLink'

import { createInstanceDisplayName } from '../../reducers/clusters/createCluster'

import isSystemDeploymentUpgradeRecommended, {
  getRecommendedVersion,
} from '../isSystemDeploymentUpgradeRecommended'

import canUpgradeKibana, { getExpectedKibanaVersion } from '../kibanaNeedsUpgradeCheck'
import canUpgradeApm, { getExpectedApmVersion } from '../apmClusters/apmNeedsUpgradeCheck'

import { hasInconsistentUserSettings } from '../deployments/userSettings'

import {
  EuiHealthColor,
  getEuiHealthColor,
  PreparedProblems,
  prepareProblems,
  Problem,
} from './problems'

import { isCurrentPath } from '../urls'
import {
  sliderActivityUrl,
  deploymentActivityElasticsearchUrl,
  deploymentActivityUrl,
  deploymentEditUrl,
  deploymentUrl,
  resolveDeploymentUrlForEsCluster,
} from '../urlBuilder'

import { describePlanAttemptSource, describePlanAttemptStep } from '../plan'

import { getConfigForKey, isFeatureActivated } from '../../store'

import Feature from '../feature'

import {
  ApmCluster,
  AsyncRequestState,
  ElasticsearchCluster,
  KibanaCluster,
  PlanAttempt,
} from '../../types'

import { ClusterSnapshotSettings, ElasticsearchClusterBlockingIssueElement } from '../api/v1/types'

type BlockingErrorDescription = {
  apiError: string
  id: string
  message: ReactElement
}

const blockingErrors: BlockingErrorDescription[] = [
  {
    apiError: `index read-only / allow delete (api)`,
    id: `readonly-index`,
    message: (
      <FormattedMessage
        id='deployment-health-problems.es-readonly-index'
        defaultMessage='An Elasticsearch index is in a read-only state and only allows deletes'
      />
    ),
  },
  {
    apiError: `no master`,
    id: `no-master`,
    message: (
      <FormattedMessage
        id='deployment-health-problems.es-no-master'
        defaultMessage='No master node reported'
      />
    ),
  },
  {
    apiError: `state not recovered / initialized`,
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
  kibanaCluster,
  apmCluster,
  cancelEsPlanRequest,
  cancelApmPlanRequest,
  cancelKibanaPlanRequest,
  hideLinks,
  hideActivityBits,
  apmPlans,
  esPlans,
  kibanaPlans,
}: {
  deployment?: ElasticsearchCluster
  kibanaCluster?: KibanaCluster
  apmCluster?: ApmCluster
  hideLinks?: boolean
  hideActivityBits?: boolean
  cancelEsPlanRequest?: AsyncRequestState
  cancelKibanaPlanRequest?: AsyncRequestState
  cancelApmPlanRequest?: AsyncRequestState
  apmPlans?: PlanAttempt[]
  esPlans?: PlanAttempt[]
  kibanaPlans?: PlanAttempt[]
}): PreparedProblems {
  const problems: Problem[] = []
  const mainDeployment = deployment || kibanaCluster || apmCluster

  // no problems if there's no deployments to base problems off of
  if (!mainDeployment) {
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

  if (deployment) {
    problems.push(
      ...getConfigurationChangeProblems({
        cluster: deployment,
        cancelPlanRequest: cancelEsPlanRequest,
        hideActivity,
      }),
    )

    problems.push(
      ...getElasticsearchHealthProblems({
        deployment,
        esPlans,
        hideLinks,
      }),
    )
  }

  if (kibanaCluster) {
    problems.push(
      ...getConfigurationChangeProblems({
        cluster: kibanaCluster,
        cancelPlanRequest: cancelKibanaPlanRequest,
        hideActivity,
      }),
    )

    problems.push(
      ...getKibanaHealthProblems({
        kibanaCluster,
        kibanaPlans,
        deployment,
        hideLinks,
      }),
    )
  }

  if (apmCluster) {
    problems.push(
      ...getConfigurationChangeProblems({
        cluster: apmCluster,
        cancelPlanRequest: cancelApmPlanRequest,
        hideActivity,
      }),
    )

    problems.push(
      ...getApmHealthProblems({
        apmCluster,
        apmPlans,
        deployment,
        hideLinks,
      }),
    )
  }

  if (mainDeployment && mainDeployment.isHidden) {
    problems.push({
      sticky: true,
      kind: `deployment`,
      id: `deployment-hidden`,
      level: `warning`,
      iconType: `eyeClosed`,
      message: mainDeployment.hiddenTimestamp ? (
        <FormattedMessage
          id='deployment-health-problems.deployment-hidden-since'
          defaultMessage='Deployment hidden {when}'
          values={{
            when: (
              <CuiTimeAgo date={moment(mainDeployment.hiddenTimestamp)} shouldCapitalize={false} />
            ),
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

  if (deployment && deployment.isLocked) {
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

  return prepareProblems(problems)
}

function getCreationProblems({
  deployment,
  hideLinks,
}: {
  deployment?: ElasticsearchCluster
  hideLinks?: boolean
}): Problem[] {
  const problems: Problem[] = []

  if (!deployment) {
    return problems
  }

  const { stackDeploymentId, plan } = deployment

  if (!plan || !plan.isCreating) {
    return problems
  }

  // even if it's being created, an unhealthy plan needs a warning sign.
  if (!plan.healthy) {
    return problems
  }

  // a new deployment has no business being `hidden`, thus we'll assume create failed.
  if (get(deployment, [`settings`, `metadata`, `hidden`]) === true) {
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
      <EuiFlexGroup gutterSize='s' alignItems='center'>
        <EuiFlexItem grow={false}>
          <FormattedMessage
            id='deployment-health-problems.deployment-being-created'
            defaultMessage='(takes about five minutes)'
          />
        </EuiFlexItem>

        {hideLinks || (
          <EuiFlexItem grow={false}>
            <CuiLink to={deploymentActivityElasticsearchUrl(stackDeploymentId!)}>
              <FormattedMessage
                id='deployment-health-problems.go-to-activity'
                defaultMessage='Go to Activity'
              />
            </CuiLink>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    ),
  })

  return problems
}

function getOverridingProblems({ deployment }: { deployment?: ElasticsearchCluster }): Problem[] {
  const problems: Problem[] = []

  if (!deployment) {
    return problems
  }

  if (hasPendingChanges(deployment)) {
    return problems
  }

  if (deployment.isInitialPlanFailed) {
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
  cluster,
  cancelPlanRequest,
  hideActivity,
}: {
  cluster?: ElasticsearchCluster | KibanaCluster | ApmCluster
  cancelPlanRequest?: AsyncRequestState
  hideActivity?: boolean
}) {
  const problems: Problem[] = []

  if (!cluster) {
    return problems
  }

  const { kind } = cluster
  const clusterIconType = getClusterIcon(kind)
  const changeset = getConfigurationChangeset({ cluster, cancelPlanRequest })

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

  const message = (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      <EuiFlexItem grow={false}>
        <div data-test-id='pendingPlan-message'>{changeset.description}</div>
      </EuiFlexItem>

      {hideActivity || (
        <EuiFlexItem grow={false}>
          <CuiLink to={getClusterActivityLink({ cluster })}>
            <FormattedMessage
              id='deployment-health-problems.go-to-activity'
              defaultMessage='Go to Activity'
            />
          </CuiLink>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  )

  problems.push({
    kind,
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
  cluster,
  cancelPlanRequest,
}: {
  cluster: ElasticsearchCluster | KibanaCluster | ApmCluster
  cancelPlanRequest?: AsyncRequestState
}): {
  id: string
  description: ReactNode
  'data-test-id': string
} | null {
  const { kind, plan } = cluster
  const clusterKind = getClusterKind(kind)

  if (cluster.isForceRestarting) {
    return {
      id: `force-restarting-${kind}`,
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

  if (cluster.isRestarting) {
    return {
      id: `restarting-${kind}`,
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

  if (cluster.isStopping) {
    return {
      id: `terminating-${kind}`,
      description: (
        <FormattedMessage
          id='deployment-health-problems.terminating-deployment'
          defaultMessage='Terminating {clusterKind}'
          values={{ clusterKind }}
        />
      ),
      'data-test-id': `deploymentStatus-stoppingPlan`,
    }
  }

  if (plan.waitingForPending) {
    return {
      id: `changing-${kind}-configuration-imminently`,
      description: (
        <FormattedMessage
          id='deployment-health-problems.deployment-configuration-change-started'
          defaultMessage='Initializing configuration change'
        />
      ),
      'data-test-id': `pendingPlan-waitingForStatus`,
    }
  }

  if (plan.isPending) {
    return {
      id: `changing-${kind}-configuration-now`,
      description: describePendingChange(),
      'data-test-id': `pendingPlan-progress`,
    }
  }

  return null

  function describePendingChange() {
    // Guard against `_raw` being undefined. This code would benefit from
    // being properly typed - see https://github.com/elastic/cloud/pull/31645#discussion_r278156583
    const { pendingSource } = cluster._raw || { pendingSource: undefined }
    const { messages } = plan.status || { messages: undefined }
    const lastMessage = last(messages)
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

    if (lastMessage) {
      const stepInfo = describePlanAttemptStep(lastMessage)
      return stepInfo.value
    }

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
  cluster,
}: {
  cluster: ElasticsearchCluster | KibanaCluster | ApmCluster
}) {
  const { kind, stackDeploymentId } = cluster

  if (kind) {
    return sliderActivityUrl(stackDeploymentId!, kind)
  }

  return deploymentActivityUrl(stackDeploymentId!)
}

function getClusterIcon(kind) {
  if (kind === `apm`) {
    return `logoObservability`
  }

  if (kind === `kibana`) {
    return `logoKibana`
  }

  return `logoElasticsearch`
}

function getClusterKind(kind) {
  if (kind === `apm`) {
    return (
      <FormattedMessage id='deployment-health-problems.apm-cluster-kind' defaultMessage='APM' />
    )
  }

  if (kind === `kibana`) {
    return (
      <FormattedMessage
        id='deployment-health-problems.kibana-cluster-kind'
        defaultMessage='Kibana'
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
  esPlans,
  hideLinks,
}: {
  deployment: ElasticsearchCluster
  esPlans?: PlanAttempt[]
  hideLinks?: boolean
}): Problem[] {
  const hidePlanDetails = isFeatureActivated(Feature.hidePlanDetails)

  const {
    snapshots,
    instances,
    plan,
    master,
    shards,
    blocks,
    remoteClusters,
    regionId,
    stackDeploymentId,
    settings,
  } = deployment

  const problems: Problem[] = []

  if (hasPendingChanges(deployment)) {
    return problems
  }

  if (deployment.isStopped) {
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

  const healthyMasters = master.healthy
  const masterCount = master.count
  const instancesWithNoMaster = master.instancesWithNoMaster

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
                  {instancesWithNoMaster.map((instanceWithNoMaster) => (
                    <EuiCode key={instanceWithNoMaster}>{instanceWithNoMaster}</EuiCode>
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
    instances,
  })

  problems.push(...instanceProblems)

  const nodeConfigurations = deployment._raw?.plan?.cluster_topology
  const inconsistentUserSettings = hasInconsistentUserSettings({ nodeConfigurations })

  if (inconsistentUserSettings) {
    problems.push({
      kind: `elasticsearch`,
      id: `es-user-settings-diff`,
      level: `warning`,
      'data-test-id': 'user-settings-diff',
      message: (
        <FormattedMessage
          id='deployment-health-problems.user-settings-diff-message'
          defaultMessage='User settings are different across Elasticsearch instances. {learnMore}'
          values={{
            learnMore: (
              <DocLink link='esUserSettingsDocLink'>
                <FormattedMessage
                  id='deployment-health-problems.user-settings.learn-more'
                  defaultMessage='Learn more'
                />
              </DocLink>
            ),
          }}
        />
      ),
      helpText: (
        <FormattedMessage
          id='deployment-health-problems.user-settings-diff-help'
          defaultMessage='This could lead to issues with your deployment. {editLink}'
          values={{
            editLink: (
              <CuiLink to={deploymentEditUrl(deployment.stackDeploymentId!)}>
                <FormattedMessage
                  id='deployment-health-problems.go-to-edit-page'
                  defaultMessage='Go to Edit page'
                />
              </CuiLink>
            ),
          }}
        />
      ),
    })
  }

  if (!plan.healthy) {
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
      tooltip: hidePlanDetails ? null : get(last(esPlans), [`status`, `error`, `message`], null),
    })
  }

  if (!shards.healthy) {
    if (shards.count.unavailable > 0) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-shards-unavailable`,
        level: `danger`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.es-shards-unavailable'
            defaultMessage='{count, plural, one {An} other {{count}}} Elasticsearch {count, plural, one {shard} other {shards}} unavailable'
            values={{ count: shards.count.unavailable }}
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

  const snapshotProblems = getSnapshotProblems({
    snapshots,
    settings: settings.snapshot,
  })

  problems.push(...snapshotProblems)
  problems.push(...getEsBlockingProblems({ blocks }))

  if (remoteClusters && remoteClusters.enabled && !remoteClusters.healthy) {
    const problemRemoteIds = remoteClusters.list
      .filter((remote) => !remote.compatible)
      .map((remote) => remote.id)

    if (problemRemoteIds.length) {
      problems.push({
        kind: `elasticsearch`,
        id: `es-remote-cluster-compatibility-issues`,
        level: `warning`,
        iconType: `offline`,
        message: (
          <FormattedMessage
            id='deployment-health-problems.remote-cluster-compatibility-issues'
            defaultMessage='Incompatible remote {amount, plural, one {cluster} other {clusters}}: {clusters} must be upgraded to include in search'
            values={{
              amount: problemRemoteIds.length,
              clusters: (
                <span>
                  {problemRemoteIds.map((clusterId) => (
                    <EuiCode key={clusterId}>
                      {hideLinks ? (
                        clusterId.slice(0, 6)
                      ) : (
                        <CuiLink
                          to={resolveDeploymentUrlForEsCluster(deploymentUrl, regionId, clusterId)}
                        >
                          {clusterId.slice(0, 6)}
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

  if (isSystemDeploymentUpgradeRecommended(deployment)) {
    const recommendedVersion = getRecommendedVersion()

    problems.push({
      kind: `elasticsearch`,
      id: `es-system-upgrade-recommended`,
      level: `info`,
      message: (
        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='deployment-health-problems.es-system-upgrade-recommended'
              defaultMessage='Upgrade Elasticsearch to version {recommendedVersion} or above'
              values={{ recommendedVersion }}
            />
          </EuiFlexItem>

          {hideLinks || (
            <EuiFlexItem grow={false}>
              <CuiLink to={deploymentUrl(stackDeploymentId!)}>
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

function getKibanaHealthProblems({
  kibanaCluster,
  kibanaPlans,
  deployment,
  hideLinks,
}: {
  kibanaCluster: KibanaCluster
  kibanaPlans?: PlanAttempt[]
  deployment?: ElasticsearchCluster
  hideLinks?: boolean
}): Problem[] {
  const hidePlanDetails = isFeatureActivated(Feature.hidePlanDetails)
  const problems: Problem[] = []

  if (hasPendingChanges(kibanaCluster)) {
    return problems
  }

  if (
    kibanaCluster.settings != null &&
    kibanaCluster.settings.metadata != null &&
    kibanaCluster.settings.metadata.hidden
  ) {
    problems.push({
      kind: `kibana`,
      id: `kibana-hidden`,
      level: `warning`,
      iconType: `eyeClosed`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.kibana-hidden'
          defaultMessage='Kibana is hidden'
        />
      ),
    })
  }

  if (deployment && canUpgradeKibana(kibanaCluster, deployment)) {
    const overviewUrl = deploymentUrl(deployment.stackDeploymentId!)

    problems.push({
      kind: `kibana`,
      id: `kibana-upgrade-to-match-es`,
      level: `info`,
      message: (
        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='deployment-health-problems.kibana-needs-to-be-upgraded'
              defaultMessage='Upgrade Kibana to match Elasticsearch version {recommendedVersion}'
              values={{ recommendedVersion: getExpectedKibanaVersion(kibanaCluster, deployment) }}
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

  const { instances } = kibanaCluster

  const instanceProblems = getInstanceProblems({
    kind: `kibana`,
    kindName: (
      <FormattedMessage
        id='deployment-health-problems.kibana-instance-kind'
        defaultMessage='Kibana'
      />
    ),
    instances,
  })

  problems.push(...instanceProblems)

  if (!kibanaCluster.plan.healthy) {
    problems.push({
      stickyLast: true,
      kind: `kibana`,
      id: `kibana-config-change-failed`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.kibana-config-change-failed'
          defaultMessage='Latest change to Kibana configuration failed'
        />
      ),
      tooltip: hidePlanDetails
        ? null
        : get(last(kibanaPlans), [`status`, `error`, `message`], null),
    })
  }

  return problems
}

function getApmHealthProblems({
  apmCluster,
  apmPlans,
  deployment,
  hideLinks,
}: {
  apmCluster: ApmCluster
  apmPlans?: PlanAttempt[]
  deployment?: ElasticsearchCluster
  hideLinks?: boolean
}): Problem[] {
  const hidePlanDetails = isFeatureActivated(Feature.hidePlanDetails)
  const problems: Problem[] = []

  if (hasPendingChanges(apmCluster)) {
    return problems
  }

  if (deployment && canUpgradeApm(apmCluster, deployment)) {
    const overviewUrl = deploymentUrl(deployment.stackDeploymentId!)

    problems.push({
      kind: `apm`,
      id: `apm-upgrade-to-match-es`,
      level: `info`,
      message: (
        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='deployment-health-problems.apm-needs-to-be-upgraded'
              defaultMessage='Upgrade APM to match Elasticsearch version {recommendedVersion}'
              values={{ recommendedVersion: getExpectedApmVersion(apmCluster, deployment) }}
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

  const { instances } = apmCluster

  const instanceProblems = getInstanceProblems({
    kind: `apm`,
    kindName: (
      <FormattedMessage id='deployment-health-problems.apm-instance-kind' defaultMessage='APM' />
    ),
    instances,
  })

  problems.push(...instanceProblems)

  if (!apmCluster.plan.healthy) {
    problems.push({
      stickyLast: true,
      kind: `apm`,
      id: `apm-config-change-failed`,
      level: `warning`,
      message: (
        <FormattedMessage
          id='deployment-health-problems.apm-config-change-failed'
          defaultMessage='Latest change to APM configuration failed'
        />
      ),
      tooltip: hidePlanDetails ? null : get(last(apmPlans), [`status`, `error`, `message`], null),
    })
  }

  return problems
}

export function getEsInstanceBlockingProblems({
  instance,
  blocks,
}: {
  instance
  blocks: ElasticsearchCluster['blocks']
}): Problem[] {
  if (instance.kind !== `elasticsearch`) {
    return []
  }

  const blockingProblems = getEsBlockingProblems({ blocks })
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

function getEsBlockingProblems({ blocks }: { blocks: ElasticsearchCluster['blocks'] }): Problem[] {
  const problems: Problem[] = []

  if (!blocks || blocks.healthy) {
    return problems
  }

  walkBlocks(`cluster`)
  walkBlocks(`indices`)

  return problems

  function walkBlocks(type) {
    if (!Array.isArray(blocks[type])) {
      return
    }

    blocks[type].forEach((block: ElasticsearchClusterBlockingIssueElement) => {
      const blockInstances = block.instances || []
      const blockedInstances = blockInstances.map((blockInstance) =>
        createInstanceDisplayName(blockInstance),
      )
      const apiError = block.description
      const blockError = find(blockingErrors, { apiError }) as BlockingErrorDescription | undefined
      const errorMessage = blockError ? blockError.message : apiError
      const errorId = blockError ? `-${blockError.id}` : ``

      problems.push({
        kind: `elasticsearch`,
        id: `es-${type}-locked-error${errorId}`,
        level: `danger`,
        iconType: `crossInACircleFilled`,
        message: errorMessage,
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
  kind,
  kindName,
  instances,
}: {
  kind: 'elasticsearch' | 'apm' | 'kibana'
  kindName: ReactElement
  instances:
    | ElasticsearchCluster['instances']
    | KibanaCluster['instances']
    | ApmCluster['instances']
  deployment?: ElasticsearchCluster
}): Problem[] {
  const problems: Problem[] = []

  if (!instances.healthy) {
    if (instances.count.notRunning > 0) {
      const noneRunning = instances.count.total - instances.count.notRunning <= 0

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
              values={{ kindName, instances: instances.count.notRunning }}
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

function getSnapshotProblems({
  snapshots,
  settings,
}: {
  snapshots: ElasticsearchCluster['snapshots']
  settings?: ClusterSnapshotSettings
}): Problem[] {
  const problems: Problem[] = []
  const { healthy, enabled, status, latest } = snapshots

  if (!healthy) {
    if (!enabled) {
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
    } else if (settings?.slm && Object.keys(settings?.suspended || {}).length > 0) {
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
    } else if (!status.hasRecentEnoughSuccess) {
      if (status.latestSuccessAt != null) {
        problems.push({
          kind: `elasticsearch`,
          id: `es-snapshots-out-of-date-with-last-success`,
          level: `warning`,
          message: (
            <FormattedMessage
              id='deployment-health-problems.es-snapshots-out-of-date-with-last-success'
              defaultMessage='Last successful snapshot was {lastSuccess}'
              values={{
                lastSuccess: (
                  <CuiTimeAgo date={moment(status.latestSuccessAt)} shouldCapitalize={false} />
                ),
              }}
            />
          ),
        })
      } else if (status.pendingInitialSnapshot) {
        if (status.nextSnapshotAt) {
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
                    <CuiTimeAgo date={moment(status.nextSnapshotAt!)} shouldCapitalize={false} />
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
    } else if (!latest.success) {
      if (status.latestSuccessAt != null) {
        problems.push({
          kind: `elasticsearch`,
          id: `es-failed-with-last-success`,
          level: `warning`,
          message: (
            <FormattedMessage
              id='deployment-health-problems.es-latest-snapshot-failed-with-last-success'
              defaultMessage='Last successful snapshot was {lastSuccess}'
              values={{
                lastSuccess: (
                  <CuiTimeAgo date={moment(status.latestSuccessAt)} shouldCapitalize={false} />
                ),
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
  }

  return problems
}

export function getDeploymentEuiHealthColor({
  deployment,
  kibanaCluster,
  apmCluster,
}: {
  deployment?: ElasticsearchCluster
  kibanaCluster?: KibanaCluster
  apmCluster?: ApmCluster
}): EuiHealthColor {
  const [problems] = getDeploymentHealthProblems({ deployment, kibanaCluster, apmCluster })

  if (find(problems, { id: `deployment-hidden` })) {
    return `subdued`
  }

  if (find(problems, { id: `deployment-terminated` })) {
    return `subdued`
  }

  const color = getEuiHealthColor(problems)
  return color
}

function hasPendingChanges(cluster: ElasticsearchCluster | KibanaCluster | ApmCluster) {
  return cluster.plan && (cluster.plan.waitingForPending || cluster.plan.isPending)
}
