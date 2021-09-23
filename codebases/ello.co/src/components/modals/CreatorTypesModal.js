import React from 'react'
import CreatorTypeContainer from '../../containers/CreatorTypeContainer'
import * as s from '../../styles/jso'
import { css, media } from '../../styles/jss'

const creatorTypeModalStyle = css(
  s.bgcWhite,
  s.fullWidth,
  s.mxAuto,
  s.p10,
  { borderRadius: 5, maxWidth: 510 },
  media(s.minBreak2, s.p20),
)

const titleStyle = css(
  s.colorBlack,
  s.fontSize14,
  { marginRight: 60, marginBottom: 40 },
)

export default () => (
  <div className={creatorTypeModalStyle}>
    <h3 className={titleStyle}>We&apos;re doing a quick survey to find out a little more about the
      artistic composition of the Ello Community. You can always update your selection(s) on your
      settings page. Thank you!</h3>
    <CreatorTypeContainer />
  </div>
)

