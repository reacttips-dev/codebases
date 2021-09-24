import glamorous from 'glamorous';
import {BASE_TEXT} from '../../style/typography';
import {TARMAC} from '../../style/colors';

export default glamorous.span({
  ...BASE_TEXT,
  color: TARMAC,
  '& a, & a:hover, & a:visited': {
    color: TARMAC,
    textDecoration: 'none'
  }
});
