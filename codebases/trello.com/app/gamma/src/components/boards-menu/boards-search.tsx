/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';

import preventDefault from 'app/gamma/src/util/prevent-default';

import styles from './boards-menu.less';

import { HeaderTestIds } from '@trello/test-ids';
import { Spinner } from '@trello/nachos/spinner';
import { CloseButton } from 'app/src/components/CloseButton';
import { forTemplate } from '@trello/i18n';
import { navigate } from 'app/scripts/controller/navigate';
import { Key } from '@trello/keybindings';
import { State } from 'app/gamma/src/modules/types';
import { BOARD_FIELDS } from 'app/gamma/src/modules/loaders/fields';
import {
  boardSearchResultsSuccess as boardSearchSuccess,
  resetPastQueries,
} from 'app/gamma/src/modules/state/models/search';
import { CompactBoardTile } from 'app/gamma/src/components/CompactBoardTile';
import {
  setBoardsMenuSearchText,
  setBoardsMenuSelectedBoard,
} from 'app/gamma/src/modules/state/ui/boards-menu';
import { getMe } from 'app/gamma/src/selectors/members';
import {
  BoardModel,
  BoardsMenuSelectedItemModel,
} from 'app/gamma/src/types/models';
import { BoardResponse } from 'app/gamma/src/types/responses';
import { dynamicDebounce } from '@trello/time';

const format = forTemplate('boards_sidebar');

import { Analytics } from '@trello/atlassian-analytics';
import { BoardsMenuVisibilityState } from 'app/src/components/BoardsMenuVisibility';
import { CloseIcon } from '@trello/nachos/icons/close';
import type { TrelloClientSearchBoardsParams } from 'app/gamma/src/api/trello-client-js/trello-client-js.types';

interface OwnProps {
  readonly boards: BoardModel[] | null;
  readonly searchText: string;
  readonly selectedBoard: BoardsMenuSelectedItemModel | null;
  readonly visibleBoards: BoardsMenuSelectedItemModel[] | null;
  readonly boardsMenuVisibility: BoardsMenuVisibilityState;
  readonly setBoardsMenuVisibility: (s: BoardsMenuVisibilityState) => void;
}

interface ForwardedProps extends OwnProps {
  forwardedRef?: React.Ref<HTMLInputElement>;
}

interface DispatchProps {
  readonly setBoardsMenuSearchText: (value: string) => void;
  readonly setSelectedBoard: (
    selected: BoardsMenuSelectedItemModel | null,
  ) => void;
  readonly addBoardSearchResults: (options: {
    query: string;
    boards: BoardResponse[];
    limited: boolean;
    timestamp: number;
  }) => void;
  readonly resetPastQueries: () => void;
}

interface StateProps {
  readonly shouldSearchTeamBoards: boolean;
  readonly myIdBoards: string[];
  readonly pastQueries: {
    query: string;
    limited: boolean;
  }[];
}

interface AllProps
  extends OwnProps,
    ForwardedProps,
    DispatchProps,
    StateProps {}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setBoardsMenuSearchText(value) {
      dispatch(setBoardsMenuSearchText(value));
    },
    setSelectedBoard(selected: BoardsMenuSelectedItemModel | null) {
      dispatch(setBoardsMenuSelectedBoard(selected));
    },
    addBoardSearchResults(options: {
      query: string;
      boards: BoardResponse[];
      limited: boolean;
      timestamp: number;
    }) {
      dispatch(boardSearchSuccess(options));
    },
    resetPastQueries() {
      dispatch(resetPastQueries());
    },
  };
};

const mapStateToProps = (state: State): StateProps => {
  const me = getMe(state);

  return {
    pastQueries: state.ui.boardsMenu.pastQueries,
    shouldSearchTeamBoards:
      me !== undefined &&
      me.idOrganizations !== undefined &&
      me.idOrganizations.length > 0,
    myIdBoards: me && me.idBoards ? me.idBoards : [],
  };
};

class BoardsSearch extends React.Component<AllProps> {
  componentWillUnmount() {
    this.props.setBoardsMenuSearchText('');
    this.debouncedSearch.clear();
    this.props.resetPastQueries();
  }

  private getSelectedIndex(): number {
    const { selectedBoard, searchText } = this.props;
    const selectedCategory =
      selectedBoard && !searchText ? selectedBoard.category : null;

    return selectedBoard && this.props.visibleBoards
      ? this.props.visibleBoards.findIndex(
          (board) =>
            board.id === selectedBoard.id &&
            board.category === selectedCategory,
        )
      : -1;
  }

  onClickCloseButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const { boardsMenuVisibility, setBoardsMenuVisibility } = this.props;

    if (boardsMenuVisibility === BoardsMenuVisibilityState.POPOVER) {
      setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
      Analytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'boardsMenuInlineDialog',
        source: 'appHeader',
        attributes: {
          method: 'clicked close button',
        },
      });
    }
  };

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case Key.ArrowUp:
        this.onUpArrow();
        break;
      case Key.ArrowDown:
        this.onDownArrow();
        break;
      default:
        return;
    }
  };

  onUpArrow = () => {
    const { visibleBoards } = this.props;
    if (!visibleBoards) {
      return;
    }
    const index = this.getSelectedIndex();
    const next: number = index > 0 ? index - 1 : 0;
    this.props.setSelectedBoard(visibleBoards[next]);
  };

  onDownArrow = () => {
    const { visibleBoards } = this.props;
    if (!visibleBoards) {
      return;
    }
    const index = this.getSelectedIndex();
    const length: number = visibleBoards.length - 1;
    const next: number = index === length ? length : index + 1;
    this.props.setSelectedBoard(visibleBoards[next]);
  };

  onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      visibleBoards,
      boardsMenuVisibility,
      setBoardsMenuVisibility,
    } = this.props;
    if (!visibleBoards || visibleBoards.length === 0) {
      return;
    }

    if (boardsMenuVisibility === BoardsMenuVisibilityState.POPOVER) {
      setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
    }

    const index = Math.max(this.getSelectedIndex(), 0);
    const boardAtIndex = visibleBoards[index];
    if (boardAtIndex?.url) {
      navigate(boardAtIndex.url, { trigger: true });
    }
  };

  render() {
    const {
      boards,
      searchText,
      selectedBoard,
      forwardedRef,
      boardsMenuVisibility,
    } = this.props;
    const selectedId = selectedBoard ? selectedBoard.id : null;
    const searchInProgress = searchText && this.isSearchNecessary(searchText);

    const closeButton =
      boardsMenuVisibility === BoardsMenuVisibilityState.PINNED ? null : (
        <CloseButton
          closeIcon={<CloseIcon />}
          className={styles.boardsMenuCloseButton}
          medium={true}
          onClick={this.onClickCloseButton}
          type="button"
        />
      );

    return (
      <>
        <form
          onSubmit={preventDefault(this.onSearchSubmit)}
          className={styles.boardsMenuSearchForm}
        >
          <input
            ref={forwardedRef}
            autoComplete="off"
            className={classNames(styles.input)}
            type="text"
            placeholder={format('find-boards-by-name-ellipsis')}
            name="search-boards"
            value={searchText}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            data-test-id={HeaderTestIds.BoardsMenuSearch}
            aria-label={format('find-boards-by-name-ellipsis')}
          />
          {closeButton}
        </form>
        {Boolean(searchText) &&
          boards &&
          boards.map((board: BoardModel) => (
            <CompactBoardTile
              key={board.id}
              idBoard={board.id}
              showTeamName={true}
              focused={board.id === selectedId}
            />
          ))}
        {searchInProgress && <Spinner centered />}
      </>
    );
  }

  onChange: React.ChangeEventHandler<HTMLInputElement> = async ({
    target: { value: rawValue },
  }) => {
    const val = rawValue.trim();

    this.props.setBoardsMenuSearchText(rawValue);
    this.props.setSelectedBoard(null);

    if (
      val.length > 0 &&
      this.props.shouldSearchTeamBoards &&
      this.isSearchNecessary(rawValue)
    ) {
      this.debouncedSearch(rawValue);
    } else {
      // A search is no longer necessary
      this.debouncedSearch.clear();
    }
  };

  private isSearchNecessary = (query: string) => {
    // Don't bother searching on just a single character
    if (query.trim().length <= 1) {
      return false;
    }

    const alreadySearched = this.props.pastQueries.some(
      (entry) =>
        // We recently searched for this exact thing
        query.toLowerCase() === entry.query.toLowerCase() ||
        // We recently got all the results for a shorter prefix of this search
        (!entry.limited &&
          query.toLowerCase().startsWith(entry.query.toLowerCase())),
    );

    return !alreadySearched;
  };

  private searchBoards = async (query: string) => {
    const partial = !query.endsWith(' ');
    const trimmedQuery = query.trim();
    const limit = 10;

    const results = await API.client.searchBoards(
      {
        board_fields: BOARD_FIELDS as TrelloClientSearchBoardsParams['board_fields'],
        boards_limit: limit,
        modelTypes: ['boards'],
        partial,
        query: trimmedQuery,
      },
      true,
    );

    this.props.addBoardSearchResults({
      query: trimmedQuery,
      boards: results.boards,
      limited: results.boards.length === limit,
      timestamp: Date.now(),
    });
  };

  private debouncedSearch = dynamicDebounce(this.searchBoards, (query) => {
    if (this.props.pastQueries.some((entry) => entry.query.startsWith(query))) {
      // They're very likely hitting backspace, we don't need to be as quick to
      // search
      return 1000;
    } else {
      return query.length <= 3 ? 1000 : 500;
    }
  });
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(
  React.forwardRef<HTMLInputElement, AllProps>((props, ref) => (
    <BoardsSearch forwardedRef={ref} {...props} />
  )),
);
