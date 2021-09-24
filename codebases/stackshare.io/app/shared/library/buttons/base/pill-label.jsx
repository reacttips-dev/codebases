import {FOCUS_BLUE, WHITE} from '../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import glamorous from 'glamorous';
import {ALPHA} from '../../../style/color-utils';

const PillLabel = glamorous.span(
  {
    fontWeight: WEIGHT.BOLD,
    ...BASE_TEXT,
    borderRadius: 6,
    height: 18,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 6,
    fontSize: 12,
    flexGrow: 0
  },
  ({flavour = FOCUS_BLUE, invert}) =>
    invert
      ? {
          background: flavour,
          color: WHITE
        }
      : {
          background: ALPHA(flavour, 0.1),
          color: flavour
        }
);

export default PillLabel;
