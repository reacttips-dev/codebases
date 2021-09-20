import React from 'react';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { useUpdateCardCoversPreferenceMutation } from './UpdateCardCoversPreferenceMutation.generated';

import styles from './CardCoversSetting.less';

const format = forTemplate('card_cover_chooser');

interface CardCoversSettingProps {
  idBoard: string;
  isAdmin: boolean;
}

export const CardCoversSetting: React.FunctionComponent<CardCoversSettingProps> = ({
  idBoard,
  isAdmin,
}) => {
  const [updateCardCovers] = useUpdateCardCoversPreferenceMutation();

  const handleClick = () => {
    updateCardCovers({
      variables: {
        boardId: idBoard,
        cardCovers: true,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateBoardCardCoversPref: {
          __typename: 'Board',
          id: idBoard,
          prefs: {
            __typename: 'Board_Prefs',
            cardCovers: true,
          },
        },
      },
    });
  };

  if (!isAdmin) {
    return (
      <p className={styles.notAdmin}>
        {format(
          'card-covers-are-disabled-on-this-board-admins-can-enable-card-covers',
        )}
      </p>
    );
  }

  return (
    <div>
      <p className={styles.isAdmin}>
        {format('card-covers-are-disbaled-on-this-board')}
      </p>
      <Button
        appearance="primary"
        size="fullwidth"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={handleClick}
        className={styles.enableButton}
      >
        {format('enable-card-covers')}
      </Button>
    </div>
  );
};
