import React, { useMemo, useState, useRef, Suspense, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import matchSorter from 'match-sorter'
import styled from 'styled-components'

import {
  GetPagesMetricsHistory as MetricsQuery,
  UpdatePageMetrics as UpdatePageMetricsMutation
} from '../../../queries/PageQueries.gql'

import { TextLink } from '../../Type'
import { Section } from '../../Layout'
import Table, { Thead, Th, Tr, Td, Tbody } from '../../Table'
import { Box } from '../../Grid'
import { SortButton } from '../../Button'
import { Heading as MetricHeading, Link as MetricLink } from '../../Metric'
import { CustomiseButton } from '../../Button'
import Tooltip from '../../Tooltip'
import { LoadingTable } from '../../Loading'

import { sortByString, sortByInteger } from '../../../utils/sort'
import { breakpoint } from '../../../utils/style'

import PageMetric from './PageMetric'
import { formatDeployMarkers } from '../../../utils/deploys'

const BlankSlate = React.lazy(() => import('../../BlankSlate'))

const PageLink = styled(TextLink)`
  display: inline-block;
`

const NameCell = styled(Td)`
  max-width: 60px;

  ${breakpoint(2)`
    max-width: none;
  `};
`

const MetricCell = styled(Td)`
  min-width: 220px;

  ${breakpoint(2)`
    min-width: none;
  `};
`

const CustomiseMetricButton = styled(CustomiseButton)`
  left: ${({ left }) => left}px;
  margin-top: ${({ top }) => top}px;
  position: absolute;
  transform: translateY(-50%);
  z-index: 4;
`

const CustomiseMetric = ({ containerRef, metricRef, ...props }) => {
  const metricRect = metricRef.current.getBoundingClientRect()
  const containerRect = containerRef.current.getBoundingClientRect()
  const left = metricRect.left - 25
  const top = Math.min(
    containerRect.height / 2,
    (window.innerHeight - containerRect.top) / 2
  )
  return (
    <CustomiseMetricButton
      {...props}
      left={left}
      top={top}
      data-qa="choose-customise-metric-button"
    >
      <FormattedMessage id="pages.actions.metrics.change" />
    </CustomiseMetricButton>
  )
}

const Pages = ({
  teamId,
  siteId,
  metrics,
  sortBy: initialSortBy,
  sortDirection: initialSortDirection,
  from,
  deviceFilter,
  searchTerm,
  customiseMetrics,
  onCustomiseMetric
}) => {
  const [sortBy, setSortBy] = useState(initialSortBy || 'page')
  const [sortDirection, setSortDirection] = useState(
    initialSortDirection || 'asc'
  )

  const containerRef = useRef()
  const metricRefs = [useRef(), useRef(), useRef()]

  const [savePageMetrics] = useMutation(UpdatePageMetricsMutation)

  const handleSortBy = sortBy => {
    setSortBy(sortBy)
    savePageMetrics({ variables: { siteId, sortBy } })
  }

  const handleSortDirection = sortDirection => {
    setSortDirection(sortDirection)
    savePageMetrics({ variables: { siteId, sortDirection } })
  }

  const measurements = useMemo(() => metrics.map(({ name }) => name), [metrics])
  const variables = {
    teamId,
    siteId,
    measurements,
    from
  }
  const [getMetricsData, { data, loading }] = useLazyQuery(MetricsQuery, {
    variables
  })
  useEffect(() => {
    if (measurements.length) getMetricsData()
  }, [measurements])

  const { team } = data || {}
  const {
    site: { deploys: deploysEdge = {}, latestMetrics }
  } = team || { site: {} }
  const { pages = [], testProfiles = [], data: historyData = [] } =
    latestMetrics || {}

  const deploys = formatDeployMarkers(deploysEdge)

  let pageMetrics = []
  pages.forEach(page => {
    testProfiles.forEach(profile => {
      pageMetrics.push({
        id: `${page.uuid}-${profile.uuid}`,
        teamId,
        siteId,
        page,
        profile,
        metrics: [],
        gradings: []
      })
    })
  })

  historyData.forEach(
    ({
      profile: profileUuid,
      page: pageUuid,
      measurement,
      current,
      currentGrading
    }) => {
      const pageMetricId = `${pageUuid}-${profileUuid}`
      const pageMetric = pageMetrics.find(({ id }) => id === pageMetricId)
      if (pageMetric) {
        measurements.forEach((name, index) => {
          if (name === measurement) {
            pageMetric.metrics[index] = current
            pageMetric.gradings[index] = currentGrading
          }
        })
      }
    }
  )

  if (deviceFilter && deviceFilter !== 'all') {
    pageMetrics = pageMetrics.filter(({ profile: { device } }) =>
      deviceFilter === 'mobile'
        ? device && device.isMobile
        : !device || !device.isMobile
    )
  }

  if (searchTerm !== '') {
    pageMetrics = matchSorter(pageMetrics, searchTerm, {
      keys: ['page.name', 'profile.name']
    })
  }

  const sortedPageMetrics = pageMetrics.sort((a, b) => {
    switch (sortBy) {
      case 'page':
        return sortByString(a.page.name, b.page.name, sortDirection)
      case 'profile':
        return sortByString(a.profile.name, b.profile.name, sortDirection)
      default:
        return sortByInteger(
          a.metrics[sortBy] ? a.metrics[sortBy] : null,
          b.metrics[sortBy] ? b.metrics[sortBy] : null,
          sortDirection
        )
    }
  })

  if (loading)
    return (
      <FormattedMessage id="test.page">
        {label => <LoadingTable label={label} />}
      </FormattedMessage>
    )

  if (!pages?.length)
    return (
      <Suspense fallback={<div />}>
        <BlankSlate id={`pages`} />
      </Suspense>
    )

  return (
    <Section borderBottom="none" ref={containerRef}>
      <Table
        bleed={0}
        overflow="auto"
        disabled={customiseMetrics}
        header={
          customiseMetrics ? (
            <>
              {metrics.map((metric, index) => (
                <CustomiseMetric
                  key={index}
                  containerRef={containerRef}
                  metricRef={metricRefs[index]}
                  onClick={() => onCustomiseMetric(metric)}
                />
              ))}
            </>
          ) : null
        }
      >
        <Thead>
          <Tr>
            <Th>
              <SortButton
                attribute={'page'}
                onUpdateSortBy={handleSortBy}
                onUpdateSortDirection={handleSortDirection}
                sortBy={sortBy}
                sortDirection={sortDirection}
              >
                <FormattedMessage id="test.page" />
              </SortButton>
            </Th>
            <Th>
              <SortButton
                attribute={'profile'}
                onUpdateSortBy={handleSortBy}
                onUpdateSortDirection={handleSortDirection}
                sortBy={sortBy}
                sortDirection={sortDirection}
              >
                <FormattedMessage id="test.profile" />
              </SortButton>
            </Th>
            {metrics.length
              ? metrics.map((metric, index) => (
                  <Th key={index}>
                    <div ref={metricRefs[index]}>
                      <SortButton
                        attribute={`${index}`}
                        onUpdateSortBy={handleSortBy}
                        onUpdateSortDirection={handleSortDirection}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                      >
                        <MetricHeading {...metric} />
                      </SortButton>{' '}
                      <MetricLink {...metric} />
                    </div>
                  </Th>
                ))
              : [1, 2, 3].map(index => (
                  <Th key={index}>
                    <Box width="150px" />
                  </Th>
                ))}
          </Tr>
        </Thead>
        <Tbody>
          {searchTerm !== '' && !sortedPageMetrics.length ? (
            <Tr>
              <Td borderBottomWidth="1px" colSpan="5">
                <FormattedMessage id="pages.metrics.no_results" />
              </Td>
            </Tr>
          ) : (
            sortedPageMetrics.map((pageMetric, index) => (
              <Tr key={index}>
                <NameCell
                  borderBottomWidth={
                    index === historyData.length - 1 ? '1px' : 0
                  }
                >
                  <PageLink
                    to={`/teams/${teamId}/${siteId}?page=${pageMetric.page.uuid}`}
                  >
                    <Tooltip label={pageMetric.page.name}>
                      <div>{pageMetric.page.name}</div>
                    </Tooltip>
                  </PageLink>
                </NameCell>
                <NameCell
                  borderBottomWidth={
                    index === historyData.length - 1 ? '1px' : 0
                  }
                >
                  <Tooltip label={pageMetric.profile.name}>
                    <>{pageMetric.profile.name}</>
                  </Tooltip>
                </NameCell>
                {metrics.length
                  ? metrics.map((metric, i) => (
                      <MetricCell
                        key={`${metric.name}-${i}`}
                        borderBottomWidth={
                          index === historyData.length - 1 ? '1px' : 0
                        }
                      >
                        <PageMetric
                          {...pageMetric}
                          loading={loading}
                          current={pageMetric.metrics[i]}
                          currentGrading={pageMetric.gradings[i]}
                          metric={metric}
                          deploys={deploys}
                        />
                      </MetricCell>
                    ))
                  : [1, 2, 3].map(index => (
                      <MetricCell
                        key={index}
                        borderBottomWidth={
                          index === historyData.length - 1 ? '1px' : 0
                        }
                      >
                        <Box width="150px" />
                      </MetricCell>
                    ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Section>
  )
}

Pages.defaultProps = {
  filters: 'all'
}

export default Pages
