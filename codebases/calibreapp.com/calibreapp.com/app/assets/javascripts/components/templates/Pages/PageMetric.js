import React from 'react'
import { useQuery } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { useInView } from 'react-intersection-observer'

import { GetPagesMetricsTimeSeries as MetricsQuery } from '../../../queries/PageQueries.gql'

import { Flex, Box } from '../../Grid'
import { Text } from '../../Type'
import { Value } from '../../Metric'
import { BarChart } from '../../Chart'

import Measurement from '../Budgets/Measurement'
import { PlainFormatter } from '../../../utils/MetricFormatter'
import FormattedDate from '../../FormattedDate'
import isNumeric from '../../../utils/isNumeric'

const color = ({ value, metric }) => {
  if (!isNumeric(value)) return 'neutral'

  switch (metric.budgetThreshold) {
    case 'GreaterThan':
      return value > metric.poorStop
        ? 'error'
        : value < metric.goodStop
        ? 'success'
        : 'warning'
    default:
      return value > metric.goodStop
        ? 'success'
        : value < metric.poorStop
        ? 'error'
        : 'warning'
  }
}

const PageMetricChart = ({
  teamId,
  siteId,
  metric,
  page,
  profile,
  deploys
}) => {
  const variables = {
    teamId,
    siteId,
    profiles: [profile.uuid],
    pages: [page.uuid],
    first: 15,
    measurements: [metric.name]
  }
  const { data, loading } = useQuery(MetricsQuery, {
    variables
  })
  const { team } = data || {}
  const {
    site: { timeSeries }
  } = team || { site: {} }
  const { series = [{ values: [] }], times = [] } = timeSeries || {}
  const values = (series[0] && series[0].values) || []

  const segments = times.map((time, index) => {
    let deploy
    deploys.forEach(d => {
      if (d.timestamp < time.timestamp) deploy = d
    })

    return {
      ...time,
      color: color({ metric, value: values[index] }),
      value: values[index],
      link: time.snapshot
        ? `/teams/${teamId}/${siteId}/snapshots/${time.snapshot}?page=${page.uuid}&profile=${profile.uuid}`
        : null,
      deploy
    }
  })

  while (segments.length < 15) {
    segments.unshift({})
  }

  while (segments.length > 15) {
    segments.splice(0, 1)
  }

  const formatter = ({ value, name, timestamp, deploy }) => (
    <Measurement
      metric={metric}
      value={<PlainFormatter number={value} formatter={metric.formatter} />}
      metadata={
        <>
          {name}
          <br />
          <FormattedDate date={timestamp} />
          {deploy ? (
            <>
              <br />
              {deploy.name}
            </>
          ) : null}
        </>
      }
    />
  )

  return (
    <BarChart
      height={24}
      width={148}
      loading={loading || !data}
      emptyLabel={
        <Text level="xs" textAlign="left" color="grey300">
          <em>
            <FormattedMessage id="pages.metrics.empty" />
          </em>
        </Text>
      }
      segments={segments}
      formatter={formatter}
    />
  )
}

const PageMetric = ({
  teamId,
  siteId,
  metric,
  page,
  profile,
  current,
  currentGrading,
  deploys
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true
  })
  return (
    <Flex alignItems="center" ref={inViewRef}>
      <Box width={148}>
        {!inView ? null : (
          <PageMetricChart
            teamId={teamId}
            siteId={siteId}
            page={page}
            profile={profile}
            metric={metric}
            deploys={deploys}
          />
        )}
      </Box>
      <Box ml="8px">
        <Value level="base" variant={currentGrading}>
          {!isNumeric(current) ? null : (
            <PlainFormatter number={current} formatter={metric.formatter} />
          )}
        </Value>
      </Box>
    </Flex>
  )
}

export default PageMetric
