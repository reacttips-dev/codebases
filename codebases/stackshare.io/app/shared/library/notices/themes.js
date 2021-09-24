import {ALPHA} from '../../style/color-utils';
import {FOCUS_BLUE, SCORE} from '../../style/colors';
export const BOX = 'box';
export const BAR = 'bar';
export const DRAFT = 'draft';
export const INLINE = 'inline';
export const LIGHT_BLUE = ALPHA(FOCUS_BLUE, 0.08);
export const DARK_BLUE = ALPHA(FOCUS_BLUE, 0.17);

export const THEMES = {
  [INLINE]: {
    Wrapper: {
      background: DARK_BLUE
    }
  },
  [BOX]: {
    Wrapper: {
      background: LIGHT_BLUE,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3
    }
  },
  [BAR]: {
    Wrapper: {
      background: LIGHT_BLUE
    }
  },
  [DRAFT]: {
    Wrapper: {
      background: SCORE
    }
  }
};
