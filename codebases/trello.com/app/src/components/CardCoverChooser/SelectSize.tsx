import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import {
  useSelectCoverQuery,
  SelectCoverQuery,
} from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import { MiniCard } from './MiniCard';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
} from '@trello/image-previews';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './SelectSize.less';

const format = forTemplate('card_cover_chooser');

type Cover = NonNullable<SelectCoverQuery['card']>['cover'];

interface SelectSizeProps {
  cardId: string;
  cover?: Cover;
}

export const SelectSize: React.FunctionComponent<SelectSizeProps> = ({
  cardId,
  cover,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const [updateCardCover] = useUpdateCardCoverMutation();

  const card = data?.card;
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const setSize = useCallback(
    async (size: 'normal' | 'full') => {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/cover',
        source: 'cardCoverInlineDialog',
      });

      try {
        await updateCardCover({
          variables: {
            traceId,
            cardId,
            cover: {
              size,
            },
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCardCover: {
              __typename: 'Card',
              id: cardId,
              cover: {
                __typename: 'Card_Cover',
                ...cover,
                size,
              },
              idAttachmentCover: cover?.idAttachment,
            },
          },
        });

        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'coverSize',
          source: 'cardCoverInlineDialog',
          attributes: {
            value: size,
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
    },
    [cardId, containers, cover, updateCardCover],
  );

  const onNormalSizeClick = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'cardCoverSizeTile',
      source: 'cardCoverInlineDialog',
      attributes: {
        value: 'normal',
      },
      containers,
    });

    setSize('normal');
  }, [containers, setSize]);

  const onFullSizeClick = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'cardCoverSizeTile',
      source: 'cardCoverInlineDialog',
      attributes: {
        value: 'full',
      },
      containers,
    });

    setSize('full');
  }, [containers, setSize]);

  const preview =
    cover && cover.scaled
      ? smallestPreviewBiggerThan(cover.scaled, 86, 64) ||
        biggestPreview(cover.scaled)
      : null;

  const hasCover =
    cover &&
    (cover.idAttachment ||
      cover?.color ||
      cover?.idUploadedBackground ||
      cover?.idPlugin);

  return (
    <div className={styles.selectSize}>
      <h4 className={styles.heading}>{format('size')}</h4>
      <div className={styles.sizeTiles}>
        <MiniCard
          onClick={onNormalSizeClick}
          coverSize="normal"
          coverColor={cover?.color}
          coverImageUrl={preview?.url}
          selected={Boolean(hasCover && cover?.size === 'normal')}
          disabled={!hasCover}
        />
        <MiniCard
          onClick={onFullSizeClick}
          coverSize="full"
          coverColor={cover?.color}
          coverImageUrl={preview?.url}
          selected={Boolean(hasCover && cover?.size === 'full')}
          textColor={cover?.brightness === 'dark' ? 'light' : 'dark'}
          disabled={!hasCover}
        />
      </div>
    </div>
  );
};
