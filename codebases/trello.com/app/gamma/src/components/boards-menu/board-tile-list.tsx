/* eslint-disable import/no-default-export */
import React from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import {
  BoardsMenuCategoryModel,
  BoardsMenuCategoryType,
} from 'app/gamma/src/types/models';
import BoardTile from './board-tile';
import PortalAwareBoardTile from './portal-aware-board-tile';

const BoardTileList = (category: BoardsMenuCategoryModel) => {
  const { boards, type, id } = category;
  const showTeamName =
    type === BoardsMenuCategoryType.Starred ||
    type === BoardsMenuCategoryType.Recent;

  return (
    <>
      {boards.map((board, index) => {
        if (type === BoardsMenuCategoryType.Starred) {
          return (
            <Draggable
              draggableId={board.id}
              index={index}
              key={board.id}
              disableInteractiveElementBlocking={true}
            >
              {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot,
              ) => (
                <PortalAwareBoardTile
                  provided={provided}
                  snapshot={snapshot}
                  board={board}
                  showTeamName={showTeamName}
                  type={type}
                  category={id}
                />
              )}
            </Draggable>
          );
        }

        return (
          <BoardTile
            key={`boards-menu-board-${board.id}`}
            board={board}
            showTeamName={showTeamName}
            type={type}
            category={id}
          />
        );
      })}
    </>
  );
};

export default BoardTileList;
