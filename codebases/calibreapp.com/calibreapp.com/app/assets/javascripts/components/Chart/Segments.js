import React, { useContext } from 'react'

import { ChartContext } from './'
import Segment from './Segment'

const Segments = ({ segments }) => {
  const {
    state: { nearestSegment }
  } = useContext(ChartContext)

  return segments
    .filter(segment => !segment.hidden)
    .map((segment, index) => {
      const active = nearestSegment ? nearestSegment.id === segment.id : true

      const props = {
        color: segment.color[active ? 'active' : 'inactive'],
        name: segment.name,
        x: segment.x.scaled,
        y: segment.y.scaled,
        width: segment.width.scaled,
        height: segment.height.scaled
      }
      return <Segment key={index} {...props} />
    })
}

export default Segments
