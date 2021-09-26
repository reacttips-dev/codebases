import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max as d3Max, min as d3Min, range as d3Range } from 'd3-array'
import { parseISO } from 'date-fns'
import _flatten from 'lodash.flatten'

import Chart from './Chart'

import { chartColors } from '../../theme'

export const ChartContext = createContext()

export const ChartProvider = ({ children }) => {
  const [state, setState] = useState({
    nearestPoint: undefined,
    nearestPoints: []
  })
  const value = { state, setState }

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
}

export const calculatePointsScale = ({
  height,
  markers,
  timeSeries,
  width
}) => {
  const times = _flatten(timeSeries.times)
  return {
    x: scaleLinear()
      .domain([
        // Use timeseries for start date
        d3Min(times, d => parseISO(d.timestamp)),
        // Include markers for end date
        d3Max(times.concat(markers), d => parseISO(d.timestamp))
      ])
      .range([0, width]),
    y: scaleLinear()
      .domain([
        0,
        (timeSeries.range && timeSeries.range.max * 1.2) ||
          d3Max(
            _flatten(timeSeries.series.map(data => data.values)),
            d => d * 1.2
          )
      ])
      .range([height, 0])
  }
}

export const calculatePoints = ({
  scale,
  profiles,
  timeSeries,
  xFormatter,
  yFormatter,
  linkTo
}) => {
  const orderedSeries = profiles
    .map(profile => {
      const set = timeSeries.series.find(
        series => series.profile === profile.uuid
      )
      if (set) {
        return {
          ...set,
          hidden: !!profile.hidden
        }
      }
      return set
    })
    .filter(set => set)

  return orderedSeries.map((set, seriesIndex) =>
    set.values.map((y, index) => {
      const time = timeSeries.times[index]
      const x = parseISO(time.timestamp)

      return {
        link: linkTo(time, set),
        color: set.color || chartColors[seriesIndex],
        hidden: set.hidden,
        x: {
          name: time.name,
          value: x,
          scaled: scale.x(x),
          formatted: xFormatter(x)
        },
        y: {
          name: set.name,
          value: y,
          scaled: scale.y(y),
          formatted: yFormatter(y)
        }
      }
    })
  )
}

export const calculateMarkers = ({ scale, markers, linkTo }) =>
  markers.map(marker => {
    const value = parseISO(marker.timestamp)

    return {
      link: linkTo(marker),
      name: marker.name,
      byline: marker.byline,
      x: {
        value,
        scaled: scale.x(value)
      }
    }
  })

export const calculateSegmentsScale = ({ height, width, segments }) => {
  return {
    x: scaleLinear()
      .domain([0, d3Max(segments, s => s.endTime)])
      .range([0, width]),
    y: scaleLinear().domain([0, 500]).range([height, 0])
  }
}

export const calculateSegments = ({ scale, segments, formatter, profiles }) => {
  const calculatedSegments = []

  let index = 0
  for (const segment of segments) {
    const profile = profiles.find(profile => profile.uuid === segment.profile)
    calculatedSegments.push({
      id: segment.id,
      name: segment.name,
      hidden: profile && profile.hidden,
      color: segment.color || {
        active: chartColors[index],
        inactive: chartColors[index]
      },
      formatted: formatter(segment),
      x: {
        value: segment.startTime,
        scaled: scale.x(segment.startTime)
      },
      width: {
        value: segment.duration,
        scaled: scale.x(segment.duration)
      },
      y: {
        value: segment.y,
        scaled: scale.y(500 - segment.y)
      },
      height: {
        value: segment.height,
        scaled: scale.y(500 - (segment.height / 100) * 400)
      }
    })
  }

  index++

  return calculatedSegments
}

export const calculateBarScale = ({
  segments = [],
  padding = 0.1,
  width,
  height
}) => ({
  x: scaleBand()
    .domain(d3Range(segments.length))
    .range([0, width])
    .padding(padding),
  y: scaleLinear()
    .domain([
      0,
      Math.max(
        1,
        d3Max(segments, s => s.value)
      )
    ])
    .nice()
    .range([height, 0])
})

export const chartPropTypes = {
  timeSeries: PropTypes.shape({
    times: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        snapshot: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired
      })
    ),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        profile: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.number).isRequired
      })
    )
  }),
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired
    })
  ),
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  }),
  max: PropTypes.number,
  formatter: PropTypes.func
}

const dotAxisPropTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  scaled: PropTypes.number,
  formatted: PropTypes.string
}

export const dotPropTypes = {
  active: PropTypes.bool,
  color: PropTypes.string,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  x: PropTypes.shape(dotAxisPropTypes),
  y: PropTypes.shape(dotAxisPropTypes)
}

export const markerPropTypes = {
  name: PropTypes.string.isRequired,
  byline: PropTypes.string.isRequired,
  x: PropTypes.shape(dotAxisPropTypes)
}

export { default as Container } from './Container'
export { default as Flag } from './Flag'
export { default as Layer } from './Layer'
export { default as Lines } from './Lines'
export { NearestDots, NearestMarker } from './NearestPoints'
export { default as Pole } from './Pole'
export { default as Legend } from './Legend'
export { ProfileLegend } from './Legend'
export { default as LegendProvider } from './Legend/Provider'
export { default as EmptyChart } from './EmptyChart'
export { default as LineChart } from './LineChart'
export { default as ChartObserver } from './Observer'
export { default as ChartSizer } from './Sizer'
export { default as Event } from './Event'
export { default as Markers } from './Markers'
export { default as HorizontalBarChart } from './HorizontalBarChart'
export { default as PieChart } from './PieChart'
export { default as TimelineChart } from './TimelineChart'
export { default as Details } from './Details'
export { default as Bars } from './Bars'
export { default as BarChart } from './BarChart'
export default Chart
