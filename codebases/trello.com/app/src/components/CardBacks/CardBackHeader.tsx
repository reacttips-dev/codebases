import React from 'react';
import { CardIcon } from '@trello/nachos/icons/card';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import { forTemplate } from '@trello/i18n';
import { LinkWrapper } from 'app/src/components/RouterLink/LinkWrapper';

import styles from './CardBackHeader.less';

const format = forTemplate('card_detail', { shouldEscapeStrings: false });
interface CardBackHeaderProps {
  boardName: string;
  boardShortLink: string;
  cardName: string;
  listName: string;
  closeCardBack: () => void;
  subscribed: boolean;
}

export const CardBackHeader = ({
  boardName,
  boardShortLink,
  cardName,
  listName,
  closeCardBack,
  subscribed,
}: CardBackHeaderProps) => (
  <div className={styles.header}>
    <div className={styles.cardIcon}>
      <CardIcon size="large" />
    </div>
    <h2 className={styles.cardName} dir="auto">
      {cardName}
    </h2>
    <div className={styles.cardLocation}>
      {format('mirror-card-header-card-location', {
        listName,
        boardName: (
          <LinkWrapper
            href={`/b/${boardShortLink}`}
            onClick={closeCardBack}
            className={styles.boardLink}
            key={`/b/${boardShortLink}`}
          >
            {boardName}
          </LinkWrapper>
        ),
      })}
    </div>
    {subscribed && (
      <div className={styles.subscribedIndicator}>
        <SubscribeIcon size="small" />
      </div>
    )}
  </div>
);
