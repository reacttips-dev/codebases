import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FormControl from '../forms/FormControl'
import { CheckIconLG } from '../assets/Icons'
import { DismissButton } from '../../components/buttons/Buttons'
import { hireUser } from '../../networking/api'
import { css, disabled, focus, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const dialogStyle = css(
  s.fullWidth,
  { maxWidth: 440 },
  select('& .CheckIconLG', s.absolute, { top: 7, left: -40, transform: 'scale(0.6)' }),
  select('& .CheckIconLG > g', { stroke: '#00d100' }),
)
const headingStyle = css(s.relative, s.mb30, s.fontSize18, media(s.minBreak2, s.fontSize24))
const buttonStyle = css(
  { height: 50, lineHeight: '50px', padding: '0 20px', borderRadius: 5 },
  s.fontSize14,
  s.colorA,
  s.center,
  { transition: 'background-color 0.2s ease, color 0.2s ease' },
  focus(s.colorWhite),
  hover(s.colorWhite),
  disabled(s.colorWhite, s.bgcA),
)
const confirmButtonStyle = css(buttonStyle, s.mr10, s.colorWhite, s.bgcGreen)
const okayButtonStyle = css(
  buttonStyle,
  s.fullWidth,
  s.colorWhite,
  s.bgcA,
  focus(s.bgc9),
  hover(s.bgc9),
)

export default class MessageDialog extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    titlePrefix: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.state = { isValid: false, scene: 'renderCompose' }
    this.messageValue = ''
  }

  onChangeMessageControl = ({ message }) => {
    this.messageValue = message
    this.updateFormState()
  }

  onConfirm = () => {
    this.props.onConfirm({
      message: this.messageValue,
    })
    this.setState({ scene: 'renderSent' })
  }

  updateFormState() {
    const { isValid } = this.state
    if (!isValid && this.messageValue.length) {
      this.setState({ isValid: true })
    } else if (isValid && !this.messageValue.length) {
      this.setState({ isValid: false })
    }
  }

  renderCompose() {
    const { name, onDismiss, titlePrefix } = this.props
    const { isValid } = this.state
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>{`${titlePrefix} ${name}`}</h2>
        <form
          action={hireUser(null).path}
          className="MessageForm"
          id="MessageForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={this.onConfirm}
        >
          <FormControl
            classList="MessageMessageControl isBoxControl"
            id="message"
            kind="textarea"
            label="Message"
            name="message[message]"
            onChange={this.onChangeMessageControl}
            placeholder="Message"
            tabIndex="2"
          />
        </form>
        <button
          className={confirmButtonStyle}
          disabled={!isValid}
          onClick={this.onConfirm}
        >
          Submit
        </button>
        <button
          className={buttonStyle}
          onClick={onDismiss}
        >
          Cancel
        </button>
        <DismissButton />
      </div>
    )
  }

  renderSent() {
    const { name, onDismiss } = this.props
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>
          <CheckIconLG />
          <span>{`Email sent to ${name}`}</span>
        </h2>
        <button
          className={okayButtonStyle}
          onClick={onDismiss}
        >
          Okay
        </button>
        <DismissButton />
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}

