import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Icon from './icons/bit-bucket.svg';
import IconInvert from './icons/bit-bucket_invert.svg';
import {containerStyle, handleClick} from './shared';
import {BITBUCKET_BLUE} from '../../../style/colors';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const Container = glamorous.a(...containerStyle(BITBUCKET_BLUE));

const AuthWithBitBucket = ({redirect, payload, sendAnalyticsEvent, invert}) => (
  <Container
    href="/users/auth/bitbucket"
    onClick={handleClick('bitbucket', redirect, sendAnalyticsEvent, payload)}
    invert={invert}
  >
    {invert ? <IconInvert /> : <Icon /> /*eslint-disable-line*/} Continue with Bitbucket
  </Container>
);

AuthWithBitBucket.propTypes = {
  redirect: PropTypes.string,
  payload: PropTypes.object,
  sendAnalyticsEvent: PropTypes.func,
  invert: PropTypes.bool
};

export default withSendAnalyticsEvent(AuthWithBitBucket);
