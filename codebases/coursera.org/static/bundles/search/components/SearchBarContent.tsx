// Component is used in both standard env and next.js env. If adding data-fetching refactor SearchBarContainer and pass down data as props.
import type { ChangeEvent } from 'react';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import URI from 'jsuri';
import Retracked from 'js/app/retracked';
import { ON_SITE_SEARCH_PATH } from 'bundles/search/SearchConstants';
import type { AutoCompleteWithIndexProps as AutoCompleteProps } from 'bundles/search/components/AutoComplete';

import MagnifierSvg from 'bundles/browse/components/PageHeader/MagnifierSvg';

import type { CollectionRecommendations } from 'bundles/search/types/collection-recommendation';

import _t from 'i18n!nls/search';

import 'css!./__styles__/SearchBar';

type Props = {
  hideSearch?: boolean;
  searchIsOpen?: boolean;
  isSearchPage?: boolean;
  shouldFocusSearch?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  hideMobileSearchPage?: () => void;
  searchInputIsFocused?: boolean;
  collectionRecommendations?: CollectionRecommendations;
  enableOneStepSearch?: boolean;
  shouldShowExposedSearchAndReg?: boolean;
  smallSearchBar?: boolean;
  className?: string;
};

type State = {
  searchText: string;
  autoCompleteLoaded: boolean;
};

class SearchBarContent extends React.Component<Props, State> {
  LoadableAutoComplete: React.ComponentType<AutoCompleteProps> | null;

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    hideSearch: false,
    isSearchPage: false,
    enableOneStepSearch: false,
    shouldShowExposedSearchAndReg: false,
  };

  constructor(props: Props) {
    super(props);

    this.LoadableAutoComplete = null;
  }

  state = {
    searchText: '',
    autoCompleteLoaded: false,
  };

  componentDidMount() {
    this.loadAutoComplete();
  }

  loadAutoComplete = () => {
    import('bundles/search/components/AutoComplete').then((Mod) => {
      this.LoadableAutoComplete = Mod.default;
      this.setState(() => ({
        autoCompleteLoaded: true,
      }));
    });
  };

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.target.value });
  };

  onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const {
      router,
      router: { location },
      _eventData,
    } = this.context;
    const { isSearchPage } = this.props;
    const { searchText } = this.state;
    const encodedSearchText = encodeURIComponent(searchText.replace(/\s+/g, ' '));

    const otherQueryParamsString = new URI(location.query).deleteQueryParam('query').query();
    const urlWithQuery = (new URI(ON_SITE_SEARCH_PATH)
      .setQuery(otherQueryParamsString)
      .addQueryParam('query', encodedSearchText, 0) as unknown) as string;

    if (isSearchPage) {
      router.push(urlWithQuery);
    } else {
      window.location.assign(urlWithQuery);
    }
    Retracked.trackComponent(
      _eventData,
      { searchText, page: window.location.pathname },
      'algolia_search_page_query_updated',
      'search'
    );
  };

  renderSearchBar = () => {
    const {
      // using false here because the default prop is false
      isSearchPage = false,
      shouldFocusSearch,
      onBlur,
      onFocus,
      searchIsOpen,
      hideMobileSearchPage,
      enableOneStepSearch,
      shouldShowExposedSearchAndReg,
      searchInputIsFocused,
      collectionRecommendations,
    } = this.props;
    const { LoadableAutoComplete } = this;
    const { searchText, autoCompleteLoaded } = this.state;
    const autoCompleteShouldFocus = shouldFocusSearch || searchInputIsFocused;

    if ((enableOneStepSearch || shouldShowExposedSearchAndReg) && autoCompleteLoaded && LoadableAutoComplete) {
      return (
        <LoadableAutoComplete
          onSearchFocus={onFocus}
          searchIsOpen={searchIsOpen}
          hideMobileSearchPage={hideMobileSearchPage}
          shouldShowExposedSearchAndReg={shouldShowExposedSearchAndReg}
          enableOneStepSearch={enableOneStepSearch}
          shouldFocusSearch={autoCompleteShouldFocus}
          collectionRecommendations={collectionRecommendations}
          isSearchPage={isSearchPage}
          startingQuery={searchText}
        />
      );
    }

    if (autoCompleteLoaded && LoadableAutoComplete) {
      return (
        <LoadableAutoComplete
          collectionRecommendations={collectionRecommendations}
          isSearchPage={isSearchPage}
          searchIsOpen={searchIsOpen}
          hideMobileSearchPage={hideMobileSearchPage}
          shouldFocusSearch={autoCompleteShouldFocus}
          startingQuery={searchText}
        />
      );
    }

    return (
      <div className="rc-SearchBar__container horizontal-box">
        <div className="mobile-magnifier">
          <MagnifierSvg fill="#4385F5" />
        </div>
        <input
          id="algolia-placeholder-search-input"
          type="text"
          // This is necessary to allow the search bar to work without rehydration
          name="query"
          placeholder={_t('What do you want to learn?')}
          value={searchText}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={this.onChange}
          autoComplete="off"
          aria-label={_t('Search catalog')}
        />
        <button type="submit" className="nostyle search-button" aria-label="Submit Search">
          <MagnifierSvg fill="#E1E1E1" />
        </button>
      </div>
    );
  };

  render() {
    const { hideSearch, shouldShowExposedSearchAndReg, enableOneStepSearch, smallSearchBar } = this.props;
    const { autoCompleteLoaded } = this.state;

    if (hideSearch) {
      return null;
    }

    // After lazy loading, the AutoComplete will handle the operations, but before
    // we still want to allow the user to search & be redirected accordingly
    const formProps = autoCompleteLoaded
      ? { onSubmit: (e: React.SyntheticEvent) => e.preventDefault() }
      : { onSubmit: this.onSubmit };
    const searchBarRootClasses = classNames('rc-SearchBar horizontal-box isLohpRebrand', {
      shouldShowExposedSearchAndReg,
      enableOneStepSearch: enableOneStepSearch && !shouldShowExposedSearchAndReg,
      'small-search-bar': smallSearchBar,
    });

    return (
      <div className={searchBarRootClasses}>
        <form className="search-form" role="search" {...formProps}>
          {this.renderSearchBar()}
        </form>
      </div>
    );
  }
}

export default SearchBarContent;
