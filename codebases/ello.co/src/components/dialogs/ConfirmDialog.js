import React from 'react'
import PropTypes from 'prop-types'
import { css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const dialogStyle = css(s.center)
// TODO: exports used by DeleteAccountDialog, move to Dialog?
export const headingStyle = css(
  s.hv30, s.lh30, s.mb10, s.fontSize18, s.nowrap,
  media(s.minBreak2, s.inlineBlock, s.mr20, s.mb0, s.fontSize24, s.alignMiddle),
)
const buttonHighlightStyle = css(s.colorWhite, s.bgcBlack, { borderColor: '#000' })
export const buttonStyle = css(
  s.inlineBlock,
  s.wv60,
  s.hv40,
  s.lh40,
  { borderRadius: 20 },
  s.fontSize14,
  s.colorBlack,
  s.center,
  s.nowrap,
  s.alignMiddle,
  s.bgcWhite,
  s.borderWhite,
  { transition: `background-color 0.2s ${s.ease}, border-color 0.2s ${s.ease}, color 0.2s ${s.ease}, opacity 0.2s ${s.ease}` },
  modifier('.isActive', buttonHighlightStyle),
  hover(buttonHighlightStyle),
  select('& + &', s.ml5),
)

const ConfirmDialog = ({ title, onConfirm, onDismiss }) =>
  (<div className={`${baseDialogStyle} ${dialogStyle}`}>
    {title ? <h2 className={headingStyle}>{title}</h2> : null}
    <button className={buttonStyle} onClick={onConfirm}>Yes</button>
    <button className={buttonStyle} onClick={onDismiss}>No</button>
  </div>)

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ConfirmDialog

