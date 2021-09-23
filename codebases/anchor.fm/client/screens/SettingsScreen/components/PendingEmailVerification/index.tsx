import React, { Fragment, useEffect, useState } from 'react';
import { AnchorAPI } from '../../../../modules/AnchorAPI';
import { EmailVerificationModal } from '../EmailVerificationModal';
import { InfoIcon, PendingButton } from './styles';

export function PendingEmailVerification({ userId }: { userId: number }) {
  const [isShowing, setIsShowing] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(
    false
  );
  useEffect(() => {
    AnchorAPI.fetchUserVerificationState().then(({ userVerificationState }) => {
      setIsShowing(userVerificationState === 'verifiedEmailChangeRequested');
    });
  }, []);
  return isShowing ? (
    <Fragment>
      <PendingButton
        type="button"
        onClick={() => setShowEmailVerificationModal(true)}
      >
        PENDING
        <InfoIcon>i</InfoIcon>
      </PendingButton>
      {showEmailVerificationModal && (
        <EmailVerificationModal
          type="pending"
          onClickClose={() => {
            setShowEmailVerificationModal(false);
          }}
          onResendEmail={() => {
            AnchorAPI.resendVerificationEmail({ userId }).finally(() =>
              setShowEmailVerificationModal(false)
            );
          }}
        />
      )}
    </Fragment>
  ) : null;
}
