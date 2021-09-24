import glamorous from 'glamorous';
import {grid} from '../../utils/grid';
import {TITLE_TEXT} from '../../style/typography';
import {CHARCOAL} from '../../style/colors';

export default glamorous.div({
  ...TITLE_TEXT,
  color: CHARCOAL,
  marginBottom: grid(1),
  '& a, & a:hover, & a:visited': {
    color: CHARCOAL,
    textDecoration: 'none'
  }
});
