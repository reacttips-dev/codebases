import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {containerStyle, handleClick} from './shared';
import {GOSSAMER} from '../../../style/colors';

const Container = glamorous.a(...containerStyle(GOSSAMER));

const AuthWithDummy = ({redirect, payload, invert}) => (
  <Container
    href="/users/auth/dummy"
    onClick={handleClick('dummy', redirect, () => null, payload)}
    invert={invert}
  >
    Continue with Dummy Auth
  </Container>
);

AuthWithDummy.propTypes = {
  redirect: PropTypes.string,
  payload: PropTypes.object,
  invert: PropTypes.bool
};

export default AuthWithDummy;
