import * as React from 'react'
import { StaggeredMotion, spring } from 'react-motion'
import styled from 'styled-components'
import { Link, IconButton } from '@invisionapp/helios'
import BackIcon from '@invisionapp/helios/icons/Back'
import CloseIcon from '@invisionapp/helios/icons/Close'
import Logo from '@invisionapp/helios/icons/InVision'
import ModalControl from './ModalControl'

const INITIAL_OPACITY = 0

const getDefaultStyles = (verticalOffset: number, children: React.ReactChildren) => {
  return React.Children.map(children, () => {
    return { y: verticalOffset, opacity: INITIAL_OPACITY }
  })
}

const getStyles = (isVisible: boolean, verticalOffset: number, prevStyles: any[]) => {
  const springConfig = {
    stiffness: 200,
    damping: 25,
    precision: 0.05
  }

  if (!prevStyles) {
    return []
  }

  return prevStyles.map((_, i) => {
    let ySpring
    let opacitySpring

    /**
     * `isVisible` is the state the modal is transitioning to, e.g., `isVisible === true` means
     *  the modal was hidden and is now transitioning to the open/visible state.
     */
    if (isVisible) {
      ySpring = i === 0 ? 0 : prevStyles[i - 1].y
      opacitySpring = i === 0 ? 1 : prevStyles[i - 1].opacity
    } else {
      ySpring = i === 0 ? verticalOffset : prevStyles[i - 1].y
      opacitySpring = i === 0 ? INITIAL_OPACITY : prevStyles[i - 1].opacity
    }

    return {
      y: spring(ySpring, springConfig),
      opacity: spring(opacitySpring, springConfig)
    }
  })
}

const handleBack = (onBack: (callback: any) => void, closePortal: () => void) => {
  onBack(closePortal)
}

type ModalContentProps = {
  children: any
  closePortal: () => void
  isVisible?: boolean
  onBack: (callback: any) => void
  backButton?: boolean
  closeButton?: boolean
  closeWarning?: string
  showWarning?: boolean
  displayLogo?: boolean
  verticalOffset?: number
}

const ModalContent = ({
  children,
  closePortal,
  isVisible,
  onBack,
  backButton,
  closeButton,
  closeWarning,
  showWarning,
  displayLogo,
  verticalOffset,
  ...rest
}: ModalContentProps) => {
  // @ts-ignore
  const styles = getStyles.bind(this, isVisible ?? 0, verticalOffset)
  let modalBack

  if (onBack) {
    modalBack = handleBack.bind(null, onBack, closePortal)
  }

  return (
    <Wrapper {...rest}>
      {backButton && (
        <ModalControl orientation="left">
          <IconButton withTooltip={false} onClick={modalBack}>
            <BackIcon size={32} />
          </IconButton>
        </ModalControl>
      )}
      {displayLogo && !backButton && (
        <LogoLink href="/">
          <Logo size={24} />
        </LogoLink>
      )}
      {closeButton && (
        <ModalControl orientation="right" showWarning={showWarning}>
          <IconButton
            tooltipPlacement="left"
            size="larger"
            tooltip={showWarning && closeWarning ? closeWarning : 'Close'}
            onClick={closePortal}
            withTooltipRelativeWrapper
            tooltipChevron="center"
          >
            <CloseIcon size={32} />
          </IconButton>
        </ModalControl>
      )}
      <StaggeredMotion
        defaultStyles={getDefaultStyles(verticalOffset ?? 0, children)}
        styles={styles}
      >
        {(interpolatedStyles: any[]) => {
          const styles = interpolatedStyles.map((_, i) => {
            return {
              WebkitTransform: `translate3d(0, ${interpolatedStyles[i].y}px, 0)`,
              msTransform: `translate3d(0, ${interpolatedStyles[i].y}px, 0)`,
              transform: `translate3d(0, ${interpolatedStyles[i].y}px, 0)`,
              opacity: interpolatedStyles[i].opacity
            }
          })

          const childrenWithProps = React.Children.map(children, (child, i) => {
            // @ts-ignore
            return React.cloneElement(child, { style: styles[i] })
          })

          return <div className="modal-content">{childrenWithProps}</div>
        }}
      </StaggeredMotion>
    </Wrapper>
  )
}

const LogoLink = styled(Link)`
  position: absolute;
  z-index: ${props => props.theme.zindex.base};
  top: 26px;
  left: 26px;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  transition: background-color 120ms linear;

  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: #fff;
  overflow-y: scroll;
`

ModalContent.defaultProps = {
  closeButton: true,
  backButton: false,
  displayLogo: false,
  verticalOffset: 200
}

ModalContent.displayName = 'ModalContent'

export default ModalContent
