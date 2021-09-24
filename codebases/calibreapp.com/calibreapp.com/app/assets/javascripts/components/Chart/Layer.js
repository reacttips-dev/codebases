import React, { useRef, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bisector } from 'd3-array'

import { ChartContext, dotPropTypes, markerPropTypes } from './'

const Layer = ({
  children,
  height,
  width,
  seriesPoints,
  seriesSegments,
  markerPoints,
  scale,
  margin,
  parentRef
}) => {
  const offset = margin.left
  const containerRef = useRef(null)
  const { state, setState } = useContext(ChartContext)

  const bisectX = bisector(d => d.x.value).left

  const findNearestPoint = (referenceData, x0, alwaysPrevious = false) => {
    const i = bisectX(referenceData, x0, 1)
    const d0 = referenceData[i - 1]
    if (alwaysPrevious) return d0

    const d1 = referenceData[i]
    return d1 && x0 - d0.x.value > d1.x.value - x0 ? d1 : d0
  }

  const findNearestSegment = (referenceData, x0) => {
    let nearestSegment
    referenceData.forEach(segment => {
      const start = segment.x.value
      const end = segment.x.value + segment.width.value

      if (!segment.hidden && segment.name && x0 >= start && x0 <= end) {
        nearestSegment = segment
      }
    })

    return nearestSegment
  }

  const handleMouseMove = event => {
    let nearestMarker, nearestPoint, nearestSegment
    const nearestPoints = []

    const xPosition = (event.layerX || event.offsetX) - offset
    const x0 = scale.x.invert(xPosition)

    if (seriesPoints) {
      nearestPoint = findNearestPoint(seriesPoints[0], x0)
      nearestMarker = findNearestPoint(markerPoints, x0, true)

      seriesPoints.forEach(points =>
        points.forEach(point => {
          if (
            +point.x.value === +nearestPoint.x.value &&
            point.y.value != null
          ) {
            nearestPoints.push(point)
          }
        })
      )
    } else if (seriesSegments) {
      nearestSegment = findNearestSegment(seriesSegments, x0)
    }

    setState({
      ...state,
      nearestPoint,
      nearestPoints,
      nearestMarker,
      nearestSegment
    })
  }

  const handleMouseOut = () => {
    setState({ nearestPoint: undefined, nearestPoints: [] })
  }

  useEffect(() => {
    containerRef.current.addEventListener('mousemove', handleMouseMove)
    parentRef.current.addEventListener('mouseleave', handleMouseOut)
    return () => {
      containerRef.current &&
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      parentRef.current &&
        parentRef.current.removeEventListener('mouseleave', handleMouseOut)
    }
  }, [scale])

  if (children) return <g ref={containerRef}>{children}</g>

  return <rect ref={containerRef} height={height} width={width} fill="white" />
}

Layer.defaultProps = {
  markerPoints: [],
  margin: {}
}

Layer.propTypes = {
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  }),
  parentRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired
  }).isRequired,
  seriesPoints: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(dotPropTypes))
  ),
  markerPoints: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(markerPropTypes))
  ),
  width: PropTypes.number.isRequired
}

export default Layer
