/* eslint-disable import/no-default-export */
import React from 'react';
import { connect } from 'react-redux';

import { TestId } from '@trello/test-ids';
import { State } from 'app/gamma/src/modules/types';
import { getTeamById } from 'app/gamma/src/selectors/teams';
import {
  getBoardById,
  isBoardStarred,
  isTemplate,
} from 'app/gamma/src/selectors/boards';
import { BoardModel, BoardsMenuCategoryType } from 'app/gamma/src/types/models';
import { CompactBoardTile as CompactBoardTileUnconnected } from './CompactBoardTile';

interface OwnProps {
  readonly idBoard: string;
  readonly boardTileClassName?: string;
  readonly isDragging?: boolean;
  readonly showTeamName?: boolean;
  readonly minifyBoardTile?: boolean;
  readonly focused?: boolean;
  readonly testId?: TestId;
  readonly type?: BoardsMenuCategoryType;
  readonly onClickBoardName?: () => void;
}

interface StateProps {
  readonly board: BoardModel | undefined;
  readonly isStarred: boolean;
  readonly isTemplate: boolean;
  readonly teamName: string | undefined;
}

interface AllProps extends OwnProps, StateProps {}

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
  const board = getBoardById(state, ownProps.idBoard);
  const team =
    board && board.idTeam ? getTeamById(state, board.idTeam) : undefined;

  return {
    board,
    isStarred: isBoardStarred(state, ownProps.idBoard),
    isTemplate: isTemplate(state, ownProps.idBoard),
    teamName: team ? team.displayName : undefined,
  };
}

const CompactBoardTileContainer = ({ board, ...rest }: AllProps) => {
  return board ? <CompactBoardTileUnconnected board={board} {...rest} /> : null;
};

export const CompactBoardTile = connect(mapStateToProps)(
  CompactBoardTileContainer,
);
