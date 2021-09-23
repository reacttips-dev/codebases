import { History, LocationState } from 'history';
import queryString from 'querystring';
import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { useFetchData } from '../../hooks/useFetchData';
import { UserVerificationState } from '../../modules/AnchorAPI/user/verifyUserEmail';
import { EmailVerifier } from './EmailVerifier';
import * as styles from './styles.sass';
import { useCurrentUserCtx } from '../../contexts/CurrentUser';

enum WORDPRESS_ACCOUNT_STATUS {
  LOADING,
  WORDPRESS,
  NOT_WORDPRESS,
}
type Props = {
  location: Location;
  history: History<LocationState>;
};

type VerificationStateResponse = {
  userId: number;
  userVerificationState: UserVerificationState;
};

export function VerifyUserEmailScreen({ history, location }: Props) {
  const [wordPressAccountStatus, setWordPressAccountStatus] = useState<
    WORDPRESS_ACCOUNT_STATUS
  >(WORDPRESS_ACCOUNT_STATUS.LOADING);

  const {
    state: { webStationId },
  } = useCurrentUserCtx();

  useEffect(() => {
    if (webStationId) {
      AnchorAPI.fetchPodcastMetadata({ webStationId })
        .then(res => {
          const { wordpressStatus } = res;
          setWordPressAccountStatus(
            wordpressStatus
              ? WORDPRESS_ACCOUNT_STATUS.WORDPRESS
              : WORDPRESS_ACCOUNT_STATUS.NOT_WORDPRESS
          );
        })
        .catch(() => {
          setWordPressAccountStatus(WORDPRESS_ACCOUNT_STATUS.NOT_WORDPRESS);
        });
    }
  }, [webStationId]);

  const qs = queryString.parse(location.search.slice(1));
  // Component re-renders and loses its query string.
  // useState preserves it across re-renders.
  const [code] = useState(Array.isArray(qs.code) ? qs.code[0] : qs.code);

  const { state } = useFetchData<{}, VerificationStateResponse>({
    fetchFunction: AnchorAPI.fetchUserVerificationState,
  });
  const {
    json: { userVerificationState, userId },
    status,
  } = state;

  // User is not logged in
  if (status === 'error') {
    return redirectTo('login');
  }

  if (
    status === 'loading' ||
    wordPressAccountStatus === WORDPRESS_ACCOUNT_STATUS.LOADING
  )
    return <Spinner color="gray" />;

  if (isVerified()) {
    return redirectTo(
      wordPressAccountStatus === WORDPRESS_ACCOUNT_STATUS.WORDPRESS
        ? 'episodeListPage'
        : 'dashboard'
    );
  }
  return (
    <div className={styles.screen}>
      <EmailVerifier
        code={code}
        userId={userId}
        userVerificationState={userVerificationState}
        isForwardToEpisodeList={
          wordPressAccountStatus === WORDPRESS_ACCOUNT_STATUS.WORDPRESS
        }
      />
    </div>
  );

  function redirectTo(target: 'dashboard' | 'login' | 'episodeListPage') {
    switch (target) {
      case 'episodeListPage':
        history.replace('/dashboard/episodes');
        return null;
      case 'dashboard':
        history.replace('/');
        return null;
      default:
      case 'login':
        history.replace(
          `/login?return_to=${encodeURI(location.pathname + location.search)}`
        );
        return null;
    }
  }

  function isVerified() {
    return ['verified', 'legacyOrSocialSignOnUser'].includes(
      userVerificationState
    );
  }
}
