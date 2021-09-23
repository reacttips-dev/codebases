import React from 'react'
import PropTypes from 'prop-types'
import { DismissButton } from '../../components/buttons/Buttons'
import { css, hover, media } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const dialogStyle = css(
  { maxWidth: 480 },
  s.colorBlack,
  s.bgcWhite,
  media(s.minBreak2, { minWidth: 480 }),
)

const buttonStyle = css(
  s.block,
  s.fullWidth,
  s.hv60,
  s.lh60,
  s.fontSize14,
  s.colorWhite,
  s.center,
  s.bgcBlack,
  s.borderBlack,
  { transition: 'background-color 0.2s ease, border-color 0.2s ease' },
  hover(s.bgc6, { borderColor: '#666' }),
)

const AdultPostsDialog = ({ onConfirm }) =>
  (<div className={`${baseDialogStyle} ${dialogStyle}`}>
    <p style={s.mt0}>
      If you post adult content, you must mark your account Not Safe for Work (NSFW).
    </p>
    <p>
      When you set &quot;Post Adult Content&quot; to yes, users who do not wish to view
      adult content will not see your posts.
    </p>
    <button className={buttonStyle} onClick={onConfirm}>Okay</button>
    <DismissButton />
  </div>)

AdultPostsDialog.propTypes = {
  onConfirm: PropTypes.func.isRequired,
}

export default AdultPostsDialog

