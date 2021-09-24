import glamorous from 'glamorous';
import {TITLE_TEXT} from '../../../../shared/style/typography';
import {CHARCOAL, SILVER_ALUMINIUM} from '../../../../shared/style/colors';
import SmallTitle from '../../../../shared/library/typography/small-title';

export const Title = glamorous.h2({
  ...TITLE_TEXT,
  fontSize: 18,
  color: CHARCOAL,
  margin: 0
});

export const ComponentContainer = glamorous.div({
  margin: '25px 0',
  display: 'block'
});

export const StyledSmallTitle = glamorous(SmallTitle)({
  textTransform: 'uppercase',
  color: SILVER_ALUMINIUM
});

export const Spinner = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '100px 0'
});

export const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 20
});

export const MembersTitle = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  ' svg': {
    marginLeft: 7
  }
});
