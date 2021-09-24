import glamorous from 'glamorous';
import {TITLE_TEXT} from '../../style/typography';
import {CHARCOAL} from '../../style/colors';

export default glamorous.h1({
  ...TITLE_TEXT,
  padding: 0,
  margin: 0,
  fontSize: 25,
  lineHeight: 1,
  color: CHARCOAL
});
