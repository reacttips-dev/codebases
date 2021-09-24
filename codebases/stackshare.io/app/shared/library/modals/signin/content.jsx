import React, {useEffect, Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../style/typography';
import DiscoverIcon from './discover-icon.svg';
import CompareIcon from './compare-icon.svg';
import LearnIcon from './learn-icon.svg';
import {CHARCOAL, CONCRETE, TARMAC} from '../../../style/colors';
import Twitter from '../../buttons/auth/twitter';
import GitHub from '../../buttons/auth/github';
import BitBucket from '../../buttons/auth/bit-bucket';
import GitLab from '../../buttons/auth/git-lab';
import Dummy from '../../buttons/auth/dummy';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {Google} from '../../buttons/auth';
import AuthWithSSO from '../../buttons/auth/sso';
import SingleSignOn from './sso';
import {PHONE} from '../../../style/breakpoints';

const REFERRER_POSTS_SUBMIT = '/posts/submit';

const Container = glamorous.div({
  display: 'flex',
  ...BASE_TEXT,
  flexDirection: 'column',
  alignItems: 'center'
});

const Logo = glamorous.img({
  height: 36,
  width: 235.74,
  marginTop: 10
});

const Welcome = glamorous.div({
  fontSize: 16
});

const Reasons = glamorous.div({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: 40,
  width: '100%',
  maxWidth: 619,
  minWidth: 200
});

const Reason = glamorous.div({
  width: 114,
  fontSize: 17,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '>span': {
    fontSize: 12,
    display: 'block'
  }
});

const Buttons = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 22,
  minWidth: 280,
  '>*': {
    marginBottom: 12
  },
  '>a.seeMore': {
    alignSelf: 'center',
    marginTop: 10,
    color: CHARCOAL,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  }
});

const Message = glamorous.div({
  margin: '40px 0 0 0',
  textAlign: 'center',
  fontStyle: 'italic'
});

const HideMobile = glamorous.span({
  [PHONE]: {
    display: 'none'
  }
});

const Footer = glamorous.div({
  color: CONCRETE,
  fontSize: 10,
  marginTop: 44 - 12,
  marginBottom: 20,
  textAlign: 'center',
  paddingRight: 40,
  paddingLeft: 40,
  '>a': {
    color: TARMAC,
    fontWeight: '600'
  }
});

const reasons = (
  <Reasons>
    <Reason>
      <DiscoverIcon />
      Discover <span>new tools &amp; services</span>
    </Reason>
    <Reason>
      <CompareIcon />
      Compare <span>tools side-by-side</span>
    </Reason>
    <Reason>
      <LearnIcon />
      Learn <span>the stack behind top companies</span>
    </Reason>
  </Reasons>
);

const footer = (
  <Footer>
    By clicking the sign up button above you agree to the{' '}
    <a href="/terms" title="Terms of use">
      Terms of use
    </a>{' '}
    and{' '}
    <a href="/privacy" title="Privacy Policy">
      Privacy Policy
    </a>
  </Footer>
);

const SigninContent = ({sendAnalyticsEvent, redirect, referrer, isMobile}) => {
  const [showMore, setShowMore] = useState(false);
  const [sso, setSso] = useState(false);
  useEffect(() => {
    sendAnalyticsEvent('Viewed signup.index Page', {url: redirect});
  }, []);

  const customMessage =
    referrer === REFERRER_POSTS_SUBMIT ? (
      <Fragment>
        <p>
          <strong>
            We&#39;re trying out something new here at StackShare - letting users share their blog
            posts.
          </strong>
        </p>
        <p>
          After signup, you&#39;ll be able to share your post. Please note your post won&#39;t be
          published immediately. Our moderators will review it and let you know via email if
          it&#39;s been approved and published on StackShare.
        </p>
      </Fragment>
    ) : null;

  return (
    <>
      {sso && (
        <>
          <SingleSignOn setSso={setSso} />
        </>
      )}
      <Container data-testid="signup">
        {!sso && (
          <>
            <Welcome>Welcome to</Welcome>
            <Logo alt="StackShare Logo" src="//img.stackshare.io/fe/ss-logo.png" />
            {customMessage && <Message>{customMessage}</Message>}
            {reasons}
            <Buttons>
              <div>{process.env.DUMMY_AUTH_ENABLED && <Dummy redirect={redirect} />}</div>
              <Google redirect={redirect} invert />
              <GitHub redirect={redirect} />
              {showMore ? (
                <>
                  <Twitter redirect={redirect} />
                  <BitBucket redirect={redirect} />
                  <GitLab redirect={redirect} />
                  {!isMobile && (
                    <HideMobile>
                      <AuthWithSSO setSso={setSso} />
                    </HideMobile>
                  )}
                </>
              ) : (
                <a
                  className="seeMore"
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setShowMore(true);
                  }}
                >
                  Show more options to <strong>Log in or Sign up</strong>
                </a>
              )}
            </Buttons>
            {footer}
          </>
        )}
      </Container>
    </>
  );
};

SigninContent.propTypes = {
  redirect: PropTypes.string,
  sendAnalyticsEvent: PropTypes.func,
  referrer: PropTypes.string,
  isMobile: PropTypes.bool
};

export default withSendAnalyticsEvent(SigninContent);
