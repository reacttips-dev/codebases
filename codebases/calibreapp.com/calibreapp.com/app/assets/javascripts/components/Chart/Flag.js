import React, { useContext, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ChartContext } from './'
import { Flex, Box } from '../Grid'
import { fade, transition } from '../../utils/style'
import truncate from '../../utils/smart-truncate'

const Container = styled.div`
  height: 100%;
  left: ${props => props.left}px;
  pointer-events: none;
  position: absolute;
  top: 0;
  transform: ${props => props.transform};
  width: ${props => props.width}px;
  z-index: 2;
`

Container.defaultProps = {
  offset: 0,
  transform: 'none'
}

Container.propTypes = {
  offset: PropTypes.number,
  transform: PropTypes.string,
  width: PropTypes.number.isRequired
}

const Indicator = styled.div`
  text-align: ${props => props.align};
`

Indicator.defaultProps = {
  align: 'right'
}

Indicator.propTypes = {
  align: PropTypes.oneOf(['left', 'right'])
}

const Values = styled.ul`
  animation: ${fade} 0.15s linear forwards;
  background: white;
  list-style: none;
  margin: 0;
  opacity: 0;
  padding: 0;
  pointer-events: auto;
`

const Header = styled.li`
  background-color: ${props => props.theme.colors.grey500};
  border: 1px solid ${props => props.theme.colors.grey500};
  border-radius: 3px;
  border-bottom-${props => props.align}-radius: 0;
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  pointer-events: auto;
  ${transition('background-color')};

  &:hover {
    background-color: ${props => props.theme.colors.black};
  }
`

const Key = styled.li`
  align-items: center;
  ${props => `${props.align}: 0`};
  opacity: ${props => (props.active ? 1 : 0)};
  padding-${props => props.align}: 10px;
  position: absolute;
  transform: translateY(-50%);
  visibility: ${props => (props.active ? 'visible' : 'hidden')};
`

const Value = styled(Flex)`
  background: white;
  border: 1px solid ${props => props.theme.colors.grey200};
  border-left: 3px solid ${props => props.backgroundColor};
  border-radius: 3px;
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  padding: 10px;
  pointer-events: auto;
  position: relative;
  white-space: nowrap;

  &:after {
    background-color: ${props => props.backgroundColor};
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
      opacity: 0.2;
    }
  }
`
Value.defaultProps = {
  alignItems: 'center',
  fontSize: 1,
  color: 'grey400',
  width: '100%'
}

const Link = styled(RouterLink)`
  color: inherit;
  text-deocration: inherit;
`

const Flag = ({ margin }) => {
  const containerRef = useRef(null)
  const {
    state: { nearestPoint, nearestPoints }
  } = useContext(ChartContext)

  const containerWidth = containerRef.current
    ? containerRef.current.offsetWidth
    : 0
  const left = nearestPoint ? nearestPoint.x.scaled : 0
  const width = 190
  let flagOffset = 0
  let align = 'left'
  let transform = `translateX(${margin.left}px)`
  if (left + margin.left + width > containerWidth) {
    align = 'right'
    transform = `translateX(-${width - margin.left}px)`
  }

  return (
    <div ref={containerRef}>
      {!nearestPoint || (
        <React.Fragment>
          <Container
            left={left}
            offset={flagOffset}
            transform={transform}
            width={width}
          >
            <Values>
              <Header align={align}>
                <Link to={nearestPoint.link}>
                  <Box fontSize={1} color="grey100">
                    {nearestPoint.x.name}
                  </Box>
                  <Box fontSize={1} color="grey300">
                    {nearestPoint.x.formatted}
                  </Box>
                </Link>
              </Header>
              {nearestPoints.map((point, index) => (
                <Key
                  to={point.link}
                  key={index}
                  align={align}
                  active={point.active}
                  style={{ top: `${point.y.scaled + margin.top}px` }}
                >
                  <Link to={point.link}>
                    <Value backgroundColor={point.color}>
                      <Box flex={1}>{truncate(point.y.name, 24)}</Box>
                      <Box ml="3px">
                        <strong>{point.y.formatted}</strong>
                      </Box>
                    </Value>
                  </Link>
                </Key>
              ))}
            </Values>
          </Container>
        </React.Fragment>
      )}
    </div>
  )
}

Flag.defaultProps = {
  margin: {}
}

Flag.propTypes = {
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  })
}

export default Flag
