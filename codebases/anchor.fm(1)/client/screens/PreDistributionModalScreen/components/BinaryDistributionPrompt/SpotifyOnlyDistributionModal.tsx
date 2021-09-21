import React, { useEffect } from 'react';
import { css } from 'emotion';
import { RetinaPicture } from 'components/RetinaPicture';
import { Modal } from 'shared/Modal';
import { Button } from 'shared/Button/NewButton';
import {
  ErrorMessage,
  ModalHeader,
  ModalSubHeader,
  PaddedContainer,
} from './styles';
import { events } from './events';

const SpotifyOnlyDistributionModal = ({
  onClickClose,
  onOptInClick,
  isLoading,
  isError,
}: {
  onClickClose: () => void;
  onOptInClick: () => void;
  isLoading: boolean;
  isError: boolean;
}) => {
  // analytics
  useEffect(() => {
    events.distributeToSpotifyModalScreenView();
  }, []);

  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickClose={() => {
        events.distributeToSpotifyExitButtonClicked();
        onClickClose();
      }}
      onClickOutside={onClickClose}
      useBaseContentClass={false}
      className={css`
        width: 480px;
        margin: auto;
      `}
      renderContent={() => {
        return (
          <PaddedContainer>
            <ModalHeader>Ready to publish?</ModalHeader>
            <ModalSubHeader>
              This will make your podcast available on Anchor and Spotify. You
              can distribute your podcast to more platforms in the next step.
            </ModalSubHeader>
            <RetinaPicture
              className={css`
                width: 327px;
                height: 360px;
              `}
              imagePath="/distribution/ic_distribution_preview"
              alt="Minimalized display of Spotify's mobile user interface"
              fallbackExtension="png"
            />
            <Button
              className={css`
                margin-top: 24px;
              `}
              color="purple"
              onClick={() => {
                events.distributeToSpotifyPublishButtonClicked();
                onOptInClick();
              }}
              isDisabled={isLoading}
            >
              {isError ? 'Retry' : 'Publish'}
            </Button>
            {isError && (
              <ErrorMessage>
                Hm, something went wrong. Please try again or if the issue
                persists, reach out to us at{' '}
                <a
                  href="https://help.anchor.fm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  help.anchor.fm
                </a>
                .
              </ErrorMessage>
            )}
          </PaddedContainer>
        );
      }}
    />
  );
};

export { SpotifyOnlyDistributionModal };
