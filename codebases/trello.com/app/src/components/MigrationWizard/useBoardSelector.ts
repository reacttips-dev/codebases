import { useReducer } from 'react';

export type SelectedBoardsAction =
  | {
      type: 'add' | 'remove';
      idBoard: string;
    }
  | {
      type: 'clear';
    }
  | {
      type: 'all';
      idBoards: string[];
    };

const selectedBoardsReducer = (
  selectedBoards: string[],
  action: SelectedBoardsAction,
) => {
  switch (action.type) {
    case 'add':
      return [...selectedBoards, action.idBoard];
    case 'remove':
      return selectedBoards.filter((idMember) => idMember !== action.idBoard);
    case 'clear':
      return [];
    case 'all':
      return action.idBoards;
    default:
      return selectedBoards;
  }
};

export const useBoardSelector = () => {
  return useReducer(selectedBoardsReducer, []);
};
