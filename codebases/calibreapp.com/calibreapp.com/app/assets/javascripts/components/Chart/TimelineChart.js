import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import Chart, {
  ChartProvider,
  calculateSegmentsScale,
  calculateSegments,
  Layer,
  Details
} from './'
import Axis, { Ticks, TickLabels } from './Axis'
import Segments from './Segments'
import LegendContext from './Legend/Context'

import { PlainFormatter } from '../../utils/MetricFormatter'

const Timeline = ({
  margin,
  height,
  width,
  segments,
  formatter,
  containerRef
}) => {
  const { profiles } = useContext(LegendContext) || { profiles: [] }
  if (!width) return null

  const chartAreaWidth = width - (margin.left + margin.right)
  const chartAreaHeight = height - (margin.top + margin.bottom)

  const scale = calculateSegmentsScale({
    segments,
    height: chartAreaHeight,
    width: chartAreaWidth
  })

  const seriesSegments = calculateSegments({
    scale,
    profiles,
    segments,
    formatter
  })

  const xTicks = scale.x.ticks(5)

  const chartTransform = `translate(${margin.left},${margin.top})`
  const axisTransform = `translate(${margin.left},${height - margin.bottom})`
  const labelsTransform = `translate(${margin.left},${height})`
  const ticksTransform = `translate(${margin.left},${
    height - margin.bottom + 10
  })`

  const tickFormatter = number =>
    PlainFormatter({ number, formatter: 'humanDuration' })

  return (
    <ChartProvider>
      <Details margin={margin} />
      <Chart width={width} height={height}>
        <Layer
          parentRef={containerRef}
          seriesSegments={seriesSegments}
          scale={scale}
          height={height}
          width={width}
          margin={margin}
        >
          <g transform={axisTransform}>
            <Axis width={chartAreaWidth} />
          </g>
          <g transform={ticksTransform}>
            <Ticks scale={scale.x} ticks={xTicks} orientation="x" />
          </g>
          <g transform={labelsTransform}>
            <TickLabels
              scale={scale.x}
              ticks={xTicks}
              orientation="x"
              formatter={tickFormatter}
            />
          </g>
          <g transform={chartTransform}>
            <Segments segments={seriesSegments} />
          </g>
        </Layer>
      </Chart>
    </ChartProvider>
  )
}

Timeline.propTypes = {
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  })
}

Timeline.defaultProps = {
  margin: { bottom: 30, left: 15, right: 15, top: 30 },
  segments: [],
  formatter: value => value
}

export default Timeline
