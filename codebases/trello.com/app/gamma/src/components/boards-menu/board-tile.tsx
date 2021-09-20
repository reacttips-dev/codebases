/* eslint-disable import/no-default-export */
import { CompactBoardTile } from 'app/gamma/src/components/CompactBoardTile';
import { setBoardsMenuSelectedBoard } from 'app/gamma/src/modules/state/ui/boards-menu';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getBoardsMenu } from 'app/gamma/src/selectors/boards';
import {
  BoardModel,
  BoardsMenuCategoryType,
  BoardsMenuSelectedItemModel,
} from 'app/gamma/src/types/models';

interface OwnProps {
  board: BoardModel;
  showTeamName: boolean;
  type: BoardsMenuCategoryType;
  category: string;
}

interface StateProps {
  readonly selectedBoard: BoardsMenuSelectedItemModel | null;
}
interface DispatchProps {
  readonly setSelectedBoard: (
    selected: BoardsMenuSelectedItemModel | null,
  ) => void;
}

interface AllProps extends OwnProps, StateProps, DispatchProps {}

const mapStateToProps = (state: State): StateProps => {
  return {
    selectedBoard: getBoardsMenu(state).selectedBoard,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setSelectedBoard(selected: BoardsMenuSelectedItemModel | null) {
      dispatch(setBoardsMenuSelectedBoard(selected));
    },
  };
};

/**
 * This class serves as a wrapper around a compact board tile that allows it
 * to be rendered in a React Portal during while it is being dragged
 */
const BoardTile = (props: AllProps) => {
  const { selectedBoard, board, showTeamName, type, category } = props;
  const selectedId = selectedBoard ? selectedBoard.id : null;
  const selectedCategory = selectedBoard ? selectedBoard.category : null;
  const focused = board.id === selectedId && category === selectedCategory;

  return (
    <CompactBoardTile
      idBoard={board.id}
      showTeamName={showTeamName}
      type={type}
      focused={focused}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTile);
