import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Wrapper from './Wrapper'

const Svg = styled.svg`
  position: relative;
`

const Chart = ({ children, height, width }) => (
  <Wrapper height={height}>
    <Svg width={width} height={height}>
      {children}
    </Svg>
  </Wrapper>
)

Chart.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

export default Chart
