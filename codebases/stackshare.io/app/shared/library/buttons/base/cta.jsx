import {WHITE, TANGERINE} from '../../../style/colors';
import {ALPHA} from '../../../style/color-utils';
import glamorous from 'glamorous';
import BASE from './style';

export default glamorous.button(
  BASE,
  ({active, width = 'auto', disabled = false, color = TANGERINE}) => ({
    width,
    backgroundColor: active ? WHITE : disabled ? ALPHA(color, 0.8) : color,
    color: active ? color : WHITE,
    ':hover': {
      backgroundColor: active ? WHITE : disabled ? ALPHA(color, 0.8) : ALPHA(color, 0.8),
      borderColor: active ? color : disabled ? ALPHA(color, 0.8) : ALPHA(color, 0.8),
      color: active ? color : WHITE
    },
    cursor: disabled ? 'default' : 'pointer',
    border: `1px solid ${disabled ? ALPHA(color, 0.8) : color}`,
    outline: 'none'
  })
);
