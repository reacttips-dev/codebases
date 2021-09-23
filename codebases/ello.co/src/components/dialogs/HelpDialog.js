/* eslint-disable max-len */
import React from 'react'
import { DismissButton } from '../../components/buttons/Buttons'
import { SHORTCUT_KEYS } from '../../constants/application_types'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const dialogStyle = css({ maxWidth: 440 }, s.colorBlack, s.bgcWhite, media(s.minBreak2, { minWidth: 440 }))
const headingStyle = css(
  s.mb30,
  { paddingLeft: 60, lineHeight: 1 },
  s.fontSize18,
  media(s.minBreak2, s.fontSize24),
)

const textWrapperStyle = css(s.relative, s.mb0, { paddingLeft: 60 })
const textStyle = css(
  s.absolute,
  {
    left: 0,
    width: 50,
    height: 22,
    lineHeight: '22px',
    borderRadius: 11,
    color: '#535353',
    backgroundColor: '#e8e8e8',
  },
  s.fontSize12,
  s.center,
)

const HelpDialog = () =>
  (<div className={`${baseDialogStyle} ${dialogStyle}`}>
    <h2 className={headingStyle}>Key Commands</h2>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.EDITORIAL}</span> Navigate to editorial</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.ARTIST_INVITES}</span> Navigate to artist invites</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.DISCOVER}</span> Navigate to discover</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.SEARCH}</span> Navigate to search</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.FOLLOWING}</span> Navigate to following</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.NOTIFICATIONS}</span> View notifications</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.TOGGLE_LAYOUT}</span> Toggle grid mode for main content</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.OMNIBAR}</span> Focus post editor</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>ESC</span> Close modal or alerts</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.FULLSCREEN}</span> Toggle fullscreen within a post editor</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.DT_GRID_TOGGLE}</span> Toggle layout grid</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.DT_GRID_CYCLE}</span> Toggle between horizontal and vertical grid</p>
    <p className={textWrapperStyle}><span className={`${textStyle} ${s.monoRegularCSS}`}>{SHORTCUT_KEYS.HELP}</span> Show this help modal</p>
    <DismissButton />
  </div>)

export default HelpDialog

