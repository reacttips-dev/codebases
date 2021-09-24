import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { DismissButton } from '../../components/buttons/Buttons'
import { before, css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const flags = {
  spam: 'Spam',
  violence: 'Violence',
  copyright: 'Copyright infringement',
  threatening: 'Threatening',
  hate_speech: 'Hate Speech',
  adult: 'Adult content that isn\'t marked NSFW*',
  offensive: 'I don\'t like it',
}

const OFFSETS = { mobile: 70, tablet: 80, desktop: 100 }

const dialogStyle = css(
  { maxWidth: 480 },
  s.colorBlack,
  s.bgcWhite,
  media(s.minBreak2, { minWidth: 480, maxWidth: 580 }),
)

const headingStyle = css(s.hv40, s.lh40, s.mb20, s.fontSize18, media(s.minBreak2, s.fontSize24))

const footnoteStyle = css(
  { margin: '20px 0 0' },
  before({ marginLeft: -10, content: '"* "' }),
)

const buttonStyle = css(
  s.hv60,
  s.lh60,
  s.fontSize14,
  s.colorWhite,
  s.bgcBlack,
  s.borderBlack,
  { transition: 'background-color 0.2s ease, border-color 0.2s ease, width 0.2s ease' },
  hover(s.bgc6, { borderColor: '#666' }),
)

const okayAndChoiceButtons = css(
  s.relative,
  s.zIndex2,
  s.block,
  s.fullWidth,
  s.py0,
  s.px20,
  s.alignLeft,
)

const okayButtonStyle = css(buttonStyle, okayAndChoiceButtons, s.center)
const choiceButtonStyle = css(
  buttonStyle,
  okayAndChoiceButtons,
  s.leftAlign,
  modifier('.isActive', { width: 'calc(100% - 140px)', borderColor: '#666' }, s.bgc6),
  select('& + &', s.mt10),
)
const flagButtonStyle = css(
  buttonStyle,
  s.absolute,
  { top: 0, right: 20, minWidth: 120 },
  s.zIndex1,
  media(s.minBreak4, { right: 40 }),
)

export default class FlagDialog extends Component {

  static propTypes = {
    deviceSize: PropTypes.string.isRequired,
    onResponse: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      activeChoice: null,
      scene: 'renderChoicesScreen',
    }
  }

  onClickChoiceWasMade = () => {
    const { onResponse } = this.props
    const { activeChoice } = this.state
    this.setState({ scene: 'renderConfirmationScreen' })
    onResponse({ flag: activeChoice })
  }

  onClickChoice = (e) => {
    const { activeChoice } = this.state
    const dataFlag = e.target.dataset.flag
    const newChoice = dataFlag === activeChoice ? null : dataFlag
    this.setState(
      { activeChoice: newChoice },
    )
  }

  renderFlagChoices() {
    const { activeChoice } = this.state
    const buttons = []
    Object.keys(flags).forEach((choice) => {
      buttons.push(
        <button
          className={classNames({ isActive: activeChoice === choice }, `${choiceButtonStyle}`)}
          data-flag={choice}
          key={choice}
          onClick={this.onClickChoice}
        >
          {flags[choice]}
        </button>,
      )
    })
    return buttons
  }

  renderChoicesScreen() {
    const { activeChoice } = this.state
    const index = Object.keys(flags).indexOf(activeChoice)
    const top = index < 0 ? null : (70 * index) + OFFSETS[this.props.deviceSize]
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>Would you like to flag this content as:</h2>
        <div>
          {this.renderFlagChoices()}

          <button
            className={flagButtonStyle}
            onClick={this.onClickChoiceWasMade}
            style={top ? { top, display: 'inline-block' } : { display: 'none' }}
          >
            Submit
          </button>

        </div>
        <p className={footnoteStyle}>
          Ello allows adult content as long as it complies with our rules and is
          marked NSFW. You may temporarily still see this content. You may want
          to block or mute this user as well.
        </p>
        <DismissButton />
      </div>
    )
  }

  renderConfirmationScreen() {
    const { onConfirm } = this.props
    return (
      <div className={`${baseDialogStyle} ${dialogStyle}`}>
        <h2 className={headingStyle}>Thank you.</h2>
        <p>
          You may temporarily still see this content. You may want to block or
          mute this user as well.
        </p>
        <div>
          <button className={okayButtonStyle} onClick={onConfirm}>Okay</button>
        </div>
        <DismissButton />
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}

