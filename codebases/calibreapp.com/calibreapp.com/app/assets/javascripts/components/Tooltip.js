import React, { useRef, useEffect, cloneElement } from 'react'
import styled from 'styled-components'
import { useTooltip, TooltipPopup } from '@reach/tooltip'

const Popup = styled(TooltipPopup)`
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.colors.grey500};
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.grey50};
  font-size: 16px;
  line-height: 1.4;
  max-width: 450px;
  padding: 15px 20px;
  position: absolute;
  word-wrap: break-word;
`

const Container = styled.span`
  position: relative;

  * {
    cursor: pointer;
  }
`

const Trigger = styled.span`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
`

const Tooltip = ({ children, label, ariaLabel, alwaysShow, position }) => {
  const [trigger, tooltip] = useTooltip()
  const ref = useRef()

  const handleClick = event => {
    if (ref.current.contains(event.target)) {
      return
    }

    return trigger.onMouseLeave && trigger.onMouseLeave(event)
  }

  const handleTouch = () => {
    return trigger.onMouseLeave && trigger.onMouseLeave(event)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('touchstart', handleTouch, false)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('touchstart', handleTouch, false)
    }
  }, [])

  const onClick = event => {
    trigger.onMouseEnter && trigger.onMouseEnter(event)
    event.preventDefault()
    event.stopPropagation()
  }

  const overrideTooltip = {}
  if (alwaysShow) overrideTooltip.isVisible = true
  if (position) overrideTooltip.position = position

  return (
    <Container ref={ref}>
      <Trigger onClick={onClick} {...trigger} />
      {cloneElement(children, trigger)}

      <Popup
        {...tooltip}
        {...overrideTooltip}
        label={label}
        ariaLabel={ariaLabel}
        style={{ zIndex: 10 }}
      />
    </Container>
  )
}
export default Tooltip
