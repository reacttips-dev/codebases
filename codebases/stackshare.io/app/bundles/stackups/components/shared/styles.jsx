import glamorous from 'glamorous';
import {TABLET} from '../../../../shared/style/breakpoints';

export const Grid = glamorous.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, auto))',
  rowGap: 20,
  columnGap: 20,
  [TABLET]: {
    gridTemplateColumns: 'minmax(250px, auto)'
  }
});

export const StackupsLinks = glamorous(Grid)({
  marginTop: 20,
  [TABLET]: {
    justifyItems: 'center'
  }
});
