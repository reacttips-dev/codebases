import styled from '@emotion/styled';
import React, { useState } from 'react';
import AnchorAPI from '../../../../modules/AnchorAPI';
import { CreatePodcastSubscriptionResponse } from '../../../../modules/AnchorAPI/v3/podcastSubscriptions/types';
import { Button } from '../../../../shared/Button/NewButton';
import {
  BORDER_RADIUS_DEFAULT,
  COLOR_MUTED_BORDER,
  COLOR_MUTED_TEXT,
} from '../../../PaywallsShared/constants';

export const OPT_IN_BUTTON_LABEL = 'Yes, opt me in';
export const OPTING_IN_BUTTON_LABEL = 'Opting in...';
export const OPT_OUT_BUTTON_LABEL = 'No, continue';

export const ProfilePaywallsEmailConsent = ({
  webStationId,
  subscriptionInfo,
  onComplete,
  onOptInClick,
  onOptOutClick,
}: {
  webStationId: string;
  subscriptionInfo: CreatePodcastSubscriptionResponse;
  onComplete: () => void;
  onOptInClick?: () => void;
  onOptOutClick?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { code } = subscriptionInfo;
  return (
    <>
      <TermsContainer>
        <TermsHeader>I understand:</TermsHeader>
        <TermsList>
          <li>This opts me in to receiving emails directly from the creator</li>
          <li>My email address will be shared with the creator</li>
          <li>
            The creator is responsible for their use of my email address and any
            requests to unsubscribe from emails should be directed to the
            creator
          </li>
        </TermsList>
      </TermsContainer>
      <ButtonContainer>
        <Button
          kind="button"
          color="purple"
          isDisabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            onOptInClick?.();
            try {
              await AnchorAPI.optIntoPodcastSubscriptionEmails({
                webStationId,
                code,
              });
            } catch (error) {
              /**
               * Log the error, but don't block, as this API call is
               * non-essential and we really want to forward them to the
               * confirmation page. The backend does no validation of the code.
               */
              console.error(error);
            }
            setIsLoading(false);
            onComplete();
          }}
        >
          {isLoading ? OPTING_IN_BUTTON_LABEL : OPT_IN_BUTTON_LABEL}
        </Button>
        <Button
          kind="button"
          isDisabled={isLoading}
          onClick={() => {
            onOptOutClick?.();
            onComplete();
          }}
        >
          {OPT_OUT_BUTTON_LABEL}
        </Button>
      </ButtonContainer>
    </>
  );
};

const TermsContainer = styled.div`
  font-size: 1.6rem;
  padding: 24px;
  border: 2px solid ${COLOR_MUTED_BORDER};
  border-radius: ${BORDER_RADIUS_DEFAULT};
`;

const TermsList = styled.ul`
  font-size: 1.4rem;
  padding-left: 15px;
  color: ${COLOR_MUTED_TEXT};

  li {
    font-size: inherit;
  }
`;

const TermsHeader = styled.h2`
  font-size: inherit;
  font-weight: bold;
  margin: 0 0 24px 0;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 10px;
`;
