import React from 'react';
import { sortBy } from 'underscore';
import { N30, N800 } from '@trello/colors';
import { Board, BoardName, ErrorMessage, TeamName } from './Board';
import { PlaceholderBoardTile } from './PlaceholderBoardTile';
import { ProportionalBoardLists } from './ProportionalLists';

const DEFAULT_LIST_COUNT = 5;
const MIN_LISTS = 4;
const MAX_LISTS = 6;

interface BackgroundImageScaled {
  width: number;
  height: number;
  url: string;
}

interface List {
  id: string;
  size: number;
}

interface BoardTileProps {
  board: {
    name?: string;
    lists?: List[];
    prefs?: {
      backgroundImage: string;
      backgroundColor: string;
      backgroundBrightness: string;
      backgroundImageScaled: BackgroundImageScaled[];
    };
    organization?: {
      displayName: string;
    };
  };
  error: boolean;
  loading: boolean;
  numLists?: number;
}

export const BoardTile = ({
  board = {},
  error,
  loading,
  numLists = DEFAULT_LIST_COUNT,
}: BoardTileProps) => {
  const num =
    numLists < MIN_LISTS || numLists > MAX_LISTS
      ? DEFAULT_LIST_COUNT
      : numLists;

  if (loading) {
    return <PlaceholderBoardTile numLists={numLists} />;
  }

  if (error) {
    return (
      <Board className="board-background" hasError numLists={num}>
        <ErrorMessage>{error}</ErrorMessage>

        <ProportionalBoardLists
          lists={[
            { id: '1', size: 2 },
            { id: '2', size: 3 },
            { id: '3', size: 1 },
            { id: '4', size: 2 },
            { id: '5', size: 2 },
            { id: '6', size: 1 },
          ]}
          numLists={num}
        />
      </Board>
    );
  }

  let bgColor;
  if (board.prefs && board.prefs.backgroundColor) {
    bgColor = board.prefs.backgroundColor;
  }

  let headerBgColor = bgColor;

  let bgImage;
  if (board.prefs && board.prefs.backgroundImage) {
    bgImage = board.prefs.backgroundImage;

    if (board.prefs.backgroundBrightness === 'light') {
      headerBgColor = N30;
    } else {
      headerBgColor = N800;
    }

    if (board.prefs.backgroundImageScaled) {
      const sortedPreviews = sortBy(board.prefs.backgroundImageScaled, 'width');
      const bigEnoughPreviews = sortedPreviews.filter(
        (p) => p.width > 248 && p.height > 158,
      );
      if (bigEnoughPreviews.length > 0) {
        bgImage = bigEnoughPreviews[0].url;
      }
    }
  }

  const lists = board.lists || [];

  return (
    <Board
      className="board-background"
      bgColor={bgColor}
      bgImage={bgImage}
      headerBgColor={headerBgColor}
      numLists={num}
    >
      <BoardName>{board.name}</BoardName>

      {board.organization && (
        <TeamName>{board.organization.displayName}</TeamName>
      )}

      <ProportionalBoardLists lists={lists} numLists={numLists} />
    </Board>
  );
};
