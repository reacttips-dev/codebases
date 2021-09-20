import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import { useSearchUnsplashQuery } from './SearchUnsplashQuery.generated';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
} from '@trello/image-previews';
import { SearchResultImageButton } from './SearchResultImageButton';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { Cover } from './types';

import styles from './SelectUnsplashCover.less';
import { noop } from 'app/src/noop';

const format = forTemplate('card_cover_chooser');

interface SelectUnsplashCoverProps {
  cardId: string;
  navigateToAddCover: () => void;
}

export const SelectUnsplashCover: React.FunctionComponent<SelectUnsplashCoverProps> = ({
  cardId,
  navigateToAddCover,
}) => {
  const [selectedTopPhotoId, setSelectedTopPhotoId] = useState<string | null>(
    null,
  );

  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const { data: topPhotosData } = useSearchUnsplashQuery({
    variables: {
      query: '',
      perPage: 9,
      page: 1,
    },
    fetchPolicy: 'cache-only',
  });

  const [updateCardCover] = useUpdateCardCoverMutation();

  if (!data?.card) {
    throw new Error(
      'Failed to load card details from cache for SelectUnsplashCover.',
    );
  }

  const card = data && data.card;
  const currentCover = card ? card.cover : null;

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

  const setCover = async (
    cover: {
      idUploadedBackground?: string;
    } | null,
  ) => {
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
        optimisticResponse: {
          __typename: 'Mutation',
          updateCardCover: {
            __typename: 'Card',
            id: cardId,
            cover: cover
              ? {
                  __typename: 'Card_Cover',
                  ...card.cover,
                  idUploadedBackground: cover.idUploadedBackground,
                  idAttachment: null,
                  color: null,
                }
              : {
                  __typename: 'Card_Cover',
                  ...card.cover,
                  idAttachment: null,
                  idUploadedBackground: null,
                  color: null,
                },
            idAttachmentCover: null,
          },
        },
      });
      if (cover) {
        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'cover',
          source: 'cardCoverInlineDialog',
          attributes: {
            type: 'unsplash',
            value: cover.idUploadedBackground,
            taskId: traceId,
          },
          containers,
        });
      } else {
        Analytics.sendTrackEvent({
          action: 'removed',
          actionSubject: 'cover',
          source: 'cardCoverInlineDialog',
          attributes: {
            type: 'unsplash',
            taskId: traceId,
          },
          containers,
        });
      }

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
  };

  const [lastUploadedBackgroundCover] = useState<Cover>(currentCover);

  useEffect(() => {
    const hasUploadedBackgroundCover = currentCover?.idUploadedBackground;
    const hasColorOrAttachmentCover =
      currentCover?.color || currentCover?.idAttachment;
    if (!hasUploadedBackgroundCover || hasColorOrAttachmentCover) {
      setSelectedTopPhotoId(null);
    }
  }, [currentCover, lastUploadedBackgroundCover]);

  let firstUnsplashCoverNode: React.ReactNode = null;
  let numTopPhotosToShow = 6;

  if (
    lastUploadedBackgroundCover &&
    lastUploadedBackgroundCover.idUploadedBackground &&
    lastUploadedBackgroundCover.scaled
  ) {
    const preview =
      smallestPreviewBiggerThan(lastUploadedBackgroundCover.scaled, 256) ||
      biggestPreview(lastUploadedBackgroundCover.scaled);

    if (preview && preview.url) {
      firstUnsplashCoverNode = (
        <button
          key="firstUnsplashCoverNode"
          className={cx('button', styles.unsplashTilesItem, {
            [styles.selected]:
              currentCover &&
              lastUploadedBackgroundCover.idUploadedBackground ===
                currentCover.idUploadedBackground,
          })}
          style={{
            backgroundColor:
              lastUploadedBackgroundCover?.edgeColor || 'transparent',
            backgroundImage: `url('${preview.url}')`,
            backgroundSize: 'cover',
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'tile',
              actionSubjectId: 'cardCoverUnsplashTile',
              source: 'cardCoverInlineDialog',
              containers,
            });

            if (
              currentCover &&
              lastUploadedBackgroundCover.idUploadedBackground ===
                currentCover.idUploadedBackground
            ) {
              setCover(null);
              setSelectedTopPhotoId(null);
            } else if (lastUploadedBackgroundCover?.idUploadedBackground) {
              setCover({
                idUploadedBackground:
                  lastUploadedBackgroundCover.idUploadedBackground,
              });
              setSelectedTopPhotoId(null);
            }
          }}
        />
      );

      numTopPhotosToShow = 5;
    }
  }

  const potentialUnsplashCovers = [];

  if (topPhotosData?.unsplashPhotos?.length) {
    let index = 0;
    for (const unsplashPhoto of topPhotosData.unsplashPhotos.slice(
      0,
      numTopPhotosToShow,
    )) {
      const { urls, links, user, id } = unsplashPhoto;
      potentialUnsplashCovers.unshift(
        <SearchResultImageButton
          key={id}
          urls={urls}
          links={links}
          user={user}
          index={index++}
          cardId={cardId}
          // eslint-disable-next-line react/jsx-no-bind
          onSetCover={() => {
            setSelectedTopPhotoId(id);
          }}
          onSetCoverFailed={noop}
          buttonClassName={cx(styles.unsplashTilesItem, {
            [styles.selected]: selectedTopPhotoId === id,
          })}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={(e) => {
            if (selectedTopPhotoId === id) {
              e.preventDefault();
              setCover(null);
            }

            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'tile',
              actionSubjectId: 'cardCoverUnsplashTile',
              source: 'cardCoverInlineDialog',
              attributes: {
                value: urls.raw,
              },
              containers,
            });

            return;
          }}
        />,
      );
    }
  }

  return (
    <>
      <h4 className={styles.heading}>{format('unsplash')}</h4>
      <div className={styles.unsplashTiles}>
        {firstUnsplashCoverNode}
        {potentialUnsplashCovers}
      </div>
      <button
        className={cx('button', styles.searchButton)}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          Analytics.sendClickedButtonEvent({
            buttonName: 'cardCoverUnsplashSearchButton',
            source: 'cardCoverInlineDialog',
            containers,
          });
          navigateToAddCover();
        }}
      >
        {format('search-for-photos')}
      </button>
    </>
  );
};
