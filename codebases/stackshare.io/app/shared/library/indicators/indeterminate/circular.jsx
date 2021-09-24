import glamorous from 'glamorous';
import * as glamor from 'glamor';
import {FOCUS_BLUE} from '../../../style/colors';

const spin = glamor.css.keyframes({
  to: {transform: 'rotate(360deg)'}
});

export const LARGE = 64;
export const MEDIUM = 46;
export const BUTTON = 22;
export const SMALL = 19;

export default glamorous.div(
  {
    boxSizing: 'border-box',
    borderRadius: '50%',
    border: '1px solid #ccc',
    borderTopColor: FOCUS_BLUE,
    animation: `${spin} 1s linear infinite`
  },
  ({size = LARGE}) => ({
    width: size,
    height: size,
    borderWidth: size * 0.0625
  })
);
