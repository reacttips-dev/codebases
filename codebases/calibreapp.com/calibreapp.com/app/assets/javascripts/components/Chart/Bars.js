import React from 'react'
import styled from 'styled-components'

const Bar = styled.rect`
  fill: ${({ color, theme, hover }) =>
    theme.colors[`${color}${hover ? 'Active' : 'Inactive'}`]};
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`
Bar.defaultProps = {
  color: 'neutral',
  rx: 2,
  ry: 2
}

const Bars = ({ nearestSegment, segments }) => (
  <g>
    {segments.map((segment, index) => {
      let y = segment.y.scaled
      let height = segment.height.scaled
      if (segment.y.value === 0) {
        y -= 2
        height = 2
      }

      return (
        <Bar
          key={index}
          color={segment.color}
          active={segment.active}
          hover={nearestSegment && segment.id === nearestSegment.id}
          x={segment.x.scaled}
          y={y}
          width={segment.width.scaled}
          height={height + 2}
        />
      )
    })}
  </g>
)
Bars.defaultProps = {
  segments: []
}

export default Bars
