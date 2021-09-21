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

import { get, uniqBy } from 'lodash'

import React, { Component } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'

import { EuiFilterGroup } from '@elastic/eui'

import { withSmallErrorBoundary } from '../../../../cui'

import { InstanceSummary, NodesVisualizationFilters } from '../../../../types'
import { FilterButton, FilterOption } from './FilterButton'
import { applyFilters } from './filters'

type FilterKey = keyof NodesVisualizationFilters

type Props = {
  instanceSummaries: InstanceSummary[]
  filters: NodesVisualizationFilters
  onChange: (filters: NodesVisualizationFilters) => void
}

const dataTierMessages = defineMessages({
  data_hot: {
    id: 'nodes-visualization-filter.data-tiers-hot-label',
    defaultMessage: `Hot`,
  },
  data_warm: {
    id: 'nodes-visualization-filter.data-tiers-warm-label',
    defaultMessage: `Warm`,
  },
  data_cold: {
    id: 'nodes-visualization-filter.data-tiers-cold-label',
    defaultMessage: `Cold`,
  },
  data_frozen: {
    id: 'nodes-visualization-filter.data-tiers-frozen-label',
    defaultMessage: `Frozen`,
  },
})

type DataTier = keyof typeof dataTierMessages

class StackDeploymentNodesVisualizationFilters extends Component<Props> {
  render() {
    return (
      <div data-test-id='nodes-visualization-filters'>
        <EuiFilterGroup>
          {this.renderHealthFilter()}
          {this.renderInstanceConfigurationIdFilter()}
          {this.renderDataTiersFilter()}
        </EuiFilterGroup>
      </div>
    )
  }

  renderDataTiersFilter() {
    const { filters } = this.props
    let filterOptions: FilterOption[] = (Object.keys(dataTierMessages) as DataTier[])
      .map((tier) => ({
        id: tier,
        label: <FormattedMessage {...dataTierMessages[tier]} />,
        isEnabled: filters.dataTier === tier,
        count: this.countMatching({ dataTier: tier }),
        value: tier,
      }))
      .filter(({ count }) => count > 0)

    if (!filterOptions.length) {
      return null
    }

    if (filterOptions.length > 1) {
      filterOptions = [
        {
          id: 'all',
          label: (
            <FormattedMessage
              id='nodes-visualization-filter.data-tiers-all-label'
              defaultMessage='All'
            />
          ),
          isEnabled: filters.dataTier === undefined,
          count: this.countMatching({ dataTier: undefined }),
        },
        ...filterOptions,
      ]
    }

    return (
      <FilterButton
        data-test-id='nodes-visualization-filter.button.node-roles'
        filterKey='dataTier'
        hasActiveFilters={filters.dataTier !== undefined}
        buttonText={
          <FormattedMessage
            id='nodes-visualization-filter.data-tier-label'
            defaultMessage='Data tier'
          />
        }
        filterOptions={filterOptions}
        toggleFilter={(key, value) => this.toggleFilter(key, value)}
      />
    )
  }

  renderInstanceConfigurationIdFilter() {
    const { filters } = this.props
    const instanceConfigOptions = this.getInstanceConfigOptions()
    let filterOptions: FilterOption[] = instanceConfigOptions.map(({ id, name }) => ({
      id,
      label: name,
      isEnabled: filters.instanceConfigurationId === id,
      count: this.countMatching({ instanceConfigurationId: id }),
      value: id,
    }))

    if (instanceConfigOptions.length > 1) {
      filterOptions = [
        {
          id: 'all',
          label: (
            <FormattedMessage
              id='nodes-visualization-filter.instance-config-all-label'
              defaultMessage='All'
            />
          ),
          isEnabled: filters.instanceConfigurationId === undefined,
          count: this.countMatching({ instanceConfigurationId: undefined }),
        },
        ...filterOptions,
      ]
    }

    return (
      <FilterButton
        data-test-id='nodes-visualization-filter.button.instance-config'
        filterKey='instanceConfigurationId'
        hasActiveFilters={filters.instanceConfigurationId !== undefined}
        buttonText={
          <FormattedMessage
            id='nodes-visualization-filter.instance-configuration-id-label'
            defaultMessage='Instance configuration'
          />
        }
        filterOptions={filterOptions}
        toggleFilter={(key, value) => this.toggleFilter(key, value)}
      />
    )
  }

  renderHealthFilter() {
    const { filters } = this.props
    const filterOptions: FilterOption[] = [
      {
        id: 'all',
        label: (
          <FormattedMessage id='nodes-visualization-filter.health-all-label' defaultMessage='All' />
        ),
        isEnabled: filters.health === undefined,
        count: this.countMatching({ health: undefined }),
      },
      {
        id: 'healthy',
        label: (
          <FormattedMessage
            id='nodes-visualization-filter.health-healthy-label'
            defaultMessage='Healthy'
          />
        ),
        isEnabled: filters.health === 'healthy',
        count: this.countMatching({ health: 'healthy' }),
        value: 'healthy',
      },
      {
        id: 'stopped-routing',
        label: (
          <FormattedMessage
            id='nodes-visualization-filter.health-stopped-routing-label'
            defaultMessage='Stopped routing'
          />
        ),
        isEnabled: filters.health === 'stopped-routing',
        count: this.countMatching({ health: 'stopped-routing' }),
        value: 'stopped-routing',
      },
      {
        id: 'node-paused',
        label: (
          <FormattedMessage
            id='nodes-visualization-filter.health-paused-label'
            defaultMessage='Paused'
          />
        ),
        isEnabled: filters.health === 'node-paused',
        count: this.countMatching({ health: 'node-paused' }),
        value: 'node-paused',
      },
      {
        id: 'unhealthy',
        label: (
          <FormattedMessage
            id='nodes-visualization-filter.health-unhealthy-label'
            defaultMessage='Unhealthy'
          />
        ),
        isEnabled: filters.health === 'unhealthy',
        count: this.countMatching({ health: 'unhealthy' }),
        value: 'unhealthy',
      },
    ]

    return (
      <FilterButton
        data-test-id='nodes-visualization-filter.button.health'
        filterKey='health'
        hasActiveFilters={filters.health !== undefined}
        buttonText={
          <FormattedMessage id='nodes-visualization-filter.health-label' defaultMessage='Health' />
        }
        filterOptions={filterOptions}
        toggleFilter={(key, value) => this.toggleFilter(key, value)}
      />
    )
  }

  countMatching(filter: Partial<NodesVisualizationFilters>): number {
    const { filters, instanceSummaries } = this.props
    const matching = applyFilters({
      instanceSummaries,
      filters: {
        ...filters,
        ...filter,
      },
    })

    return matching.length
  }

  toggleFilter(filterKey: FilterKey, filterValue?: any) {
    const { filters } = this.props

    const currentFilterValue = filters[filterKey]

    const nextFilterValue = currentFilterValue === filterValue ? undefined : filterValue

    this.onChange({ [filterKey]: nextFilterValue })
  }

  onChange = (changes) => {
    const { filters, onChange } = this.props

    onChange({
      ...filters,
      ...changes,
    })
  }

  getInstanceConfigOptions() {
    const { instanceSummaries } = this.props

    const instanceConfigOptions = uniqBy(
      instanceSummaries
        .filter((instanceSummary) => !!instanceSummary.instance.instance_configuration)
        .map(({ instance }) => ({
          id: get(instance, [`instance_configuration`, `id`], ``),
          name: get(instance, [`instance_configuration`, `name`], ``),
        })),
      `id`,
    )

    return instanceConfigOptions
  }
}

export default withSmallErrorBoundary(StackDeploymentNodesVisualizationFilters)
