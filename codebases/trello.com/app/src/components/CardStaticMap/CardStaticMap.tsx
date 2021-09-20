import React, { useCallback } from 'react';

import { useCardStaticMapQuery } from './CardStaticMapQuery.generated';

import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import styles from './CardStaticMap.less';
import { Button } from '@trello/nachos/button';

const format = forTemplate('card_static_map');
interface CardStaticMapProps {
  cardId: string;
}

export const CardStaticMap = ({ cardId }: CardStaticMapProps) => {
  const { data, loading, error, refetch } = useCardStaticMapQuery({
    variables: { cardId },
  });

  const retry = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      refetch();
    },
    [refetch],
  );

  const staticMapUrl = data?.card?.staticMapUrl;

  if (loading || !staticMapUrl)
    return (
      <div className={styles.cardBackStaticMap}>
        <Spinner centered />
      </div>
    );

  if (error) {
    return (
      <div className={styles.cardBackStaticMapError}>
        <p>{format('map-load-error')}</p>
        <Button onClick={retry}>{format('retry')}</Button>
      </div>
    );
  }
  // No alt text needed because image has a footer that describes location name and address
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img className={styles.cardBackStaticMap} src={staticMapUrl} />;
};
