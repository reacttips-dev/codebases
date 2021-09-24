import glamorous from 'glamorous';
import {PHONE} from '../../../../shared/style/breakpoints';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {ASH, FOCUS_BLUE, WHITE, SCORE} from '../../../../shared/style/colors';

// User Details

export const Container = glamorous.div({
  margin: '25px 0',
  position: 'relative',
  [PHONE]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 15px',
    margin: '25px 0 10px 0'
  }
});

export const AvatarContainer = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  '&:last-child': {
    display: 'none'
  }
});

export const MetaData = glamorous.div({
  ...BASE_TEXT
});

export const UserPositionDetails = glamorous.div({
  margin: '5px 0'
});

export const Location = glamorous.div({
  margin: '5px 0',
  display: 'flex',
  alignItems: 'center',
  [PHONE]: {
    textAlign: 'center',
    display: 'block'
  }
});

export const Bookmarks = glamorous.div({
  margin: '5px 0',
  display: 'flex',
  alignItems: 'center',
  color: FOCUS_BLUE,
  cursor: 'pointer',
  ...BASE_TEXT,
  [PHONE]: {
    textAlign: 'center',
    display: 'block'
  }
});

// Jobs Card

export const JobsCardContainer = glamorous.div(
  {
    width: '100%',
    borderRadius: 4,
    background: WHITE,
    padding: '20px 20px',
    marginBottom: 25,
    ...BASE_TEXT,
    boxSizing: 'border-box',
    [PHONE]: {
      padding: '15px 15px'
    }
  },
  ({sponsored}) => ({
    border: sponsored ? `1px solid ${SCORE}` : `1px solid ${ASH}`
  })
);

export const Top = glamorous.div({
  borderBottom: `1px solid ${ASH}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: 25,
  [PHONE]: {
    flexDirection: 'column',
    paddingBottom: 0
  }
});

export const Bottom = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 15
});

export const JobDetails = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '75%',
  [PHONE]: {
    width: '100%'
  }
});

export const CtaPannel = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  [PHONE]: {
    width: '100%',
    marginTop: 20
  }
});
