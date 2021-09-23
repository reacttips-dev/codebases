import styled from '@emotion/styled';
import React from 'react';
import AnchorAPI from '../../../../modules/AnchorAPI';
import { Button } from '../../../../shared/Button/NewButton';
import { Modal } from '../../../../shared/Modal';

const ModalContent = styled.div`
  text-align: center;
  h4 {
    font-size: 2.2rem;
  }
  p,
  span {
    font-size: 1.8rem;
    color: #5f6369;
    margin-bottom: 28px;
  }
  .buttonContainer {
    max-width: 294px;
    margin: 20px auto 0 auto;
    display: flex;
    flex-direction: column;
  }
  .buttonContainer button:first-of-type {
    margin-bottom: 16px;
  }
`;

type Props = {
  type: 'verify' | 'pending' | 'publish';
  onResendEmail?: () => void;
  onClickClose(): void;
};

const EmailVerificationModal = ({
  onClickClose,
  onResendEmail,
  type,
}: Props) => {
  const [pendingEmail, setPendingEmail] = React.useState('');

  React.useEffect(() => {
    if (type === 'pending') {
      AnchorAPI.fetchPendingEmail().then(({ email }: { email: string }) => {
        setPendingEmail(email);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function content() {
    switch (type) {
      case 'verify':
        return (
          <span>
            Click the link in the email we just sent you to verify your new
            email address. Your account information will not be updated until
            you have verified this change.
          </span>
        );
      case 'pending':
        return (
          <span>
            Please click the link in the email we sent to{' '}
            <strong>{pendingEmail}</strong> to verify your new email address.
            Your account information will be updated once you’ve verified this
            change.
          </span>
        );
      case 'publish':
        return (
          <span>
            Before we can publish this episode, you’ll need to verify your email
            address. Just click the link in the email we sent you!
          </span>
        );
      default:
        return <span>no type specified</span>;
    }
  }
  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickClose={onClickClose}
      renderContent={() => (
        <ModalContent>
          <h4>Verify your email address</h4>
          {content()}
          <div className="buttonContainer">
            <Button onClick={onClickClose} color="purple">
              Got it, thanks
            </Button>
            {onResendEmail && (
              <Button onClick={onResendEmail} color="white">
                Resend email
              </Button>
            )}
          </div>
        </ModalContent>
      )}
    />
  );
};

export { EmailVerificationModal };
