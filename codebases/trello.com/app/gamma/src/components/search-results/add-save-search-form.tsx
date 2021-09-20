/* eslint-disable import/no-default-export */
import { addSavedSearch } from 'app/gamma/src/modules/state/models/saved-searches';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { getCurrentSearchQuery } from 'app/gamma/src/selectors/search';
import { getSavedSearches } from 'app/gamma/src/selectors/saved-searches';
import preventDefault from 'app/gamma/src/util/prevent-default';
import styles from './search-results.less';

import { Button } from '@trello/nachos/button';
import { SavedSearchModel } from 'app/gamma/src/types/models';
import { Dispatch } from 'app/gamma/src/types';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('search_instant_results');
import { defaultRouter, RouteNames } from 'app/src/router';
import { searchState } from 'app/src/components/SearchResults';

interface StateProps {
  query: string;
  savedSearches: SavedSearchModel[];
}

interface DispatchProps {
  onSaveSearch: (params: { name: string; query: string; pos: number }) => void;
}

interface AllProps extends DispatchProps, StateProps {}

interface FormState {
  searchName: string;
}

const mapStateToProps = (state: State) => {
  return {
    query: getCurrentSearchQuery(state),
    savedSearches: getSavedSearches(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onSaveSearch({
      name,
      pos,
      query,
    }: {
      name: string;
      query: string;
      pos: number;
    }) {
      dispatch(
        addSavedSearch({
          id: `${Math.random()}`,
          name,
          pos,
          query,
        }),
      );
    },
  };
};

class SaveSearchForm extends React.Component<AllProps, FormState> {
  state = {
    searchName: '',
  };

  inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    const routeContext = defaultRouter.getRoute();
    if (this.inputRef.current && routeContext.routeName !== RouteNames.SEARCH) {
      this.inputRef.current.focus();
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchName = e.currentTarget.value;
    this.setState({ searchName });
  };

  onSave = () => {
    const { searchName } = this.state;
    const { savedSearches, query, onSaveSearch } = this.props;
    if (searchName) {
      /** This is how classic is calculating pos **/
      const pos = 16384 * (savedSearches.length + 1);
      onSaveSearch({
        name: searchName,
        pos,
        query,
      });
      searchState.setValue({
        displayAddSavedSearchForm: false,
      });
    }
  };

  render() {
    const { searchName } = this.state;

    return (
      <div className={styles.addSearchForm}>
        <header className={styles.addSearchFormHeader}>
          {format('what-would-you-like-to-call-this-search')}
        </header>
        <form
          className={styles.addSearch}
          onSubmit={preventDefault(this.onSave)}
        >
          <input
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            type="text"
            value={searchName}
            onChange={this.onChange}
            className={styles.addSearchInput}
            ref={this.inputRef}
          />
          <footer className={styles.addSearchFooter}>
            <Button
              appearance="primary"
              className={styles.addSearchButton}
              onClick={preventDefault(this.onSave)}
              isDisabled={!searchName}
            >
              {format('save')}
            </Button>
            <a
              onClick={preventDefault(() => {
                searchState.setValue({
                  displayAddSavedSearchForm: false,
                });
              })}
              href="#"
            >
              {format('nevermind')}
            </a>
          </footer>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchForm);
