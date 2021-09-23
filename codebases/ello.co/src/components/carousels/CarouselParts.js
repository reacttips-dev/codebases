import React from 'react'
import { ArrowIcon } from '../assets/Icons'
import { css, hover, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const paddleStyle = css(
  s.wv30,
  s.hv30,
  s.transitionColor,
  s.colorWhite,
  hover(s.colorA),
)

const nextPaddleStyle = css(
  { ...paddleStyle },
)

export const NextPaddle = props => (
  <button className={nextPaddleStyle} type="button" {...props} >
    <ArrowIcon />
  </button>
)

const prevPaddleStyle = css(
  { ...paddleStyle },
  select('& > .ArrowIcon', s.rotate180),
)

export const PrevPaddle = props => (
  <button className={prevPaddleStyle} type="button" {...props} >
    <ArrowIcon />
  </button>
)

