import React from 'react'
import { useMutation } from '@apollo/client'

import { SortButton } from './Button'
import { UpdateUserSettings } from '../queries/UserQueries.gql'
import { Heading as MetricHeading, Link as MetricLink } from './Metric'

const Heading = ({
  children,
  sortBy,
  sortDirection,
  name,
  onSortDirection,
  onSortBy
}) => {
  const [updateSort] = useMutation(UpdateUserSettings)
  const updateSortBy = summarySortBy => {
    updateSort({ variables: { summarySortBy } })
    onSortBy(summarySortBy)
  }

  const updateSortDirection = summarySortDirection => {
    updateSort({ variables: { summarySortDirection } })
    onSortDirection(summarySortDirection)
  }

  return (
    <th className={sortBy === name ? 'active' : ''}>
      <SortButton
        attribute={name}
        onUpdateSortBy={updateSortBy}
        onUpdateSortDirection={updateSortDirection}
        sortBy={sortBy}
        sortDirection={sortDirection}
      >
        {children}
      </SortButton>
    </th>
  )
}

const KpiMetricTableHeader = ({
  TitleCell,
  name,
  metrics,
  sortBy,
  onSortBy,
  sortDirection,
  onSortDirection
}) => {
  return (
    <thead>
      <tr>
        {(TitleCell && <TitleCell />) ||
          (name && (
            <Heading
              name="name"
              sortBy={sortBy}
              onSortBy={onSortBy}
              sortDirection={sortDirection}
              onSortDirection={onSortDirection}
            >
              {name}
            </Heading>
          )) ||
          null}
        {!metrics ||
          metrics.map((metric, idx) => (
            <Heading
              key={idx}
              name={metric.name}
              sortBy={sortBy}
              onSortBy={onSortBy}
              sortDirection={sortDirection}
              onSortDirection={onSortDirection}
            >
              <MetricHeading {...metric} /> <MetricLink {...metric} />
            </Heading>
          ))}
      </tr>
    </thead>
  )
}

export default KpiMetricTableHeader
