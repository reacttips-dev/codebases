import React, { useEffect } from 'react';
import { css } from 'emotion';
import { Button } from '../../../../shared/Button/NewButton';
import { Modal } from '../../../../shared/Modal';
import { confirmationModalBaseContentClass } from './styles';
import { events } from './events';

const ConfirmationModal = ({
  onClickClose,
  onClickContinue,
}: {
  onClickClose: () => void;
  onClickContinue: () => void;
}) => {
  // analytics
  useEffect(() => {
    events.distributeToSpotifyConfirmationScreenView();
  }, []);

  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickOutside={onClickClose}
      onClickClose={() => {
        events.distributeToSpotifyConfirmationExitButtonClicked();
        onClickClose();
      }}
      useBaseContentClass={false}
      className={css`
        width: 480px;
        margin: auto;
        overflow: hidden;
      `}
      contentClassName={confirmationModalBaseContentClass}
      closeIconColor="#ffffff"
      renderContent={() => (
        <div
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            height: 100%;
            justify-content: center;

            p {
              color: #ffffff;
              margin-bottom: 24px;
            }

            h3 {
              font-weight: 800;
              font-size: 2.4rem;
              line-height: 2.8rem;

              span {
                margin-left: 5px;
              }
            }
          `}
        >
          <h3>
            You&#39;re almost live!
            <span role="img" aria-label="Tada emoji">
              🎉
            </span>
          </h3>
          <p>
            Your podcast will be available on Spotify shortly. We’ll let you
            know as soon as it’s ready!
          </p>
          <Button
            color="white"
            className={css`
              border: none;
              width: 240px;
            `}
            onClick={() => {
              events.distributeToSpotifyConfirmationContinueButtonClicked();
              onClickContinue();
            }}
          >
            Continue
          </Button>
        </div>
      )}
    />
  );
};

export { ConfirmationModal };
