import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isIOS } from '../../lib/jello'
import Avatar from '../assets/Avatar'
import Emoji from '../assets/Emoji'
import { MarkerIcon } from '../assets/Icons'
import Completion from './Completion'
import { getPositionFromSelection } from '../editor/SelectionUtil'
import { addKeyObject, removeKeyObject } from '../viewport/KeyComponent'
import { addScrollObject, removeScrollObject } from '../viewport/ScrollComponent'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

const baseStyle = css(
  s.fixed,
  s.zIndex2,
  s.fullWidth,
  { height: 235 },
  s.overflowScrollWebY,
  s.fontSize14,
  media(s.minBreak2, { maxWidth: 240, height: 320 }),
)

export const emojiRegex = /\s?:{1}(\w+|\+|-):{0}$/
export const userRegex = /(\s|^)@{1}\w+/

export default class Completer extends PureComponent {

  static propTypes = {
    completions: PropTypes.object.isRequired,
    deviceSize: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onCompletion: PropTypes.func.isRequired,
  }

  static defaultProps = {
    deviceSize: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      // scrollY: 0, // NOTE: reported by eslint as unused, therefore commented
    }
  }

  componentDidMount() {
    addKeyObject(this)
    addScrollObject(this)
  }

  componentWillUnmount() {
    removeKeyObject(this)
    removeScrollObject(this)
  }

  onKeyDown(e) {
    if ((!e.shiftKey && e.which === 9) || e.which === 40) {
      e.preventDefault()
      this.nextSelection()
    } else if ((e.shiftKey && e.which === 9) || e.which === 38) {
      e.preventDefault()
      this.prevSelection()
    } else if (e.which === 13) {
      e.preventDefault()
      this.submit()
    } else if (e.which === 27) {
      e.preventDefault()
      this.props.onCancel()
    }
  }

  /* NOTE: reported by eslint as unused, therefore commented
  onScroll({ scrollY }) {
    this.setState({ scrollY })
  }
  */

  nextSelection() {
    const { completions } = this.props
    let { selectedIndex } = this.state
    selectedIndex += 1
    if (selectedIndex > completions.get('data').size - 1) { selectedIndex = 0 }
    this.setState({ selectedIndex })
  }

  prevSelection() {
    const { completions } = this.props
    let { selectedIndex } = this.state
    selectedIndex -= 1
    if (selectedIndex < 0) selectedIndex = completions.get('data').size - 1
    this.setState({ selectedIndex })
  }

  submit() {
    const { onCompletion } = this.props
    const { selectedIndex } = this.state
    onCompletion({ value: this[`completion_${selectedIndex}`].getValue() })
  }

  renderUsers() {
    const { completions, onCompletion } = this.props
    const { selectedIndex } = this.state
    return (
      completions.get('data').map((completion, i) =>
        (<Completion
          className={i === selectedIndex ? 'isActive UserCompletion' : 'UserCompletion'}
          key={`completion_${completion.get('name')}`}
          asset={<Avatar className="isTiny" sources={Immutable.fromJS({ tmp: { url: completion.get('imageUrl') } })} />}
          label={`@${completion.get('name')}`}
          ref={(comp) => { this[`completion_${i}`] = comp }}
          onClick={onCompletion}
        />),
      )
    )
  }

  renderEmoji() {
    const { completions, onCompletion } = this.props
    const { selectedIndex } = this.state
    return (
      completions.get('data').map((completion, i) =>
        (<Completion
          className={i === selectedIndex ? 'isActive EmojiCompletion' : 'EmojiCompletion'}
          key={`completion_${completion.get('name')}`}
          asset={<Emoji key={completion.get('name')} src={completion.get('imageUrl')} />}
          label={`:${completion.get('name')}:`}
          ref={(comp) => { this[`completion_${i}`] = comp }}
          onClick={onCompletion}
        />),
      )
    )
  }

  renderLocations() {
    const { completions, onCompletion } = this.props
    const { selectedIndex } = this.state
    return (
      completions.get('data').map((completion, i) =>
        (<Completion
          className={i === selectedIndex ? 'isActive LocationCompletion' : 'LocationCompletion'}
          key={`completion_${completion.get('location')}`}
          asset={<MarkerIcon />}
          label={`${completion.get('location')}`}
          ref={(comp) => { this[`completion_${i}`] = comp }}
          onClick={onCompletion}
        />),
      )
    )
  }

  render() {
    const { completions, deviceSize } = this.props
    if (!completions || !completions.get('data', Immutable.List()).size) {
      return null
    }

    let style = {}
    const type = completions.get('type')
    if (type === 'location') {
      const control = document.querySelector('.LocationControl')
      const locationPos = control ? control.getBoundingClientRect() : { top: -200, left: -666 }
      if (deviceSize === 'mobile') {
        style = { top: isIOS() ? locationPos.bottom + window.pageYOffset : locationPos.bottom }
      } else {
        style = { top: locationPos.bottom, left: locationPos.left }
      }
    } else {
      const pos = getPositionFromSelection()
      if (!pos) {
        style = { top: -200, left: -666 }
      } else if (deviceSize === 'mobile') {
        style = { top: pos.top + 20 }
      } else if (pos) {
        style = { top: pos.top + 20, left: pos.left }
      }
    }
    let completed = null
    switch (type) {
      case 'user':
        completed = this.renderUsers()
        break
      case 'emoji':
        completed = this.renderEmoji()
        break
      case 'location':
        completed = this.renderLocations()
        break
      default:
        break
    }
    return (
      <div style={style} className={baseStyle}>
        {completed}
      </div>
    )
  }
}

