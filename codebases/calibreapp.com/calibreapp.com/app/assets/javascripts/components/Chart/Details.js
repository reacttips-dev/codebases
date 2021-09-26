import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useComponentSize from '@rehooks/component-size'

import { ChartContext } from './'
import { Box } from '../Grid'
import { fade } from '../../utils/style'
import truncate from '../../utils/smart-truncate'

const Wrapper = styled.div`
  pointer-events: none;
`

const StyledDetail = styled(Box)`
  animation: ${fade} 0.15s linear forwards;
  cursor: pointer;
  left: ${props => props.left}px;
  pointer-events: auto;
  position: absolute;
  top: 100%;
  margin-top: ${props => -props.bottom}px;
  overflow: hidden;
  transform: translateX(-50%);
  z-index: 2;

  &:hover {
    &:after {
      opacity: 0.1;
    }
  }

  > div {
    white-space: nowrap;
  }
`
StyledDetail.defaultProps = {
  role: 'button',
  backgroundColor: 'grey500',
  borderRadius: '3px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  color: 'grey100',
  fontSize: 1,
  lineHeight: 'lg',
  maxWidth: '320px',
  px: '20px',
  py: '15px'
}

const Detail = ({ left, containerWidth, margin, children }) => {
  const ref = useRef(null)
  const { width } = useComponentSize(ref)
  const right = left + width / 2
  if (right > containerWidth) {
    left -= right - containerWidth
  }

  return (
    <StyledDetail ref={ref} left={left + margin.left} bottom={margin.bottom}>
      {children}
    </StyledDetail>
  )
}

const Details = ({ margin }) => {
  const containerRef = useRef(null)
  const containerWidth = containerRef.current
    ? containerRef.current.offsetWidth
    : 0
  const {
    state: { nearestSegment }
  } = useContext(ChartContext)
  let left =
    (nearestSegment &&
      nearestSegment.x.scaled + nearestSegment.width.scaled / 2) ||
    0

  return (
    <Wrapper ref={containerRef}>
      {!nearestSegment || (
        <Detail margin={margin} left={left} containerWidth={containerWidth}>
          <Box fontSize={1} textAlign="center">
            {nearestSegment.name}
          </Box>
          {nearestSegment.formatted.map((detail, index) => (
            <Box
              key={index}
              mt={index === 0 ? '5px' : 0}
              fontSize={1}
              color="grey300"
            >
              {truncate(detail, 50)}
            </Box>
          ))}
        </Detail>
      )}
    </Wrapper>
  )
}

Details.defaultProps = {
  margin: {}
}

Details.propTypes = {
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  })
}
export default Details
