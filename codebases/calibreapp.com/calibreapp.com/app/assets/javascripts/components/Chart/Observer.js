import React from 'react'
import PropTypes from 'prop-types'
import { useInView } from 'react-intersection-observer'

import Sizer from './Sizer'

const Observer = ({ loading, children, triggerOnce, ...props }) => {
  const [inViewRef, inView] = useInView({ triggerOnce })

  return (
    <div ref={inViewRef}>
      <Sizer loading={loading || !inView} {...props}>
        {children}
      </Sizer>
    </div>
  )
}

Observer.defaultProps = {
  aspectRatio: 3,
  loading: false,
  minHeight: 200,
  triggerOnce: true
}

Observer.propTypes = {
  aspectRatio: PropTypes.number,
  loading: PropTypes.bool,
  minHeight: PropTypes.number
}

export default Observer
