import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Icon from './icons/twitter.svg';
import IconInvert from './icons/twitter_invert.svg';
import {containerStyle, handleClick} from './shared';
import {TWITTER_BLUE} from '../../../style/colors';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const Container = glamorous.a(...containerStyle(TWITTER_BLUE));

const AuthWithTwitter = ({redirect, payload, sendAnalyticsEvent, invert}) => (
  <Container
    href="/users/auth/twitter"
    onClick={handleClick('twitter', redirect, sendAnalyticsEvent, payload)}
    invert={invert}
  >
    {invert ? <IconInvert /> : <Icon />} Continue with Twitter
  </Container>
);

AuthWithTwitter.propTypes = {
  redirect: PropTypes.string,
  payload: PropTypes.object,
  sendAnalyticsEvent: PropTypes.func,
  invert: PropTypes.bool
};

export default withSendAnalyticsEvent(AuthWithTwitter);
