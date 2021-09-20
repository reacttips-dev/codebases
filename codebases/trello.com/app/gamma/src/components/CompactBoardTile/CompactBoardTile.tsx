import classNames from 'classnames';
import React, { useEffect } from 'react';
import { BoardModel, BoardsMenuCategoryType } from 'app/gamma/src/types/models';

import { TestId } from '@trello/test-ids';
import { Analytics } from '@trello/atlassian-analytics';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { CloseBoardButton } from './CloseBoardButton';
import { StarredBoardButton } from './StarredBoardButton';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { BoardTemplateBadge } from 'app/src/components/BoardTemplateBadge';
import styles from './CompactBoardTile.less';
import { hasUnreadActivity } from '@trello/boards';
import { UnsplashTracker } from '@trello/unsplash';

const paddingStyle = (isUnread: boolean, isRecent: boolean) => {
  if (isUnread && isRecent) {
    return styles.threeIcon;
  } else if (isUnread || isRecent) {
    return styles.twoIcon;
  } else {
    return styles.oneIcon;
  }
};

const getBackgroundStyle = (background?: BoardModel['background']) => {
  const css: React.CSSProperties = {};

  if (background) {
    const image = background.tile
      ? background
      : // some old boards have not gone through image scaling,
        // so <board response>.prefs.backgroundImageScaled === null
        smallestPreviewBiggerThan(background.scaled, 400, 200) || background;

    if (image) {
      css.backgroundImage = `url('${image.url}')`;
    }

    css.backgroundColor = background.color || undefined;
  }

  return css;
};

const getBoardThumbnailStyle = (minifyBoardTile: boolean) => {
  const css: React.CSSProperties = {};

  if (minifyBoardTile) {
    css.height = '20px';
    css.width = '20px';
    css.alignSelf = 'center';
    css.borderRadius = '3px';
    css.marginRight = '-4px';
  }

  return css;
};

export interface CompactBoardTileProps {
  readonly board: BoardModel;
  readonly boardTileClassName?: string;
  readonly focused?: boolean;
  readonly isStarred: boolean;
  readonly isDragging?: boolean;
  readonly isTemplate?: boolean;
  readonly minifyBoardTile?: boolean;
  readonly onClickBoardName?: () => void;
  readonly showTeamName?: boolean;
  readonly teamName?: string;
  readonly testId?: TestId;
  readonly type?: BoardsMenuCategoryType;
}

export const CompactBoardTile: React.FunctionComponent<CompactBoardTileProps> = ({
  board,
  boardTileClassName,
  focused,
  isDragging,
  isStarred,
  isTemplate,
  onClickBoardName,
  showTeamName,
  minifyBoardTile = false,
  teamName,
  testId,
  type,
}) => {
  const sendAnalytics = () => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'compactBoardTile',
      source: 'boardsMenuInlineDialog',
      containers: {
        board: {
          id: board.id,
        },
      },
      ...(type && {
        attributes: {
          type,
        },
      }),
    });
  };
  const { background, id, name, url } = board;

  useEffect(() => {
    background &&
      background.url &&
      UnsplashTracker.trackOncePerInterval(background.url);
  }, [background]);

  const isUnread = hasUnreadActivity(board);
  const boardNameStyles = classNames(
    styles.boardName,
    !minifyBoardTile && styles.boardNameBold,
  );
  const nameBackgroundStyle = minifyBoardTile
    ? {}
    : getBackgroundStyle(background);
  const tileBackgroundStyle = {
    ...getBackgroundStyle(background),
    ...getBoardThumbnailStyle(minifyBoardTile),
  };
  const boardBackgroundStyles = classNames(
    styles.boardBackground,
    background && background.tile && styles.modTiled,
  );
  const containerStyles = classNames(
    styles.boardTile,
    boardTileClassName,
    focused && styles.isNavigationFocused,
    isDragging && styles.isDragging,
  );
  const boardLinkStyles = classNames(
    styles.boardLink,
    paddingStyle(isUnread || false, type === BoardsMenuCategoryType.Recent),
  );
  const boardDescriptionStyles = classNames(
    styles.boardDescription,
    teamName && showTeamName && styles.fullHeight,
  );
  const starStyles = classNames(
    styles.utilityAction,
    isStarred && styles.isStarred,
    type === BoardsMenuCategoryType.Recent
      ? styles.actionLarge
      : styles.actionSmall,
  );
  const unreadStyles = classNames(
    styles.unreadMarker,
    isUnread && styles.isUnread,
    isStarred && styles.isStarred,
  );
  const actionsWrapperStyles = classNames(
    styles.actionsWrapper,
    isUnread && styles.isUnread,
    isStarred && styles.isStarred,
  );

  return (
    <div className={containerStyles} key={id}>
      <RouterLink
        href={url || `/b/${id}`}
        className={boardLinkStyles}
        // eslint-disable-next-line react/jsx-no-bind
        onDragStart={(e) => e.preventDefault()}
        title={name}
        data-test-id={testId}
        onClick={onClickBoardName || sendAnalytics}
      >
        <div className={boardBackgroundStyles} style={nameBackgroundStyle} />
        <div className={styles.boardThumbnail} style={tileBackgroundStyle} />
        <div className={boardDescriptionStyles}>
          <div className={boardNameStyles}>{name}</div>
          {teamName && showTeamName && (
            <div className={styles.boardSubName}>{teamName}</div>
          )}
        </div>
        {isTemplate && !minifyBoardTile && (
          <div className={styles.boardTemplateBadgeContainer}>
            <BoardTemplateBadge />
          </div>
        )}
        {!minifyBoardTile && (
          <div className={actionsWrapperStyles}>
            {isUnread && <div className={unreadStyles} />}
            <div className={starStyles}>
              {type === BoardsMenuCategoryType.Recent && (
                <CloseBoardButton idBoard={id} />
              )}
              <StarredBoardButton idBoard={id} />
            </div>
          </div>
        )}
      </RouterLink>
    </div>
  );
};
