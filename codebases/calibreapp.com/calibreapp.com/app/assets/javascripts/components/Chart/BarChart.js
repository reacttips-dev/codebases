import React, { useState } from 'react'
import styled from 'styled-components'
import { Box } from '../Grid'
import { Link } from 'react-router-dom'

import Chart, {
  ChartProvider,
  Container,
  EmptyChart,
  Bars,
  calculateBarScale
} from './'
import Tooltip from '../Tooltip'

const Popup = styled(Box)`
  bottom: 0;
  left: ${({ left }) => left}px;
  position: absolute;
`

const SegmentLink = styled(Link).attrs(props => ({
  style: {
    left: props.x + 'px',
    height: props.height + 'px',
    width: props.width + 'px',
    top: props.y + 'px'
  }
}))`
  position: absolute;
  z-index: 10;
`

const BarChart = ({
  loading,
  emptyLabel,
  segments,
  height,
  margin,
  width,
  formatter,
  popup
}) => {
  const [nearestSegment, setNearestSegment] = useState()
  const chartAreaWidth = width - (margin.left + margin.right)
  const chartAreaHeight = height - (margin.top + margin.bottom)
  const scale = calculateBarScale({
    segments,
    width: chartAreaWidth,
    height: chartAreaHeight
  })

  const seriesSegments = segments
    .map((segment, index) => ({
      ...segment,
      id: index,
      active:
        segment.active === undefined || segment.active === null
          ? true
          : segment.active,
      formatted: formatter(segment),
      x: {
        value: index,
        scaled: scale.x(index)
      },
      y: {
        value: segment.value,
        scaled: scale.y(segment.value)
      },
      width: {
        value: scale.x.bandwidth(),
        scaled: scale.x.bandwidth()
      },
      height: {
        value: scale.y(0) - scale.y(segment.value),
        scaled: scale.y(0) - scale.y(segment.value)
      }
    }))
    .filter(({ value }) => value !== undefined && value !== null)

  const tooltipPosition = (triggerRect, tooltipRect) => {
    const maxLeft = window.innerWidth - tooltipRect.width - 2

    if (popup.position === 'side') {
      const triggerBottom = triggerRect.bottom
      const left = triggerRect.left
      return {
        left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
        top: triggerBottom + 8 + window.scrollY,
        pointerEvents: 'none'
      }
    } else {
      const triggerCenter = triggerRect.left + triggerRect.width / 2
      const left = triggerCenter - tooltipRect.width / 2
      return {
        left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
        top: triggerRect.top - tooltipRect.height - 8 + window.scrollY,
        pointerEvents: 'none'
      }
    }
  }

  return (
    <Container>
      <ChartProvider>
        {loading || !seriesSegments.length ? (
          <EmptyChart margin={margin} label={emptyLabel} loading={loading} />
        ) : null}
        <Chart width={width} height={height}>
          <Bars segments={seriesSegments} nearestSegment={nearestSegment} />
        </Chart>
        {seriesSegments.map(segment =>
          segment.formatted || segment.link ? (
            <SegmentLink
              key={segment.id}
              to={segment.link || '#'}
              as={segment.link ? Link : 'div'}
              x={segment.x.scaled}
              y={segment.y.scaled}
              width={segment.width.scaled}
              height={segment.height.scaled + 2}
              onMouseEnter={() => {
                segment.y.value === null ||
                  segment.y.value === null ||
                  setNearestSegment(segment)
              }}
              onMouseLeave={() => setNearestSegment(null)}
            />
          ) : null
        )}
      </ChartProvider>
      {!nearestSegment ||
        (!popup.hide && (
          <Tooltip
            label={nearestSegment.formatted}
            alwaysShow={true}
            position={tooltipPosition}
          >
            <Popup
              left={nearestSegment.x.scaled}
              height={nearestSegment.height.scaled}
              width={nearestSegment.width.scaled}
            ></Popup>
          </Tooltip>
        )) ||
        null}
    </Container>
  )
}

BarChart.defaultProps = {
  margin: { bottom: 0, left: 0, right: 0, top: 0 },
  segments: [],
  formatter: ({ name }) => name,
  popup: {
    position: 'side'
  }
}

export default BarChart
