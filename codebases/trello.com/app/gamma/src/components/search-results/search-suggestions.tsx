/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import {
  clearSearchSuggestions,
  performSearch,
  setSearchQuery,
  setSelectedSuggestion,
} from 'app/gamma/src/modules/state/models/search';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getBoardsByIds } from 'app/gamma/src/selectors/boards';
import { getMembersByIds } from 'app/gamma/src/selectors/members';
import {
  getCurrentSearchQuery,
  getSearchSuggestions,
  getSelectedSuggestion,
} from 'app/gamma/src/selectors/search';
import {
  BoardModel,
  MemberModel,
  SearchSuggestionType as SuggestionType,
} from 'app/gamma/src/types/models';
import BoardSuggestion from './board-suggestion';
import KeywordSuggestion from './keyword-suggestion';
import MemberSuggestion from './member-suggestion';
import styles from './search-results.less';

const formatTitle = forTemplate('search_instant_results');

interface OwnProps {
  inputElement: HTMLInputElement | null;
}

interface SearchSuggestionsProps {
  allSuggestions: (SuggestionType | BoardModel | MemberModel)[];
  currentQuery: string;
  keywords: SuggestionType[];
  boards: BoardModel[];
  members: MemberModel[];
  selectedSuggestion: string;
  onSearchSuggestion: (query: string) => void;
  setSelected: (selected: string | null) => void;
}

interface AllProps extends OwnProps, SearchSuggestionsProps {}

const mapStateToProps = (state: State) => {
  const { keywords, idMembers, idBoards } = getSearchSuggestions(state);
  const boards: BoardModel[] = getBoardsByIds(state, idBoards);
  const members: MemberModel[] = getMembersByIds(state, idMembers);
  const selectedSuggestion = getSelectedSuggestion(state);
  const allSuggestions = [...keywords, ...boards, ...members];
  const currentQuery = getCurrentSearchQuery(state);

  return {
    allSuggestions,
    currentQuery,
    keywords,
    boards,
    members,
    selectedSuggestion,
  };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => ({
  onSearchSuggestion(query: string) {
    dispatch(clearSearchSuggestions());
    dispatch(setSearchQuery({ query }));
    dispatch(performSearch({}));
    ownProps.inputElement?.focus();
  },
  setSelected(selected: string | null) {
    dispatch(setSelectedSuggestion(selected));
  },
});

class SearchSuggestions extends React.Component<AllProps> {
  componentDidUpdate(prevProps: SearchSuggestionsProps) {
    const { boards, members, keywords } = this.props;
    if (
      prevProps.boards[0] !== boards[0] ||
      prevProps.members[0] !== members[0] ||
      prevProps.keywords[0] !== keywords[0]
    ) {
      this.setInitialSuggestion();
    }
  }

  setInitialSuggestion = () => {
    const { allSuggestions, setSelected } = this.props;

    if (allSuggestions.length) {
      setSelected(
        // @ts-expect-error
        allSuggestions[0].id ? allSuggestions[0].id : allSuggestions[0],
      );
    }
  };

  /*
   * Remove the word that triggered the suggestion and append to current query
   */
  getInitalQuery = () => {
    const { currentQuery } = this.props;

    return currentQuery.substring(0, currentQuery.lastIndexOf(' ') + 1);
  };

  onBoardSuggestion = (board: BoardModel) => {
    this.props.onSearchSuggestion(
      `${this.getInitalQuery()}board:"${board.name}" `,
    );
  };

  onMemberSuggestion = (member: MemberModel) => {
    this.props.onSearchSuggestion(
      `${this.getInitalQuery()}@${member.username} `,
    );
  };

  onKeywordSuggestion = (keyword: string) => {
    this.props.onSearchSuggestion(`${this.getInitalQuery()}${keyword} `);
  };

  render() {
    const {
      boards,
      members,
      keywords,
      selectedSuggestion,
      setSelected,
    } = this.props;

    if (!boards.length && !members.length && !keywords.length) {
      return null;
    }

    return (
      <section className={styles.searchResultsSection}>
        <div className={styles.searchResultHeading}>
          {formatTitle('did-you-mean-ellipsis')}
        </div>
        <ul>
          {keywords.map((keyword) => (
            <li
              key={`suggestion-${keyword}`}
              className={classNames(styles.suggestion, {
                [styles.isFocusedSuggestion]: selectedSuggestion === keyword,
              })}
            >
              <KeywordSuggestion
                setSelectedSuggestion={setSelected}
                keyword={keyword}
                onClick={this.onKeywordSuggestion}
              />
            </li>
          ))}
          {boards.map((board) => (
            <li
              key={`suggestion-${board.id}`}
              className={classNames(styles.suggestion, {
                [styles.isFocusedSuggestion]: selectedSuggestion === board.id,
              })}
            >
              <BoardSuggestion
                setSelectedSuggestion={setSelected}
                board={board}
                onClick={this.onBoardSuggestion}
              />
            </li>
          ))}
          {members.map((member) => (
            <li
              key={`suggestion-${member.id}`}
              className={classNames(styles.suggestion, {
                [styles.isFocusedSuggestion]: selectedSuggestion === member.id,
              })}
            >
              <MemberSuggestion
                setSelectedSuggestion={setSelected}
                member={member}
                onClick={this.onMemberSuggestion}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestions);
