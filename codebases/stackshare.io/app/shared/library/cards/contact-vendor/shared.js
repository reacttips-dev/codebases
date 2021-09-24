import glamorous from 'glamorous';
import {TABLET} from '../../../style/breakpoints';

export const Field = glamorous.div({
  ' > div > input': {
    boxSizing: 'border-box'
  }
});

export const WideField = glamorous(Field)({
  gridColumn: '1/3',
  ' > div > textarea': {
    minHeight: 110
  },
  [TABLET]: {
    gridColumn: '1'
  }
});
