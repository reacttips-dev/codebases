import styled from '@emotion/styled';
import { History } from 'history';
import React, { useEffect } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useCurrentUserCtx } from '../../contexts/CurrentUser';
import { localStorage } from '../../modules/Browser/localStorage';

export const IS_EXISTING_USER_KEY = 'isExistingUser';

export function NewEpisodeRedirectScreen({ history }: { history: History }) {
  const {
    state: { status, userId },
  } = useCurrentUserCtx();

  useEffect(() => {
    if (status === 'success') {
      if (userId) {
        history.replace('/dashboard/episode/new');
      } else {
        loggedOutRedirect();
      }
    } else if (status === 'error') loggedOutRedirect();

    function loggedOutRedirect() {
      localStorage
        .getItem(IS_EXISTING_USER_KEY)
        .then(isExistingUser =>
          history.replace(
            `${
              isExistingUser ? '/login' : '/signup'
            }?return_to=%2Fdashboard%2Fepisode%2Fnew`
          )
        );
    }
  }, [status, userId, history]);

  return (
    <Container>
      <LoadingSpinner />
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;
