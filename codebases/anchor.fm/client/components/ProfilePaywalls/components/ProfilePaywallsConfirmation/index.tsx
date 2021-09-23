import React from 'react';
import styled from '@emotion/styled';
import { ProfilePaywallsSpotifyButton } from './ProfilePaywallsSpotifyButton';
import { ProfilePaywallsPrivateRSS } from './ProfilePaywallsPrivateRSS';
import {
  COLOR_MUTED_BORDER,
  COLOR_MUTED_TEXT,
  MOBILE_BREAKPOINT,
} from '../../../PaywallsShared/constants';
import { CreatePodcastSubscriptionResponse } from '../../../../modules/AnchorAPI/v3/podcastSubscriptions/types';

interface ProfilePaywallsConfirmationProps {
  webStationId: string;
  subscriptionInfo: CreatePodcastSubscriptionResponse;
  onCopyRSSClick?: () => void;
  onSpotifyClick?: () => void;
}

export const CONFIRMATION_TITLE = 'You’re subscribed!';

export const ProfilePaywallsConfirmation = ({
  webStationId,
  onSpotifyClick,
  onCopyRSSClick,
  subscriptionInfo: { code: authenticationCode, rssUrl },
}: ProfilePaywallsConfirmationProps) => (
  <>
    <Message>
      Thanks for subscribing to this podcast. Tap the button below to activate
      your subscription.
    </Message>
    <ButtonContainer>
      <ProfilePaywallsSpotifyButton
        onClick={onSpotifyClick}
        href={`/auth/spotify/subscription/${webStationId}/${authenticationCode}`}
      />
    </ButtonContainer>
    <ProfilePaywallsPrivateRSS rssUrl={rssUrl} onCopyClick={onCopyRSSClick} />
  </>
);

const Message = styled.div`
  color: ${COLOR_MUTED_TEXT};
  font-size: 1.4rem;
`;

const ButtonContainer = styled.div`
  border-top: 1px solid ${COLOR_MUTED_BORDER};
  padding: 56px 0 40px;
  text-align: center;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 32px 0 16px;
  }
`;
