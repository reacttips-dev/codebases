import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import { AdjustTrackEvent } from 'modules/analytics/adjust';
import { trackEvent } from 'modules/analytics';
import {
  Wrapper,
  OverlayWrapper,
  Overlay,
  OverlayHeaderSection,
  OverlayContent,
  SwitchToAnchor,
} from 'components/ImportOnboarding/styles';
import {
  OverlayOverrideCSS,
  Header1,
  Paragraph,
} from 'components/LoginPage/styles';
import { SignupForm } from 'components/SignupForm';
import events from 'components/SignupPageContainer/events';
import { useOptimizelyFeature } from 'hooks/useOptimizelyFeature';
import { WordPressHero } from './components/WordPressHero';
import {
  Header2,
  SwitchToAnchorOverrideCSS,
  WordPressLogoContainer,
} from './styles';

function Hero({ isWordPressReferral }) {
  if (isWordPressReferral) {
    return (
      <WordPressLogoContainer>
        <WordPressHero />
      </WordPressLogoContainer>
    );
  }
  return (
    <SwitchToAnchor className={SwitchToAnchorOverrideCSS}>
      <Header2>Welcome to Anchor</Header2>
    </SwitchToAnchor>
  );
}

export function SignupPage({
  onSubmit,
  onClickRequestResetPassword,
  location: { search },
}) {
  const { ref } = queryString.parse(search);
  const isWordPressReferral = ref === 'wp';
  const [formStep, setFormStep] = useState(1);
  const [isAgeGatingEnabled, ageGatingVars] = useOptimizelyFeature(
    'age_gating'
  );
  const { multiScreen } = ageGatingVars;
  const isAgeGatingStep2 = isAgeGatingEnabled && multiScreen && formStep === 2;

  useEffect(() => {
    // Required for Floodlight tagging
    // eslint-disable-next-line no-undef
    gtag('event', 'conversion', {
      allow_custom_scripts: true,
      send_to: 'DC-9266237/ancho0/spoti00+standard',
    });

    // adjust log for viewing sign up
    trackEvent(
      null,
      { eventToken: AdjustTrackEvent.ONBOARDING_STARTED },
      // eslint-disable-next-line no-undef
      { providers: [Adjust] }
    );
  }, []);

  return (
    <Wrapper>
      <Hero isWordPressReferral={isWordPressReferral} />
      <OverlayWrapper>
        <Overlay className={OverlayOverrideCSS}>
          <OverlayHeaderSection>
            {isAgeGatingStep2 ? (
              <>
                <Header1>What’s your date of birth?</Header1>
                <Paragraph>This information will not be public.</Paragraph>
              </>
            ) : (
              <>
                <Header1>Create your account</Header1>
                {isWordPressReferral ? (
                  <Paragraph>
                    Record, share, and reach listeners everywhere.
                  </Paragraph>
                ) : (
                  <Paragraph>
                    Already have an account?{' '}
                    <Link
                      data-cy="loginLink"
                      to="/login"
                      onClick={events.signUpSignInButtonClicked}
                    >
                      Log in
                    </Link>{' '}
                    instead.
                  </Paragraph>
                )}
              </>
            )}
          </OverlayHeaderSection>
          <OverlayContent>
            <SignupForm
              onSubmit={onSubmit}
              onClickRequestResetPassword={onClickRequestResetPassword}
              isWordPressReferral={isWordPressReferral}
              formStep={formStep}
              setFormStep={setFormStep}
            />
          </OverlayContent>
        </Overlay>
      </OverlayWrapper>
    </Wrapper>
  );
}
