import { useEffect, useState } from 'react';

import {
  getSidebarValues,
  setSidebarValues,
} from 'app/gamma/src/util/application-storage/sidebar';

export enum BoardsMenuVisibilityState {
  CLOSED = 'closed',
  POPOVER = 'popover',
  PINNED = 'pinned',
}

interface Subscriber {
  (boardsMenuVisibilityState: BoardsMenuVisibilityState): void;
}

interface Disposer {
  (): void;
}

class BoardsMenuState {
  private boardsMenuVisibility: BoardsMenuVisibilityState;
  private subscribers = new Set<Subscriber>();

  constructor() {
    const persistedSidebarValues = getSidebarValues();

    this.boardsMenuVisibility = persistedSidebarValues?.pinBoardsListSidebar
      ? BoardsMenuVisibilityState.PINNED
      : BoardsMenuVisibilityState.CLOSED;
  }

  get = (): BoardsMenuVisibilityState => {
    return this.boardsMenuVisibility;
  };

  set = (newVisibility: BoardsMenuVisibilityState) => {
    const { boardsMenuVisibility } = this;

    // Nothing to do if the state is the same.
    if (newVisibility === boardsMenuVisibility) {
      return;
    }

    // We can only transition from closed to popover
    if (
      boardsMenuVisibility === BoardsMenuVisibilityState.CLOSED &&
      newVisibility !== BoardsMenuVisibilityState.POPOVER
    ) {
      return;
    }

    // We can only transition from popover to either closed or pinned, but that
    // is covered by the first check...

    // We can only transition from pinned to popover
    if (
      boardsMenuVisibility === BoardsMenuVisibilityState.PINNED &&
      newVisibility !== BoardsMenuVisibilityState.POPOVER
    ) {
      return;
    }

    // Update in memory, persist to localStorage, then broadcast to consumers.
    this.boardsMenuVisibility = newVisibility;
    setSidebarValues({
      ...getSidebarValues(),
      pinBoardsListSidebar:
        this.boardsMenuVisibility === BoardsMenuVisibilityState.PINNED,
    });
    this.subscribers.forEach((subscriber) =>
      subscriber(this.boardsMenuVisibility),
    );
  };

  subscribe = (subscriber: Subscriber): Disposer => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };
}

// eslint-disable-next-line @trello/no-module-logic
const boardsMenuState = new BoardsMenuState();

export const useBoardsMenuVisibility = () => {
  const [boardsMenuVisibility, setBoardsMenuVisibility] = useState(
    boardsMenuState.get(),
  );

  useEffect(() => {
    return boardsMenuState.subscribe(setBoardsMenuVisibility);
  }, [setBoardsMenuVisibility]);

  return {
    boardsMenuVisibility,
    setBoardsMenuVisibility: boardsMenuState.set,
  };
};
