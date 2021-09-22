import React from 'react'
import styled from 'styled-components'

const ModalControl = styled(({ children, ...rest }) => {
  return <Wrapper {...rest}>{children}</Wrapper>
})`
  position: absolute;
  background-image: none;

  & path {
    transition: fill 0.15s ease-in-out;
  }

  & span {
    display: block;
    transition: color 0.15s ease-in-out;
  }
`

type Orientation = 'left' | 'right'
const getStyles = ({ orientation }: { orientation: Orientation }) => {
  switch (orientation) {
    case 'left':
      return `
      left: 20px;

      & > a {
        left: 0px;
      }
      `
    case 'right':
      return `
      right: 20px;
      & > a {
        right: 0px;
      }
      `
    default:
      return ''
  }
}

const Wrapper = styled.div`
  position: absolute;
  top: 20px;

  ${getStyles};
`

ModalControl.displayName = 'ModalControl'

export default ModalControl
