import glamorous from 'glamorous';
import {grid} from '../../../utils/grid';
import {ASH, WHITE, CHARCOAL} from '../../../style/colors';

export const PopoverPanel = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    color: CHARCOAL,
    borderRadius: 2,
    zIndex: '1000',
    textAlign: 'center',
    position: 'relative',
    background: WHITE,
    border: `1px solid ${ASH}`,
    boxSizing: 'border-box',
    lineHeight: 1.4,
    '&[data-placement*="bottom"]': {
      marginTop: grid(2)
    },
    '&[data-placement*="top"]': {
      marginBottom: grid(2)
    },
    '&[data-placement*="left"]': {
      marginRight: grid(2)
    },
    '&[data-placement*="right"]': {
      marginLeft: grid(2)
    }
  },
  ({width, padding}) => ({
    width,
    minWidth: width,
    padding
  })
);

export default PopoverPanel;
