/* eslint-disable import/no-default-export */
import { performSearch } from 'app/gamma/src/modules/state/models/search';
import { State } from 'app/gamma/src/modules/types';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import {
  getCurrentSearchQuery,
  getSearchErrorCount,
  getSearchResults,
  isSearchError,
  isSearchLoading,
} from 'app/gamma/src/selectors/search';
import { SearchResults } from './search-results';
import {
  getMyOpenStarredBoards,
  getMyOpenRecentBoards,
  getBoardsSearchFilteredBoards,
} from '../../selectors/boards';
import { getMyTeams } from '../../selectors/teams';
import { getStandardVariation } from 'app/src/components/StandardGenerics';

interface OwnProps {
  inputElement: HTMLInputElement | null;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showMoreCards: (searchData: { cardsPage: number }) => {
    dispatch(performSearch(searchData));
  },
});

const mapStateToProps = (state: State, props: OwnProps) => {
  const {
    idBoards,
    idCards,
    cardsPage,
    hasMoreCards,
    idMembers,
    idTeams,
    noMatchesFound,
  } = getSearchResults(state);

  const query = getCurrentSearchQuery(state);
  const isLoading = isSearchLoading(state);
  const isError = isSearchError(state);
  const recentBoards = getMyOpenRecentBoards(state);
  const starredBoards = getMyOpenStarredBoards(state);
  const hasResults = !!(
    idBoards.length ||
    idCards.length ||
    idMembers.length ||
    idTeams.length
  );
  const searchErrorCount = getSearchErrorCount(state);

  const filteredBoards = getBoardsSearchFilteredBoards(state);
  const isStandardVariationEnabled = getMyTeams(state).some(
    ({ standardVariation }) =>
      getStandardVariation(standardVariation) !== 'control',
  );

  return {
    idBoards,
    recentBoards,
    starredBoards,
    idCards,
    cardsPage,
    hasMoreCards,
    hasResults,
    idMembers,
    noMatchesFound,
    query,
    idTeams,
    isLoading,
    isError,
    isStandardVariationEnabled,
    filteredBoards,
    searchErrorCount,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
