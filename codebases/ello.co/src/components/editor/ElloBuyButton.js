import React from 'react'
import PropTypes from 'prop-types'
import { MoneyIcon } from '../assets/Icons'
import { dispatchTrackEvent } from '../../helpers/junk_drawer'
import { before, css, hover, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(
  s.absolute,
  { top: 50, right: 50 },
  s.zIndex2,
  s.wv40,
  s.hv40,
  { lineHeight: '39px', borderRadius: 20 },
  s.overflowHidden,
  s.colorWhite,
  s.center,
  s.nowrap,
  s.alignMiddle,
  s.bgcGreen,
  { transition: 'background-color 0.2s ease, color 0.2s ease' },
  before(s.hitarea),
  hover(s.colorBlack, s.bgcEA),
  select('.editable[contenteditable] + &', s.displayNone),
  parent('.EmbedRegion', { top: 10, right: 10 }),
  parent('.ImageRegion', { top: 10, right: 10 }),
  parent('.RegionContent', { top: 10, right: 10 }), // might be legacy?
  parent('.Notification', { width: 15, height: 15, lineHeight: '14px' }),
  parent('.Notification .RegionContent', { top: 5, right: 5 }),
  select('.Notification & svg', { transform: 'scale(0.7)', transformOrigin: '2px 2px' }),
  // TODO: This is weird, has nothing to do with Embed button but came from CSS file...
  select('.EmbedRegion .embetter a', s.lh40),
)

function onElloBuyButtonClick(e) {
  dispatchTrackEvent('buy_link_clicked', { link: e.target.href })
}

export const ElloBuyButton = ({ to }) =>
  (<a
    className={`ElloBuyButton ${buttonStyle}`}
    href={to}
    onClick={onElloBuyButtonClick}
    rel="noopener noreferrer"
    target="_blank"
  >
    <MoneyIcon />
  </a>)

ElloBuyButton.propTypes = {
  to: PropTypes.string.isRequired,
}

export default ElloBuyButton

