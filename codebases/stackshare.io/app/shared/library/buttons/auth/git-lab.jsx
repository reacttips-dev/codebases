import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Icon from './icons/git-lab.svg';
import IconInvert from './icons/git-lab_invert.svg';
import {containerStyle, handleClick} from './shared';
import {GITLAB_RED} from '../../../style/colors';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const Container = glamorous.a(...containerStyle(GITLAB_RED));

const AuthWithGitLab = ({redirect, payload, sendAnalyticsEvent, invert}) => (
  <Container
    href="/users/auth/gitlab"
    onClick={handleClick('gitlab', redirect, sendAnalyticsEvent, payload)}
    invert={invert}
  >
    {invert ? <IconInvert /> : <Icon /> /*eslint-disable-line*/} Continue with GitLab
  </Container>
);

AuthWithGitLab.propTypes = {
  redirect: PropTypes.string,
  payload: PropTypes.object,
  sendAnalyticsEvent: PropTypes.func,
  invert: PropTypes.bool
};

export default withSendAnalyticsEvent(AuthWithGitLab);
