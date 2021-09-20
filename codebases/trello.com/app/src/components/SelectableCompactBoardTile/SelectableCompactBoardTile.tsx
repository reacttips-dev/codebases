import React, { useRef, useEffect } from 'react';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import classNames from 'classnames';
import { TestId } from '@trello/test-ids';
import styles from './SelectableCompactBoardTile.less';

interface BackgroundFields {
  backgroundTopColor?: string | null;
  backgroundTile?: boolean;
  backgroundImage?: string | null;
  backgroundImageScaled?:
    | { width: number; height: number; url: string }[]
    | null;
}

interface SelectableCompactBoardTileProps {
  boardId: string;
  boardName: string;
  background?: BackgroundFields;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: React.EventHandler<
    React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  >;
  title?: string;
  testId?: TestId | string;
  tabIndex?: number;
  setRef?: (c: React.RefObject<HTMLDivElement>) => void;
}

const getBackgroundStyle = (background?: BackgroundFields) => {
  const css: React.CSSProperties = {};
  let url = '';

  if (background) {
    if (background.backgroundTile) {
      url = background.backgroundImage ?? '';
    } else {
      url =
        smallestPreviewBiggerThan(background.backgroundImageScaled, 400, 200)
          ?.url ??
        background.backgroundImage ??
        '';
    }

    if (url) {
      css.backgroundImage = `url('${url}')`;
    }

    css.backgroundColor = background.backgroundTopColor || undefined;
  }

  return css;
};

export const SelectableCompactBoardTile: React.FC<SelectableCompactBoardTileProps> = ({
  boardId,
  boardName,
  background,
  isSelected = false,
  onClick,
  isDisabled,
  title,
  testId,
  tabIndex,
  setRef,
}) => {
  const containerClasses = classNames(styles.container, {
    [styles.selectable]: !isDisabled && Boolean(onClick),
    [styles.selectedCompactBoardTile]: isSelected,
    [styles.disabled]: isDisabled,
  });
  const backgroundStyle = getBackgroundStyle(background);
  const ref = useRef(null);

  useEffect(() => {
    setRef?.(ref);
  }, [ref, setRef]);

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={backgroundStyle}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={(e) => {
        if (!isDisabled) {
          onClick?.(e);
        }
      }}
      role="button"
      key={boardId}
      title={title}
      data-test-id={testId}
      tabIndex={tabIndex}
    >
      <div className={styles.boardThumbnail} style={backgroundStyle} />
      <div className={styles.boardDescription}>
        <div className={styles.boardNameWrapper}>
          <div className={styles.boardName}>{boardName}</div>
        </div>
        {isSelected && <div className={styles.checkmark}>✓</div>}
      </div>
    </div>
  );
};
