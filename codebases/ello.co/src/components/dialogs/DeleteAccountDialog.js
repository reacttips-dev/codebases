import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { buttonStyle, headingStyle } from './ConfirmDialog'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const dialogStyle = css(s.relative, s.center, { maxWidth: 480 }, media(s.minBreak2, s.leftAlign))
const footnoteStyle = css(s.absolute, s.mt40, s.leftAlign)

class DeleteAccountDialog extends PureComponent {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      scene: 'renderConfirm',
    }
    this.counter = 5
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onClickJustKidding = () => {
    this.props.onDismiss()
  }

  onClickNotKidding = () => {
    this.props.onConfirm()
  }

  onClickConfirm = () => {
    this.setState({ scene: 'renderConfirmReally' })
  }

  onClickConfirmReally = () => {
    this.setState({ scene: 'renderCountdown' })
    this.interval = setInterval(() => {
      this.counter -= 1
      this.counterEl.innerHTML = this.counter
      if (this.counter <= 0) {
        this.onClickNotKidding()
      }
    }, 1000)
  }

  renderConfirm() {
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>Delete account?</h2>
        <button className={buttonStyle} onClick={this.onClickConfirm}>Yes</button>
        <button className={buttonStyle} onClick={this.onClickJustKidding}>No</button>
      </div>
    )
  }

  renderConfirmReally() {
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>Are you sure?</h2>
        <button className={buttonStyle} onClick={this.onClickConfirmReally}>Yes</button>
        <button className={buttonStyle} onClick={this.onClickJustKidding}>No</button>
        <p className={footnoteStyle}>
          * By deleting your account you remove your personal information from
          Ello. Your account cannot be restored.
        </p>
      </div>
    )
  }

  renderCountdown() {
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>
          <span>You will be redirected in </span>
          <span ref={(comp) => { this.counterEl = comp }}>{this.counter}</span>
          <span> ...</span>
        </h2>
        <button
          className={buttonStyle}
          onClick={this.onClickJustKidding}
          style={{
            display: 'block',
            position: 'absolute',
            width: `${100}%`,
            height: `${40 / 16}rem`,
            borderRadius: `${20 / 16}rem`,
            marginTop: `${40 / 16}rem`,
          }}
        >
          Cancel!
        </button>
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}

export default DeleteAccountDialog

