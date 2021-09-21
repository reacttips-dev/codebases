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

import React, { Component, ReactNode, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { get, groupBy, sortBy, keyBy, isEmpty, mapValues } from 'lodash'

import {
  EuiCallOut,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { withErrorBoundary } from '../../../cui'

import DocLink from '../../DocLink'
import NodeInstanceVisualization from './NodeInstanceVisualization'

import StackDeploymentNodesVisualizationFilters, {
  applyFilters,
  hasFilters,
} from './StackDeploymentNodesVisualizationFilters'

import { getDeploymentTopologyInstances } from '../../../lib/stackDeployments/selectors'

import {
  SliderInstanceType,
  StackDeployment,
  InstanceSummary,
  NodesVisualizationFilters,
} from '../../../types'

import './stackDeploymentNodesVisualization.scss'

export interface Props {
  title: ReactNode
  deployment: StackDeployment
  fetchDeploymentAllocators: () => void
  fetchNodeStats: () => void
  showNativeMemoryPressure?: boolean
  sliderInstanceType?: SliderInstanceType
  disableNodeControlsIfPlanPending?: boolean
  shouldFetchDeploymentAllocators: boolean
}

interface State {
  filters: NodesVisualizationFilters
}

class StackDeploymentNodesVisualization extends Component<Props, State> {
  state: State = {
    filters: {},
  }

  componentDidMount() {
    const {
      fetchDeploymentAllocators,
      shouldFetchDeploymentAllocators,
      fetchNodeStats,
      deployment,
      sliderInstanceType,
    } = this.props

    if (shouldFetchDeploymentAllocators) {
      fetchDeploymentAllocators()
    }

    const instanceSummaries = getDeploymentTopologyInstances({ deployment, sliderInstanceType })

    if (
      instanceSummaries.some((instanceSummary) =>
        instanceSummary.instance.node_roles?.includes(`data_frozen`),
      )
    ) {
      // we consume this later, in `<FrozenNodeUsage>`
      fetchNodeStats()
    }
  }

  render() {
    const { zoneIds, zoneSummaries } = this.getSummariesPerZone()

    return (
      <Fragment>
        {this.renderHeader()}

        {this.renderMemoryPressureWarning()}

        {this.renderZonesGrid({ zoneIds, zoneSummaries })}
      </Fragment>
    )
  }

  renderHeader() {
    const { title } = this.props

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>{title}</EuiFlexItem>

          <EuiFlexItem>{this.renderFilters()}</EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderFilters() {
    const { deployment, sliderInstanceType } = this.props
    const { filters } = this.state

    const instanceSummaries = getDeploymentTopologyInstances({ deployment, sliderInstanceType })

    return (
      <EuiFlexGroup gutterSize='xs' alignItems='center' justifyContent='flexEnd'>
        <EuiFlexItem grow={false}>
          <StackDeploymentNodesVisualizationFilters
            instanceSummaries={instanceSummaries}
            filters={filters}
            onChange={this.setFilters}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderMemoryPressureWarning() {
    const { showNativeMemoryPressure } = this.props

    if (!showNativeMemoryPressure) {
      return null
    }

    return (
      <Fragment>
        <EuiCallOut
          title='At least one Elasticsearch node has JVM memory pressure over 75%'
          color='warning'
          iconType='alert'
        >
          <FormattedMessage
            id='nodes-visualization.jvm-memory-pressure-description'
            defaultMessage='This can affect your cluster stability. Consider reducing the number of shards, optimizing large queries, or increasing your cluster size. {learnMore}.'
            values={{
              learnMore: <DocLink link='jvmMemoryPressure'>Learn more</DocLink>,
            }}
          />
        </EuiCallOut>

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderZonesGrid({
    zoneIds,
    zoneSummaries,
  }: {
    zoneIds: string[]
    zoneSummaries: {
      [key: string]: InstanceSummary[]
    }
  }) {
    return (
      <EuiFlexGrid columns={3} className='nodes-visualization'>
        {zoneIds.map((zoneId) =>
          this.renderZone({
            zoneId,
            zoneSummaries: zoneSummaries[zoneId],
          }),
        )}
      </EuiFlexGrid>
    )
  }

  renderZone({ zoneId, zoneSummaries }: { zoneId: string; zoneSummaries: InstanceSummary[] }) {
    return (
      <EuiFlexItem key={zoneId} className='nodes-visualization-column'>
        {this.renderZoneTitle({ zoneId })}

        <EuiSpacer size='l' />

        <div className='node-visualization-instance'>
          {this.renderZoneFilteredWarning({ zoneId, zoneSummaries })}
          {this.renderZoneSummaries({ zoneSummaries })}
        </div>
      </EuiFlexItem>
    )
  }

  renderZoneTitle({ zoneId }: { zoneId: string }) {
    return (
      <EuiTitle size='xxs'>
        <h3 className='nodes-visualization-column-title'>
          <EuiFlexGroup gutterSize='xs' alignItems='center'>
            <EuiFlexItem grow={false}>
              <EuiText size='s'>
                <FormattedMessage id='nodes-visualization.zone' defaultMessage='Zone' />
              </EuiText>
            </EuiFlexItem>

            <EuiFlexItem>
              {zoneId === `undefined` ? (
                <FormattedMessage
                  id='nodes-visualization.zone-untitled'
                  defaultMessage='Unassigned zone'
                />
              ) : (
                zoneId
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </h3>
      </EuiTitle>
    )
  }

  renderZoneFilteredWarning({
    zoneId,
    zoneSummaries,
  }: {
    zoneId: string
    zoneSummaries: InstanceSummary[]
  }) {
    const { filters } = this.state

    if (!hasFilters({ filters }) || !isEmpty(zoneSummaries)) {
      return null
    }

    return (
      <EuiText color='subdued' size='s'>
        <FormattedMessage
          id='nodes-visualization.no-matches-in-zone'
          defaultMessage='No matches in {zoneId} for your filters.'
          values={{ zoneId }}
        />
      </EuiText>
    )
  }

  renderZoneSummaries({ zoneSummaries }: { zoneSummaries: InstanceSummary[] }) {
    const { deployment, showNativeMemoryPressure } = this.props

    return (
      <Fragment>
        {zoneSummaries.map((summary, index) => {
          const name = this.getInstanceSummaryName(summary)

          return (
            <Fragment key={`${summary.kind}-${name}-${index}`}>
              <NodeInstanceVisualization
                deployment={deployment}
                instanceSummary={summary}
                showNativeMemoryPressure={showNativeMemoryPressure}
              />

              <EuiSpacer size='m' />
            </Fragment>
          )
        })}
      </Fragment>
    )
  }

  getSummariesPerZone() {
    const { deployment, sliderInstanceType } = this.props
    const { filters } = this.state

    const instanceSummaries = getDeploymentTopologyInstances({ deployment, sliderInstanceType })

    const zoneGroups = groupBy(instanceSummaries, `instance.zone`)
    const zoneIds = Object.keys(zoneGroups).sort()

    const zoneSummaries = mapValues(keyBy(zoneIds), (zone) =>
      applyFilters({
        instanceSummaries: sortBy(zoneGroups[zone], [
          `kind`,
          `instance.instance_configuration.name`,
          `instance.instance_name`,
        ]),
        filters,
      }),
    )

    return {
      zoneIds,
      zoneSummaries,
    }
  }

  getInstanceSummaryName(instanceSummary) {
    return get(instanceSummary, [`instance`, `instance_configuration`, `name`], ``)
  }

  setFilters = (filters: NodesVisualizationFilters) => {
    this.setState({ filters })
  }
}

export default withErrorBoundary(StackDeploymentNodesVisualization)
