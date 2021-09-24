import glamorous from 'glamorous';
import {BASE_TEXT} from '../../style/typography';
import {WHITE, WHITE_SMOKE, ASH} from '../../style/colors';

export const SearchResult = glamorous.li(
  {
    display: 'flex',
    alignItems: 'center',
    padding: '7px 9px 7px 9px',
    cursor: 'pointer',
    ...BASE_TEXT,
    ':hover': {
      background: WHITE_SMOKE
    },
    '> img': {
      background: WHITE,
      width: 24,
      height: 24,
      borderRadius: 2,
      border: `1px solid ${ASH}`,
      padding: 4,
      boxSizing: 'border-box',
      marginRight: 10
    }
  },
  ({isHighlightedResult}) => ({
    background: isHighlightedResult ? WHITE_SMOKE : WHITE
  })
);
