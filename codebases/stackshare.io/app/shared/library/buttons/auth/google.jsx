import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import GoogleIcon from '../../icons/google.svg';
import {containerStyle, handleClick} from './shared';
import {BLACK} from '../../../style/colors';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const Container = glamorous.a(...containerStyle(BLACK));

const Icon = glamorous(GoogleIcon)({
  height: 15,
  width: 15
});

const AuthWithGoogle = ({redirect, payload, sendAnalyticsEvent, invert}) => (
  <Container
    href="/users/auth/google"
    onClick={handleClick('google', redirect, sendAnalyticsEvent, payload)}
    invert={invert}
  >
    <Icon /> Continue with Google
  </Container>
);

AuthWithGoogle.propTypes = {
  redirect: PropTypes.string,
  payload: PropTypes.object,
  sendAnalyticsEvent: PropTypes.func,
  invert: PropTypes.bool
};

export default withSendAnalyticsEvent(AuthWithGoogle);
