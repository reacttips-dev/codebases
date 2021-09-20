import React from 'react';
import cx from 'classnames';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';

import styles from './ColorCover.less';

const format = forTemplate('card_cover_chooser');

interface ColorCoverProps {
  cardId: string;
}

export const cardCoverColors = [
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'blue',
  'sky',
  'lime',
  'pink',
  'black',
];

export const ColorCover: React.FunctionComponent<ColorCoverProps> = ({
  cardId,
}) => {
  const { data } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });
  const [updateCardCover] = useUpdateCardCoverMutation();

  const card = data?.card;
  const currentCover = card?.cover;
  const selectedColor = currentCover?.color;

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

  const setCover = async (color: string) => {
    let cover: null | {
      color: string;
      brightness: string;
    } = {
      color,
      brightness: color === 'black' ? 'dark' : 'light',
    };

    const traceId = Analytics.startTask({
      taskName: 'edit-card/cover',
      source: 'cardCoverInlineDialog',
    });

    if (color === selectedColor) {
      cover = null;
      Analytics.sendTrackEvent({
        action: 'removed',
        actionSubject: 'cover',
        source: 'cardCoverInlineDialog',
        attributes: {
          type: 'color',
          taskId: traceId,
        },
        containers,
      });
    } else {
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'cover',
        source: 'cardCoverInlineDialog',
        attributes: {
          type: 'color',
          value: color,
          taskId: traceId,
        },
        containers,
      });
    }

    try {
      await updateCardCover({
        variables: {
          cardId,
          cover,
          traceId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCardCover: {
            __typename: 'Card',
            id: cardId,
            cover: cover
              ? {
                  __typename: 'Card_Cover',
                  ...currentCover,
                  color,
                  brightness: cover.brightness,
                  idUploadedBackground: null,
                  idAttachment: null,
                }
              : {
                  __typename: 'Card_Cover',
                  ...currentCover,
                  color: null,
                  idUploadedBackground: null,
                  idAttachment: null,
                  scaled: null,
                },
            idAttachmentCover: null,
          },
        },
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
  };

  return (
    <>
      <h4 className={styles.heading}>{format('colors')}</h4>
      <div className={styles.colorTiles}>
        {cardCoverColors.map((color) => (
          <button
            key={color}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'tile',
                actionSubjectId: 'cardCoverColorTile',
                source: 'cardCoverInlineDialog',
                attributes: {
                  value: color,
                },
                containers,
              });
              setCover(color);
            }}
            className={cx(styles.colorTile, styles[color], {
              [styles.selected]: color === selectedColor,
            })}
          />
        ))}
      </div>
    </>
  );
};
