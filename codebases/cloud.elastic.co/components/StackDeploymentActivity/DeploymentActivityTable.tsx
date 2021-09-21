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

import React, { Fragment, FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiCallOut,
  EuiErrorBoundary,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from '@elastic/eui'

import { CuiTable, withErrorBoundary, CuiTableColumn } from '../../cui'

import AutoscalingBadge from '../Autoscaling/AutoscalingBadge'

import {
  StackConfigurationChangeActions,
  StackConfigurationChangeAttribution,
  StackConfigurationChangeError,
  StackConfigurationChangeIcon,
  StackConfigurationChangeId,
  StackConfigurationChangePendingSteps,
  StackConfigurationChangeRawPlanJson,
  StackConfigurationChangeStatus,
  StackConfigurationChangeStepDataMigration,
  StackConfigurationChangeSteps,
  StackConfigurationChangeStepSnapshot,
  StackConfigurationChangeSummary,
  StackConfigurationChangeTime,
} from '../StackDeploymentConfigurationChange'

import {
  getPlanAttemptId,
  getPlanVersion,
  isAutoscalingGeneratedPlanAttempt,
  isAutoscalingTerminationPlanAttempt,
} from '../../lib/stackDeployments'

import { isFeatureActivated } from '../../store'

import Feature from '../../lib/feature'

import { ResourceChangeAttempt } from '../../types'

import './deploymentActivityTable.scss'

type Props = {
  planAttempts: ResourceChangeAttempt[]
  emptyText: ReactElement
  totalCount: number
  filterByPlanAttempt?: (planAttemptId: string) => void
}

const DeploymentActivityTable: FunctionComponent<Props> = ({
  planAttempts,
  emptyText,
  totalCount,
  filterByPlanAttempt,
}) => {
  if (planAttempts === null || planAttempts.length === 0) {
    return <EuiCallOut color='primary' title={emptyText} />
  }

  const showAttributionColumn = !isFeatureActivated(Feature.showSimpleAttribution)

  const columns: Array<CuiTableColumn<ResourceChangeAttempt>> = [
    {
      mobile: {
        label: <FormattedMessage id='deployment-activity-table.status' defaultMessage='Status' />,
      },
      render: ({ resource, resourceType, planAttempt }) => (
        <StackConfigurationChangeStatus
          resource={resource}
          resourceType={resourceType}
          planAttempt={planAttempt}
        />
      ),
      sortKey: `healthy`,
      width: '40px',
    },
    {
      label: <FormattedMessage id='deployment-activity-table.change' defaultMessage='Change' />,
      render: ({ resourceType, resource, planAttempt }) => (
        <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
          <EuiFlexItem grow={false}>
            <StackConfigurationChangeIcon
              kind={resourceType}
              version={getPlanVersion({ plan: planAttempt.plan })}
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <StackConfigurationChangeId
              kind={resourceType}
              id={getPlanAttemptId({ resource, planAttempt })}
              onClick={filterByPlanAttempt}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
      sortKey: `started`,
      width: '165px',
    },

    {
      label: <FormattedMessage id='deployment-activity-table.summary' defaultMessage='Summary' />,
      render: ({ deployment, resource, resourceType, planAttempt }, { isExpanded }) => (
        <Fragment>
          <EuiText size='xs' color='subdued'>
            <EuiFlexGroup gutterSize='s'>
              {isAutoscalingGeneratedPlanAttempt({ planAttempt }) &&
                !isAutoscalingTerminationPlanAttempt({ planAttempt }) && (
                  <EuiFlexItem grow={false}>
                    <AutoscalingBadge />
                  </EuiFlexItem>
                )}

              <EuiFlexItem grow={false}>
                <StackConfigurationChangeTime
                  deployment={deployment}
                  resourceType={resourceType}
                  resource={resource}
                  planAttempt={planAttempt}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiText>
          {isAutoscalingTerminationPlanAttempt({ planAttempt }) && (
            <EuiCallOut>
              <FormattedMessage
                id='deployment-activity-table.summary.disable-unused'
                defaultMessage='Unused deployment configurations have been disabled automatically.'
              />
            </EuiCallOut>
          )}
          <StackConfigurationChangeSummary
            resourceType={resourceType}
            resource={resource}
            planAttempt={planAttempt}
            spacerBefore={true}
          />

          {isExpanded || (
            <Fragment>
              <StackConfigurationChangePendingSteps
                deployment={deployment}
                resourceType={resourceType}
                resource={resource}
                planAttempt={planAttempt}
                spacerBefore={true}
              />

              <StackConfigurationChangeError
                resourceType={resourceType}
                resource={resource}
                planAttempt={planAttempt}
                spacerBefore={true}
              />
            </Fragment>
          )}
        </Fragment>
      ),
    },

    ...(showAttributionColumn
      ? [
          {
            label: (
              <FormattedMessage
                id='deployment-activity-table.attribution'
                defaultMessage='Attribution'
              />
            ),
            render: ({ resourceType, planAttempt }) => (
              <StackConfigurationChangeAttribution kind={resourceType} planAttempt={planAttempt} />
            ),
            className: 'deploymentActivityTable-attribution',
            align: 'right' as const,
            width: '220px',
          },
        ]
      : []),

    {
      label: <FormattedMessage id='deployment-activity-table.actions' defaultMessage='Actions' />,
      render: ({ deployment, resource, resourceType, planAttempt }) => (
        <StackConfigurationChangeActions
          deployment={deployment}
          resource={resource}
          resourceType={resourceType}
          planAttempt={planAttempt}
        />
      ),
      align: 'right' as const,
      width: '280px',
      actions: true,
    },
  ]

  return (
    <CuiTable<ResourceChangeAttempt>
      rows={planAttempts}
      columns={columns}
      getRowId={(change) => `${change.resourceType}-${getPlanAttemptId(change)}`}
      getRowTestSubj={(change) => `${change.resourceType}-row`}
      hasDetailRow={true}
      renderDetailButton={CustomExpandButton}
      renderDetailRow={(change) => <DetailRow change={change} />}
      pageSize={10}
      showMatchCount={true}
      totalCount={totalCount}
      matchType={
        <FormattedMessage
          id='deployment-activity-table.match-type'
          defaultMessage='configuration change'
        />
      }
      matchTypePlural={
        <FormattedMessage
          id='deployment-activity-table.match-type-plural'
          defaultMessage='configuration changes'
        />
      }
    />
  )
}

function DetailRow({ change }: { change: ResourceChangeAttempt }) {
  const { deployment, resource, resourceType, planAttempt } = change

  return (
    <EuiErrorBoundary>
      <StackConfigurationChangeError
        resource={resource}
        resourceType={resourceType}
        planAttempt={planAttempt}
        spacerAfter={true}
      />
      <StackConfigurationChangeStepSnapshot
        deployment={deployment}
        planAttempt={planAttempt}
        spacerAfter={true}
      />
      <StackConfigurationChangeStepDataMigration
        deployment={deployment}
        planAttempt={planAttempt}
        spacerAfter={true}
      />
      <StackConfigurationChangeRawPlanJson
        resource={resource}
        planAttempt={planAttempt}
        spacerAfter={true}
      />
      <StackConfigurationChangeSteps
        deployment={deployment}
        resourceType={resourceType}
        resource={resource}
        planAttempt={planAttempt}
      />
    </EuiErrorBoundary>
  )
}

function CustomExpandButton({ isExpanded, toggleExpanded }) {
  return (
    <EuiButtonEmpty
      data-test-id='planAttemptMeta-showPlanDetails'
      size='s'
      iconSide='right'
      iconType={isExpanded ? `arrowUp` : `arrowDown`}
      onClick={toggleExpanded}
    >
      <FormattedMessage id='deployment-activity-table.show-details' defaultMessage='Details' />
    </EuiButtonEmpty>
  )
}

export default withErrorBoundary(DeploymentActivityTable)
