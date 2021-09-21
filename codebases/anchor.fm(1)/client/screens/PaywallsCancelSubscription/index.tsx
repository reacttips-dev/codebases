import styled from '@emotion/styled';
import { History, Location } from 'history';
import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  COLOR_MUTED_TEXT,
  MOBILE_BREAKPOINT,
  COLOR_MUTED_BACKGROUND,
} from '../../components/PaywallsShared/constants';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { Metadata } from '../../types/Metadata';
import { Button } from '../../shared/Button/NewButton';
import { WarningMessage } from '../../components/WarningMessage';
import { WarningIcon } from '../../shared/WarningIcon';
import { getPaywallsSubscribeUrl } from '../../components/PaywallsShared/utils';
import { AccessibleErrorContainer } from '../../components/AccessibleErrorContainer';

export const ERROR_ROUTE = '/404';
export const CANCEL_HEADER = 'Would you like to cancel your subscription?';
export const CONFIRMATION_HEADER = 'Subscription canceled';
export const CANCEL_BUTTON_LABEL = 'Cancel subscription';
export const CANCELLING_BUTTON_LABEL = 'Cancelling subscription...';
export const ERROR_MESSAGE = 'Something went wrong. Please submit again.';

interface PaywallsCancelSubscriptionProps {
  history: History;
  location: Location;
  match: {
    params: {
      vanitySlug: string;
    };
  };
}

enum STATUS {
  IDLE = 'IDLE',
  CANCELLING = 'CANCELLING',
  CANCELLED = 'CANCELLED',
  ERROR = 'ERROR',
}

export const PaywallsCancelSubscription = ({
  history,
  location: { search },
  match: {
    params: { vanitySlug },
  },
}: PaywallsCancelSubscriptionProps) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [webStationId, setWebStationId] = useState<string | null>(null);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);

  const { code } = queryString.parse(search);
  const forwardTo404 = () => history.push(ERROR_ROUTE);

  if (!code || typeof code !== 'string' || !vanitySlug) {
    forwardTo404();
    return null;
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const stationId = await AnchorAPI.getStationIdForVanityName(vanitySlug);
        setWebStationId(stationId);
        const metaResponse = await AnchorAPI.getPodcastMetadata(stationId);
        if (!metaResponse?.stationPaywall?.isSubscriptionEnabled) {
          return forwardTo404();
        }
        setMetadata(metaResponse);
      } catch (err) {
        forwardTo404();
      }
    };
    if (vanitySlug) {
      getData();
    }
  }, [vanitySlug]);

  if (!metadata || !webStationId) {
    return (
      <CancelContainer>
        <LoadingSpinner />
      </CancelContainer>
    );
  }

  const { podcastName } = metadata;
  const subscribeUrl = getPaywallsSubscribeUrl(vanitySlug);

  if (status === STATUS.CANCELLED) {
    return (
      <CancelContainer>
        <Header>{CONFIRMATION_HEADER}</Header>
        <ContentContainer>
          You won’t be charged for <PodcastName>{podcastName}</PodcastName>{' '}
          going forward. If you’d like to subscribe to{' '}
          <PodcastName>{podcastName}</PodcastName> in the future, you can sign
          up from their profile at{' '}
          <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
            {subscribeUrl}
          </a>
          .
        </ContentContainer>
      </CancelContainer>
    );
  }

  return (
    <CancelContainer>
      <Header>{CANCEL_HEADER}</Header>
      <ContentContainer>
        If you cancel, you can access your subscription to{' '}
        <PodcastName>{podcastName}</PodcastName> until the next billing period.
      </ContentContainer>
      <ButtonContainer>
        <Button
          kind="button"
          color="red"
          isDisabled={status === STATUS.CANCELLING}
          onClick={async () => {
            setStatus(STATUS.CANCELLING);
            try {
              await AnchorAPI.cancelPodcastSubscription({
                code,
                webStationId,
              });
              setStatus(STATUS.CANCELLED);
            } catch (err) {
              setStatus(STATUS.ERROR);
            }
          }}
        >
          {status === STATUS.CANCELLING
            ? CANCELLING_BUTTON_LABEL
            : CANCEL_BUTTON_LABEL}
        </Button>
      </ButtonContainer>
      {status === STATUS.ERROR && (
        <AccessibleErrorContainer>
          <StyledWarningMessage>
            <WarningIcon /> {ERROR_MESSAGE}
          </StyledWarningMessage>
        </AccessibleErrorContainer>
      )}
    </CancelContainer>
  );
};

const CancelContainer = styled.div`
  background: ${COLOR_MUTED_BACKGROUND};
  display: flex;
  align-items: center;
  text-align: center;
  padding: 70px;
  min-height: 400px;
  flex-direction: column;
`;

const Header = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  display: block;
  margin: 0 0 20px 0;
`;

const ContentContainer = styled.div`
  font-size: 1.6rem;
  color: ${COLOR_MUTED_TEXT};
  max-width: ${MOBILE_BREAKPOINT}px;
  line-height: 1.5;

  a {
    color: inherit;
  }
`;

const PodcastName = styled.span`
  font-weight: bold;
  display: inline-block;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  button {
    white-space: nowrap;
  }
`;

const StyledWarningMessage = styled(WarningMessage)`
  margin-top: 32px;
`;
