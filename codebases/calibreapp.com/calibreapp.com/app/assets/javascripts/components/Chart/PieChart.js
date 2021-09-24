import React from 'react'
import styled from 'styled-components'

const Chart = styled.svg`
  background: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.colors.grey50};
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  transform: rotate(-90deg);
`

const Circle = styled.circle`
  fill: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.colors.grey50};
  stroke: ${({ theme, color }) => color || theme.colors.blue300};
  stroke-width: 50;
  transition: stroke-dasharray 0.3s ease;
`

const PieChart = ({ value, color, title }) => {
  const circumference = 158
  const portion = (value * circumference) / 100

  return (
    <Chart width="100" height="100">
      <Circle
        r="25"
        cx="50"
        cy="50"
        strokeDasharray={`${portion}, ${circumference}`}
        color={color}
      />
      <title>{title}</title>
    </Chart>
  )
}

export default PieChart
