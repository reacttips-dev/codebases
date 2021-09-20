/* eslint-disable no-fallthrough, import/no-default-export */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';

import { loadBoardsForBoardsMenu } from 'app/gamma/src/modules/loaders/load-my-boards';
import {
  createBoardSetNameFromSearch,
  preloadCreateBoardData,
} from 'app/gamma/src/modules/state/ui/create-menu';
import {
  setBoardsMenuSelectedBoard,
  updateSidebarState,
  setBoardsMenuSearchText,
} from 'app/gamma/src/modules/state/ui/boards-menu';
import { State } from 'app/gamma/src/modules/types';
import { MemberContext } from 'app/gamma/src/modules/context';
import {
  getBoardsMenu,
  getBoardsMenuCategoriesWithBoards,
  getBoardsMenuFilteredBoards,
  getBoardsMenuSearchText,
  getBoardStars,
} from 'app/gamma/src/selectors/boards';
import { getMyId, isLoggedIn } from 'app/gamma/src/selectors/session';
import {
  BoardModel,
  BoardsMenuCategoryModel,
  BoardsMenuSelectedItemModel,
} from 'app/gamma/src/types/models';

import { BoardsMenu } from './boards-menu';
import { BoardsMenuContainerProps, StateProps, DispatchProps } from './types';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { getSidebarValues } from 'app/gamma/src/util/application-storage/sidebar';

const mapStateToProps = (state: State): StateProps => {
  const { loading, selectedBoard } = getBoardsMenu(state);
  const searchText = getBoardsMenuSearchText(state);
  const isSearching = !!searchText;
  const categoriesWithBoards = getBoardsMenuCategoriesWithBoards(state);
  const filteredBoards = isSearching
    ? getBoardsMenuFilteredBoards(state)
    : null;
  const collapsibles: string[] =
    getSidebarValues()?.collapsedDrawerSections || [];
  const visibleCategoryBoards:
    | BoardsMenuSelectedItemModel[]
    | null = !isSearching
    ? categoriesWithBoards
        .filter((category: BoardsMenuCategoryModel) =>
          collapsibles.includes(category.id),
        )
        .reduce(
          (
            result: BoardsMenuSelectedItemModel[],
            category: BoardsMenuCategoryModel,
          ) => {
            const items: BoardsMenuSelectedItemModel[] = category.boards.map(
              (board: BoardModel) => ({
                id: board.id,
                category: category.id,
                url: board.url,
              }),
            );

            return result.concat(items);
          },
          [],
        )
    : null;

  const visibleFilteredBoards: BoardsMenuSelectedItemModel[] | null =
    isSearching && filteredBoards
      ? filteredBoards.map((board: BoardModel) => ({
          id: board.id,
          category: null,
          url: board.url,
        }))
      : null;

  const visibleBoards = isSearching
    ? visibleFilteredBoards
    : visibleCategoryBoards;

  return {
    categoriesWithBoards,
    filteredBoards,
    idMe: getMyId(state),
    isLoggedIn: isLoggedIn(state),
    isSearching: !!searchText,
    loading,
    searchText,
    selectedBoard,
    visibleBoards,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  loader(idMe: string) {
    if (idMe) {
      dispatch(updateSidebarState());
      dispatch(loadBoardsForBoardsMenu(idMe));
      dispatch(preloadCreateBoardData());
    }
  },

  clearSearchText() {
    dispatch(setBoardsMenuSearchText(''));
  },

  clearSelectedBoard() {
    dispatch(setBoardsMenuSelectedBoard(null));
  },

  prepareToShowCreateBoard() {
    dispatch(preloadCreateBoardData());
    dispatch(createBoardSetNameFromSearch());
  },

  setSelectedBoard(selected) {
    dispatch(setBoardsMenuSelectedBoard(selected));
  },
});

const BoardsMenuContainer = (props: BoardsMenuContainerProps) => {
  const { loader, idMe } = props;
  useEffect(() => {
    loader(idMe);
  }, [idMe, loader]);

  return (
    <MemberContext.Provider value={{ id: props.idMe }}>
      <BoardsMenu {...props} />
    </MemberContext.Provider>
  );
};

const Connected = connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual(next, prev) {
    switch (true) {
      // If boards or stars were added or removed, update the DOM even if it is hidden
      // This ensures that desktop menu shortcuts still work until desktop can get
      // off of jQuery click magic
      case getBoardStars(prev).length !== getBoardStars(next).length ||
        prev.models.boards.length !== next.models.boards.length:
        return false;

      // else if any underlying models change…
      case next.models !== prev.models:
      // or if the UI state of the boards menu has changed…
      case next.ui.boardsMenu !== prev.ui.boardsMenu:
        // …assume we need to update.
        return false;

      default:
        // Otherwise, skip re-rendering as building the boards list is expensive
        return true;
    }
  },
})(BoardsMenuContainer);

const WithReduxProvider: React.FunctionComponent = () => {
  return (
    <ComponentWrapper>
      <Connected />
    </ComponentWrapper>
  );
};

export default WithReduxProvider;
