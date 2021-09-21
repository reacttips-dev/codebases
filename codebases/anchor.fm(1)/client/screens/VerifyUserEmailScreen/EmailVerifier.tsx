import React from 'react';
// @ts-ignore
import { isAndroidChrome, isIOS } from '../../../helpers/serverRenderingUtils';
import { useFetchData } from '../../hooks/useFetchData';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { UserVerificationState } from '../../modules/AnchorAPI/user/verifyUserEmail';
import { Button } from '../../shared/Button/NewButton';
import Icon from '../../shared/Icon';
import * as styles from './styles.sass';

type Params = {
  code: string;
  userId: number;
};

type Response = {
  userVerificationState: UserVerificationState;
};

type Props = Params & Response;

export function EmailVerifier({
  code,
  userId,
  userVerificationState,
  isForwardToEpisodeList,
}: Props & { isForwardToEpisodeList: boolean }) {
  const {
    state: { status },
  } = useFetchData<Params, Response>({
    fetchFunction: AnchorAPI.verifyUserEmail,
    parameters: { code, userId },
  });

  const isMobile = isAndroidChrome() || isIOS();
  const printMessage = () => {
    if (status === 'error') {
      return (
        <React.Fragment>
          We are unable to verify your email. If you need more help, please
          reach out to <a href="https://help.anchor.fm">help.anchor.fm</a>
        </React.Fragment>
      );
    }
    switch (userVerificationState) {
      case 'verifiedEmailChangeRequested':
        return 'Great! Your email address has been updated.';
      case 'unverified':
      default:
        return "Great! Now you can publish an episode whenever you're ready.";
    }
  };
  return (
    <div className={styles.container}>
      {status !== 'error' && (
        <div className={styles.emailIcon}>
          <Icon type="EmailVerified" />
        </div>
      )}
      <h1 className={styles.title}>
        {status !== 'error'
          ? 'Email verified'
          : "We're having trouble right now"}
      </h1>
      <p className={styles.copy}>{printMessage()}</p>
      {isMobile && (
        <Button
          kind="link"
          color="purple"
          className={styles.button}
          href="AnchorFM://anchor.fm/emailVerification"
        >
          Open in Anchor
        </Button>
      )}
      <Button
        color="white"
        href={isForwardToEpisodeList ? '/dashboard/episodes' : '/dashboard'}
        kind="link"
      >
        {isForwardToEpisodeList
          ? 'Continue to episode list'
          : ' Continue to dashboard'}
      </Button>
    </div>
  );
}
