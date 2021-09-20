/* eslint-disable import/no-default-export */
import cx from 'classnames';
import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import { CompactBoardTile } from 'app/gamma/src/components/CompactBoardTile';
import React, { MouseEvent } from 'react';
import preventDefault from 'app/gamma/src/util/prevent-default';
import AddSavedSearchForm from './add-save-search-form';
import BackButton from './back-button';
import CardResult from './card-result';
import MemberResult from './member-result';
import SaveSearchButton from './save-search-button';
import SavedSearches from './saved-searches';
import styles from './search-results.less';
import SearchSuggestions from './search-suggestions';
import SearchTips from './search-tips';
import TeamResult from './team-result';
import SavedSearchPromo from './upgrade-promo';
import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { useSharedState } from '@trello/shared-state';
import {
  searchState,
  showSearchErrorAlertFlag,
} from 'app/src/components/SearchResults';
import { BoardModel } from 'app/gamma/src/types/models';

const format = forTemplate('search_instant_results');
const DEFAULT_LIST_STYLE = {
  minHeight: '0px',
};

interface SearchResultsReduxProps {
  idBoards: string[];
  recentBoards: BoardModel[];
  starredBoards: BoardModel[];
  filteredBoards: BoardModel[];
  idCards: string[];
  cardsPage: number;
  hasMoreCards: boolean;
  hasResults: boolean;
  idMembers: string[];
  noMatchesFound: boolean;
  inputElement: HTMLInputElement | null;
  query: string;
  idTeams: string[];
  isLoading: boolean;
  isError: boolean;
  searchErrorCount: number;
  showMoreCards: (searchData: { query: string; cardsPage: number }) => void;
}

export interface SearchResultsProps extends SearchResultsReduxProps {
  isSavedSearchPromoActive: boolean;
  isAddSearchFormActive: boolean;
}

class SearchResultsUnconnected extends React.Component<SearchResultsProps> {
  state = {
    cardHighlight: false,
    cardListStyles: DEFAULT_LIST_STYLE,
  };

  private cardList = React.createRef<HTMLUListElement>();
  private listContainer = React.createRef<HTMLElement>();
  private shouldShowLoadingState = () =>
    this.props.cardsPage === 0 && this.props.isLoading;
  private shouldShowNoResultsState = () =>
    this.props.cardsPage === 0 && this.props.noMatchesFound;
  private shouldShowErrorState = () =>
    this.props.cardsPage === 0 && this.props.isError;
  private shouldShowSearchResults = () =>
    this.props.query.length && this.props.hasResults;
  private isLoadingMore = () =>
    this.props.isLoading && this.props.cardsPage > 0;
  private showLoadMore = () => this.props.hasMoreCards && !this.isLoadingMore();
  private hasTeamResults = () => this.props.idTeams.length > 0;
  private hasCardResults = () => this.props.idCards.length > 0;
  private hasMemberResults = () => this.props.idMembers.length > 0;
  private hasBoardResults = () => this.props.idBoards.length > 0;
  private hasRecentBoards = () => this.props.recentBoards.length > 0;
  private hasStarredBoards = () => this.props.starredBoards.length > 0;
  private hasFilteredBoards = () => this.props.filteredBoards.length > 0;
  private hasContentBelowCardResults = () =>
    this.showLoadMore() ||
    this.isLoadingMore() ||
    this.hasBoardResults() ||
    this.hasMemberResults() ||
    this.hasTeamResults();

  /*
   * If there is no content below the card results, and a card preview is being hovered
   * over, and that card preview is taller than the card-results list - adjust the min-
   * height of the card-results list to contain it. This prevents card previews from
   * getting clipped off the bottom of the search results popover.
   */
  private getCardListStyles = (e: MouseEvent) => {
    const previewContainer = (e.target as HTMLElement).closest(
      `.${styles.cardPreviewContainer}`,
    );
    const preview = previewContainer
      ? previewContainer.querySelector(`.${styles.cardPreview}`)
      : null;
    const cardList = this.cardList.current;
    const lastCardListItem = cardList
      ? cardList.querySelector(`.${styles.cardListItem}:last-child`)
      : null;
    if (
      previewContainer &&
      preview &&
      cardList &&
      lastCardListItem &&
      !this.hasContentBelowCardResults()
    ) {
      const topOfCardsList = cardList.getBoundingClientRect().top;
      const bottomOfCardsList = lastCardListItem.getBoundingClientRect().bottom;
      const topOfPreview = previewContainer.getBoundingClientRect().top;
      const bottomOfPreview = topOfPreview + preview.clientHeight;
      if (bottomOfPreview > bottomOfCardsList) {
        return {
          minHeight: `${bottomOfPreview - topOfCardsList}px`,
        };
      }
    }

    return DEFAULT_LIST_STYLE;
  };

  componentDidMount = () => {
    Analytics.sendScreenEvent({
      name: 'searchInlineDialog',
    });
  };

  onHighlightCard = (e: MouseEvent) => {
    this.setState({
      cardListStyles: this.getCardListStyles(e),
      cardHighlight: true,
    });
  };

  onUnhighlightCard = (e: MouseEvent) => {
    this.setState({
      cardListStyles: DEFAULT_LIST_STYLE,
      cardHighlight: false,
    });
  };

  onShowMoreClick = () => {
    const { query, cardsPage, showMoreCards } = this.props;
    showMoreCards({ query, cardsPage: cardsPage + 1 });
  };

  componentDidUpdate(prevProps: SearchResultsProps) {
    /*
     * if the user sees a certain number of errors in a fixed period
     * of time (tracked by props.searchErrorCount) Trello may be offline
     * and we want to show an alert pointing them to the status page.
     * We want to do this on every x errors in the fixed period of time
     * where x is the ALERT_ERROR_INTERVAL defined below.
     */
    const ALERT_ERROR_INTERVAL = 3;
    /*
     * The number of errors over some fixed period has hit our interval
     * Show the alert flag with a link to the status page
     */
    if (
      prevProps.searchErrorCount % ALERT_ERROR_INTERVAL !== 0 &&
      this.props.searchErrorCount % ALERT_ERROR_INTERVAL === 0
    ) {
      showSearchErrorAlertFlag();
    }
  }

  render() {
    /*
     * Show loading indicator if we are querying the server for the first
     * page of search results.
     */
    if (this.shouldShowLoadingState()) {
      return (
        <div className={styles.searchResults}>
          <SearchSuggestions inputElement={this.props.inputElement} />
          {this.renderQuickBoardList()}
          <div className={styles.loadingState}>
            <Spinner text={` ${format('searching-ellipsis')}`} small inline />
          </div>
        </div>
      );
    }

    /*
     * Show message saying no results were found for the given query
     */
    if (this.shouldShowNoResultsState()) {
      return (
        <div className={styles.searchResults}>
          <SearchSuggestions inputElement={this.props.inputElement} />
          {this.renderSearchOptions()}
          <p className={styles.emptyState}>{format('no-results')}</p>
        </div>
      );
    }

    /*
     * A search request error occurred. Show error message
     */
    if (this.shouldShowErrorState()) {
      return (
        <div className={styles.searchResults}>
          {this.renderSearchOptions()}
          <p className={styles.errorState}>
            {format('your-search-produced-an-error')}
          </p>
        </div>
      );
    }

    /*
     * Show search results for the given query
     */
    if (this.shouldShowSearchResults()) {
      return (
        <div className={styles.searchResults}>
          {this.renderSearchOptions()}
          <SearchSuggestions inputElement={this.props.inputElement} />
          {/* {this.renderQuickBoardList()} */}
          {this.renderBoardResults()}
          {this.renderCardResults()}
          {this.renderMemberResults()}
          {this.renderTeamResults()}
        </div>
      );
    }

    /*
     * User hasn't typed anything yet or we haven't started loading the
     * results yet, so show empty state with list of saved searches and
     * helpful tips on how to use the search feature
     */
    return (
      <div className={styles.searchResults}>
        <SearchSuggestions inputElement={this.props.inputElement} />
        {this.renderRecentBoards()}
        {this.renderStarredBoards()}
        <SavedSearches />
        <SearchTips />
      </div>
    );
  }

  /*
   * Render Search Options
   */
  renderSearchOptions() {
    const { isSavedSearchPromoActive, isAddSearchFormActive } = this.props;

    if (isSavedSearchPromoActive) {
      return <SavedSearchPromo />;
    } else if (isAddSearchFormActive) {
      return <AddSavedSearchForm />;
    } else {
      return (
        <header className={styles.searchHeader}>
          <BackButton />
          <SaveSearchButton />
        </header>
      );
    }
  }

  /*
   * Render matching boards quickly, if any
   */

  renderQuickBoardList() {
    if (!this.hasFilteredBoards()) {
      return null;
    }

    return (
      <>
        <div className={styles.searchResultHeading}>{format('boards')}</div>
        <ul className={styles.boardResults}>
          {this.uniqueBoardsList().map((idBoard: string) => (
            <li key={`board-result-${idBoard}`}>
              <CompactBoardTile
                key={idBoard}
                idBoard={idBoard}
                showTeamName={true}
                // eslint-disable-next-line react/jsx-no-bind
                onClickBoardName={() =>
                  Analytics.sendClickedLinkEvent({
                    linkName: 'boardSearchResultLink',
                    source: 'searchInlineDialog',
                  })
                }
              />
            </li>
          ))}
        </ul>
      </>
    );
  }

  /**
   * Render matching boards, if any
   */

  // de-depulicate the two board searches
  uniqueBoardsList() {
    return [
      ...new Set([
        ...this.props.filteredBoards.map((board) => board.id),
        ...this.props.idBoards,
      ]),
    ];
  }

  renderBoardResults() {
    if (!this.hasBoardResults()) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection}>
        <div className={styles.searchResultHeading}>{format('boards')}</div>
        <ul className={styles.boardResults}>
          {this.uniqueBoardsList().map((idBoard) => (
            <li key={`board-result-${idBoard}`}>
              <CompactBoardTile
                idBoard={idBoard}
                showTeamName={true}
                // eslint-disable-next-line react/jsx-no-bind
                onClickBoardName={() => {
                  Analytics.sendClickedLinkEvent({
                    linkName: 'boardSearchResultLink',
                    source: 'searchInlineDialog',
                  });
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /**
   * Render matching cards, if any
   */
  renderCardResults() {
    const listStyles = cx(styles.cardResults, {
      [styles.cardResultsHighlight]: this.state.cardHighlight,
    });
    if (!this.hasCardResults()) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection} ref={this.listContainer}>
        <div className={styles.searchResultHeading}>{format('cards')}</div>
        <ul
          className={listStyles}
          style={this.state.cardListStyles}
          ref={this.cardList}
        >
          {this.props.idCards.map((idCard) => (
            <li key={`card-result-${idCard}`} className={styles.cardListItem}>
              <CardResult
                id={idCard}
                onPreviewHover={this.onHighlightCard}
                onPreviewBlur={this.onUnhighlightCard}
              />
            </li>
          ))}
        </ul>
        {this.showLoadMore() ? (
          <Button
            appearance="subtle-link"
            size="fullwidth"
            className={styles.showMoreButton}
            onClick={preventDefault(this.onShowMoreClick)}
          >
            {format('show-more-cards-ellipsis')}
          </Button>
        ) : null}
        {this.isLoadingMore() ? (
          <div className={styles.showMoreSpinner}>
            <Spinner text={` ${format('loading-ellipsis')}`} small inline />
          </div>
        ) : null}
      </section>
    );
  }

  /**
   * Render recent boards, if any
   */
  renderRecentBoards() {
    if (!this.hasRecentBoards()) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection}>
        <div className={styles.searchResultHeading}>
          {format('recent-boards')}
        </div>
        <ul className={styles.boardResults}>
          {this.props.recentBoards.map((board) => (
            <li key={`board-result-${board.id}`}>
              <CompactBoardTile
                idBoard={board.id}
                showTeamName
                // eslint-disable-next-line react/jsx-no-bind
                onClickBoardName={() => {
                  Analytics.sendClickedLinkEvent({
                    linkName: 'recentBoardsLink',
                    source: 'searchInlineDialog',
                  });
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /**
   * Render starred boards, if any
   */
  renderStarredBoards() {
    if (!this.hasStarredBoards()) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection}>
        <div className={styles.searchResultHeading}>
          {format('starred-boards')}
        </div>
        <ul className={styles.boardResults}>
          {this.props.starredBoards.map((board) => (
            <li key={`board-result-${board.id}`}>
              <CompactBoardTile
                idBoard={board.id}
                showTeamName
                // eslint-disable-next-line react/jsx-no-bind
                onClickBoardName={() => {
                  Analytics.sendClickedLinkEvent({
                    linkName: 'starredBoardsLink',
                    source: 'searchInlineDialog',
                  });
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /**
   * Render matching users, if any
   */
  renderMemberResults() {
    if (!this.hasMemberResults()) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection}>
        <div className={styles.searchResultHeading}>{format('members')}</div>
        <ul className={styles.memberResults}>
          {this.props.idMembers.map((idMember) => (
            <li key={`member-result-${idMember}`}>
              <MemberResult id={idMember} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /**
   * Render matching teams, if any
   */
  renderTeamResults() {
    if (!this.hasTeamResults()) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection}>
        <div className={styles.searchResultHeading}>
          {format('organizations')}
        </div>
        <ul className={styles.teamResults}>
          {this.props.idTeams.map((idTeam) => (
            <li key={`team-result-${idTeam}`}>
              <TeamResult id={idTeam} />
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export const SearchResults: React.FC<SearchResultsReduxProps> = (props) => {
  const [
    { displayAddSavedSearchForm, displaySavedSearchPromo },
  ] = useSharedState(searchState);

  return (
    <SearchResultsUnconnected
      {...props}
      isSavedSearchPromoActive={displaySavedSearchPromo}
      isAddSearchFormActive={displayAddSavedSearchForm}
    />
  );
};
