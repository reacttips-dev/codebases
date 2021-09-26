import React from 'react'
import styled from 'styled-components'

import { Flex, Box } from '../Grid'
import { Text } from '../Type'
import Tooltip from '../Tooltip'

const LEVELS = {
  xs: '20px',
  sm: '30px',
  md: '50px'
}
const Container = styled(Flex)`
  outline: 0;
`
Container.defaultProps = {
  borderRadius: '3px'
}

const Segment = styled(Box)`
  height: ${({ level }) => LEVELS[level]};
  color: white;
  overflow: hidden;
  position: relative;
  transition: all 0.25s cubic-bezier(0.25, 0.2, 0.015, 1.5);

  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

const HorizontalBarChart = ({ level, segments }) => (
  <Container flexWrap="nowrap">
    {segments
      .filter(segment => !segment.hidden)
      .map((segment, index) =>
        segment.value ? (
          <Segment
            key={index}
            backgroundColor={segment.color}
            width={`${segment.scaled}%`}
            level={level}
          >
            {!segment.name || (
              <Tooltip label={`${segment.name}: ${segment.formatted}`}>
                <Box pl={3} height={LEVELS[level]}>
                  <Text level="xs" color="inherit" lineHeight={LEVELS[level]}>
                    {segment.label === ' ' ? <>&nbsp;</> : segment.label}
                  </Text>
                </Box>
              </Tooltip>
            )}
          </Segment>
        ) : null
      )}
  </Container>
)

HorizontalBarChart.defaultProps = {
  segments: [],
  level: 'md'
}

export default HorizontalBarChart
