import React, { Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useLazyQuery } from '@apollo/client'
import { useInView } from 'react-intersection-observer'
import { format } from 'date-fns'

import { GetPulseMetricTimeSeries } from '../../queries/PulseQueries.gql'

import { Flex, Box } from '../Grid'
import TimeseriesRangeSelector from '../TimeseriesRangeSelector'
import { ProfileLegend, LineChart, ChartSizer, EmptyChart } from '../Chart'
import { PlainFormatter } from '../../utils/MetricFormatter'
import { useTimeSeriesCSV } from '../../utils/download'
import { TextLink } from '../Type'
import { Link as MetricLink } from '../Metric'

const Export = React.lazy(() => import('../Export'))

const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 3;
`

const PulseMetric = ({
  orgId,
  teamId,
  siteId,
  page,
  from,
  metric,
  markers,
  duration,
  onChangeDateRange,
  metricRoute,
  snapshotLink,
  showControls
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true
  })
  const variables = {
    orgId,
    teamId,
    siteId,
    measurements: [metric.value],
    pages: [page],
    from
  }

  const [getData, { loading, data }] = useLazyQuery(GetPulseMetricTimeSeries, {
    variables
  })

  useEffect(() => {
    if ((showControls || inView) && !data) getData()
  }, [inView])

  const getCSV = useTimeSeriesCSV(variables)

  const timeSeries = data?.team?.site?.timeSeries || {
    times: [],
    series: [],
    testProfiles: [],
    metrics: [],
    loading: true
  }

  const Chart = () => (
    <React.Fragment>
      {!showControls || (
        <TopBar className="page-section">
          <div className="row middle-xs">
            <div className="col-xs-12 col-sm-4">
              <TimeseriesRangeSelector
                onChange={onChangeDateRange}
                currentValue={duration}
                range={[
                  { label: '7 days', value: '7' },
                  { label: '30 days', value: '30' }
                ]}
              />
            </div>
            <div className="col-xs-12 col-sm-8 center-xs end-sm">
              <div className="type-small" data-qa="pulse-testProfiles">
                <ProfileLegend series={timeSeries.series} />
              </div>
            </div>
          </div>
        </TopBar>
      )}

      <div className="page-section" data-qa={`pulseMetric-${metric.value}`}>
        <div className="m--b3">
          <Box key={metric.name} mb={3}>
            <Flex>
              <Box flex={1}>
                <Flex alignItems="center">
                  <Box mr="8px">
                    <TextLink to={metricRoute(metric.value)}>
                      {metric.label}
                    </TextLink>
                  </Box>

                  <Box>
                    <MetricLink {...metric} />
                  </Box>
                </Flex>
              </Box>
              <Box>
                <Suspense fallback={<div />}>
                  <Export
                    id="pulse.export"
                    actions={[
                      {
                        action: 'csv',
                        onClick: getCSV
                      }
                    ]}
                    values={{
                      site: siteId,
                      measurement: metric.value,
                      from: format(from, 'yyyy-MM-dd')
                    }}
                  />
                </Suspense>
              </Box>
            </Flex>

            {!showControls && !inView ? null : loading || timeSeries.loading ? (
              <ChartSizer aspectRatio={6}>
                <Box position="relative">
                  <EmptyChart loading={true} />
                </Box>
              </ChartSizer>
            ) : (
              <ChartSizer aspectRatio={6}>
                <LineChart
                  to={new Date()}
                  linkTo={(time, set) =>
                    snapshotLink(time.snapshot, set.profile)
                  }
                  markers={markers}
                  timeSeries={timeSeries}
                  formatter={value =>
                    PlainFormatter({
                      number: value,
                      formatter: metric.formatter
                    })
                  }
                />
              </ChartSizer>
            )}
          </Box>
        </div>
      </div>
    </React.Fragment>
  )

  if (showControls) return <Chart />

  return (
    <div ref={inViewRef}>
      <Chart />
    </div>
  )
}

PulseMetric.defaultProps = {
  duration: '7',
  showControls: true
}

PulseMetric.propTypes = {
  duration: PropTypes.string,
  onChangeDateRange: PropTypes.func.isRequired,
  showControls: PropTypes.bool
}

export default PulseMetric
