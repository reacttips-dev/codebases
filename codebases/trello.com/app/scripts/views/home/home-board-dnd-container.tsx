import React from 'react';
import { DropTarget, ConnectDropTarget, DropTargetConnector } from 'react-dnd';
import { BoardSection } from './presentational/board';
import { HomeTestIds } from '@trello/test-ids';
interface HomeBoardDndContainerProps {
  connectDropTarget: ConnectDropTarget;
  boardIds: string[];
  boardsType: string;
  isDraggable: boolean;
  numBoardsVisible: number;
  onShowFewerClick: () => void;
  onShowMoreClick: () => void;
  orgId: string;
  renderBoardTile: (
    boardId: string,
    boardsType: string,
    isDraggable: boolean,
    organizationId: string,
  ) => React.ReactElement;
  sectionHeaderTitle: string;
  sectionHeaderIcon: JSX.Element;
  showAll: boolean;
  testId: HomeTestIds;
}

const _HomeBoardDndContainer: React.FunctionComponent<HomeBoardDndContainerProps> = ({
  connectDropTarget,
  ...props
}) => {
  return connectDropTarget(
    <div>
      <BoardSection {...props} />
    </div>,
  );
};

const spec = { drop() {} };

const collect = (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget(),
});

// eslint-disable-next-line @trello/no-module-logic
export const HomeBoardDndContainer = DropTarget(
  'HomeBoardTile',
  spec,
  collect,
)(_HomeBoardDndContainer);
