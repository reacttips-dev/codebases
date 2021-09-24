import {FOCUS_BLUE, WHITE, FOCUS_BLUE_DISABLED} from '../../../style/colors';
import {ALPHA} from '../../../style/color-utils';
import glamorous from 'glamorous';
import BASE from './style';

export default glamorous.button(BASE, ({active, width = 'auto', disabled = false}) => ({
  width,
  backgroundColor: active ? WHITE : disabled ? FOCUS_BLUE_DISABLED : FOCUS_BLUE,
  color: active ? FOCUS_BLUE : WHITE,
  ':hover': {
    backgroundColor: active ? WHITE : disabled ? FOCUS_BLUE_DISABLED : ALPHA(FOCUS_BLUE, 0.8),
    borderColor: active ? FOCUS_BLUE : disabled ? FOCUS_BLUE_DISABLED : ALPHA(FOCUS_BLUE, 0.79),
    color: active ? FOCUS_BLUE : WHITE
  },
  cursor: disabled ? 'default' : 'pointer',
  border: `1px solid ${disabled ? FOCUS_BLUE_DISABLED : FOCUS_BLUE}`,
  outline: 'none'
}));
