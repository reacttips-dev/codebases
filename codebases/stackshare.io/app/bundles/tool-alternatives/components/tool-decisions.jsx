import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {TARMAC, ALABASTER} from '../../../shared/style/colors';
import {TITLE_TEXT} from '../../../shared/style/typography';
import AlternateDecisions from '../../../shared/library/cards/alternate-decision';
import {flexBox, INITIAL, COLUMN, ROW, CENTER, FLEX_START} from '../styles';
import {MEDIUM, PHONE, TABLET} from '../../../shared/style/breakpoints';

const Container = glamorous.div({
  width: '100%',
  padding: '20px 20px 0',
  ...flexBox(INITIAL, COLUMN, CENTER),
  ' > div:last-child': {
    borderBottom: 'none'
  },
  [MEDIUM]: {
    width: '95%'
  },
  [TABLET]: {
    width: '93%'
  },
  [PHONE]: {
    width: '97%'
  }
});

const PostsTitle = glamorous.div({
  width: '100%',
  height: 42,
  borderRadius: 4,
  paddingLeft: 10,
  background: ALABASTER,
  ...flexBox(FLEX_START, ROW, CENTER),
  '& h2': {
    ...TITLE_TEXT,
    color: TARMAC,
    margin: 0,
    fontSize: 14,
    textTransform: 'uppercase'
  }
});

const ToolDecisions = ({name, decisions}) => {
  return (
    <Container>
      <PostsTitle>
        <h2>{`related ${name} posts`}</h2>
      </PostsTitle>
      <AlternateDecisions decisions={decisions} sendAnalyticsEvent={() => {}} />
    </Container>
  );
};

ToolDecisions.propTypes = {
  name: PropTypes.string,
  decisions: PropTypes.array
};

export default ToolDecisions;
