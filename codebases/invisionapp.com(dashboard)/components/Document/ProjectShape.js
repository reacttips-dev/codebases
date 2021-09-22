import React from 'react'
import PropTypes from 'prop-types'

import { PROP_TYPE_COLOR } from '../../constants/CustomPropTypes'

import {
  PROJECT_SHAPES,
  PROJECT_SHAPE_NONE,
  PROJECT_SHAPE_SQUARE_UP,
  PROJECT_SHAPE_SQUARE_DOWN,
  PROJECT_SHAPE_CIRCLE_UP,
  PROJECT_SHAPE_CIRCLE_DOWN,
  PROJECT_SHAPE_ARCH_UP,
  PROJECT_SHAPE_ARCH_DOWN
} from '../../constants/ProjectTiles'

const DEFAULT_WIDTH = 208
const DEFAULT_HEIGHT = 208
const INNER_SIZE = 121
const INNER_MARGIN = 12

const ARCH_PATH_D = 'M120.714+1.08927L0.71409+0.852993C0.67471+20.853+0.63533+40.8529+0.59595+60.8529C0.530703+93.9899+27.3407+120.906+60.4777+120.971C93.6147+121.036+120.53+94.2262+120.596+61.0892C120.635+41.0892+120.674+21.0892+120.714+1.08927Z'
const ARCH_INVERT_PATH_D = 'M1+121L121+121C121+101+121+81+121+61C121+27.8629+94.1371+1+61+1C27.8629+1+1+27.8629+1+61C1+81+1+101+1+121Z'

const ProjectShape = ({ shape, color }) => {
  const isSquare = () => [PROJECT_SHAPE_NONE, PROJECT_SHAPE_SQUARE_DOWN, PROJECT_SHAPE_SQUARE_UP].indexOf(shape) >= 0
  const isCircle = () => [PROJECT_SHAPE_CIRCLE_UP, PROJECT_SHAPE_CIRCLE_DOWN].indexOf(shape) >= 0
  const isArch = () => [PROJECT_SHAPE_ARCH_UP, PROJECT_SHAPE_ARCH_DOWN].indexOf(shape) >= 0

  const width = DEFAULT_WIDTH + INNER_MARGIN
  const height = DEFAULT_HEIGHT + (INNER_MARGIN * 2)

  const primaryProps = {
    fill: color,
    stroke: 'none'
  }

  const innerProps = {
    stroke: '#1d1d1f',
    strokeWidth: 1.25,
    fill: 'none',
    strokeLinecap: 'butt',
    strokeLinejoin: 'bevel',
    strokeDasharray: '5,3'
  }

  const renderShape = () => {
    const shapeDirection = {
      [PROJECT_SHAPE_NONE]: 'up',
      [PROJECT_SHAPE_SQUARE_UP]: 'up',
      [PROJECT_SHAPE_CIRCLE_UP]: 'up',
      [PROJECT_SHAPE_ARCH_UP]: 'up',
      [PROJECT_SHAPE_SQUARE_DOWN]: 'down',
      [PROJECT_SHAPE_CIRCLE_DOWN]: 'down',
      [PROJECT_SHAPE_ARCH_DOWN]: 'down'
    }

    const dir = shapeDirection[shape]

    const x = 0
    const y = INNER_MARGIN
    const innerX = width - INNER_SIZE - 1.25
    const innerY = dir === 'up' ? 1.25 : height - INNER_SIZE - 1.25

    if (isCircle()) {
      const r = DEFAULT_WIDTH / 2
      const innerR = INNER_SIZE / 2

      return (
        <>
          <circle cx={x + r} cy={y + r} r={r} {...primaryProps} />
          <circle cx={innerX + innerR} cy={innerY + innerR} r={innerR} {...innerProps} />
        </>
      )
    } else if (isSquare()) {
      return (
        <>
          <rect x={x} y={y} width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} {...primaryProps} />
          <rect x={innerX} y={innerY} width={INNER_SIZE} height={INNER_SIZE} {...innerProps} />
        </>
      )
    } else if (isArch()) {
      const scale = DEFAULT_WIDTH / INNER_SIZE
      const translate = `0 ${INNER_MARGIN}`
      const innerTranslate = `${innerX} ${innerY}`

      return (
        <>
          <path
            d={ARCH_PATH_D}
            transform={`translate(${translate}) scale(${scale})`}
            {...primaryProps}
          />

          <path
            d={dir === 'up' ? ARCH_PATH_D : ARCH_INVERT_PATH_D}
            transform={`translate(${innerTranslate}) scale(1)`}
            {...innerProps}
          />
        </>
      )
    }

    return null
  }

  return (
    <svg
      aria-hidden='true'
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}>
      { renderShape() }
    </svg>
  )
}

ProjectShape.propTypes = {
  color: PROP_TYPE_COLOR,
  shape: PropTypes.oneOf(PROJECT_SHAPES)
}

export default ProjectShape
