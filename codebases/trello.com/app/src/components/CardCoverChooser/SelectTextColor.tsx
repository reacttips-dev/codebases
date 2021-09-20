import React, { useCallback } from 'react';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
} from '@trello/image-previews';
import { Analytics } from '@trello/atlassian-analytics';
import { Cover } from './types';

import styles from './SelectTextColor.less';

const format = forTemplate('card_cover_chooser');

interface SelectTextColorProps {
  cardId: string;
  cardName?: string;
  cover: Cover;
}

const darkFullCoverGradient =
  'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))';
const lightFullCoverGradient =
  'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))';

export const SelectTextColor: React.FunctionComponent<SelectTextColorProps> = ({
  cardId,
  cardName,
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

  const setBrightness = useCallback(
    async (brightness: 'light' | 'dark') => {
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
              brightness,
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
                brightness,
              },
              idAttachmentCover: cover?.idAttachment,
            },
          },
        });

        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'coverBrightness',
          source: 'cardCoverInlineDialog',
          attributes: {
            value: brightness,
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

  const selectDarkBrightness = useCallback(() => {
    setBrightness('dark');
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'cardCoverTextColorTile',
      source: 'cardCoverInlineDialog',
      attributes: {
        value: 'dark',
      },
      containers,
    });
  }, [setBrightness, containers]);

  const selectLightBrightness = useCallback(() => {
    setBrightness('light');
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'cardCoverTextColorTile',
      source: 'cardCoverInlineDialog',
      attributes: {
        value: 'light',
      },
      containers,
    });
  }, [setBrightness, containers]);

  let textColor = 'dark';
  if (cover?.brightness === 'dark') {
    textColor = 'light';
  }
  const coverColor = cover?.color;
  const colorCoverClassName = coverColor ? styles[coverColor] : null;
  const preview =
    cover && cover.scaled
      ? smallestPreviewBiggerThan(cover.scaled, 86, 64) ||
        biggestPreview(cover.scaled)
      : null;

  const tileClassName = cx(styles.textColorTile, colorCoverClassName, {
    [styles.colorCardCover]: colorCoverClassName,
  });

  const darkTileStyle = {
    backgroundImage: preview?.url
      ? `${darkFullCoverGradient}, url(${preview.url})`
      : undefined,
  };

  const lightTileStyle = {
    backgroundImage: preview?.url
      ? `${lightFullCoverGradient}, url(${preview.url})`
      : undefined,
  };

  return (
    <div className={styles.selectTextColor}>
      <h4 className={styles.heading}>{format('text-color')}</h4>
      <div className={styles.textColorTiles}>
        <div
          role="button"
          onClick={selectDarkBrightness}
          className={cx(tileClassName, {
            [styles.selected]: textColor === 'light',
          })}
          style={darkTileStyle}
        >
          <h3 className={cx(styles.name, styles.light)}>{cardName}</h3>
        </div>
        <div
          role="button"
          onClick={selectLightBrightness}
          className={cx(tileClassName, {
            [styles.selected]: textColor === 'dark',
          })}
          style={lightTileStyle}
        >
          <h3 className={styles.name}>{cardName}</h3>
        </div>
      </div>
    </div>
  );
};
