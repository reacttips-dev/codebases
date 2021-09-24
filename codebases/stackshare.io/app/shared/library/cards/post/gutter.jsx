import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CONCRETE, WHITE} from '../../../style/colors';
import {PHONE} from '../../../style/breakpoints';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginLeft: 7,
  marginRight: 14,
  [PHONE]: {
    marginLeft: 0,
    marginRight: 5
  }
});

const Top = glamorous.div({
  width: 3,
  height: 38,
  backgroundColor: ASH
});

const Knob = glamorous.div({
  height: 11,
  width: 11,
  backgroundColor: CONCRETE,
  border: `2px solid ${WHITE}`,
  boxSizing: 'content-box',
  borderRadius: '50%'
});

const Bottom = glamorous.div({
  width: 3,
  backgroundColor: ASH,
  flexGrow: 1
});

const Gutter = ({last = false}) => {
  return (
    <Container>
      <Top />
      <Knob />
      {!last && <Bottom />}
    </Container>
  );
};

Gutter.propTypes = {
  last: PropTypes.bool
};

export default Gutter;
