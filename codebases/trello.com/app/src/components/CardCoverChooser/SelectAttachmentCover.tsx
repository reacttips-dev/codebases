import React, { useState } from 'react';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
} from '@trello/image-previews';
import { Upload } from './Upload';
import { Analytics } from '@trello/atlassian-analytics';

import styles from './SelectAttachmentCover.less';

const format = forTemplate('card_cover_chooser');

interface SelectAttachmentCoverProps {
  cardId: string;
}

export const SelectAttachmentCover: React.FunctionComponent<SelectAttachmentCoverProps> = ({
  cardId,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  if (!data?.card) {
    throw new Error(
      'Failed to load card details from cache for SelectAttachmentCover.',
    );
  }

  const card = data.card;
  const { attachments } = card;
  const idAttachmentCover = card.cover?.idAttachment;

  const [showMore, setShowMore] = useState(false);
  const [idFirstAttachment, setIdFirstAttachment] = useState(idAttachmentCover);
  const [selectedBeyondCutOff, setSelectedBeyondCutOff] = useState(false);

  const [updateCardCover] = useUpdateCardCoverMutation();

  if (!data?.card) {
    throw new Error(
      'Failed to load card details from cache for SelectAttachmentCover.',
    );
  }

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
      idAttachment?: string;
    } | null,
  ) => {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/idAttachmentCover',
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
                  idAttachment: cover.idAttachment,
                  idUploadedBackground: null,
                  color: null,
                }
              : {
                  __typename: 'Card_Cover',
                  ...card.cover,
                  idAttachment: null,
                  idUploadedBackground: null,
                  color: null,
                },
            idAttachmentCover: cover?.idAttachment,
          },
        },
      });

      if (cover) {
        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'cover',
          source: 'cardCoverInlineDialog',
          attributes: {
            type: 'attachment',
            value: cover.idAttachment,
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
            type: 'attachment',
            taskId: traceId,
          },
          containers,
        });
      }

      Analytics.taskSucceeded({
        taskName: 'edit-card/idAttachmentCover',
        traceId,
        source: 'cardCoverInlineDialog',
      });
    } catch (error) {
      throw Analytics.taskFailed({
        taskName: 'edit-card/idAttachmentCover',
        traceId,
        source: 'cardCoverInlineDialog',
        error,
      });
    }
  };

  const potentialAttachmentCovers = [];

  for (const attachment of attachments) {
    const preview =
      smallestPreviewBiggerThan(attachment.previews, 256) ||
      biggestPreview(attachment.previews);

    if (!preview || !preview.url) {
      continue;
    }

    const potentialAttachmentCover = {
      id: attachment.id,
      edgeColor: attachment.edgeColor || 'transparent',
      thumbnailUrl: preview.url,
      selected: idAttachmentCover === attachment.id,
    };

    if (idFirstAttachment && attachment.id === idFirstAttachment) {
      potentialAttachmentCovers.unshift(potentialAttachmentCover);
    } else {
      potentialAttachmentCovers.push(potentialAttachmentCover);
    }
  }

  const potentialAttachmentCoversToShow = showMore
    ? potentialAttachmentCovers
    : potentialAttachmentCovers.slice(0, 6);

  return (
    <>
      <h4 className={styles.heading}>{format('attachments')}</h4>
      {potentialAttachmentCovers.length > 0 && (
        <div className={styles.attachmentTiles}>
          {potentialAttachmentCoversToShow.map(
            ({ id, edgeColor, thumbnailUrl, selected }, index) => (
              <button
                key={id}
                className={cx('button', styles.attachmentTilesItem, {
                  [styles.selected]: selected,
                })}
                style={{
                  backgroundColor: edgeColor,
                  backgroundImage: `url('${thumbnailUrl}')`,
                  backgroundSize: 'contain',
                }}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  if (selected) {
                    setCover(null);
                  } else {
                    setCover({
                      idAttachment: id,
                    });

                    if (index > 5) {
                      setSelectedBeyondCutOff(true);
                    } else {
                      setSelectedBeyondCutOff(false);
                    }
                  }

                  Analytics.sendUIEvent({
                    action: 'clicked',
                    actionSubject: 'tile',
                    actionSubjectId: 'cardCoverAttachmentTile',
                    source: 'cardCoverInlineDialog',
                    attributes: {
                      value: id,
                    },
                    containers,
                  });
                }}
              />
            ),
          )}
        </div>
      )}
      {potentialAttachmentCovers.length > 6 && !showMore && (
        <button
          className={cx('button', styles.showMoreButton)}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            Analytics.sendClickedButtonEvent({
              buttonName: 'cardCoverAttachmentShowMoreButton',
              source: 'cardCoverInlineDialog',
              containers,
            });
            setShowMore(true);
          }}
        >
          {format('show-more')}
        </button>
      )}
      {showMore && (
        <button
          className={cx('button', styles.showFewerButton)}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            Analytics.sendClickedButtonEvent({
              buttonName: 'cardCoverAttachmentShowFewerButton',
              source: 'cardCoverInlineDialog',
              containers,
            });

            setShowMore(false);

            if (selectedBeyondCutOff) {
              setIdFirstAttachment(card.cover?.idAttachment);
            }
          }}
        >
          {format('show-fewer')}
        </button>
      )}
      <Upload
        cardId={cardId}
        className={cx(styles.uploadButton, {
          [styles.hasNoAttachments]: potentialAttachmentCovers.length === 0,
          [styles.hasPaginatedTiles]: potentialAttachmentCovers.length > 6,
        })}
        hideHeading
      />
    </>
  );
};
