import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../style/typography';
import {CATHEDRAL, CHARCOAL, CONCRETE} from '../../../style/colors';

export default glamorous.a({
  ...BASE_TEXT,
  letterSpacing: 0.2,
  color: CHARCOAL,
  display: 'flex',
  border: `1px solid ${CONCRETE}`,
  borderRadius: 20,
  height: 37,
  minWidth: 115,
  padding: 0,
  outline: 'none',
  background: 'none',
  paddingLeft: 20,
  paddingRight: 20,
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  textDecoration: 'none',
  boxSizing: 'border-box',
  ':hover': {
    color: CHARCOAL,
    border: `1px solid ${CATHEDRAL}`
  }
});
