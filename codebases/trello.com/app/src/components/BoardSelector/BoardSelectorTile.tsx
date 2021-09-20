import React from 'react';
import cx from 'classnames';
import { Preview, smallestPreviewBiggerThan } from '@trello/image-previews';

import { SelectTestClasses } from '@trello/test-ids';

/* eslint-disable-next-line @trello/less-matches-component */
import styles from './BoardSelector.less';

interface BoardSelectorTileProps {
  backgroundColor?: string | null;
  backgroundImageScaled?: Preview[] | null;
  backgroundImage?: string | null;
  backgroundTile?: boolean | null;
  name?: string | null;
  boardThumbnailClassName?: string;
  maxWidth?: string;
}

export const BoardSelectorTile: React.FunctionComponent<BoardSelectorTileProps> = ({
  backgroundColor,
  backgroundImage,
  backgroundImageScaled,
  backgroundTile,
  name,
  boardThumbnailClassName,
  maxWidth,
}) => {
  const backgroundStyle: React.CSSProperties = {};

  if (backgroundImageScaled) {
    const image = smallestPreviewBiggerThan(backgroundImageScaled, 24, 24);
    if (image) {
      backgroundStyle.backgroundImage = `url('${image.url}')`;
    }
  }
  if (backgroundImage && backgroundTile) {
    // some old boards have not gone through image scaling,
    // so <board response>.prefs.backgroundImageScaled === null
    backgroundStyle.backgroundImage = `url('${backgroundImage}')`;
  }
  if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  return (
    <div
      className={styles.boardTile}
      data-test-class={SelectTestClasses.BoardTile}
    >
      <div
        className={cx(styles.boardThumbnail, boardThumbnailClassName)}
        style={backgroundStyle}
      />
      {name && (
        <div className={styles.boardName} style={{ maxWidth }}>
          {name}
        </div>
      )}
    </div>
  );
};
