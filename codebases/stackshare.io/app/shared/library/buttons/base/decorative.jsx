import glamorous from 'glamorous';
import SimpleButton from './simple';
import {WEIGHT} from '../../../style/typography';
import {grid} from '../../../utils/grid';

export const SMALL = 'small';

export default glamorous(SimpleButton)(
  {
    textTransform: 'uppercase',
    fontWeight: WEIGHT.BOLD,
    letterSpacing: 1.3
  },
  ({size = 'normal'}) => ({
    fontSize: size === SMALL ? 11 : 12,
    height: size === SMALL ? 21 : grid(4),
    paddingLeft: size === SMALL ? grid(1) : grid(2),
    paddingRight: size === SMALL ? grid(1) : grid(2)
  })
);
