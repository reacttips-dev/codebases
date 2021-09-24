import React, {useContext, useState, useEffect} from 'react';
import glamorous from 'glamorous';
import {CHARCOAL, FOCUS_BLUE, WHITE, MAKO} from '../../../../shared/style/colors';
import PropTypes from 'prop-types';
import {CurrentUserContext} from '../../../../shared/enhancers/current-user-enhancer';
import GithubSyncIcon from './images/github_sync_icon.svg';
import CloseCta from './images/close_cta.svg';
import {useSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';

const Container = glamorous.div({
  display: 'flex',
  padding: '6px 0 0 10px',
  width: 389,
  height: 152,
  borderRadius: 4,
  margin: '30px 0',
  border: `1px solid #E2E2E2`,
  boxSizing: 'border-box',
  backgroundColor: WHITE,
  left: 28,
  bottom: 0,
  zIndex: 1000,
  position: 'fixed'
});

const GithubSyncIconStyled = glamorous(GithubSyncIcon)({
  height: 47,
  width: 45,
  background: WHITE,
  marginTop: 5
});

const InfoText = glamorous.div({
  margin: '7px 10px 0 8px',
  width: 290
});

const Title = glamorous.a({
  margin: '4px 0 0 0',
  fontSize: 13,
  width: 242,
  height: 42,
  fontWeight: 600,
  lineHeight: 1.53,
  color: CHARCOAL,
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
});

const SubTitle = glamorous.p({
  fontSize: 12,
  lineHeight: 1.64,
  width: 281,
  height: 51,
  color: MAKO,
  margin: '6px 0 9px 0'
});

const CloseCtaStyled = glamorous(CloseCta)({
  cursor: 'pointer'
});

const LearnMoreLink = glamorous.a({
  color: FOCUS_BLUE,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  }
});

const CtaStackbot = ({privateMode, mobile}) => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const currentUser = useContext(CurrentUserContext);
  const [showCta, setShowCta] = useState(false);
  const bannerUrl = window.location.href;

  useEffect(() => {
    if (
      sessionStorage.getItem('show_cta_stackbot') === null &&
      localStorage.getItem('hidden_page') === null
    ) {
      setShowCta(true);
    }

    if (window.location.pathname === '/private') {
      localStorage.setItem('hidden_page', true);
      setShowCta(false);
    }

    // eslint-disable-next-line no-undef
    if (contentGroupPage === 'Onboarding') {
      setShowCta(false);
    }

    if (
      localStorage.getItem('hidden_page') === 'true' &&
      sessionStorage.getItem('show_cta_stackbot') === null
    ) {
      sessionStorage.setItem('show_cta_stackbot', false);
    }
  }, []);

  const closeBanner = () => {
    sendAnalyticsEvent('floating_banner_click', {
      url: bannerUrl,
      path: window.location.pathname,
      // eslint-disable-next-line no-undef
      contentGroupPage: contentGroupPage,
      clickType: 'hide'
    });
    setShowCta(false);
    sessionStorage.setItem('show_cta_stackbot', false);
  };

  return (
    <>
      {(!currentUser || (currentUser && !privateMode)) && !mobile && showCta && (
        <Container>
          <GithubSyncIconStyled />
          <InfoText>
            <Title
              href="/private"
              onClick={() => {
                sendAnalyticsEvent('floating_banner_click', {
                  url: bannerUrl,
                  path: window.location.pathname,
                  // eslint-disable-next-line no-undef
                  contentGroupPage: contentGroupPage,
                  clickType: 'title'
                });
              }}
            >
              Automatically sync your stack profiles with your GitHub repos 💫
            </Title>
            <SubTitle>
              Install the StackShare GitHub App to automatically create stack profiles for your
              org’s public/private repos!
            </SubTitle>
            <LearnMoreLink
              href="/private"
              onClick={() => {
                sendAnalyticsEvent('floating_banner_click', {
                  url: bannerUrl,
                  path: window.location.pathname,
                  // eslint-disable-next-line no-undef
                  contentGroupPage: contentGroupPage,
                  clickType: 'learn_more'
                });
              }}
            >
              Learn more
            </LearnMoreLink>
          </InfoText>
          <CloseCtaStyled onClick={() => closeBanner()} />
        </Container>
      )}
    </>
  );
};

CtaStackbot.propTypes = {
  privateMode: PropTypes.object,
  mobile: PropTypes.bool
};

export default CtaStackbot;
