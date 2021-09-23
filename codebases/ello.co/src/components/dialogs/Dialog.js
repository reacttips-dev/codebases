import React from 'react'
import PropTypes from 'prop-types'
import { XIcon } from '../assets/Icons'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

export const dialogStyle = css(
  s.relative,
  select('.Modal > &', s.p10, s.my0, s.mxAuto, media(s.minBreak2, s.p20), media(s.minBreak4, s.p40)),
)

// TODO: This shows up in an alert which is sort of werid so we hardcode this
// button instead of using the dismiss
const dismissStyle = css(s.absolute, { top: -10, right: -10 }, s.colorWhite, hover(s.colorA))

const Dialog = ({ body, title, onClick }) =>
  (<div className={dialogStyle}>
    <h2>{title}</h2>
    <p>{body}</p>
    {onClick && <button className={dismissStyle} onClick={onClick}><XIcon /></button>}
  </div>)

Dialog.propTypes = {
  body: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
}

Dialog.defaultProps = {
  body: '',
  onClick: null,
  title: '',
}

export default Dialog

