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

export const HELP_URL =
  'https://help.anchor.fm/hc/en-us/requests/new?ticket_form_id=360001589532';

/**
 * Maps to ?type= query param values. What this particular value should render is
 * defined in the ERRORS object below.
 */
export enum ErrorType {
  DEFAULT_ERROR = 'default',
  SPOTIFY_AUTH_ERROR = 'spotify_auth_error',
  SPOTIFY_ACCESS_DENIED = 'access_denied', // Lacks the spotify_ prefix because it comes directly from the oauth flow
}

interface ErrorConfiguration {
  title: string;
  body: string;
}

type ErrorMap = {
  [key in ErrorType]: ErrorConfiguration;
};

export const ERRORS: ErrorMap = {
  [ErrorType.DEFAULT_ERROR]: {
    title: 'An error has occured',
    body: 'Something went wrong.',
  },
  [ErrorType.SPOTIFY_AUTH_ERROR]: {
    title: 'Unable to authenticate',
    body:
      'Something went wrong and we weren’t able to authenticate your Spotify account.',
  },
  [ErrorType.SPOTIFY_ACCESS_DENIED]: {
    title: 'Account not authenticated',
    body:
      'To listen to the show you subscribed to, you’ll need to authenticate your Spotify account. If you want to do this later, click the link to authenticate in the email we’ve sent you.',
  },
};

export const ERROR_ROUTE = '/404';
export const HELP_LINK_TEXT = 'here';

const isValidErrorType = (
  errorTypeParam: string | string[] | null | undefined
): errorTypeParam is ErrorType =>
  typeof errorTypeParam === 'string' &&
  Object.values(ErrorType).includes(errorTypeParam as ErrorType);

interface PaywallsSubscriptionErrorProps {
  history: History;
  location: Location;
  match: {
    params: {
      vanitySlug: string;
    };
  };
}

export const PaywallsSubscriptionError = ({
  history,
  location: { search },
  match: {
    params: { vanitySlug },
  },
}: PaywallsSubscriptionErrorProps) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const { type } = queryString.parse(search);
  const forwardTo404 = () => history.push(ERROR_ROUTE);
  const errorType = isValidErrorType(type) ? type : ErrorType.DEFAULT_ERROR;

  if (!vanitySlug) {
    forwardTo404();
    return null;
  }

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
  }, [vanitySlug]);

  if (!metadata) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }
  const { title, body } = ERRORS[errorType];
  return (
    <Container>
      <Header>{title}</Header>
      <Content>
        {body}
        {
          <>
            {' '}
            Reach out to us{' '}
            <a href={HELP_URL} target="_blank" rel="noopener noreferrer">
              {HELP_LINK_TEXT}
            </a>{' '}
            for help.
          </>
        }
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

  a {
    color: inherit;
  }
`;
