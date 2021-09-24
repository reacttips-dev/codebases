import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {FOCUS_BLUE, PUMPKIN} from '../../../../shared/style/colors';

export const GetAdviceButton = glamorous.button({
  ...BASE_TEXT,
  color: 'white',
  border: 0,
  borderRadius: 2,
  background: PUMPKIN,
  height: 34,
  outline: 'none'
});

export const GiveAdviceButton = glamorous(GetAdviceButton)({background: FOCUS_BLUE});
