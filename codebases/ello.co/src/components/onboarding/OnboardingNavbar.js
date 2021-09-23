import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ElloMark } from '../assets/Icons'
import { active, css, disabled, hover, media, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

const navbarStyle = css(
  s.fixed,
  { top: 0, right: 0, left: 0, height: 70 },
  s.zNavbar,
  s.p10,
  s.fontSize14,
  s.colorBlack,
  s.rightAlign,
  { backgroundColor: '#f0f0f0' },
  media(s.minBreak2,
    { top: 'auto', bottom: 0, height: 100, paddingTop: 25 },
    s.pb20,
    s.px20,
    s.center,
  ),
)

const nextButtonStyle = css(
  { height: 50, borderRadius: 5 },
  s.px30,
  s.colorWhite,
  s.center,
  s.bgcGreen,
  s.borderGreen,
  { transition: 'background-color 0.2s, border-color 0.2s, color 0.2s' },
  active(s.colorWhite, { backgroundColor: '#00b100', borderColor: '#00b100' }),
  hover(s.colorWhite, { backgroundColor: '#00b100', borderColor: '#00b100' }),
  disabled({
    color: '#aaa !important',
    backgroundColor: 'transparent !important',
    borderColor: '#aaa !important',
  }),
  media(s.maxBreak2,
    { width: 'calc(100% - 60px)' },
    modifier('.hasDone', { width: 'calc(100% - 140px)' }),
  ),
)

const doneButtonStyle = css(s.ml10, s.colorA, media(s.minBreak2, s.ml30))

const OnboardingNavbar = (props, context) => {
  const { isNextDisabled } = props
  const { nextLabel = 'Continue', onDoneClick, onNextClick } = context
  return (
    <header className={`OnboardingNavbar ${navbarStyle}`}>
      <ElloMark />
      <button
        className={classNames(`${nextButtonStyle}`, { hasDone: !!onDoneClick })}
        disabled={isNextDisabled}
        onClick={onNextClick}
      >
        {nextLabel}
      </button>
      {onDoneClick ?
        <button className={doneButtonStyle} onClick={onDoneClick} >{'I\'m Done'}</button>
        : null
      }
    </header>
  )
}

OnboardingNavbar.propTypes = {
  isNextDisabled: PropTypes.bool,
}
OnboardingNavbar.defaultProps = {
  isNextDisabled: false,
}
OnboardingNavbar.contextTypes = {
  nextLabel: PropTypes.string,
  onDoneClick: PropTypes.func,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingNavbar

