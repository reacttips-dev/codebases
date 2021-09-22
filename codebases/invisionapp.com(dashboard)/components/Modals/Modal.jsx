import React from 'react'
import PropTypes from 'prop-types'

import forEach from 'lodash/forEach'
import { IconButton } from '@invisionapp/helios'
import Close from '@invisionapp/helios/icons/Close'

import {
  DEFAULT_STAGGER_TIME,
  MODAL_BACKDROP_ENTER_TIME,
  MODAL_ZOOM_TIME
} from '../../constants/ModalConstants'

import animationStyles from '../../css/modal-animations.css'
import styles from '../../css/modal.css'

class Modal extends React.Component {
  constructor (props) {
    super(props)

    this.startUnmounting = this.startUnmounting.bind(this)

    this.animateInComponents = this.animateInComponents.bind(this)
    this.animateOutComponents = this.animateOutComponents.bind(this)
  }

  componentDidMount () {
    if (this.refs.modalBackdrop) {
      this.refs.modalBackdrop.classList.add(animationStyles[this.refs.modalBackdrop.dataset.animation + '-in'])
    }

    if (!this.props.fullScreen) {
      this.refs.modalContent.classList.add(animationStyles[this.refs.modalContent.dataset.animation + '-in'])
    }

    setTimeout(() => {
      this.animateInComponents(this.getRefs(this, 'main'), 0)
    }, this.props.fullScreen ? MODAL_ZOOM_TIME : MODAL_BACKDROP_ENTER_TIME)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.willUnmount && !this.props.willUnmount) {
      this.startUnmounting(this.props.delayTime)
    }
  }

  animateInComponents (components, index) {
    if (index < components.length && !this.props.willUnmount) {
      components[index].classList.remove(animationStyles[components[index].dataset.animation + '-out'])
      components[index].classList.add(animationStyles[components[index].dataset.animation + '-in'])

      setTimeout(() => {
        this.animateInComponents(components, index + 1)
      }, DEFAULT_STAGGER_TIME)
    }
  }

  animateOutComponents (components, index) {
    if (index >= 0) {
      if (components[index].classList.contains(animationStyles[components[index].dataset.animation + '-in'])) {
        components[index].classList.remove(animationStyles[components[index].dataset.animation + '-in'])
        components[index].classList.add(animationStyles[components[index].dataset.animation + '-out'])
      }

      setTimeout(() => {
        this.animateOutComponents(components, index - 1)
      }, DEFAULT_STAGGER_TIME)
    }
  }

  getRefs (self, match) {
    var refs = []

    forEach(self.refs, (ref, key) => {
      if (key.indexOf(match) !== -1) {
        refs.push(ref)
      }
    })

    return refs
  }

  startUnmounting (delayTime) {
    var mainComponents = this.getRefs(this, 'main')

    setTimeout(() => {
      this.animateOutComponents(mainComponents, mainComponents.length - 1)

      if (!!this.refs.modalContent && !this.props.fullScreen) {
        this.refs.modalContent.classList.add(animationStyles[this.refs.modalContent.dataset.animation + '-out'])
      }

      setTimeout(() => {
        if (this.refs.modalBackdrop) {
          this.refs.modalBackdrop.classList.add(animationStyles[this.refs.modalBackdrop.dataset.animation + '-out'])
        }
      }, this.props.fullScreen ? 300 : 0)
    }, delayTime || 0)
  }

  render () {
    return (
      <div className={`${this.props.className}${!this.props.fullScreen ? ' ' + styles.small : ''}`}>
        <div
          ref='modalBackdrop'
          data-animation='fade'
          onClick={!this.props.fullScreen ? this.props.handleCloseModal : null}
          className={`${styles.backdrop}${this.props.fullScreen ? ` ${styles.fullScreen}` : ''}`}
        />
        <div
          ref='modalContent'
          data-animation='zoom'
          className={`${styles.content}${this.props.fullScreen ? ` ${styles.fullScreen}` : ''}`}
          style={{
            width: this.props.width || null
          }}>
          <div
            ref='main3'
            data-animation={this.props.fullScreen ? 'fade' : ''}
            className={`${styles.close}${this.props.fullScreen ? ` ${styles.fullScreen}` : ''}`}
          >
            <IconButton
              tooltip='Close'
              tooltipPlacement='bottom'
              onClick={this.props.handleCloseModal}
            >
              <Close fill='text' size={32} />
            </IconButton>
          </div>
          {React.cloneElement(this.props.children, {
            animateInComponents: this.animateInComponents,
            animateOutComponents: this.animateOutComponents,
            getRefs: this.getRefs,
            startUnmounting: this.startUnmounting,
            willUnmount: this.props.willUnmount
          })}
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  delayTime: PropTypes.number,
  fullScreen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  width: PropTypes.number,
  willUnmount: PropTypes.bool
}

Modal.defaultProps = {
  delayTime: 0,
  fullScreen: true
}

export default Modal
