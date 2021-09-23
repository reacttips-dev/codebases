/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const modalStyle = css(
  s.fullscreen,
  s.zModal,
  s.pt40,
  s.colorWhite,
  s.pointerNone,
  s.bgcTransparent,
  s.opacity0,
  { transition: `opacity 0.4s ${s.ease}, background-color 0.4s ${s.ease}` },
  modifier('.isActive',
    s.overflowScrollWebY,
    s.pointerAuto,
    s.opacity1,
    { backgroundColor: 'rgba(26, 26, 26, 0.8)' },
  ),
  modifier('.isActive.hasOverlay9', s.bgcModal),
  modifier('.isActive.isDangerZone', { backgroundColor: 'rgba(255, 0, 0, 0.95)' }),
  modifier('.isDecapitated', s.zDecapitated),
  modifier('.isFlex', s.flex, s.itemsCenter, s.pt0),
  media(s.minBreak2, s.flex, s.itemsCenter, s.pt0),
)

const alertStyle = css(
  s.fixed,
  s.zModal,
  { top: 30, right: 10, width: '95%', maxWidth: 320, minHeight: 80, padding: '16px 20px' },
  s.colorWhite,
  s.pointerNone,
  s.bgcTransparent,
  s.opacity0,
  { transition: `transform 0.2s ${s.ease}, opacity 0.4s ${s.ease}, background-color 0.4s ${s.ease}` },
  { transform: 'translate3d(100%, 0, 0)' },
  modifier('.isActive', s.pointerAuto, s.bgcBlack, s.opacity1, s.transformNone),
  media(s.minBreak2, s.fullWidth, { right: 20 }),
  media(s.minBreak4, { right: 40 }),
  select('.Alert p:last-of-type', s.mb0),
)

export const Modal = ({ classList, component, kind, isActive, onClickModal }) =>
  (<div
    className={classNames(`${kind === 'Alert' ? alertStyle : modalStyle}`, classList, kind, { isActive })}
    onClick={onClickModal}
  >
    {component}
  </div>)

Modal.propTypes = {
  classList: PropTypes.string,
  component: PropTypes.node,
  isActive: PropTypes.bool.isRequired,
  kind: PropTypes.string.isRequired,
  onClickModal: PropTypes.func,
}
Modal.defaultProps = {
  classList: null,
  component: null,
  onClickModal: null,
}

export default Modal

