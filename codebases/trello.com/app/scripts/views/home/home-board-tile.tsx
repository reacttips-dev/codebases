import React, { useEffect } from 'react';
import { Auth } from 'app/scripts/db/auth';
import { isSafari } from '@trello/browser';
import { Util } from 'app/scripts/lib/util';
import { ModelCache } from 'app/scripts/db/model-cache';
import BlueBirdPromise from 'bluebird';
import { Analytics } from '@trello/atlassian-analytics';
import { HomeBoardDndComponent } from 'app/scripts/views/home/home-board-dnd-component';
import { BoardTile } from './presentational/tile';
import { UnsplashTracker } from '@trello/unsplash';
import { forTemplate } from '@trello/i18n';
import type { Board } from 'app/scripts/models/board';

const formatHome = forTemplate('home');

interface HomeBoardTileProps {
  modelCache: ModelCache;
  boardId: string;
  boardsType: string;
  isDraggable: boolean;
  orgId: string;
}

export const HomeBoardTile = ({
  boardId,
  isDraggable,
  modelCache,
  boardsType,
  orgId,
}: HomeBoardTileProps) => {
  const { boardStarList } = Auth.me();
  const board = ModelCache.get('Board', boardId) as Board;
  const isLoggedIn = Auth.isLoggedIn();
  const boardName = board.get('name');
  const orgName = board.getOrganization()?.get('displayName');
  const url = board.getUrl();
  const isStarred = board.isStarred();

  const backgroundTile = board.getPref('backgroundTile');
  const backgroundImage = board.getPref('backgroundImage');
  const backgroundImageScaled = board.getPref('backgroundImageScaled');

  let backgroundImageThumbnail = backgroundImage;
  if (!backgroundTile && backgroundImageScaled) {
    backgroundImageThumbnail =
      // @ts-expect-error
      Util.smallestPreviewBiggerThan(backgroundImageScaled, 400, 200)?.url ||
      backgroundImage;
  }
  const backgroundColor = board.getPref('backgroundColor');

  useEffect(() => {
    if (backgroundImage) {
      return UnsplashTracker.trackOncePerInterval(backgroundImage);
    }
  }, [backgroundImage]);

  const onStarClick = (e: React.MouseEvent) => {
    Util.preventDefault(e);

    if (!boardStarList.getBoardStar(boardId)) {
      boardStarList.starBoard(boardId);
      Analytics.sendUpdatedBoardFieldEvent({
        field: 'star',
        value: true,
        source: 'memberHomeRecentBoardsSection',
        containers: {
          organization: {
            id: orgId,
          },
          board: {
            id: boardId,
          },
        },
      });
    } else {
      boardStarList.unstarBoard(boardId);
      Analytics.sendUpdatedBoardFieldEvent({
        field: 'star',
        value: false,
        source: 'memberHomeStarredBoardsSection',
        containers: {
          organization: {
            id: orgId,
          },
          board: {
            id: boardId,
          },
        },
      });
    }
  };

  const trackClick = () => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'menuItem',
      actionSubjectId: 'boardMenuItem',
      source:
        boardsType === 'recent'
          ? 'memberHomeRecentBoardsSection'
          : 'memberHomeStarredBoardsSection',
      containers: {
        organization: {
          id: orgId,
        },
        board: {
          id: boardId,
        },
      },
    });
  };

  const isSafariLeftClick = (e: React.MouseEvent) => {
    return isSafari() && e.button === 0;
  };

  // onMouseDown and onMouseUp are here to prevent
  // Safari's default rendering <a> tags while they're
  // being dragged, which changes them to a gray box
  // containing the href attribute. The author of
  // React-DND has said this cannot be fixed, as it is
  // how Safari implements HTML5. The logic of our
  // workaround, then, is this:
  // If the <a> tag doesn't have an href attr, the image
  // will not change while being dragged. However, we do
  // need each board tile to have an href attr on right-click.
  // So, in non-Safari browsers, we do nothing onMouseDown, but
  // in Safari, if we detect a left click (which may lead into a
  // drag), we remove the href onMouseDown and reset it
  // onMouseUp, which occurs before the click. Dragging, plus
  // left/right click navigation, works everywhere -- and in Safari.
  const onMouseDown = (e: React.MouseEvent) => {
    if (isSafariLeftClick(e)) {
      const boardTileLink = e.currentTarget;
      return boardTileLink.removeAttribute('href');
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    const boardTileLink = e.currentTarget;
    return boardTileLink.setAttribute('href', board.getUrl());
  };

  const onDragHover = (idBoardHoverer: string) => {
    const boardStar = boardStarList.getBoardStar(idBoardHoverer);
    if (boardStar) {
      const index = boardStarList.getBoardIndex(boardId);
      const pos = boardStarList.getNewPos(boardStar, index);
      return boardStar.set({ pos });
    }
  };

  const onDragEnd = () => {
    const boardStar = boardStarList.getBoardStar(boardId);

    if (boardStar) {
      Analytics.sendTrackEvent({
        action: 'reordered',
        actionSubject: 'board',
        source: 'memberHomeStarredBoardsSection',
      });

      BlueBirdPromise.using(ModelCache.getLock(), () => {
        return new BlueBirdPromise((resolve) => {
          boardStar.update(
            {
              pos: boardStar.get('pos'),
            },
            () => resolve(),
          );
        });
      }).done();
    }
  };

  if (isDraggable) {
    return (
      <HomeBoardDndComponent
        id={boardId}
        backgroundColor={backgroundColor}
        boardName={boardName}
        isDraggable={isDraggable}
        isLoggedIn={isLoggedIn}
        isStarred={isStarred}
        // eslint-disable-next-line react/jsx-no-bind
        onDragEnd={onDragEnd}
        // eslint-disable-next-line react/jsx-no-bind
        onDragHover={onDragHover}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseDown={onMouseDown}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseUp={onMouseUp}
        // eslint-disable-next-line react/jsx-no-bind
        onStarClick={onStarClick}
        orgName={orgName}
        starIconTitle={formatHome('star-board')}
        thumbnailUrl={backgroundImageThumbnail}
        // eslint-disable-next-line react/jsx-no-bind
        trackClick={trackClick}
        url={url}
      />
    );
  } else {
    return (
      <BoardTile
        backgroundColor={backgroundColor}
        boardName={boardName}
        isLoggedIn={isLoggedIn}
        isStarred={isStarred}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseDown={onMouseDown}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseUp={onMouseUp}
        // eslint-disable-next-line react/jsx-no-bind
        onStarClick={onStarClick}
        orgName={orgName}
        starIconTitle={formatHome('star-board')}
        thumbnailUrl={backgroundImageThumbnail}
        // eslint-disable-next-line react/jsx-no-bind
        trackClick={trackClick}
        url={url}
      />
    );
  }
};
