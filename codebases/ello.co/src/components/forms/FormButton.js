import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(
  s.fullWidth,
  s.hv60,
  s.lh60,
  s.px30,
  s.fontSize14,
  s.colorWhite,
  s.bgcGreen,
  s.borderGreen,
  { transition: `background-color 0.2s ${s.ease}, border-color 0.2s ${s.ease}, color 0.2s ${s.ease}, width 0.2s ${s.ease}` },
  modifier(':not([disabled]):active', s.colorWhite, { backgroundColor: '#00b100', borderColor: '#00b100' }),
  select('.no-touch &:not([disabled]):hover', s.colorWhite, { backgroundColor: '#00b100', borderColor: '#00b100' }),
  modifier('[disabled]', s.colorWhite, { backgroundColor: '#7ac97a', border: '1px solid #7ac97a' }),
  modifier('.isRounded', { borderRadius: 5 }),
  modifier('.isAutoSize', { width: 'auto' }, s.hv40, s.lh40),
  modifier('.isOutlined[disabled]', s.colorA, s.bgcTransparent, { borderColor: '#aaa' }),
  modifier('.inFooter',
    s.wv30,
    s.hv30,
    s.lh30,
    s.p0,
    s.ml10,
    { marginTop: 1, borderRadius: '50%' },
    s.bgcGreen,
    s.borderGreen,
    media(s.minBreak2, {
      width: 'auto',
      paddingRight: 15,
      paddingLeft: 15,
      marginRight: 5,
      borderRadius: 20,
    }),
  ),
  modifier('.inFooter[disabled]', s.bgcBlack, s.borderBlack),
  select('& .ArrowIcon', { marginTop: -2 }),
  parent('.SettingsCredentialActions', s.mb20, s.lh40, s.hv40, { width: 160 }),
  parent('.InvitationsForm', { float: 'right', marginTop: -60 }),
)

const FormButton = ({ children, className, ...rest }) =>
  (<button className={classNames(`${buttonStyle}`, className)} {...rest}>
    {children}
  </button>)

FormButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default FormButton

