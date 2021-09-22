import React from 'react'
import styled from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { beziers } from '@invisionapp/helios/css/theme'

const animationBezier = beziers.out

type FadeWrapperProps = {
  drop?: boolean
  fadeMs: number
}
const FadeWrapper = styled.div`
  &.fade-enter {
    opacity: 0;
    transform: ${(props: FadeWrapperProps) => (props.drop ? 'translateY(-30px)' : 'none')};
  }
  &.fade-enter.fade-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity ${(props: FadeWrapperProps) => props.fadeMs}ms linear,
      transform ${(props: FadeWrapperProps) => props.fadeMs}ms ${animationBezier};
  }

  &.fade-exit {
    overflow: hidden;
    height: 0;
    opacity: 1;
    transform: translateY(0);
  }

  &.fade-exit.fade-exit-active {
    opacity: 0;
    transform: ${props => (props.drop ? 'translateY(-30px)' : 'none')};
    transition: opacity ${props => props.fadeMs}ms linear,
      transform ${props => props.fadeMs}ms ${animationBezier};
  }
`

type CrossFadeProps = FadeWrapperProps & {
  fadeKey: string
  children: any
  component?: any
}

const CrossFade = (props: CrossFadeProps) => {
  const { fadeKey, children, fadeMs, component, drop } = props

  return (
    <TransitionGroup component={component}>
      <CSSTransition {...props} key={fadeKey} classNames="fade" timeout={fadeMs}>
        <FadeWrapper className="wrapper" key={fadeKey} fadeMs={fadeMs} drop={drop}>
          <div className="wrappee">{children}</div>
        </FadeWrapper>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default CrossFade
