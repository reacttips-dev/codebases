import {WEIGHT} from '../../style/typography';
import glamorous from 'glamorous';
import BaseHeading from './heading';

export default glamorous(BaseHeading)({
  fontWeight: WEIGHT.NORMAL,
  fontSize: 22,
  marginBottom: 18,
  lineHeight: 1.41
});
