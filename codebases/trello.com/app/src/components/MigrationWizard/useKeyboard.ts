import React, {
  useState,
  useRef,
  useEffect,
  createRef,
  useCallback,
  useContext,
} from 'react';
import { Key, getKey } from '@trello/keybindings';
import { TeamlessBoardsQuery } from './TeamlessBoardsQuery.generated';
import { MigrationWizardContext } from './MigrationWizardContext';

type Member = NonNullable<NonNullable<TeamlessBoardsQuery>['member']>;
type Boards = NonNullable<Member['boards']>;
type Board = NonNullable<Boards[0]>;

export const useKeyboard = () => {
  const { teamlessBoards, updateBoards } = useContext(MigrationWizardContext);
  const [activeElementIndex, setActiveElementIndex] = useState<number | null>(
    null,
  );
  const boardRefs = useRef<React.RefObject<HTMLDivElement | null>[]>(
    teamlessBoards.map((b) => createRef()),
  );

  const onKeyboardNavigationBoardList = useCallback(
    (
      selected: boolean,
      board: Board,
      teamlessBoards: Boards,
      isDisabled: boolean = false,
    ): React.KeyboardEventHandler => (
      event: React.KeyboardEvent<HTMLElement>,
    ) => {
      if (activeElementIndex === null) {
        return;
      }

      switch (getKey(event)) {
        case Key.ArrowDown:
          // odd number of boards, down on right side goes to last board on left
          if (activeElementIndex + 1 === teamlessBoards.length - 1) {
            setActiveElementIndex(activeElementIndex + 1);
            break;
            // no board to go to
          } else if (activeElementIndex + 2 > teamlessBoards.length - 1) {
            break;
          }

          setActiveElementIndex(activeElementIndex + 2);
          break;
        case Key.ArrowUp:
          if (activeElementIndex - 2 < 0) {
            break;
          }
          setActiveElementIndex(activeElementIndex - 2);
          break;
        case Key.ArrowRight:
          if (activeElementIndex === teamlessBoards.length - 1) {
            break;
          }
          setActiveElementIndex(activeElementIndex + 1);
          break;
        case Key.ArrowLeft:
          if (activeElementIndex === 0) {
            break;
          }
          setActiveElementIndex(activeElementIndex - 1);
          break;
        case Key.Enter:
          if (!selected && isDisabled) {
            break;
          }

          updateBoards({
            type: selected ? 'remove' : 'add',
            idBoard: board.id,
          });
          break;
        case Key.Space:
          if (!selected && isDisabled) {
            break;
          }

          updateBoards({
            type: selected ? 'remove' : 'add',
            idBoard: board.id,
          });
          break;
        default:
          return;
      }

      event.preventDefault();
    },
    [activeElementIndex, updateBoards],
  );

  const setRef = useCallback(
    (divElement, index) => {
      boardRefs.current[index] = divElement;
    },
    [boardRefs],
  );

  const setRefAtIndex = useCallback(
    (index) => (divElement: React.RefObject<HTMLDivElement>) =>
      setRef(divElement, index),
    [setRef],
  );

  useEffect(() => {
    if (activeElementIndex !== null) {
      boardRefs.current[activeElementIndex].current?.focus();
    }
  }, [boardRefs, activeElementIndex]);

  return {
    setRef,
    setRefAtIndex,
    onKeyboardNavigationBoardList,
    boardRefs,
    activeElementIndex,
    setActiveElementIndex,
  };
};
