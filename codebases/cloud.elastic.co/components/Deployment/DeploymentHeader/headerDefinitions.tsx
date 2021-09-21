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

import { fromPairs, flatMap } from 'lodash'

import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router-dom'

import { IconType } from '@elastic/eui'

import {
  deploymentActivityCrumbs,
  deploymentActivitySliderCrumbs,
  deploymentApiConsoleCrumbs,
  deploymentEditAdvancedCrumbs,
  deploymentEditCrumbs,
  deploymentHeapDumpsCrumbs,
  deploymentOperationsCrumbs,
  deploymentOverviewCrumbs,
  deploymentSecurityCrumbs,
  deploymentSliderCrumbs,
  deploymentSnapshotsCrumbs,
  deploymentSnapshotCrumbs,
  deploymentLogsCrumbs,
  deploymentMetricsCrumbs,
  deploymentIndexCurationCrumbs,
  deploymentIlmMigrationCrumbs,
  deploymentGettingStartedCrumbs,
} from '../../../lib/crumbBuilder'

import {
  getSupportedSliderInstanceTypes,
  getSliderPrettyName,
  getSliderIconType,
} from '../../../lib/sliders'

import { RoutableBreadcrumb, VersionNumber } from '../../../types'

type QueryParams = {
  deploymentId: string
  snapshotName?: string
}

type HeaderDefinition = {
  breadcrumbs: RoutableBreadcrumb[]
  iconType?: IconType
  title: ReactNode
}

type HeaderDefinitions = {
  [matchPath: string]: HeaderDefinition
}

export function getHeaderDefinition({
  match,
  deploymentDisplayName,
  version,
}: {
  match: RouteComponentProps<QueryParams>['match']
  deploymentDisplayName?: string
  version?: VersionNumber | null
}): HeaderDefinition {
  const { deploymentId, snapshotName } = match.params

  const matchPath = match.path.replace(/^\/deployments\/:deploymentId(\/|$)/gi, `/`)

  const editHeaderDefinition = {
    title: <FormattedMessage id='deployment-header.edit' defaultMessage='Edit' />,
    breadcrumbs: deploymentEditCrumbs({ deploymentId, deploymentDisplayName }),
  }

  const editAdvancedHeaderDefinition = {
    title: <FormattedMessage id='deployment-header.advanced-edit' defaultMessage='Advanced edit' />,
    breadcrumbs: deploymentEditAdvancedCrumbs({ deploymentId }),
  }

  const headerDefinitions: HeaderDefinitions = {
    '/': {
      title: deploymentDisplayName,
      breadcrumbs: deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/edit': editHeaderDefinition,
    '/edit/advanced': editAdvancedHeaderDefinition,
    '/metrics': {
      title: <FormattedMessage id='deployment-header.performance' defaultMessage='Performance' />,
      breadcrumbs: deploymentMetricsCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/index-curation': {
      title: (
        <FormattedMessage id='deployment-header.index-curation' defaultMessage='Index Curation' />
      ),
      breadcrumbs: deploymentIndexCurationCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/logs-metrics': {
      title: (
        <FormattedMessage
          id='deployment-header.logging-and-monitoring'
          defaultMessage='Logs and metrics'
        />
      ),
      breadcrumbs: deploymentLogsCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/activity': {
      title: <FormattedMessage id='deployment-header.activity' defaultMessage='Activity' />,
      breadcrumbs: deploymentActivityCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/getting-started': {
      title: <FormattedMessage id='deployment-header.create' defaultMessage='Create' />,
      breadcrumbs: deploymentGettingStartedCrumbs({ deploymentId, deploymentDisplayName }),
    },
    ...fromPairs(
      flatMap(getSupportedSliderInstanceTypes(), (sliderInstanceType) => [
        [
          `/:sliderInstanceType(${sliderInstanceType})`,
          {
            title: <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />,
            iconType: getSliderIconType({ sliderInstanceType }),
            breadcrumbs: deploymentSliderCrumbs({
              deploymentId,
              sliderInstanceType,
              deploymentDisplayName,
              version,
            }),
          },
        ],
        [
          `/activity/${sliderInstanceType}`,
          {
            title: (
              <FormattedMessage
                id='deployment-header.slider-activity'
                defaultMessage='{sliderName} activity'
                values={{
                  sliderName: (
                    <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />
                  ),
                }}
              />
            ),
            iconType: getSliderIconType({ sliderInstanceType }),
            breadcrumbs: deploymentActivitySliderCrumbs({
              deploymentId,
              sliderInstanceType,
              deploymentDisplayName,
            }),
          },
        ],
      ]),
    ),
    '/elasticsearch/snapshots': {
      title: (
        <FormattedMessage
          id='deployment-header.elasticsearch-snapshots'
          defaultMessage='Snapshots'
        />
      ),
      iconType: getSliderIconType({ sliderInstanceType: `elasticsearch` }),
      breadcrumbs: deploymentSnapshotsCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/elasticsearch/snapshots/:snapshotName': {
      title: (
        <FormattedMessage id='deployment-header.elasticsearch-snapshot' defaultMessage='Snapshot' />
      ),
      iconType: getSliderIconType({ sliderInstanceType: `elasticsearch` }),
      breadcrumbs: deploymentSnapshotCrumbs({
        deploymentId,
        snapshotName: snapshotName!,
        deploymentDisplayName,
      }),
    },
    '/elasticsearch/console': {
      title: (
        <FormattedMessage
          id='deployment-header.elasticsearch-console'
          defaultMessage='API console'
        />
      ),
      iconType: getSliderIconType({ sliderInstanceType: `elasticsearch` }),
      breadcrumbs: deploymentApiConsoleCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/security': {
      title: <FormattedMessage id='deployment-header.security' defaultMessage='Security' />,
      breadcrumbs: deploymentSecurityCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/operations': {
      title: <FormattedMessage id='deployment-header.operations' defaultMessage='Operations' />,
      breadcrumbs: deploymentOperationsCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/operations/heap-dumps': {
      title: <FormattedMessage id='deployment-header.heap-dumps' defaultMessage='Heap dumps' />,
      breadcrumbs: deploymentHeapDumpsCrumbs({ deploymentId, deploymentDisplayName }),
    },
    '/migrate-to-index-lifecycle-management': {
      title: (
        <FormattedMessage id='deployment-header.ilm-migration' defaultMessage='Migrate to ILM' />
      ),
      breadcrumbs: deploymentIlmMigrationCrumbs({ deploymentId, deploymentDisplayName }),
    },
  }

  const headerDefinition = headerDefinitions[matchPath] || headerDefinitions[`/`]

  return headerDefinition
}
