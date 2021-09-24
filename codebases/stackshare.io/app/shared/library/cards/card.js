import glamorous from 'glamorous';
import {BASE_TEXT, TITLE_TEXT, WEIGHT} from '../../style/typography';
import {CHARCOAL, TARMAC, ASH, FOCUS_BLUE, CONCRETE} from '../../style/colors';
import {PHONE} from '../../style/breakpoints';

export const MOBILE_PADDING = 10;

export const ROW_BORDER = `1px solid ${ASH}`;

export const Container = glamorous.div({
  ...BASE_TEXT,
  color: TARMAC,
  ' strong': {
    color: CHARCOAL
  },
  display: 'flex',
  flexDirection: 'column',
  [PHONE]: {
    padding: MOBILE_PADDING
  }
});

export const ListContainer = glamorous.div();

export const Title = glamorous.div({
  ...TITLE_TEXT,
  color: CHARCOAL,
  fontSize: 18
});

export const Content = glamorous.div({
  paddingRight: 10
});

export const List = glamorous.div({
  marginTop: 10
});

export const ListItem = glamorous.div({
  ...BASE_TEXT,
  color: TARMAC,
  display: 'flex',
  '&::before': {
    content: '\u2022',
    paddingLeft: 5,
    paddingRight: 10
  }
});

export const SectionHeading = glamorous.div({
  ...BASE_TEXT,
  fontSize: 18,
  fontWeight: WEIGHT.BOLD,
  color: CHARCOAL,
  [PHONE]: {
    padding: MOBILE_PADDING,
    borderBottom: 'none'
  }
});

export const Placeholder = glamorous.div({
  ...BASE_TEXT,
  textAlign: 'center',
  fontsize: 14,
  color: CONCRETE,
  fontStyle: 'italic'
});

export const SectionPlaceholder = glamorous(Placeholder)({
  height: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const Link = glamorous.a({
  ...BASE_TEXT,
  textDecoration: 'none',
  color: FOCUS_BLUE,
  marginTop: 10
});
