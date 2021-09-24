import {CHARCOAL, GUNSMOKE} from '../../../style/colors';
import glamorous from 'glamorous';
import BASE from './style';

export default glamorous.div(BASE, ({width = 'auto'}) => ({
  width,
  backgroundColor: 'none',
  color: GUNSMOKE,
  ':hover': {
    backgroundColor: 'none',
    borderColor: 'transparent',
    color: CHARCOAL
  },
  cursor: 'pointer',
  border: `1px solid transparent`
}));
