/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router'
import ImageAsset from '../assets/ImageAsset'
import VideoAsset from '../assets/VideoAsset'
import { isGif } from '../../helpers/file_helper'
import { before, css, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export function getSource(props) {
  const { dpi, sources, useGif } = props
  if (!sources) {
    return ''
  } else if (sources.getIn(['tmp', 'url'])) {
    return sources.getIn(['tmp', 'url'])
  } else if (useGif && isGif(sources.getIn(['original', 'url'])) && sources.hasIn(['video', 'url'])) {
    return sources.getIn(['video', 'url'])
  } else if (useGif && isGif(sources.getIn(['original', 'url']))) {
    return sources.getIn(['original', 'url'])
  }
  return sources.getIn([dpi, 'url'], null)
}

const baseStyle = css(
  s.absolute,
  s.flood,
  s.zIndex0,
  s.overflowHidden,
  {
    background: 'rgba(0, 0, 0, 0.2) no-repeat 50% 50%',
    backgroundSize: 'cover',
    transition: 'background-color 0.2s ease, opacity 0.4s ease',
  },
  modifier('.isRequesting', { animation: 'animateLavaLamp 3s infinite linear' }),
  modifier('.isFailing', s.bgcRed),
  modifier('.inOnboarding', { height: 220 }),
  modifier('.inSettings', { height: 220 }),
  modifier('.inUserProfileCard', { height: 260 }),
  before(s.absolute, s.flood, s.zIndex1, s.bgcTransparent, s.transitionBgColor, { content: '""' }),
  modifier('.hasOverlay3', before({ backgroundColor: 'rgba(0, 0, 0, 0.3)' })),
  modifier('.hasOverlay4', before({ backgroundColor: 'rgba(0, 0, 0, 0.4)' })),
  modifier('.hasOverlay5', before({ backgroundColor: 'rgba(0, 0, 0, 0.5)' })),
  modifier('.hasOverlay6', before({ backgroundColor: 'rgba(0, 0, 0, 0.6)' })),
  select('.no-touch &.isLink:hover::before', { backgroundColor: 'rgba(0, 0, 0, 0.4)' }),
  media(s.maxBreak2, modifier('.inHeroProfile', { height: 220 })),
  media(s.minBreak2, modifier('.inSettings', { minHeight: 330 })),
  media(s.minBreak2, modifier('.inUserProfileCard:not(.isMiniProfileCard)', { minHeight: 540 })),
)

const editorialVideoStyle = css(
  {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    minWidth: '100%',
    minHeight: '100%',
  },
)

export default class BackgroundImage extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    to: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    onClick: null,
    to: null,
  }

  componentWillMount() {
    this.state = {
      status: STATUS.REQUEST,
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = getSource(this.props)
    const nextSource = getSource(nextProps)
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
    const { className, onClick, to } = this.props
    const { status } = this.state
    const classList = classNames(`BackgroundImage ${baseStyle}`, status, className)
    const src = getSource(this.props)
    const isVideo = !!src && src.substr(-3) === 'mp4'
    const imageAssetProps = {
      isBackgroundImage: true,
      onLoadFailure: this.onLoadFailure,
      onLoadSuccess: this.onLoadSuccess,
      src,
    }
    const videoAssetProps = {
      src,
    }

    if (isVideo) {
      return (<Link className={classNames(classList, 'isLink')} onClick={onClick} to={to}>
        <VideoAsset {...videoAssetProps} className={editorialVideoStyle} />
      </Link>)
    }

    return to ?
      <Link className={classNames(classList, 'isLink')} onClick={onClick} to={to}>
        <ImageAsset {...imageAssetProps} />
      </Link> :
      <div className={classList} onClick={onClick}>
        <ImageAsset {...imageAssetProps} />
      </div>
  }
}

