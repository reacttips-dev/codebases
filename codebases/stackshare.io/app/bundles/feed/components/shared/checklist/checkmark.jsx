import glamorous from 'glamorous';
import {WHITE} from '../../../../../shared/style/colors';

export default glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  '&::after': {
    /*Add another block-level blank space*/
    content: ' ',
    display: 'block',

    /*Make it a small rectangle so the border will create an L-shape*/
    width: 4,
    height: 9,

    /*Add a white border on the bottom and left, creating that 'L' */
    border: `solid ${WHITE}`,
    borderWidth: '0 1px 1px 0',

    /*Rotate the L 45 degrees to turn it into a checkmark*/
    transform: 'rotate(45deg)',

    /*Tweak position*/
    position: 'relative',
    bottom: 1
  }
});
