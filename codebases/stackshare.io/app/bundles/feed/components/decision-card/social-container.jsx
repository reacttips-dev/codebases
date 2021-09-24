import glamorous from 'glamorous';
import {grid} from '../../../../shared/utils/grid';
import {FOCUS_BLUE, MAKO} from '../../../../shared/style/colors';
import {HOVER} from '../../../../shared/style/breakpoints';

export default glamorous.button({
  border: 0,
  background: 'none',
  outline: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginLeft: grid(4),
  color: MAKO,
  '&:first-child': {
    marginLeft: 0
  },
  '> svg': {
    marginRight: grid(1)
  },
  [HOVER]: {
    ':hover': {
      '> svg > path': {
        fill: FOCUS_BLUE
      },
      color: FOCUS_BLUE
    }
  }
});
