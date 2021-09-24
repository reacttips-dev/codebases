import glamorous from 'glamorous';
import {grid} from '../../../utils/grid';
import {ASH, WHITE, CHARCOAL} from '../../../style/colors';

export const ReferenceBox = glamorous.div({
  display: 'inline-block'
});

export const PopperBox = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    width: 200,
    color: CHARCOAL,
    borderRadius: 2,
    padding: grid(2),
    zIndex: '1000',
    textAlign: 'center',
    position: 'relative',
    background: WHITE,
    border: `1px solid ${ASH}`,
    lineHeight: 1.4,
    boxSizing: 'border-box',
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
  ({width}) => ({width, minWidth: width})
);

export const ArrowContainer = glamorous.div({
  position: 'absolute',
  width: 20,
  height: 10,
  '&[data-placement*="top"]': {
    bottom: 0,
    marginBottom: -6
  },
  '&[data-placement*="bottom"]': {
    transform: 'rotate(180deg)',
    top: 0,
    marginTop: -6
  },
  '&[data-placement*="right"]': {
    transform: 'rotate(90deg)',
    left: 0,
    marginLeft: -11
  },
  '&[data-placement*="left"]': {
    transform: 'rotate(-90deg)',
    right: 0,
    marginRight: -11
  }
});
