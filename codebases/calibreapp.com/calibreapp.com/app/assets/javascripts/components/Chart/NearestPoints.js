import React, { useContext } from 'react'

import { ChartContext } from './'
import Dot from './Dot'
import Marker from './Marker'

export const NearestDots = () => {
  const { state, setState } = useContext(ChartContext)
  const dots = state.nearestPoints
    .filter(point => !point.hidden)
    .map(point => ({
      active: true,
      color: point.color,
      cx: point.x.scaled,
      cy: point.y.scaled,
      link: point.link,
      onMouseEnter: () => {
        const activeIndex = state.nearestPoints.indexOf(point)
        const updatedNearestPoints = state.nearestPoints.map(
          (point, index) => ({
            ...point,
            active: activeIndex === index
          })
        )
        setState({ ...state, nearestPoints: updatedNearestPoints })
      },
      onMouseLeave: () => {
        const index = state.nearestPoints.indexOf(point)
        state.nearestPoints[index] = {
          ...point,
          active: true
        }
        setState({ ...state })
      }
    }))

  return dots.map((dot, index) => <Dot key={index} {...dot} />)
}

export const NearestMarker = ({ height, margin }) => {
  const {
    state: { nearestMarker }
  } = useContext(ChartContext)

  return (
    !nearestMarker || (
      <Marker
        active={true}
        cx={nearestMarker.x.scaled}
        cy={height - margin.top - margin.bottom + 10}
      />
    )
  )
}
