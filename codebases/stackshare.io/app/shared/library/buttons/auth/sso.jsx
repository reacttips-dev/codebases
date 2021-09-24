import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Icon from '../../icons/sso-icon-white.svg';
import {containerStyle} from './shared';
import {FOCUS_BLUE, WHITE} from '../../../style/colors';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const SSOIcon = glamorous(Icon)({
  ' g': {
    fill: WHITE,
    stroke: WHITE
  }
});

const Container = glamorous.a(...containerStyle(FOCUS_BLUE));

const AuthWithSSO = ({setSso}) => (
  <Container onClick={() => setSso(true)}>
    <SSOIcon /> Continue using SSO
  </Container>
);

AuthWithSSO.propTypes = {
  setSso: PropTypes.bool
};

export default withSendAnalyticsEvent(AuthWithSSO);
