import React, { useEffect } from 'react';
import { UnsplashTracker } from '@trello/unsplash';
import { useBackgroundStyle } from 'app/src/components/Templates/Helpers';

import styles from './Tile.less';

interface Tile {
  backgroundColor?: string;
  backgroundUrl?: string;
  boardId: string;
  boardName: string;
  onSelectTemplate: () => void;
}

export const Tile: React.FunctionComponent<Tile> = ({
  backgroundColor,
  backgroundUrl,
  boardId,
  boardName,
  onSelectTemplate,
}) => {
  useEffect(() => {
    if (backgroundUrl) {
      UnsplashTracker.trackOncePerInterval(backgroundUrl);
    }
  }, [backgroundUrl]);

  const { loading, templateBackgroundStyle } = useBackgroundStyle(
    boardId,
    backgroundColor,
    backgroundUrl,
  );

  return (
    <div className={styles.tileContainer}>
      <button className={styles.tileButton} onClick={onSelectTemplate}>
        {!loading && (
          <div
            className={styles.tileBackground}
            style={templateBackgroundStyle}
          />
        )}
        <div className={styles.tileTitle}>{boardName}</div>
      </button>
    </div>
  );
};
