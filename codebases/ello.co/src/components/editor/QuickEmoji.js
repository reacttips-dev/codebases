import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import sampleSize from 'lodash/sampleSize'
import Emoji from '../assets/Emoji'
import { ElloQuickEmoji } from '../assets/Icons'
import { css, hover, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const options = [
  '+1', 'sparkles', 'metal', 'ok_hand', 'v', 'snowman', 'heart', 'panda_face',
  'clap', 'boom', 'star', 'wave', 'raised_hands', 'dizzy', 'sparkling_heart',
  'muscle', 'fire', 'fist', 'ello', 'bread',
]

const choiceButtonStyle = css(
  { marginTop: -5 },
  s.transitionOpacity,
  hover({ opacity: 0.5 }),
  select('& + &', s.ml20),
)

const QuickEmojiChoiceButton = ({ name, onClick }) =>
  (<button className={choiceButtonStyle} name={name} onClick={onClick}>
    <Emoji name={name} />
  </button>)

QuickEmojiChoiceButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

const wrapperStyle = css(
  s.absolute,
  s.zIndex2,
  s.color9,
  s.nowrap,
  // TODO: Set this from a prop
  parent('.editor.isComment', { top: 38, right: 20 }, media(s.minBreak2, { right: 30 })),
)
const wrapperActiveStyle = css(wrapperStyle, s.color5)

const listStyle = css(
  s.absolute,
  { top: 0, left: -150 },
  s.pl10,
  s.bgcF2,
  s.opacity0,
  s.transitionOpacity,
)
const listActiveStyle = css(listStyle, s.opacity1)

const toggleButtonStyle = css(s.transitionColor, hover(s.color5))

export default class QuickEmoji extends PureComponent {

  static propTypes = {
    onAddEmoji: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: false }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
    document.removeEventListener('touchstart', this.onDocumentClick)
  }

  onDocumentClick = () => {
    this.hide()
  }

  show = () => {
    this.setState({ isActive: true })
    document.addEventListener('click', this.onDocumentClick)
    document.addEventListener('touchstart', this.onDocumentClick)
  }

  hide = () => {
    this.setState({ isActive: false })
    document.removeEventListener('click', this.onDocumentClick)
    document.removeEventListener('touchstart', this.onDocumentClick)
  }

  emojiWasClicked = (e) => {
    const { onAddEmoji } = this.props
    onAddEmoji({ value: `:${e.target.name}:` })
    this.hide()
  }

  renderEmojis() {
    const samples = sampleSize(options, 4)
    return samples.map(sample =>
      <QuickEmojiChoiceButton key={sample} name={sample} onClick={this.emojiWasClicked} />,
    )
  }

  render() {
    const { isActive } = this.state
    if (isActive) {
      return (
        <div className={wrapperActiveStyle}>
          <div className={listActiveStyle}>
            {this.renderEmojis()}
          </div>
        </div>
      )
    }
    return (
      <div className={wrapperStyle}>
        <button className={toggleButtonStyle} onClick={this.show}>
          <ElloQuickEmoji />
        </button>
        <div className={listStyle} />
      </div>
    )
  }
}

