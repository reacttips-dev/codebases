import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ChartContext } from './'
import { Box } from '../Grid'
import { fade, transition } from '../../utils/style'
import truncate from '../../utils/smart-truncate'
import FormattedDate from '../FormattedDate'

const Wrapper = styled.a`
  animation: ${fade} 0.15s linear forwards;
  background: white;
  border: 1px solid ${props => props.theme.colors.grey200};
  border-radius: 3px;
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  color: inherit;
  display: block;
  left: ${props => props.left}px;
  padding: 5px 10px;
  pointer-events: auto;
  position: absolute;
  top: 100%;
  margin-top: ${props => -props.bottom + 20}px;
  text-deocration: inherit;
  transform: translateX(-50%);
  width: ${props => props.width}px;
  z-index: 2;

  &:after {
    background-color: ${props => props.theme.colors.grey200};
    bottom: 0;
    content: '';
    display: block;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    ${transition('opacity')};
    z-index: 0;
  }

  &:hover {
    &:after {
      opacity: 0.1;
    }
  }

  > div {
    white-space: nowrap;
  }
`

const Event = ({ margin }) => {
  const containerRef = useRef(null)
  const containerWidth = containerRef.current
    ? containerRef.current.offsetWidth
    : 0
  const {
    state: { nearestMarker }
  } = useContext(ChartContext)
  const width = 190
  let left = (nearestMarker && nearestMarker.x.scaled) || 0
  if (left + width > containerWidth) {
    left = containerWidth - width
  }

  return (
    <div ref={containerRef}>
      {!nearestMarker || (
        <Wrapper
          href={nearestMarker.link}
          target="_blank"
          bottom={margin.bottom}
          left={left + margin.left}
          width={width}
        >
          <Box fontSize={1}>{truncate(nearestMarker.name, 24)}</Box>
          <Box fontSize={1} color="grey300">
            <FormattedDate date={nearestMarker.x.value} />
          </Box>
          <Box fontSize={1} color="grey300">
            {nearestMarker.byline}
          </Box>
        </Wrapper>
      )}
    </div>
  )
}

Event.defaultProps = {
  margin: {}
}

Event.propTypes = {
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  })
}

export default Event
