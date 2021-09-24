import glamorous from 'glamorous';
import {BASE_TEXT} from '../../style/typography';
import {FOCUS_BLUE} from '../../style/colors';

export default glamorous.a({
  ...BASE_TEXT,
  color: FOCUS_BLUE,
  textDecoration: 'none',
  cursor: 'pointer'
});
