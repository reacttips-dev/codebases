import React, { useEffect } from 'react';
import { css } from 'emotion';
import { Button } from 'shared/Button/NewButton';
import { Modal } from 'shared/Modal';
import { RetinaPicture } from 'components/RetinaPicture';
import { ModalHeader, PaddedContainer, ModalSubHeader, Note } from './styles';
import { events } from './events';

function EnableRSSFeedModal({
  onClickClose,
  onClickEnable,
}: {
  onClickClose: () => void;
  onClickEnable: () => void;
}) {
  // analytics
  useEffect(() => {
    events.enableRssModalScreenViewed();
  }, []);

  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickClose={() => {
        events.enableRssModalExitButtonClicked();
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
            <ModalHeader>Enable your RSS feed?</ModalHeader>
            <ModalSubHeader>
              Your RSS feed allows your podcast to appear in other podcast apps,
              in some cases automatically.
            </ModalSubHeader>
            <RetinaPicture
              className={css`
                width: 100%;
              `}
              imagePath="/distribution/rss-icon"
              alt="Minimalized display of Spotify's mobile user interface"
              fallbackExtension="png"
            />
            <Note>
              <span>Note:</span> this feed is public and contains your email
              address.{' '}
              <a
                className={css`
                  font-weight: normal;
                `}
                rel="ugc noopener noreferrer"
                target="_blank"
                href="https://help.anchor.fm/hc/en-us/articles/4402979021723"
              >
                Click here
              </a>{' '}
              to learn more.
            </Note>
            <Button
              className={css`
                margin-top: 24px;
                width: 240px;
              `}
              color="purple"
              onClick={() => {
                events.enableRssModalEnableFeedButtonClicked();
                onClickEnable();
              }}
            >
              Enable
            </Button>
            <Button
              className={css`
                border: none;
                width: 240px;
              `}
              color="white"
              onClick={() => {
                events.enableRssModalNotYetButtonClicked();
                onClickClose();
              }}
            >
              Not yet
            </Button>
          </PaddedContainer>
        );
      }}
    />
  );
}

export { EnableRSSFeedModal };
