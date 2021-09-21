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

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiCode } from '@elastic/eui'

import { DifferenceFormatter } from '../types'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'
import { LoggingPlanConfiguration, MetricsPlanConfiguration } from '../../../../lib/api/v1/types'
import { CuiLink } from '../../../../cui'
import { deploymentUrl, resolveDeploymentUrlForEsCluster } from '../../../../lib/urlBuilder'

interface ObservabilityDifferenceMeta {
  type: `log` | `metrics`
  currentDestination?:
    | LoggingPlanConfiguration['destination']
    | MetricsPlanConfiguration['destination']
  nextDestination?:
    | LoggingPlanConfiguration['destination']
    | MetricsPlanConfiguration['destination']
}

export const observabilityEnabledFormatter: DifferenceFormatter = {
  handles: `observability-enabled`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<ObservabilityDifferenceMeta>
    const { nextDestination, type } = meta || {}

    const id = `${target}-add-observability-${type}-setting-destination`

    if (nextDestination) {
      const { region, cluster_id } = nextDestination
      const url = resolveDeploymentUrlForEsCluster(deploymentUrl, region, cluster_id)
      return {
        id,
        type: target,
        message: (
          <FormattedMessage
            id='explain-changes.observability-settings-add'
            defaultMessage='Enable {type} delivery to {destination}'
            values={{
              destination: (
                <CuiLink to={url}>
                  <EuiCode>{cluster_id}</EuiCode>
                </CuiLink>
              ),
              type,
            }}
          />
        ),
      }
    }

    return {
      id,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.observability-settings-add-unknown-dest'
          defaultMessage='Enable {type} delivery'
          values={{
            type,
          }}
        />
      ),
    }
  },
}

export const observabilityDisabledFormatter: DifferenceFormatter = {
  handles: `observability-disabled`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<ObservabilityDifferenceMeta>
    const { type } = meta || {}

    return {
      id: `${target}-removed-observability-${type}-setting-destination`,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.observability-settings-remove'
          defaultMessage='Disable {type} delivery'
          values={{
            type,
          }}
        />
      ),
    }
  },
}

export const observabilityChangedFormatter: DifferenceFormatter = {
  handles: `observability-changed`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<ObservabilityDifferenceMeta>
    const { nextDestination, currentDestination, type } = meta || {}

    const id = `${target}-change-observability-${type}-setting-destination`

    if (nextDestination && currentDestination) {
      const { region: currentRegion, cluster_id: currentClusterID } = currentDestination
      const { region: nextRegion, cluster_id: nextClusterID } = nextDestination
      const currentUrl = resolveDeploymentUrlForEsCluster(
        deploymentUrl,
        currentRegion,
        currentClusterID,
      )
      const nextUrl = resolveDeploymentUrlForEsCluster(deploymentUrl, nextRegion, nextClusterID)
      return {
        id,
        type: target,
        message: (
          <FormattedMessage
            id='explain-changes.observability-settings-edit'
            defaultMessage='Change {type} destination from {currentDestination} to {nextDestination}'
            values={{
              currentDestination: (
                <del>
                  <CuiLink to={currentUrl}>
                    <EuiCode>{currentClusterID}</EuiCode>
                  </CuiLink>
                </del>
              ),
              nextDestination: (
                <CuiLink to={nextUrl}>
                  <EuiCode>{nextClusterID}</EuiCode>
                </CuiLink>
              ),
              type,
            }}
          />
        ),
      }
    }

    return {
      id,
      type: target,
      message: (
        <FormattedMessage
          id='explain-changes.observability-settings-edit-unknown-dest'
          defaultMessage='Change {type} destination'
          values={{
            type,
          }}
        />
      ),
    }
  },
}
