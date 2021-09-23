import React, { useEffect } from 'react';
import { css } from 'emotion';
import { Modal } from 'shared/Modal';
import { Button } from 'shared/Button/NewButton';
import { CenteredSpinner } from 'client/shared/Spinner';
import {
  ModalHeader,
  PaddedContainer,
  ErrorMessage,
  ModalSubHeader,
  ImageWrapper,
} from './styles';
import { events } from './events';

function MTSpotifyDistributionModal({
  onClickClose,
  onOptInClick,
  podcastImageFull,
  isLoading,
  isError,
}: {
  onClickClose: () => void;
  onOptInClick: () => void;
  podcastImageFull?: string;
  isLoading: boolean;
  isError: boolean;
}) {
  // analytics
  useEffect(() => {
    events.distributeToSpotifyMTModalScreenViewed();
  }, []);

  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickClose={() => {
        events.distributeToSpotifyMTExitButtonClicked();
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
            <ModalHeader>Distribute to Spotify</ModalHeader>
            <ModalSubHeader>
              To submit an episode that includes Spotify songs, you’ll need to
              distribute your show to Spotify.
            </ModalSubHeader>
            {podcastImageFull ? (
              <ImageWrapper>
                <img
                  src={podcastImageFull}
                  alt="Podcast cover art"
                  className={css`
                    width: 100%;
                  `}
                />
              </ImageWrapper>
            ) : (
              <div
                className={css`
                  margin: 20px 0;
                `}
              >
                <CenteredSpinner />
              </div>
            )}
            <Button
              className={css`
                margin-top: 24px;
                width: 240px;
              `}
              color="purple"
              onClick={() => {
                events.distributeToSpotifyMTDistributeButtonClicked();
                onOptInClick();
              }}
              isDisabled={isLoading}
            >
              {isError ? 'Retry' : 'Publish to Spotify'}
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
            <Button
              className={css`
                border: none;
                width: 240px;
              `}
              onClick={() => {
                events.distributeToSpotifyMTLearnMoreButtonClicked();
              }}
              color="white"
              kind="link"
              href="https://anch.co/3iOP2uG"
              target="_blank"
            >
              Learn more
            </Button>
          </PaddedContainer>
        );
      }}
    />
  );
}

export { MTSpotifyDistributionModal };
