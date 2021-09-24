import React from 'react';
import * as glamor from 'glamor';
import glamorous from 'glamorous';
import CheckMarkIcon from '../icons/check-mark-alt.svg';
import {FOCUS_BLUE, WHITE} from '../../style/colors';
import PropTypes from 'prop-types';

const Stroke = glamor.css.keyframes({
  '100%': {
    strokeDashoffset: 0
  }
});

const Scale = glamor.css.keyframes({
  '0%, 100%': {
    transform: 'none'
  },
  '50%': {
    transform: 'scale3d(1.1, 1.1, 1)'
  }
});

const Fill = glamor.css.keyframes({
  '100%': {
    boxShadow: `inset 0px 0px 0px 30px ${FOCUS_BLUE}`
  }
});

const Svg = glamorous(CheckMarkIcon)(
  {
    borderRadius: '50%',
    display: 'block',
    strokeWidth: 2,
    stroke: WHITE,
    strokeMiterlimit: 10,
    boxShadow: `inset 0px 0px 0px ${FOCUS_BLUE}`,
    animation: `${Fill} .2s ease-in-out .4s forwards, ${Scale} .3s ease-in-out .2s both`,
    ' circle': {
      strokeDasharray: 166,
      strokeDashoffset: 166,
      strokeWidth: 2,
      strokeMiterlimit: 10,
      stroke: FOCUS_BLUE,
      fill: 'none',
      animation: `${Stroke} 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards`
    },
    ' path': {
      transformOrigin: '50% 50%',
      strokeDasharray: 48,
      strokeDashoffset: 48,
      animation: `${Stroke} 0.1s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards`
    }
  },
  ({size}) => ({
    width: size,
    height: size
  })
);

const AnimatedCheckMark = ({size = 20}) => {
  return <Svg size={size} />;
};

AnimatedCheckMark.propTypes = {
  size: PropTypes.number
};

export default AnimatedCheckMark;
