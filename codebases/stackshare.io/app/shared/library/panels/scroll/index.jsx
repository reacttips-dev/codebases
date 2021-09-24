import glamorous from 'glamorous';
import {CONCRETE} from '../../../style/colors';
import {PHONE} from '../../../style/breakpoints';
import {FULL} from '../../cards/pros-cons';

const ScrollPanel = glamorous.div(
  {
    position: 'relative',
    overflowY: 'scroll',
    display: 'flex',
    flexGrow: 1,
    '::-webkit-scrollbar': {
      width: 4
    },
    '::-webkit-scrollbar-thumb': {
      background: CONCRETE,
      borderRadius: 2.5
    }
  },
  ({disableScroll}) =>
    disableScroll
      ? {
          overflowY: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 100,
            width: '100%',
            background: 'linear-gradient(top, rgba(255,255,255,.3), rgba(255,255,255, 1))'
          }
        }
      : {},
  ({height = '100%'}) => ({
    height
  }),
  ({theme, items}) => ({
    maxHeight: theme === FULL ? 280 : 'auto',
    flexDirection: theme === FULL ? 'row' : 'column',
    flexWrap: theme === FULL ? 'wrap' : 'nowrap',
    ' > div': {
      flexBasis: theme === FULL && items.length !== 0 ? '33%' : 'unset',
      [PHONE]: {
        flexBasis: theme === FULL ? '50%' : 'unset'
      }
    }
  })
);

export default ScrollPanel;
