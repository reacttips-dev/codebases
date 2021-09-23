/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from '../../shared/Button/NewButton';
import { Modal } from '../../shared/Modal';

export function UnpublishEpisodeErrorModal({
  onClose,
  action,
}: {
  onClose: () => void;
  action: 'delete' | 'unpublish';
}) {
  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickClose={onClose}
      renderContent={() => {
        return (
          <div
            css={css`
              text-align: center;
            `}
          >
            <h3>
              {`Unable to ${
                action === 'delete' ? 'delete' : 'unpublish'
              } episode`}
            </h3>
            <p>
              {action === 'delete' ? 'Deleting' : 'Unpublishing'} this episode
              would leave your RSS feed empty and break your podcast on external
              platforms. If you{`'`}d like to delete your podcast, please{' '}
              <a
                href="https://help.anchor.fm"
                target="_blank"
                rel="noopener noreferrer"
              >
                get in touch with us
              </a>
              . If you just want to remove this episode, create a new one first.
            </p>
            <Button
              color="purple"
              onClick={onClose}
              css={css`
                width: 200px;
              `}
            >
              Ok, got it
            </Button>
          </div>
        );
      }}
    />
  );
}
