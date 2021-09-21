import React, { useEffect, useState } from 'react';
import { css } from 'emotion';

import Text from 'shared/Text';
import { CarrotIcon } from 'shared/Icon/components/CarrotIcon';
import CreateAccountContainer from 'components/CreateAccountContainer';
import { Paragraph } from 'components/LoginPage/styles';
import { useOptimizelyFeature } from 'hooks/useOptimizelyFeature';
import { ImportAgreement } from './ImportAgreement';
import { SwitchToAnchorHero } from './SwitchToAnchorHero';
import {
  Wrapper,
  OverlayWrapper,
  Overlay,
  OverlayHeader,
  OverlayHeaderSection,
  OverlayContent,
} from './styles';
import { Step } from './types';

type ImportCreateAccountProps = {
  stationId: string;
  userId: number;
  history: any;
  actions: {
    fetchTempVanitySlugFromPodcastName: () => void;
    redirectToSwitchPage: () => void;
    resetPersistedState: () => void;
  };
  onboarding: {
    rssFeed: string;
    rssFeedMetadata: {
      image: string;
      authorName: string;
    };
    vanitySlug: string;
  };
};

export const ImportCreateAccount = ({
  stationId,
  userId,
  history,
  actions: {
    fetchTempVanitySlugFromPodcastName,
    redirectToSwitchPage,
    resetPersistedState,
  },
  onboarding: { rssFeed, rssFeedMetadata, vanitySlug },
}: ImportCreateAccountProps) => {
  const [createAccountSuccess, setCreateAccountSuccess] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isAgeGatingEnabled, ageGatingVars] = useOptimizelyFeature(
    'age_gating'
  );
  const { multiScreen } = ageGatingVars;
  const isAgeGatingMultiScreen = isAgeGatingEnabled && multiScreen;
  const isAgeGatingStep1 = isAgeGatingMultiScreen && formStep === 1;
  const isAgeGatingStep2 = isAgeGatingMultiScreen && formStep === 2;
  const isAgeGatingStep3 = isAgeGatingMultiScreen && formStep === 3;

  useEffect(() => {
    fetchTempVanitySlugFromPodcastName();
  }, [fetchTempVanitySlugFromPodcastName]);

  // redirect away when the user refreshes the page or logs out
  if (!rssFeed || (createAccountSuccess && !userId)) {
    redirectToSwitchPage();
    return null;
  }

  return (
    <Wrapper>
      <SwitchToAnchorHero
        imageSrc={rssFeedMetadata.image}
        authorName={rssFeedMetadata.authorName}
      />
      <OverlayWrapper>
        <Overlay>
          <OverlayHeaderSection>
            {(!isAgeGatingMultiScreen || isAgeGatingStep1) && (
              <OverlayHeader>Create your account</OverlayHeader>
            )}
            {isAgeGatingStep2 && (
              <>
                <OverlayHeader>What’s your date of birth?</OverlayHeader>
                <Paragraph>This information will not be public.</Paragraph>
              </>
            )}
            {isAgeGatingStep3 && <OverlayHeader>Import podcast</OverlayHeader>}
            {!isAgeGatingMultiScreen && (
              <div
                className={css`
                  text-align: center;
                `}
              >
                <Text
                  size="md"
                  isInline
                  isBold
                  color={createAccountSuccess ? '#a0a0a0' : '#15171a'}
                >
                  Sign up
                </Text>
                <CarrotIcon
                  className={css`
                    width: 5px;
                    margin: 0 5px;
                  `}
                />
                <Text
                  size="md"
                  isInline
                  isBold
                  color={createAccountSuccess ? '#15171a' : '#a0a0a0'}
                >
                  Import podcast
                </Text>
              </div>
            )}
          </OverlayHeaderSection>
          <OverlayContent>
            {createAccountSuccess ? (
              <ImportAgreement
                stationId={stationId}
                userId={userId}
                feedUrl={rssFeed}
                previousStep={Step.CREATE_ACCOUNT}
                history={history}
                resetPersistedState={resetPersistedState}
              />
            ) : (
              <div
                className={css`
                  max-width: 342px;
                  margin: auto;
                `}
              >
                <CreateAccountContainer
                  // @ts-ignore TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
                  submitCallback={() => {
                    setCreateAccountSuccess(true);
                    if (isAgeGatingMultiScreen) setFormStep(3);
                  }}
                  vanitySlug={vanitySlug}
                  feedUrl={rssFeed}
                  formStep={formStep}
                  setFormStep={setFormStep}
                />
              </div>
            )}
          </OverlayContent>
        </Overlay>
      </OverlayWrapper>
    </Wrapper>
  );
};
