import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {BASE_TEXT} from '../../style/typography';
import {MAKO} from '../../style/colors';
import {PHONE} from '../../style/breakpoints';
import ViewsIcon from '../icons/views-icon.svg';
import {formatCount} from '../../utils/format';

const Container = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginRight: 10
});

const Count = glamorous.strong({
  ...BASE_TEXT,
  marginLeft: '8px',
  fontSize: '14px',
  letterSpacing: '0.6px',
  color: MAKO,
  verticalAlign: 'middle',
  [PHONE]: {
    fontSize: 13
  }
});

const Views = ({viewCount}) => {
  return (
    <Container>
      <ViewsIcon />
      <Count>{viewCount ? formatCount(viewCount) : 0}</Count>
    </Container>
  );
};

Views.propTypes = {
  viewCount: PropTypes.number
};

export default Views;
