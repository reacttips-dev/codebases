import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { fade } from '../../utils/style'

const Container = styled.div`
  animation: ${fade} 0.15s linear forwards;
  line-height: 0;
  opacity: 0;
  height: ${({ height }) => height}px;
  position: relative;
  width: 100%;
  z-index: 1;
`

const Content = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`

const Wrapper = ({ height, children }) => (
  <Container height={height}>
    <Content>{children}</Content>
  </Container>
)

Wrapper.propTypes = {
  height: PropTypes.number.isRequired
}

export default Wrapper
