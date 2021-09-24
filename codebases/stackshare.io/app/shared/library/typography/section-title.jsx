import glamorous from 'glamorous';
import {BASE_TEXT} from '../../style/typography';
import {CATHEDRAL} from '../../style/colors';

export default glamorous.h2({
  ...BASE_TEXT,
  padding: 0,
  margin: 0,
  fontSize: 18,
  lineHeight: 1,
  color: CATHEDRAL,
  marginBottom: 16
});
