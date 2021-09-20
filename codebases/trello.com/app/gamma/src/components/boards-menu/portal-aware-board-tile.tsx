/* eslint-disable import/no-default-export */
import React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import ReactDOM from '@trello/react-dom-wrapper';
import { BoardModel, BoardsMenuCategoryType } from 'app/gamma/src/types/models';
import BoardTile from './board-tile';

interface OwnProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  board: BoardModel;
  showTeamName: boolean;
  type: BoardsMenuCategoryType;
  category: string;
}

/**
 * This FunctionComponent serves as a wrapper around a compact board tile that allows it
 * to be rendered in a React Portal during while it is being dragged
 */
const PortalAwareBoardTile = (props: OwnProps) => {
  const portal = document.getElementById('dnd-portal');
  const { provided, snapshot, ...rest } = props;
  const { innerRef, draggableProps, dragHandleProps } = provided;
  const { isDragging } = snapshot;

  const child = (
    <div ref={innerRef} {...draggableProps} {...dragHandleProps} tabIndex={-1}>
      <BoardTile {...rest} />
    </div>
  );

  if (!isDragging) {
    return child;
  } else if (portal) {
    // if dragging - put the item in a portal
    return ReactDOM.createPortal(child, portal);
  }

  return null;
};

export default PortalAwareBoardTile;
