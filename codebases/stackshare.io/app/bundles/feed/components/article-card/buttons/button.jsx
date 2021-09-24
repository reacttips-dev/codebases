import glamorous from 'glamorous';
import {GUNSMOKE} from '../../../../../shared/style/colors';
import {WEIGHT} from '../../../../../shared/style/typography';

export default glamorous.a({
  marginRight: 22,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontWeight: WEIGHT.BOLD,
  '> svg': {
    marginRight: 7
  },
  ':hover > span': {
    color: GUNSMOKE
  }
});
