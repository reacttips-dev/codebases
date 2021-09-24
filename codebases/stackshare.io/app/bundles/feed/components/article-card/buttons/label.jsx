import glamorous from 'glamorous';
import {MAKO} from '../../../../../shared/style/colors';
import {FONT_FAMILY} from '../../../../../shared/style/typography';

export default glamorous.span({
  fontFamily: FONT_FAMILY,
  fontSize: 13,
  lineHeight: '20px',
  color: MAKO,
  letterSpacing: 0.2,
  cursor: 'pointer'
});
