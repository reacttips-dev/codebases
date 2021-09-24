import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../shared/style/typography';
import {FOCUS_BLUE, WHITE} from '../../../shared/style/colors';

export const UploaderContainer = glamorous.div({
  margin: '35px 0',
  ' div.uploadcare--widget': {
    flexDirection: 'row'
  },
  ' button.uploadcare--widget__button_type_open': {
    ...BASE_TEXT,
    borderRadius: 0,
    cursor: 'pointer',
    height: 32,
    textTransform: 'capitalize',
    background: WHITE,
    fontSize: 13,
    outline: 'none',
    lineHeight: 0,
    '&:hover, &:focus': {
      background: WHITE,
      color: FOCUS_BLUE
    }
  }
});

export const Label = glamorous.label({
  color: '#777',
  fontSize: 13,
  fontWeight: 600
});
