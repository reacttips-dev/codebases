import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Editor from '../editor/Editor'
import { ChevronIcon } from '../assets/Icons'
import { css, hover, media, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

const omnibarStyle = css(
  s.relative,
  s.displayNone,
  s.pt30,
  s.bgcWhite,
  s.mxAuto,
  { maxWidth: 1440 },
  modifier('.isActive', s.block),
  media(s.minBreak2, s.pt0),
)

const revealButton = css(
  s.absolute,
  { top: 15, right: 10, width: 20 },
  s.overflowHidden,
  s.fontSize14,
  s.nowrap,
  s.transitionWidth,
  hover({ width: 100 }),
  media(s.minBreak2, { top: -20, right: 20 }),
  media(s.minBreak4, { right: 40 }),
)

export const Omnibar = ({ classList, isActive, isFullScreen, onClickCloseOmnibar }) => {
  if (!isActive) {
    return <div className={classNames(`Omnibar ${omnibarStyle}`, { isActive }, classList)} />
  }
  return (
    <div className={classNames(`Omnibar ${omnibarStyle}`, { isActive, isFullScreen }, classList)} >
      <Editor shouldPersist />
      <button className={revealButton} onClick={onClickCloseOmnibar}>
        <ChevronIcon />
        Navigation
      </button>
    </div>
  )
}

Omnibar.propTypes = {
  classList: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool,
  onClickCloseOmnibar: PropTypes.func.isRequired,
}

Omnibar.defaultProps = {
  classList: null,
  isFullScreen: false,
}

export default Omnibar

