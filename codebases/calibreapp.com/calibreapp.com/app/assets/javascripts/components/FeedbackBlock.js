import React from 'react'
import styled from 'styled-components'
import { variant } from 'styled-system'

import { Box } from './Grid'
import { CrossIcon } from './Icon'

const feedbackStyle = variant({ key: 'feedback', prop: 'type' })

const StyledBlock = styled(Box)`
  border-left-width: 5px;
  border-left-style: solid;
  position: relative;
  word-break: break-word;

  a,
  a:visited {
    color: inherit;
    text-decoration: underline;

    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }

  ${feedbackStyle}
`

const Dismiss = styled(Box)`
  appearance: none;
  background: none;
  border: 0;
  line-height: 0;
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  top: 50%;

  ${feedbackStyle}
`
Dismiss.defaultProps = {
  as: 'button',
  mr: 2
}

const FeedbackBlock = ({ children, onDismiss, ...props }) => {
  return (
    <StyledBlock pr={4} p={2} data-qa="feedbackBlock" {...props}>
      {children}
      {!onDismiss || (
        <Dismiss type={props.type} onClick={onDismiss}>
          <CrossIcon />
        </Dismiss>
      )}
    </StyledBlock>
  )
}

export default FeedbackBlock
