import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Container } from './'
import useContainerWidth from '../../hooks/useContainerWidth'

const Sizer = ({ aspectRatio, minHeight, children }) => {
  const containerRef = useRef()
  const [width] = useContainerWidth(containerRef)
  const height = Math.max(width / aspectRatio, minHeight)

  return (
    <Container ref={containerRef}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { containerRef, height, width })
      )}
    </Container>
  )
}

Sizer.defaultProps = {
  aspectRatio: 3,
  minHeight: 200,
  loading: false
}

Sizer.propTypes = {
  aspectRatio: PropTypes.number,
  minHeight: PropTypes.number
}

export default Sizer
