import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import useComponentSize from '@rehooks/component-size'

import { Box } from '../Grid'
import FeedbackBlock from '../FeedbackBlock'
import { transition } from '../../utils/style'

const Content = styled(Box)`
  height: ${({ open, maxHeight }) => (open ? maxHeight : 0)}px;
  opacity: ${({ open }) => (open ? 1 : 0)};
  overflow: hidden;
  position: relative;
  visibiltiy: ${({ open }) => (open ? 'visible' : 'hidden')};
  transition: ${transition()};
`

const Feedback = feedback => {
  const { duration, type, message, onDismiss, ...props } = feedback
  const ref = useRef(null)
  const { height } = useComponentSize(ref)
  const [showFeedback, setShowFeedback] = useState()

  useEffect(() => {
    setShowFeedback(true)
    if (duration) {
      const timeout = setTimeout(() => setShowFeedback(false), duration)
      return () => clearTimeout(timeout)
    }
  }, [feedback])

  const handleDismiss = () => {
    setShowFeedback(false)
    onDismiss()
  }

  return (
    <Content open={showFeedback} maxHeight={height}>
      <Box ref={ref} {...props}>
        <FeedbackBlock type={type} onDismiss={onDismiss ? handleDismiss : null}>
          {message}
        </FeedbackBlock>
      </Box>
    </Content>
  )
}

Feedback.defaultProps = {
  duration: 5000,
  p: 3
}

export default Feedback
