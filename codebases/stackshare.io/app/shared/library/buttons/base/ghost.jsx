import {WHITE} from '../../../style/colors';
import glamorous from 'glamorous';
import BASE from './style';
import {ALPHA} from '../../../style/color-utils';

export default glamorous.button(BASE, ({width = 'auto', disabled = false, color = WHITE}) => ({
  width,
  backgroundColor: 'transparent',
  color: disabled ? ALPHA(color, 0.5) : color,
  ':hover': {
    borderColor: disabled ? ALPHA(color, 0.5) : color,
    background: 'transparent',
    color: disabled ? ALPHA(color, 0.5) : color,
    cursor: disabled ? 'not-allowed' : 'pointer'
  },
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: disabled ? `1px solid ${ALPHA(color, 0.5)}` : `1px solid ${color}`,
  outline: 'none'
}));
