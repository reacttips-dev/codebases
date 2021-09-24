import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import { CheckCircleIcon, CheckIconSM, PlusCircleIcon, PlusIconSM } from '../assets/Icons'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { css, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const blockMuteStyle = {
  color: '#fff !important',
  backgroundColor: '#f00',
  borderColor: '#f00',
}

const buttonStyle = css(
  {
    width: 100,
    height: 30,
    paddingRight: 10,
    paddingLeft: 4,
    borderRadius: 15,
  },
  s.py0,
  s.overflowHidden,
  s.fontSize12,
  s.lh30,
  s.colorWhite,
  s.center,
  s.nowrap,
  s.bgcGreen,
  s.borderGreen,
  { transition: `background-color 0.2s ${s.ease}, border-color 0.2s ${s.ease}, border-radius 0.2s ${s.ease}, color 0.2s ${s.ease}, width 0.2s ${s.ease}` },
  hover(s.colorWhite, s.bgcBlack, { borderColor: '#000' }),
  modifier('[data-priority="self"]', s.px10, s.bgcA, s.borderA),
  modifier('[data-priority="friend"]', s.colorWhite, s.bgcA, s.borderA),
  modifier('[data-priority="noise"]', s.colorWhite, s.bgcA, s.borderA),
  modifier('[data-priority="block"]', blockMuteStyle),
  modifier('[data-priority="mute"]', blockMuteStyle),
  modifier('[data-priority="block"]', hover(blockMuteStyle)),
  modifier('[data-priority="mute"]', hover(blockMuteStyle)),
  modifier('.isInHeader',
    { width: 20, height: 20, fontSize: 0, border: 0, borderRadius: 0 },
    s.p0,
    s.colorA,
    s.bgcTransparent,
    hover(s.colorWhite, s.bgcTransparent),
    modifier('[data-priority="self"]', s.displayNone),
    modifier('[data-priority="friend"]', s.colorWhite),
    modifier('[data-priority="noise"]', s.colorWhite),
  ),
  media(s.minBreak2,
    select('.no-touch &.isInHeader', s.overflowVisible, s.fontSize12),
  ),
)

const labelStyle = media(s.minBreak2,
  parent('.no-touch .FollowButton.isInHeader',
    s.absolute,
    {
      top: -25,
      left: '-50%',
      height: 22,
      lineHeight: 22,
      paddingRight: 11,
      paddingLeft: 11,
      borderRadius: 11,
    },
    s.nowrap,
    s.hidden,
    s.bgcBlack,
    s.opacity0,
    { transition: 'opacity 0.2s ease, visibility 0s ease 0.2s' },
  ),
  parent('.no-touch .FollowButton.isInHeader:hover',
    s.visible,
    s.opacity1,
    { transitionDelay: '0.5s, 0s' },
  ),
)

// Hints...
export const getNextPriority = (currentPriority) => {
  switch (currentPriority) {
    case RELATIONSHIP_PRIORITY.INACTIVE:
    case RELATIONSHIP_PRIORITY.NOISE:
    case RELATIONSHIP_PRIORITY.NONE:
    case null:
      return RELATIONSHIP_PRIORITY.FRIEND
    default:
      return RELATIONSHIP_PRIORITY.INACTIVE
  }
}

class FollowButton extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    priority: PropTypes.oneOf([
      RELATIONSHIP_PRIORITY.INACTIVE,
      RELATIONSHIP_PRIORITY.FRIEND,
      RELATIONSHIP_PRIORITY.NOISE,
      RELATIONSHIP_PRIORITY.SELF,
      RELATIONSHIP_PRIORITY.MUTE,
      RELATIONSHIP_PRIORITY.BLOCK,
      RELATIONSHIP_PRIORITY.NONE,
      null,
    ]),
    userId: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    priority: null,
    userId: null,
  }

  componentWillMount() {
    this.state = { nextPriority: getNextPriority(this.props.priority) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nextPriority: getNextPriority(nextProps.priority) })
  }

  onClickUpdatePriority = () => {
    const { nextPriority } = this.state
    const { onClick, priority, userId } = this.props
    if (onClick) {
      onClick({ userId, priority: nextPriority, existing: priority })
    }
  }

  renderAsToggleButton(label, icon = null) {
    const { className, priority } = this.props
    return (
      <button
        className={classNames(`FollowButton ${buttonStyle}`, className)}
        data-priority={priority}
        onClick={this.onClickUpdatePriority}
      >
        {icon}
        <span className={labelStyle}>{label}</span>
      </button>
    )
  }

  renderAsLabelButton(label) {
    const { className, onClick, priority } = this.props
    return (
      <button
        className={classNames(`FollowButton ${buttonStyle}`, className)}
        data-priority={priority}
        onClick={onClick}
      >
        <span>{label}</span>
      </button>
    )
  }

  renderAsSelf() {
    const { className, priority } = this.props
    return (
      <Link
        className={classNames(`FollowButton ${buttonStyle}`, className)}
        data-priority={priority}
        to="/settings"
      >
        <span>Edit Profile</span>
      </Link>
    )
  }

  renderAsInactive() {
    const icon = this.props.className === 'isInHeader' ? <PlusCircleIcon /> : <PlusIconSM />
    return this.renderAsToggleButton('Follow', icon)
  }

  renderAsNone() {
    return this.renderAsInactive()
  }

  renderAsFriend() {
    const icon = this.props.className === 'isInHeader' ? <CheckCircleIcon /> : <CheckIconSM />
    return this.renderAsToggleButton('Following', icon)
  }

  renderAsNoise() {
    return this.renderAsFriend()
  }

  renderAsMute() {
    return this.renderAsLabelButton('Muted')
  }

  renderAsBlock() {
    return this.renderAsLabelButton('Blocked')
  }

  render() {
    const { priority } = this.props
    const fn = priority ?
      `renderAs${priority.charAt(0).toUpperCase() + priority.slice(1)}` :
      'renderAsInactive'
    return this[fn]()
  }
}

export default FollowButton

