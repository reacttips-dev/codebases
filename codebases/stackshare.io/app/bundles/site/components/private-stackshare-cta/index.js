import React from 'react';
import glamorous from 'glamorous';
import PrivateStackshare from '../../../../shared/library/icons/private-stackshare-icon.svg';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import {WHITE, SILVER_ALUMINIUM, CATHEDRAL, PUMPKIN, SCORE} from '../../../../shared/style/colors';
import {PHONE} from '../../../../shared/style/breakpoints';
import {MAX_PAGE_WIDTH} from '../../../../shared/style/dimensions';
import {withAnalyticsPayload} from '../../../../shared/enhancers/analytics-enhancer';
import {useSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';

const Container = glamorous.div({
  width: '100%',
  maxWidth: MAX_PAGE_WIDTH,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  margin: '78px auto',
  [PHONE]: {
    margin: '50px 0',
    textAlign: 'center',
    flexDirection: 'column'
  }
});

const PrivateStackshareIcon = glamorous(PrivateStackshare)({
  height: 250,
  [PHONE]: {
    height: 200
  }
});

const PrivateStackshareDesc = glamorous.div({
  maxWidth: 430
});

const Title = glamorous.h1({
  fontSize: 32,
  fontWeight: 'bold',
  lineHeight: '1.25',
  letterSpacing: 0.12,
  color: CATHEDRAL,
  [PHONE]: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: '1.35',
    letterSpacing: 0.07
  }
});

const SubTitle = glamorous.h2({
  fontSize: 18,
  lineHeight: 1.78,
  letterSpacing: 0.07,
  color: SILVER_ALUMINIUM,
  margin: '10px 0',
  [PHONE]: {
    margin: '10px 40px'
  }
});

const PrivateStackshareCtaButton = glamorous(SimpleButton)({
  display: 'flex',
  border: 0,
  borderRadius: 2,
  background: PUMPKIN,
  height: 50,
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: 0.07,
  textAlign: 'center',
  color: WHITE,
  padding: '13px 30px',
  '&:hover': {
    background: SCORE
  },
  [PHONE]: {
    display: 'inline-flex',
    padding: '13px 18px'
  }
});

const PrivateStackshareCtaHomepage = () => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  const goToPrivateLandingPage = () => {
    sendAnalyticsEvent('private_landing_cta', {pageName: 'homepage'});
    window.location = '/private';
  };

  return (
    <Container>
      <PrivateStackshareIcon />
      <PrivateStackshareDesc>
        <Title>Enterprise collaboration for technology decisions</Title>
        <SubTitle>
          See which tech stacks you’re using, why, and who someone should talk to about them.
        </SubTitle>
        <PrivateStackshareCtaButton onClick={goToPrivateLandingPage}>
          Learn More
        </PrivateStackshareCtaButton>
      </PrivateStackshareDesc>
    </Container>
  );
};

export default withAnalyticsPayload({
  'page.name': 'Home',
  path: typeof window !== 'undefined' ? window.location.pathname : null,
  url: typeof window !== 'undefined' ? window.location.href : null,
  referrer: typeof document !== 'undefined' ? document.referrer : null
})(PrivateStackshareCtaHomepage);
