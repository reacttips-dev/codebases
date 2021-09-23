import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import { getSource } from './BackgroundImage'
import ImageAsset from './ImageAsset'
import VideoAsset from './VideoAsset'
import { before, css, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

// holy cow.
const baseStyle = css(
  s.relative,
  s.inlineBlock,
  s.wv30,
  s.hv30,
  s.overflowHidden,
  s.alignMiddle,
  s.colorTransparent,
  {
    borderRadius: '50%',
    background: '#f0f0f0 no-repeat 50% 50%',
    backgroundSize: 'cover',
  },
  s.transitionTransform,
  modifier(
    '.inUserProfile',
    { width: 180, height: 180, marginTop: 100, marginBottom: 15 },
    s.bgcTransparent,
  ),
  modifier('.inUserProfileCard', s.zIndex3, { width: 60, height: 60 }, s.bgcTransparent),
  modifier('.inHeroPromotionCredits', s.bgcTransparent),
  modifier('.isXLarge', { width: 220, height: 220 }),
  modifier('.isLarge', { width: 120, height: 120 }),
  modifier('.isTiny', { width: 30, height: 30 }),
  modifier('.isRequesting', { animation: 'animateLavaLamp 3s infinite linear' }),
  modifier('.isPending', { backgroundColor: '#f0f0f0' }),
  modifier('.isFailing', s.bgcRed),
  modifier('.inHeroPromotionCredits.isFailing', s.displayNone),
  select('.isAvatarBlank ~ &', s.displayNone),
  before(s.absolute, s.flood, s.zIndex2, s.bgcTransparent, s.transitionBgColor, { content: '""' }),
  select('.no-touch a&:hover::before', { backgroundColor: 'rgba(255, 255, 255, 0.4)' }),
  select('.no-touch a:hover > &::before', { backgroundColor: 'rgba(255, 255, 255, 0.4)' }),
  select('.no-touch button&:hover::before', { backgroundColor: 'rgba(255, 255, 255, 0.4)' }),
  select('.no-touch button:hover > &::before', { backgroundColor: 'rgba(255, 255, 255, 0.4)' }),
  parent('.CommentHeader', s.absolute, { top: 3, left: 0 }),
  parent('.editor.isComment', s.mb10),
  parent('.Notification', { width: 30, height: 30 }),
  parent('.RepostedBody >', s.absolute, { top: 40, left: 0 }),
  parent('.OnboardingAvatarPicker ', s.absolute, { top: 0, right: 0, left: 0 }, s.zIndex1, s.my0, s.mxAuto),
  parent('.SettingsAvatarPicker ', s.absolute, { top: 0, right: 0, left: 0 }, s.zIndex1),
  parent('.PostHeader ', s.absolute, { top: 15, left: 0 }),
  parent('.PostDetail .PostDetailHeader ', s.relative, { top: 'auto', left: 'auto' }),
  parent('.CategoryHeader ', s.absolute, { top: 15, left: 0 }),
  parent('.ArtistInviteSubmissionHeader ', s.absolute, { top: 15, left: 0 }),
  parent('.RepostHeader ', s.absolute, { top: 15, left: 0 }),
  parent('.PostDetail .RepostDetailHeader ', s.relative, { top: 'auto', left: 'auto' }),
  parent('.RepostHeader.inUserDetail ', { left: 25 }),
  parent('.UserInviteeHeader ', { marginTop: -1 }),
  media(
    s.maxBreak2,
    select('.isProfileMenuActive ~ .NavbarProfile > &', s.pointerNone),
    select('.PostDetailHeader &',
      s.wv40,
      s.hv40,
    ),
  ),
  media(
    s.minBreak2,
    parent('.Post',
      { width: 40, height: 40 },
    ),
  ),
  media(
    s.minBreak3,
    { width: 40, height: 40 },
    modifier('.inUserProfile', s.absolute, s.my0, { top: 0, left: 0, width: 260, height: 260 }),
    modifier('.inUserProfileCard:not(.isMiniProfileCard)', { width: 200, height: 200 }),
    modifier('.isLarge', { width: 180, height: 180 }),
    parent('.editor.isComment', s.absolute, { top: 0, left: 0 }, s.mb0),
    parent('.RepostedBody >', { top: 30 }),
    parent('.PostHeader ', s.absolute, { top: 20 }),
    parent('.ArtistInviteSubmissionHeader ', s.absolute, { top: 20 }),
    parent('.CategoryHeader ', s.absolute, { top: 20 }),
    parent('.RepostHeader ', s.absolute, { top: 20 }),
  ),
)

const imageStyle = css(
  s.absolute,
  s.flood,
  s.fullWidth,
  s.fullHeight,
  { borderRadius: '50%', transition: 'opacity 0.4s', objectFit: 'cover' },
  modifier('[src=""]', s.displayNone),
  parent('.isPending > ', s.opacity0),
  parent('.isRequesting > ', s.opacity0),
  parent('.PostHeader .isPending > ', s.opacity1),
  parent('.PostHeader .isRequesting > ', s.opacity1),
)

const videoStyle = css(
  s.absolute,
  s.flood,
  s.fullWidth,
  s.fullHeight,
  { borderRadius: '50%', transition: 'opacity 0.4s', objectFit: 'cover' },
  modifier('[src=""]', s.displayNone),
)

export default class Avatar extends PureComponent {
  static propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    priority: PropTypes.string,
    size: PropTypes.string,
    to: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  }

  static defaultProps = {
    alt: null,
    className: '',
    onClick: null,
    priority: null,
    size: 'regular',
    to: null,
    userId: null,
    username: null,
  }

  componentWillMount() {
    this.state = {
      status: getSource({ ...this.props, dpi: this.props.size }) ? STATUS.REQUEST : STATUS.PENDING,
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = getSource({ ...this.props, dpi: this.props.size })
    const nextSource = getSource({ ...nextProps, dpi: nextProps.size })
    if (thisSource !== nextSource) {
      this.setState({
        status: nextSource ? STATUS.REQUEST : STATUS.PENDING,
      })
    }
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const { alt, className, onClick, priority, to, userId, username } = this.props
    const { status } = this.state
    const wrapperProps = {
      className: classNames(`Avatar ${baseStyle}`, className, status),
      'data-priority': priority || 'inactive',
      'data-userid': userId,
      'data-username': username,
      draggable: (username && username.length > 1) || (priority && priority.length),
    }
    const src = getSource({ ...this.props, dpi: this.props.size })
    const isVideo = !!src && src.substr(-3) === 'mp4'
    const imageProps = {
      alt: alt || username,
      className: `${imageStyle}`,
      src,
      onLoadFailure: this.onLoadFailure,
      onLoadSuccess: this.onLoadSuccess,
    }
    const videoProps = {
      src,
      className: `${videoStyle}`,
    }

    if (isVideo) {
      if (to) {
        return (
          <Link {...wrapperProps} to={to} >
            <VideoAsset {...videoProps} />
          </Link>
        )
      } else if (onClick) {
        return (
          <button {...wrapperProps} onClick={onClick} >
            <VideoAsset {...videoProps} />
          </button>
        )
      }
      return (
        <span {...wrapperProps} >
          <VideoAsset {...videoProps} />
        </span>
      )
    }

    if (to) {
      return (
        <Link {...wrapperProps} to={to} >
          <ImageAsset {...imageProps} />
        </Link>
      )
    } else if (onClick) {
      return (
        <button {...wrapperProps} onClick={onClick} >
          <ImageAsset {...imageProps} />
        </button>
      )
    }
    return (
      <span {...wrapperProps} >
        <ImageAsset {...imageProps} />
      </span>
    )
  }
}

