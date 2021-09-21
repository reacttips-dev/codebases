import React, { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { History, Location } from 'history';

import { LoadingSpinner } from 'components/LoadingSpinner';
import {
  COLOR_MUTED_TEXT,
  MOBILE_BREAKPOINT,
  COLOR_MUTED_BACKGROUND,
} from 'components/PaywallsShared/constants';
import { AnchorAPI } from 'modules/AnchorAPI';
import { Metadata } from 'types/Metadata';

const SUBSCRIPTION_DISABLED_TITLE = 'This subscription no longer exists';
const ERROR_ROUTE = '/404';

interface PaywallsSubscriptionDisabledProps {
  history: History;
  location: Location;
  match: {
    params: {
      vanitySlug: string;
    };
  };
}

export const PaywallsSubscriptionDisabled = ({
  history,
  match: {
    params: { vanitySlug },
  },
}: PaywallsSubscriptionDisabledProps) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const forwardTo404 = useCallback(() => history.push(ERROR_ROUTE), [history]);

  useEffect(() => {
    const getData = async () => {
      try {
        const stationId = await AnchorAPI.getStationIdForVanityName(vanitySlug);
        const metaResponse = await AnchorAPI.getPodcastMetadata(stationId);
        // I think we can eventually remove this check and the metadata call, but this keeps the URL feature-flagged for now
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vanitySlug]);

  if (!vanitySlug) {
    forwardTo404();
    return null;
  }

  if (!metadata) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Header>{SUBSCRIPTION_DISABLED_TITLE}</Header>
      <Content>
        {`The subscription for "${metadata.podcastName}" is no longer available.`}
      </Content>
    </Container>
  );
};

const Container = styled.div`
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

const Content = styled.div`
  font-size: 1.6rem;
  color: ${COLOR_MUTED_TEXT};
  max-width: ${MOBILE_BREAKPOINT}px;
  line-height: 1.5;
`;
