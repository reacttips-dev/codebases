import React from 'react'
import styled from 'styled-components'

import { LoadingIcon } from './Icon'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.minHeight};
`

const Loader = ({ minHeight, size }) => {
  if (size === 'small') {
    return (
      <Wrapper minHeight={minHeight || '15px'}>
        <LoadingIcon height="15px" width="25px" />
      </Wrapper>
    )
  } else {
    return (
      <Wrapper minHeight={minHeight || '50vh'}>
        <LoadingIcon height="30px" width="75px" />
      </Wrapper>
    )
  }
}

export default Loader
