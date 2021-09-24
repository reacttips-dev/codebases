import {grid} from '../../../utils/grid';
import {FONT_FAMILY, WEIGHT} from '../../../style/typography';
import {FOCUS_BLUE, WHITE} from '../../../style/colors';
import {ALPHA} from '../../../style/color-utils';

export const MEDIUM = 45;

export default {
  label: 'button',
  height: grid(4),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 2,
  border: `1px solid ${FOCUS_BLUE}`,
  fontFamily: FONT_FAMILY,
  fontSize: 13,
  fontWeight: WEIGHT.NORMAL,
  letterSpacing: 0.8,
  backgroundColor: FOCUS_BLUE,
  color: WHITE,
  textDecoration: 'none',
  cursor: 'pointer',
  WebkitFontSmoothing: 'antialiased',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: grid(2),
  paddingRight: grid(2),
  ':hover': {
    backgroundColor: ALPHA(FOCUS_BLUE, 0.8),
    borderColor: ALPHA(FOCUS_BLUE, 0.79),
    color: WHITE
  }
};
