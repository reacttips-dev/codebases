import React from 'react'
import PropTypes from 'prop-types'

import { PositionOnAxis } from './'
import Line from './Line'

const Axis = ({ orientation, height, width }) => (
  <Line {...PositionOnAxis[orientation].line(height, width)} />
)

Axis.defaultProps = {
  height: 0,
  orientation: 'x',
  width: 0
}

Axis.propTypes = {
  height: PropTypes.number,
  orientation: PropTypes.oneOf(['x', 'y']),
  width: PropTypes.number
}

export default Axis
