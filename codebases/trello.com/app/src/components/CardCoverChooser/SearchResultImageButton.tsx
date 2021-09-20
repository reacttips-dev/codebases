import React from 'react';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';
import { Spinner } from '@trello/nachos/spinner';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import styles from './SearchResultImageButton.less';
import { unsplashClient } from '@trello/unsplash';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('card_cover_chooser');
const PhotoAttributionComponent = require('app/scripts/views/board-create/photo-attribution-component');

export interface SearchResultImageButtonProps {
  cardId: string;
  index: number;
  urls: { thumb: string; raw: string };
  user: { name: string; links: { html: string } };
  links: { download_location: string };
  onSetCover: () => void;
  onSetCoverFailed: () => void;
  buttonClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const SearchResultImageButton: React.FunctionComponent<SearchResultImageButtonProps> = ({
  cardId,
  index,
  urls,
  links,
  user,
  onSetCover,
  onSetCoverFailed,
  buttonClassName,
  onClick,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });
  const [updateCardCover, { loading }] = useUpdateCardCoverMutation({
    onError: onSetCoverFailed,
    onCompleted: () => {
      onSetCover();
    },
  });

  const card = data?.card;
  const containers = {
    organization: {
      id: card?.board.idOrganization,
    },
    board: {
      id: card?.board.id,
    },
    card: {
      id: card?.id,
    },
  };

  const setCover = async (cover: { url: string }) => {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/cover',
      source: 'cardCoverInlineDialog',
    });

    try {
      await updateCardCover({
        variables: {
          traceId,
          cardId,
          cover,
        },
      });

      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'cover',
        source: 'cardCoverInlineDialog',
        attributes: {
          type: 'unsplash',
          value: cover.url,
          taskId: traceId,
        },
        containers,
      });

      Analytics.taskSucceeded({
        taskName: 'edit-card/cover',
        traceId,
        source: 'cardCoverInlineDialog',
      });
    } catch (error) {
      throw Analytics.taskFailed({
        taskName: 'edit-card/cover',
        traceId,
        source: 'cardCoverInlineDialog',
        error,
      });
    }

    // Send Unsplash an analytics event
    unsplashClient.trackDownload({ links });
  };

  const coverButtonOverlay = () => {
    if (loading) {
      return (
        <div className={styles.upload}>
          <Spinner
            wrapperClassName={styles.spinnerWrapper}
            inline
            modLeft
            small
            text={format('uploading-ellipsis')}
          />
        </div>
      );
    } else {
      return <PhotoAttributionComponent user={user} size={'small'} />;
    }
  };

  return (
    <div key={index} className={styles.backgroundGridItem}>
      <button
        className={cx('button', styles.coverTilesItem, buttonClassName)}
        style={{
          backgroundImage: `url('${urls.thumb}')`,
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          }

          if (!e.isDefaultPrevented()) {
            setCover({
              url: unsplashClient.appendImageParameters(urls.raw),
            });
          }
        }}
      >
        {coverButtonOverlay()}
      </button>
    </div>
  );
};
