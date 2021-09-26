import React, { useContext } from 'react'
import { timeDay, timeMonth } from 'd3-time'
import { format, isAfter, parseISO } from 'date-fns'

import Chart, {
  ChartProvider,
  calculateMarkers,
  calculatePoints,
  calculatePointsScale,
  chartPropTypes,
  EmptyChart,
  Layer,
  Flag,
  Lines,
  Event,
  Markers,
  NearestDots,
  NearestMarker,
  Pole
} from './'
import Axis, { TickLabels } from './Axis'
import { FormattedDateString } from '../FormattedDate'
import LegendContext from './Legend/Context'

const LineChart = ({
  loading,
  margin,
  timeSeries,
  markers,
  formatter,
  linkTo,
  linkToEvent,
  width,
  height,
  containerRef
}) => {
  const { profiles } = useContext(LegendContext) || {
    profiles: timeSeries.series
  }

  const chartAreaWidth = width - (margin.left + margin.right)
  const chartAreaHeight = height - (margin.top + margin.bottom)

  const scale = calculatePointsScale({
    height: chartAreaHeight,
    timeSeries,
    markers,
    width: chartAreaWidth
  })

  const xFormatter = date => FormattedDateString({ date })

  const seriesPoints = calculatePoints({
    scale,
    profiles,
    timeSeries,
    xFormatter,
    yFormatter: formatter,
    linkTo
  })

  const markersInTimeRange = markers.filter(marker =>
    isAfter(parseISO(marker.timestamp), scale.x.domain()[0])
  )

  const markerPoints = calculateMarkers({
    scale,
    markers: markersInTimeRange,
    linkTo: linkToEvent
  })

  const chartAreaTransform = `translate(${margin.left},${margin.top})`
  const chartTransform = `translate(${margin.left},${margin.top})`
  const bottomTransform = `translate(${margin.left},${height - margin.bottom})`

  const dayTicks = timeDay.range(
    scale.x.domain()[0],
    timeDay.offset(scale.x.domain()[1], 1),
    1
  )
  const monthTicks = timeMonth.range(
    scale.x.domain()[0],
    timeDay.offset(scale.x.domain()[1], 1),
    1
  )
  const formatDate = value => format(value, 'dd MMM')
  const formatDay = value => format(value, 'dd')
  const formatMonth = value => format(value, 'MMM yyyy')

  const yTicks = scale.y.ticks(3)

  return (
    <ChartProvider>
      <Flag margin={margin} />
      <Event margin={margin} />
      {loading || !seriesPoints.length ? (
        <EmptyChart margin={margin} loading={loading} />
      ) : null}
      <Chart width={width} height={height}>
        {!seriesPoints.length || (
          <Layer
            parentRef={containerRef}
            seriesPoints={seriesPoints}
            markerPoints={markerPoints}
            scale={scale}
            height={height}
            width={width}
            margin={margin}
          />
        )}

        <g transform={chartAreaTransform}>
          <Axis width={chartAreaWidth} />

          <TickLabels
            scale={scale.y}
            ticks={yTicks}
            orientation="y"
            formatter={formatter}
          />
        </g>

        <g transform={bottomTransform}>
          <Axis width={chartAreaWidth} />
        </g>

        <g transform={chartTransform}>
          <Pole height={height} margin={margin} />
          <Lines seriesPoints={seriesPoints} />
          {!markerPoints.length || (
            <Markers
              height={height}
              margin={margin}
              markerPoints={markerPoints}
            />
          )}
          <NearestDots />
          <NearestMarker height={height} margin={margin} />

          {!(dayTicks.length < 50) || (
            <TickLabels
              scale={scale.x}
              ticks={dayTicks}
              formatter={dayTicks.length >= 25 ? formatDay : formatDate}
            />
          )}

          {!(dayTicks.length >= 25) || (
            <TickLabels
              scale={scale.x}
              ticks={monthTicks}
              formatter={formatMonth}
              offset={dayTicks.length < 50 ? 25 : 10}
            />
          )}
        </g>
      </Chart>
    </ChartProvider>
  )
}

LineChart.defaultProps = {
  margin: { bottom: 30, left: 75, right: 15, top: 47 },
  markers: [],
  formatter: value => value,
  linkTo: () => 'link',
  linkToEvent: event => event.url
}

LineChart.propTypes = {
  ...chartPropTypes
}

export default LineChart
