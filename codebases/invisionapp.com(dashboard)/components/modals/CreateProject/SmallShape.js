import React from 'react'
import PropTypes from 'prop-types'

import { ARCH_PATH_D } from './ProjectShape'

const SmallShape = ({ isSelected, type }) => {
  const defaultProps = {
    fill: 'none',
    strokeWidth: 1.5,
    stroke: isSelected ? '#353CEE' : '#0F0F10',
    vectorEffect: 'non-scaling-stroke'
  }

  return (
    <div>
      <svg
        width={18}
        height={18}
        viewBox='0 0 18 18'>
        {type === 'square' && <rect x={0} y={0} width={15} height={15} transform='translate(1.5, 1.5)' {...defaultProps} /> }
        {type === 'circle' && <circle cx={9} cy={9} r={9} transform='translate(1, 1) scale(0.9)' {...defaultProps} /> }
        {type === 'arch' && <path d={ARCH_PATH_D} transform='translate(1.5, .5) scale(0.13)' {...defaultProps} /> }
      </svg>
    </div>
  )
}

SmallShape.propTypes = {
  isSelected: PropTypes.bool,
  type: PropTypes.oneOf(['square', 'circle', 'arch'])
}

export default SmallShape
