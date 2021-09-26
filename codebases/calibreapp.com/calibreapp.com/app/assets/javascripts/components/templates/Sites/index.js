import React, { useState } from 'react'
import { Flex, Box } from '@rebass/grid'

import { RichFormatter } from '../../../utils/MetricFormatter'
import KpiMetricTableHeader from '../../KpiMetricTableHeader'
import { Media, MediaObject, MediaBody } from '../../Media'
import { TextLink } from '../../Type'
import MetricTable from '../../MetricTable'
import Favicon from '../../Favicon'
import MetadataList from '../../MetadataList'
import { sortByString, sortByInteger } from '../../../utils/sort'

const Sites = ({ orgId, sites, initialSortBy, initialSortDirection }) => {
  const rootSite = sites[0]

  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortDirection, setSortDirection] = useState(initialSortDirection)
  const sortedSites = sites.sort((a, b) => {
    if (sortBy === 'name') {
      return sortByString(a.name, b.name, sortDirection)
    } else {
      const primary =
        a.aggregateMetrics.find(({ metric: { name } }) => name === sortBy)
          ?.p50 || 0
      const secondary =
        b.aggregateMetrics.find(({ metric: { name } }) => name === sortBy)
          ?.p50 || 0
      return sortByInteger(primary, secondary, sortDirection)
    }
  })

  return (
    <MetricTable data-qa="sitesTable">
      <KpiMetricTableHeader
        name="Site"
        metrics={
          rootSite &&
          rootSite.aggregateMetrics &&
          rootSite.aggregateMetrics.map(({ metric }) => metric)
        }
        sortBy={sortBy}
        onSortBy={setSortBy}
        sortDirection={sortDirection}
        onSortDirection={setSortDirection}
      />
      <tbody>
        {sortedSites.map(
          ({
            aggregateMetrics,
            slug,
            name,
            location: { name: locationName },
            page
          }) => {
            return (
              <tr key={slug}>
                <td>
                  <TextLink to={`/teams/${orgId}/${slug}`}>
                    <Media rowAlign="center">
                      <MediaObject>
                        <Favicon name={name} src={page && page.favicon} />
                      </MediaObject>
                      <MediaBody>
                        <Flex>
                          <Box>{name}</Box>
                        </Flex>
                        <MetadataList items={[locationName]} />
                      </MediaBody>
                    </Media>
                  </TextLink>
                </td>
                {aggregateMetrics.map(({ p50, grading, metric }, index) => (
                  <td key={index}>
                    <RichFormatter
                      value={p50}
                      formatter={metric.formatter}
                      level="md"
                      grading={grading}
                    />
                  </td>
                ))}
              </tr>
            )
          }
        )}
      </tbody>
    </MetricTable>
  )
}

export default Sites
