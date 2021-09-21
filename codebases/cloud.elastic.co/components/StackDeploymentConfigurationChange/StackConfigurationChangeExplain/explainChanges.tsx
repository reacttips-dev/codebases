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

import { flatMap, get, isEmpty, isEqual } from 'lodash'

import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFormHelpText, EuiTextColor } from '@elastic/eui'

import RestoreSnapshotChange from './ExplainChanges/RestoreSnapshotChange'

import StrategyExplained from '../../StrategyExplained'

import explainVacateAllocatorChanges from './explainVacateAllocatorChanges'
import explainVacateInstancesChanges from './explainVacateInstancesChanges'

import { getProductName } from './polyglotTopology'

import { getSupportedSliderInstanceTypes } from '../../../lib/sliders'
import { isExplicitStrategy, isAutodetect } from '../../../lib/clusterStrategies'

import { ExplainedChange, ExplainedChangeType, ResourceChange } from './types'
import { AnyPlan, PlanAttribution, SliderInstanceType } from '../../../types'

import {
  ApmPlan,
  AppSearchPlan,
  ElasticsearchClusterPlan,
  EnterpriseSearchPlan,
  InstanceConfiguration,
  KibanaClusterPlan,
} from '../../../lib/api/v1/types'

import { getPlanVersion } from '../../../lib/stackDeployments'
import { diffPlan } from '../../../lib/stackDeployments/planDiffs'
import { formatDifferences } from './formatters'
import { diffTopology } from '../../../lib/stackDeployments/planDiffs/topology'

export type Props = {
  apmPlanAttribution?: PlanAttribution
  apmPlanPrevSource?: ApmPlan | null
  apmPlanSource?: ApmPlan | null
  appsearchPlanAttribution?: PlanAttribution
  appsearchPlanPrevSource?: AppSearchPlan | null
  appsearchPlanSource?: AppSearchPlan | null
  elasticsearchClusterId?: string
  elasticsearchPlanAttribution?: PlanAttribution
  elasticsearchPlanPrevSource?: ElasticsearchClusterPlan | null
  elasticsearchPlanSource?: ElasticsearchClusterPlan | null
  enterprise_searchPlanAttribution?: PlanAttribution
  enterprise_searchPlanPrevSource?: EnterpriseSearchPlan | null
  enterprise_searchPlanSource?: EnterpriseSearchPlan | null
  instanceConfigurations: InstanceConfiguration[]
  isPastHistory: boolean
  kibanaPlanAttribution?: PlanAttribution
  kibanaPlanPrevSource?: KibanaClusterPlan | null
  kibanaPlanSource?: KibanaClusterPlan | null
  pruneOrphans?: boolean
  regionId?: string
}

export function explainTopologyChanges({
  type,
  newSource,
  oldSource,
  instanceConfigurations,
}: {
  type: SliderInstanceType
  newSource?: AnyPlan
  oldSource?: AnyPlan
  instanceConfigurations: InstanceConfiguration[]
}): ExplainedChange[] {
  const differences = diffPlan(
    {
      instanceConfigurations,
      sliderInstanceType: type,
      pruneOrphans: false,
      current: oldSource,
      next: newSource,
    },
    [diffTopology],
  )
  return formatDifferences({ differences, isPastHistory: false })
}

export default function explainChanges(props: Props): ExplainedChange[] {
  const {
    apmPlanPrevSource,
    apmPlanSource,
    appsearchPlanPrevSource,
    appsearchPlanSource,
    elasticsearchClusterId,
    elasticsearchPlanPrevSource,
    elasticsearchPlanSource,
    enterprise_searchPlanPrevSource,
    enterprise_searchPlanSource,
    instanceConfigurations,
    isPastHistory,
    kibanaPlanPrevSource,
    kibanaPlanSource,
    pruneOrphans,
    regionId,
  } = props

  const resourceChanges: ResourceChange[] = [
    {
      sliderInstanceType: `elasticsearch`,
      oldSource: elasticsearchPlanPrevSource,
      newSource: elasticsearchPlanSource,
    },
    {
      sliderInstanceType: `kibana`,
      oldSource: kibanaPlanPrevSource,
      newSource: kibanaPlanSource,
    },
    {
      sliderInstanceType: `apm`,
      oldSource: apmPlanPrevSource,
      newSource: apmPlanSource,
    },
    {
      sliderInstanceType: `appsearch`,
      oldSource: appsearchPlanPrevSource,
      newSource: appsearchPlanSource,
    },
    {
      sliderInstanceType: `enterprise_search`,
      oldSource: enterprise_searchPlanPrevSource,
      newSource: enterprise_searchPlanSource,
    },
  ]

  const differences = flatMap(
    resourceChanges.map(({ sliderInstanceType, oldSource, newSource }) =>
      diffPlan({
        instanceConfigurations,
        sliderInstanceType,
        pruneOrphans: pruneOrphans || false,
        current: oldSource,
        next: newSource,
      }),
    ),
  )

  const changes = [...formatDifferences({ differences, isPastHistory }), ...getAttribution()]

  considerNoOpChanges({
    changes,
    apmPlanPrevSource,
    apmPlanSource,
    appsearchPlanPrevSource,
    appsearchPlanSource,
    elasticsearchPlanPrevSource,
    elasticsearchPlanSource,
    enterprise_searchPlanPrevSource,
    enterprise_searchPlanSource,
    kibanaPlanPrevSource,
    kibanaPlanSource,
  })

  return changes

  function getAttribution(): ExplainedChange[] {
    const attribution = getSupportedSliderInstanceTypes().find(
      (sliderInstanceType) => !!props[`${sliderInstanceType}PlanSource`],
    )

    return attribution
      ? getClusterOperations({
          type: attribution,
          newSource: props[`${attribution}PlanSource`],
          attribution: props[`${attribution}PlanAttribution`],
        })
      : []
  }

  function getClusterOperations({ type, newSource, attribution }): ExplainedChange[] {
    const clusterOperations: ExplainedChange[] = []

    if (attribution && attribution.action === `apm.reset-secret-token`) {
      clusterOperations.push({
        id: `apm-server-token-reset`,
        type,
        message: (
          <FormattedMessage
            id='explain-changes.reset-secret-apm-token'
            defaultMessage='Reset the APM Server secret token'
          />
        ),
      })
    } else if (get(newSource, [`transient`, `plan_configuration`, `cluster_reboot`]) === `forced`) {
      clusterOperations.push({
        id: `${type}-force-restart`,
        type,
        message: (
          <FormattedMessage
            id='explain-changes.cluster-reboot-forced'
            defaultMessage='Forcefully restart the deployment'
          />
        ),
      })
    }

    const snapshotName = get(newSource, [`transient`, `restore_snapshot`, `snapshot_name`])

    if (snapshotName) {
      clusterOperations.push({
        id: `${type}-restore-snapshot`,
        testParams: [snapshotName],
        type,
        message: (
          <RestoreSnapshotChange
            regionId={regionId!}
            esClusterId={elasticsearchClusterId}
            snapshotName={snapshotName}
            restoreFromEsClusterId={newSource.transient.restore_snapshot.source_cluster_id}
          />
        ),
      })
    }

    if (get(newSource, [`transient`, `plan_configuration`, `skip_snapshot`]) === true) {
      clusterOperations.push({
        id: `${type}-skip-snapshot`,
        type,
        message: (
          <FormattedMessage
            id='explain-changes.skip-snapshot'
            defaultMessage='Skip snapshot before applying deployment configuration change'
          />
        ),
      })
    }

    if (get(newSource, [`transient`, `plan_configuration`, `skip_data_migration`]) === true) {
      clusterOperations.push({
        id: `${type}-skip-data-migration`,
        type,
        message: (
          <FormattedMessage
            id='explain-changes.dont-migrate'
            defaultMessage="Don't attempt to gracefully move shards"
          />
        ),
      })
    }

    if (get(newSource, [`transient`, `plan_configuration`, `extended_maintenance`]) === true) {
      clusterOperations.push({
        id: `${type}-extended-maintenance`,
        type,
        message: (
          <Fragment>
            <FormattedMessage
              id='explain-changes.extended-maintenance'
              defaultMessage='Keep nodes in maintenance mode until configuration changes have been completed'
            />

            {isPastHistory ? null : (
              <EuiFormHelpText>
                <EuiTextColor color='danger'>
                  <FormattedMessage
                    id='explain-changes.extended-maintenance-danger'
                    defaultMessage='Access to all deployment instances will be blocked during configuration changes'
                  />
                </EuiTextColor>
              </EuiFormHelpText>
            )}
          </Fragment>
        ),
      })
    }

    if (get(newSource, [`transient`, `plan_configuration`, `reallocate_instances`]) === true) {
      clusterOperations.push({
        id: `${type}-reallocate-nodes`,
        type,
        message: (
          <FormattedMessage
            id='explain-changes.reallocate'
            defaultMessage='Create new containers for all nodes'
          />
        ),
      })
    }

    if (!isEmpty(get(newSource, [`transient`, `plan_configuration`, `move_allocators`]))) {
      clusterOperations.push(
        ...explainVacateAllocatorChanges({
          regionId: regionId!,
          type,
          moveAllocators: newSource.transient.plan_configuration.move_allocators,
          isPastHistory,
        }),
      )
    }

    if (!isEmpty(get(newSource, [`transient`, `plan_configuration`, `move_instances`]))) {
      clusterOperations.push(
        ...explainVacateInstancesChanges({
          regionId: regionId!,
          type,
          moveInstances: newSource.transient.plan_configuration.move_instances,
        }),
      )
    }

    const strategy = get(newSource, [`transient`, `strategy`], {})

    if (isExplicitStrategy(strategy) && !isAutodetect(strategy)) {
      clusterOperations.push({
        id: `${type}-strategy`,
        type,
        message: <StrategyExplained strategy={strategy} />,
      })
    }

    return clusterOperations
  }
}

function considerNoOpChanges(props: {
  changes: ExplainedChange[]
  elasticsearchPlanSource?: ElasticsearchClusterPlan | null
  elasticsearchPlanPrevSource?: ElasticsearchClusterPlan | null
  kibanaPlanSource?: KibanaClusterPlan | null
  kibanaPlanPrevSource?: KibanaClusterPlan | null
  apmPlanSource?: ApmPlan | null
  apmPlanPrevSource?: ApmPlan | null
  appsearchPlanSource?: AppSearchPlan | null
  appsearchPlanPrevSource?: AppSearchPlan | null
  enterprise_searchPlanSource?: EnterpriseSearchPlan | null
  enterprise_searchPlanPrevSource?: EnterpriseSearchPlan | null
}) {
  const { changes } = props

  getSupportedSliderInstanceTypes().forEach((sliderInstanceType) =>
    considerNoOpProductChanges({
      type: sliderInstanceType,
      changes,
      oldSource: props[`${sliderInstanceType}PlanPrevSource`],
      newSource: props[`${sliderInstanceType}PlanSource`],
    }),
  )
}

function considerNoOpProductChanges({
  changes,
  type,
  oldSource,
  newSource,
}: {
  changes: ExplainedChange[]
  type: ExplainedChangeType
  oldSource?: AnyPlan | null
  newSource?: AnyPlan | null
}) {
  if (typeof newSource === `undefined`) {
    return
  }

  const productChanges = changes.filter((change) => change.type === type)

  if (productChanges.length > 0) {
    return
  }

  const version = getPlanVersion({ plan: oldSource || newSource })

  const productName = getProductName({ type, version })

  if (isEqual(newSource, oldSource)) {
    changes.push({
      'data-test-id': `${type}-no-op`,
      id: `${type}-no-op`,
      type,
      message: (
        <FormattedMessage
          id='explain-changes.configuration-no-op'
          defaultMessage='No {productName} configuration changes'
          values={{ productName }}
        />
      ),
    })
  } else {
    changes.push({
      'data-test-id': `${type}-no-significant-op`,
      id: `${type}-no-significant-op`,
      type,
      message: (
        <FormattedMessage
          id='explain-changes.configuration-no-significant-op'
          defaultMessage='No significant {productName} configuration changes'
          values={{ productName }}
        />
      ),
    })
  }
}
