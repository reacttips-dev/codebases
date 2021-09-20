import React, { FunctionComponent, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { State } from 'app/gamma/src/modules/types';
import {
  BoardModel,
  BoardsMenuSelectedItemModel,
} from 'app/gamma/src/types/models';
import { Dialog, useDialog } from 'app/src/components/Dialog';
import BoardsSearch from 'app/gamma/src/components/boards-menu/boards-search';
import {
  getBoardsMenuFilteredBoards,
  getBoardsMenu,
} from 'app/gamma/src/selectors/boards';
import { BoardsMenuVisibilityState } from 'app/src/components/BoardsMenuVisibility';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import styles from './QuickSwitcher.less';
import { noop } from 'app/src/noop';

interface StateProps {
  filteredBoards: BoardModel[] | null;
  selectedBoard: BoardsMenuSelectedItemModel | null;
  visibleBoards: BoardsMenuSelectedItemModel[] | null;
}

interface AllProps extends StateProps {}

const mapStateToProps = (state: State): StateProps => {
  const filteredBoards = getBoardsMenuFilteredBoards(state);
  const { selectedBoard } = getBoardsMenu(state);

  const visibleBoards: BoardsMenuSelectedItemModel[] | null = filteredBoards
    ? filteredBoards.map((board: BoardModel) => ({
        id: board.id,
        category: null,
        url: board.url,
      }))
    : null;

  return {
    filteredBoards,
    selectedBoard,
    visibleBoards,
  };
};

const QuickSwitcherUnconnected: FunctionComponent<AllProps> = ({
  filteredBoards,
  selectedBoard,
  visibleBoards,
}) => {
  const quickSwitcherInputRef = useRef<HTMLInputElement>(null);

  const {
    show: showDialog,
    hide: hideDialog,
    isOpen,
    dialogProps,
  } = useDialog();

  // set focus on quick switcher input when dialog opens
  useEffect(() => {
    if (isOpen) {
      quickSwitcherInputRef?.current?.focus();
    }
  }, [isOpen]);

  const onQuickSwitcherShortcut = () => {
    showDialog();
  };

  useShortcut(onQuickSwitcherShortcut, {
    scope: Scope.Global,
    key: Key.b,
  });

  const delayHideDialog = () => {
    // delay so that onSearchSubmit can execute & navigate
    window.setTimeout(hideDialog, 300);
  };

  const onKeyDownHandler = (e: React.KeyboardEvent) => {
    // close the dialog whenever you press enter on a result
    if (e.key === Key.Enter) {
      if (quickSwitcherInputRef?.current?.value === '') {
        // if there is no search text, prevent enter from submitting the form and going to a board
        e.preventDefault();
        e.stopPropagation();
      } else {
        delayHideDialog();
      }
    }
  };

  const onClickHandler = (e: React.MouseEvent) => {
    // close the dialog whenever you click on a result
    // don't close if you click in the search input
    if (e.target !== quickSwitcherInputRef.current) {
      delayHideDialog();
    }
  };

  return (
    <Dialog size="small" {...dialogProps}>
      {/* The event handlers are only being used to capture bubbled events
      in order to close the dialog at the appropriate times. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={styles.quickSwitcherContainer}
        // eslint-disable-next-line react/jsx-no-bind
        onKeyDown={onKeyDownHandler}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onClickHandler}
      >
        <BoardsSearch
          ref={quickSwitcherInputRef}
          boards={filteredBoards}
          searchText={quickSwitcherInputRef?.current?.value || ''}
          selectedBoard={selectedBoard}
          visibleBoards={visibleBoards}
          // pinned doesn't display the 'x'
          boardsMenuVisibility={BoardsMenuVisibilityState.PINNED}
          setBoardsMenuVisibility={noop}
        />
      </div>
    </Dialog>
  );
};

export const QuickSwitcher = connect(mapStateToProps)(QuickSwitcherUnconnected);
