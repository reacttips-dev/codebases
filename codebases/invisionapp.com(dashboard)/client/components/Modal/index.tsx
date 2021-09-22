import React from 'react'
import { Motion, spring } from 'react-motion'

type ModalProps = {
  isVisible?: boolean
  closePortal?: () => void
  onBack?: () => void
  children: React.ReactChildren
}

class Modal extends React.Component<ModalProps> {
  static defaultProps = {
    closeButton: true,
    backButton: false
  }

  renderPortal() {
    const { isVisible, closePortal, onBack } = this.props
    const styleConfig = {
      stiffness: 200,
      damping: 25,
      precision: 0.05
    }

    return (
      <Motion
        defaultStyle={{ opacity: 0 }}
        style={{ opacity: spring(isVisible ? 1 : 0, styleConfig) }}
      >
        {interpolatedStyle => {
          return (
            <div key="modal" style={{ ...interpolatedStyle, zIndex: 1000, position: 'fixed' }}>
              {React.cloneElement(this.props.children as any, {
                isVisible,
                closePortal,
                onBack
              })}
            </div>
          )
        }}
      </Motion>
    )
  }

  render() {
    if (this.props.children) {
      return this.renderPortal()
    }

    return null
  }
}

export default Modal
