import styled from '@emotion/styled';
import React from 'react';

import { ImportAgreement } from './ImportAgreement';
import {
  Overlay as SharedOverlay,
  OverlayContent,
  OverlayHeader,
  OverlayHeaderSection,
  OverlayWrapper,
  Wrapper,
} from './styles';
import { SwitchToAnchorHero } from './SwitchToAnchorHero';
import { Step } from './types';

type Props = {
  onboarding: {
    rssFeed: string;
    rssFeedMetadata: {
      image: string;
      authorName: string;
    };
  };
  stationId: string;
  userId: number;
  menuMode: string;
  history: {
    push: (url: string) => void;
  };
  actions: {
    logOutAndRedirect: (redirectPath: string) => void;
    redirectToSwitchPage: () => void;
    resetPersistedState: () => void;
  };
};

export const ImportAlreadyLoggedIn = ({
  onboarding,
  stationId,
  userId,
  history,
  actions,
}: Props) => {
  const {
    rssFeed,
    rssFeedMetadata: { image, authorName },
  } = onboarding;

  // redirect away when the user refreshes the page or logs out
  if (!rssFeed || !userId) {
    actions.redirectToSwitchPage();
    return null;
  }

  return (
    <Wrapper>
      <SwitchToAnchorHero imageSrc={image} authorName={authorName} />
      <OverlayWrapper>
        <Overlay>
          <OverlayHeaderSection>
            <OverlayHeader>Import podcast</OverlayHeader>
          </OverlayHeaderSection>
          <OverlayContent>
            <ImportAgreement
              stationId={stationId}
              userId={userId}
              feedUrl={rssFeed}
              previousStep={Step.ALREADY_LOGGED_IN}
              history={history}
              logOutAndRedirect={actions.logOutAndRedirect}
              resetPersistedState={actions.resetPersistedState}
            />
          </OverlayContent>
        </Overlay>
      </OverlayWrapper>
    </Wrapper>
  );
};

const Overlay = styled(SharedOverlay)`
  margin-top: -109px;
`;
