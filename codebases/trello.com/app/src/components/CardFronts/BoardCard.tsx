import React, { useEffect, useCallback } from 'react';
import { N30 } from '@trello/colors';
import { sortBy } from 'underscore';
import cx from 'classnames';

import { CanonicalBoard } from '@atlassian/trello-canonical-components';

const {
  ErrorMessage,
  BoardName,
  PlaceholderBoardTile,
  ProportionalBoardLists,
  Board,
} = CanonicalBoard;

import { parseTrelloUrl } from 'app/scripts/lib/util/url/parse-trello-url';
import { useGetBoardQuery, GetBoardQuery } from './GetBoardQuery.generated';

import styles from './BoardCard.less';

import RouterLink from 'app/src/components/RouterLink/RouterLink';

import { startDecayingInterval } from 'app/scripts/lib/util/decaying-interval';
import { EditCardButton, useEditCardButton } from './EditCardButton';
import { Analytics } from '@trello/atlassian-analytics';
import { EventContainer } from '@atlassiansox/analytics-web-client';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_card');

interface BoardCardProps {
  boardUrl?: string;
  openEditor: () => void;
  removeCardRole: () => void;
  isEditable: boolean;
  analyticsContainers?: EventContainer;
  inSearchResults?: boolean;
  className?: string;
  isClosed: boolean;
}

const FULL_WIDTH_LIST = 5;
interface BoardStyle {
  bgColor?: string;
  bgImage: string | null;
  headerBgColor: string | null;
}

const getBoardStyle = (board: GetBoardQuery['board']): BoardStyle => {
  let bgColor = undefined;
  let headerBgColor = null;
  let bgImage = null;

  if (board !== null && board !== undefined) {
    if (board.prefs && board.prefs.backgroundColor) {
      bgColor = board.prefs.backgroundColor;
    }

    if (board.prefs && board.prefs.backgroundImage) {
      bgImage = board.prefs.backgroundImage;

      headerBgColor = board.prefs?.backgroundTopColor
        ? board.prefs?.backgroundTopColor
        : board.prefs.backgroundBrightness === 'dark'
        ? '#333'
        : N30;

      if (board.prefs.backgroundImageScaled) {
        const sortedPreviews = sortBy(
          board.prefs.backgroundImageScaled,
          'width',
        );
        const bigEnoughPreviews = sortedPreviews.filter(
          (p) => p.width > 248 && p.height > 158,
        );
        if (bigEnoughPreviews.length > 0) {
          bgImage = bigEnoughPreviews[0].url;
        }
      }
    }
  }

  return {
    bgColor: bgColor,
    bgImage: bgImage,
    headerBgColor: headerBgColor,
  };
};

export const BoardCard = ({
  boardUrl,
  openEditor,
  isEditable,
  analyticsContainers,
  inSearchResults,
  className,
  isClosed,
}: BoardCardProps) => {
  const boardId = parseTrelloUrl(boardUrl || '').shortLink;

  const { data, loading, refetch } = useGetBoardQuery({
    variables: { boardId: boardId || '' },
  });

  const safeRefetch = useCallback(() => {
    if (navigator.onLine) refetch();
  }, [refetch]);

  const {
    showEditCardButton,
    hideEditCardButton,
    shouldShowEditCardButton,
  } = useEditCardButton();

  useEffect(() => {
    if (!loading && data?.board) {
      Analytics.sendViewedComponentEvent({
        componentType: 'card',
        componentName: 'boardCard',
        source: 'cardView',
        containers: analyticsContainers,
        attributes: {
          linkBoardId: data.board.id,
        },
      });
    }

    if (boardId !== parseTrelloUrl(window.location.href).shortLink) {
      return startDecayingInterval(safeRefetch);
    }
  }, [
    analyticsContainers,
    boardId,
    data?.board,
    data?.board?.id,
    loading,
    safeRefetch,
  ]);

  const trackClick = useCallback(() => {
    if (!loading && data?.board) {
      Analytics.sendClickedLinkEvent({
        linkName: 'boardCard',
        source: 'cardView',
        containers: analyticsContainers,
        attributes: {
          linkBoardId: data.board.id,
        },
      });
    }
  }, [analyticsContainers, data?.board, loading]);

  if (data?.board !== null && data?.board !== undefined) {
    const board = data.board || {};
    interface CardCount {
      [key: string]: number;
    }

    const cardCount: CardCount = board.cards.reduce(
      (acc: Record<string, number>, card) => {
        if (acc[card.idList]) acc[card.idList] += 1;
        else acc[card.idList] = 1;
        return acc;
      },
      {},
    );

    const lists =
      board.lists.map((list) => ({
        id: list.id,
        size: cardCount[list.id] || 0,
      })) || [];

    return (
      <div
        className={className}
        onFocus={showEditCardButton}
        onBlur={hideEditCardButton}
        onMouseOver={showEditCardButton}
        onMouseOut={hideEditCardButton}
      >
        <Board
          className={cx(
            'board-background',
            inSearchResults ? styles.searchCard : styles.boardCard,
          )}
          {...getBoardStyle(board)}
          numLists={FULL_WIDTH_LIST} // full width always
        >
          <EditCardButton
            onClick={openEditor}
            shouldShow={isEditable && shouldShowEditCardButton}
          />
          <BoardName>{board.name}</BoardName>
          <ProportionalBoardLists lists={lists} numLists={FULL_WIDTH_LIST} />
          {!isClosed && (
            <RouterLink
              href={boardUrl}
              className={styles.boardLink}
              title={board.name}
              onClick={trackClick}
            />
          )}
        </Board>
      </div>
    );
  } else if (loading) {
    return (
      <PlaceholderBoardTile
        className={cx(
          'board-background',
          inSearchResults ? styles.searchCard : styles.boardCard,
        )}
        numLists={FULL_WIDTH_LIST}
      />
    );
  } else
    return (
      <div
        className={className}
        onFocus={showEditCardButton}
        onBlur={hideEditCardButton}
        onMouseOver={showEditCardButton}
        onMouseOut={hideEditCardButton}
      >
        <Board
          className={cx(
            'board-background',
            inSearchResults ? styles.searchCard : styles.boardCard,
          )}
          bgColor="rgb(213 217 223)"
          hasError
          numLists={FULL_WIDTH_LIST}
        >
          <EditCardButton
            onClick={openEditor}
            shouldShow={isEditable && shouldShowEditCardButton}
          />
          <ErrorMessage>{format('unable-to-load-board')}</ErrorMessage>
          <ProportionalBoardLists
            lists={[
              { id: '1', size: 2 },
              { id: '2', size: 3 },
              { id: '3', size: 1 },
              { id: '4', size: 2 },
              { id: '5', size: 2 },
              { id: '6', size: 1 },
            ]}
            numLists={FULL_WIDTH_LIST}
          />
        </Board>
      </div>
    );
};
