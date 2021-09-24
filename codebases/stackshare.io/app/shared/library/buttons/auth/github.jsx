import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Icon from './icons/github.svg';
import IconInvert from './icons/github_invert.svg';
import {containerStyle, handleClick} from './shared';
import {GITHUB_BLACK} from '../../../style/colors';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const Container = glamorous.a(...containerStyle(GITHUB_BLACK));

const AuthWithGithub = ({redirect, payload, sendAnalyticsEvent, invert}) => (
  <Container
    href="/users/auth/github"
    onClick={handleClick('github', redirect, sendAnalyticsEvent, payload)}
    invert={invert}
  >
    {invert ? <IconInvert /> : <Icon />} Continue with Github
  </Container>
);

AuthWithGithub.propTypes = {
  redirect: PropTypes.string,
  payload: PropTypes.object,
  sendAnalyticsEvent: PropTypes.func,
  invert: PropTypes.bool
};

export default withSendAnalyticsEvent(AuthWithGithub);
