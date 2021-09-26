import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { chartColors } from '../../../theme'
import { Flex, Box, InlineBox } from '../../Grid'

const Dot = styled.circle`
  fill: ${props => props.color};
`
Dot.defaultProps = {
  cx: 4,
  cy: 4,
  r: 4
}

const Button = styled(InlineBox)`
  background: none;
  border: 0;
  outline: 0;
  padding: 0;
`
Button.defaultProps = {
  as: 'button'
}

const Legend = ({ series }) => {
  return (
    <div>
      {series.map((set, index) => {
        return (
          <Button
            as={set.onClick ? 'button' : 'span'}
            key={index}
            ml={index === 0 ? 'auto' : 2}
            onClick={set.onClick}
            mb={1}
          >
            <Flex alignItems="baseline">
              <Box mr="5px">
                <svg height={8} width={8} opacity={set.hidden ? '0.2' : '1'}>
                  <Dot color={set.color || chartColors[index]} />
                </svg>
              </Box>
              <Box fontSize={2}>{set.name}</Box>
            </Flex>
          </Button>
        )
      })}
    </div>
  )
}

Legend.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  )
}

export { default as ProfileLegend } from './ProfileLegend'

export default Legend
