import React, { useState } from 'react';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { WarningIcon } from '../../shared/WarningIcon';
import { ResendTrigger, WarningMessage } from '../WarningMessage/index';

export function ResendEmailWarning({ userId }: { userId: number }) {
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const resendVerificationEmail = () => {
    return AnchorAPI.resendVerificationEmail({ userId })
      .then(() => {
        setVerificationSent(true);
        setVerificationFailed(false);
      })
      .catch((_error: Error) => {
        setVerificationFailed(true);
      });
  };
  return (
    <WarningMessage>
      <WarningIcon />
      <span>
        {verificationFailed ? (
          <React.Fragment>
            Something went wrong sending your email. Try again or visit{' '}
            <a href="https://help.anchor.fm">help.anchor.fm</a> for more
            assistance.
          </React.Fragment>
        ) : (
          'Before you can publish any episodes, you’ll need to verify your email address with Anchor.'
        )}
      </span>
      <ResendTrigger onClick={resendVerificationEmail}>
        {verificationSent ? 'Sent!' : 'Resend email'}
      </ResendTrigger>
    </WarningMessage>
  );
}
