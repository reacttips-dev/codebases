/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../assets/Icons'
import { after, css, media, hover, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const buttonStyle = css(
  s.colorWhite,
  s.transitionColor,
  select('&.isActive .HeartIcon > g', { fill: 'currentColor' }),
  select('& .BubbleIcon > g:nth-child(2)', s.displayNone),
  hover(
    s.colorA,
    select('& .HeartIcon > g', { fill: 'currentColor' }),
    select('& .BubbleIcon > g', { fill: 'currentColor' }),
  ),
)

export const ToolButton = props => (
  props.to ?
    <Link className={`${buttonStyle} ${props.className || ''}`} to={props.to}>
      {props.children}
    </Link>
    :
    <button className={`${buttonStyle} ${props.className || ''}`} onClick={props.onClick}>
      {props.children}
    </button>
)

ToolButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
  to: PropTypes.string,
}

ToolButton.defaultProps = {
  children: null,
  className: null,
  onClick: null,
  to: null,
}

// -------------------------------------

const toolsStyle = css(
  s.flex,
  s.pt10,
)

const alignEnd = css(s.mlAuto)
const leftSpacer = css(s.ml20)

export const EditorialTools = (props, context) => (
  <div className={toolsStyle}>
    <ToolButton
      className={props.isPostLoved ? 'isActive' : null}
      onClick={context.onClickLovePost}
    >
      <HeartIcon />
    </ToolButton>
    <ToolButton
      className={leftSpacer}
      onClick={context.onClickOpenSignupModal}
      to={context.onClickOpenSignupModal ? null : props.postPath}
    >
      <BubbleIcon />
    </ToolButton>
    <ToolButton
      className={leftSpacer}
      onClick={() => context.onClickRepostEditorialPost(props.postPath)}
    >
      <RepostIcon />
    </ToolButton>
    <ToolButton
      className={alignEnd}
      onClick={context.onClickSharePost}
    >
      <ShareIcon />
    </ToolButton>
  </div>
)

EditorialTools.contextTypes = {
  onClickLovePost: PropTypes.func,
  onClickRepostEditorialPost: PropTypes.func,
  onClickOpenSignupModal: PropTypes.func,
  onClickSharePost: PropTypes.func.isRequired,
}
EditorialTools.propTypes = {
  postPath: PropTypes.string.isRequired,
  isPostLoved: PropTypes.bool.isRequired,
}

// -------------------------------------

const titleStyle = css(
  s.colorWhite,
  s.fontSize32,
  s.sansBlack,
  { lineHeight: 38 },
  media(s.minBreak2, { fontSize: 38, lineHeight: 42 }),
)

export const EditorialTitle = ({ label }) => (
  <h2 className={titleStyle}>{label}</h2>
)
EditorialTitle.propTypes = { label: PropTypes.string.isRequired }

const usernameTitleStyle = css(
  { ...titleStyle },
  s.truncate,
)

export const EditorialUsernameTitle = ({ label }) => (
  <h2 className={usernameTitleStyle}>{label}</h2>
)
EditorialUsernameTitle.propTypes = { label: PropTypes.string.isRequired }

// -------------------------------------

const subtitleStyle = css(
  select(
    '& p',
    s.colorWhite,
    s.fontSize18,
    { lineHeight: 24, margin: 0 },
    media(s.minBreak2, s.fontSize24, { lineHeight: 30 }),
  ),
)

export const EditorialSubtitle = ({ label, path }, { onClickRenderedContent }) => (
  <div
    className={subtitleStyle}
    dangerouslySetInnerHTML={{ __html: label }}
    onClick={e => onClickRenderedContent(e, path)}
  />
)
EditorialSubtitle.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string,
}
EditorialSubtitle.defaultProps = {
  path: null,
}
EditorialSubtitle.contextTypes = {
  onClickRenderedContent: PropTypes.func,
}

// -------------------------------------

const overlayStyle = css(
  s.absolute,
  s.flood,
  s.zIndex1,
  s.transitionBgColorSlow,
  { backgroundColor: 'rgba(0, 0, 0, 0.15)' },
  after(
    s.absolute,
    s.flood,
    s.zIndex1,
    { top: '50%', content: '""' },
    { background: 'linear-gradient(to top, rgba(0, 0, 0, 0.666) 0%, rgba(0, 0, 0, 0) 80%)' },
  ),
  select('.no-touch *:hover ~ &', { backgroundColor: 'rgba(0, 0, 0, 0.65)' }),
)


export const EditorialOverlay = () => (
  <div className={overlayStyle} />
)

