import React from 'react';
import type ApolloClient from 'apollo-client';
import { withApollo } from 'react-apollo';

import epic from 'bundles/epic/client';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import fullStory from 'js/lib/fullStoryUtils';

import SearchBarContent from 'bundles/search/components/SearchBarContent';

import {
  CollectionRecommendationsQuery,
  getItemsListFromLocalStorageByKeyAndTrimOutdated,
} from 'bundles/search/SearchUtils';

import type { CollectionRecommendations } from 'bundles/search/types/collection-recommendation';

type PropsFromCaller = {
  hideSearch?: boolean;
  searchIsOpen?: boolean;
  isSearchPage?: boolean;
  isSEOEntityPage?: boolean;
  shouldFocusSearch?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  hideMobileSearchPage?: () => void;
  searchInputIsFocused?: boolean;
  enableOneStepSearch?: boolean;
  shouldShowExposedSearchAndReg?: boolean;
  smallSearchBar?: boolean;
  className?: string;
};

type PropsFromApollo = {
  client: ApolloClient<{}>;
};

type PropsToComponent = PropsFromCaller & PropsFromApollo;

type State = {
  collectionRecommendations?: CollectionRecommendations;
};

class SearchBar extends React.Component<PropsToComponent, State> {
  state = {
    collectionRecommendations: {} as CollectionRecommendations,
  };

  componentDidMount() {
    const { client, isSEOEntityPage } = this.props;
    if (getItemsListFromLocalStorageByKeyAndTrimOutdated('recently-viewed').length === 0 && client) {
      this.getCollectionRecommendationsData(client).then(
        ({
          data: {
            BrowseCollectionsV1Resource: {
              byCollections: { elements },
            },
          },
        }) => {
          const collectionRecommendations = {
            courses: elements[0]?.courses?.elements,
            s12ns: elements[0]?.s12ns?.elements,
            moduleID: elements[0]?.id,
            rankedRecommendations: elements[0]?.entries,
          };

          this.setState(() => ({ collectionRecommendations }));
        }
      );
    }
    if (epic.get('GrowthPage', 'fullStoryB2CEnabled') && !isSEOEntityPage) {
      fullStory.init();
    }
  }

  getCollectionRecommendationsData(client: ApolloClient<{}>) {
    return client.query({
      query: CollectionRecommendationsQuery,
      variables: {
        contextType: 'PAGE',
        contextId: 'search-zero-state',
        numEntriesPerCollection: 10,
      },
    });
  }

  render() {
    const { collectionRecommendations } = this.state;
    const {
      isSearchPage,
      searchIsOpen,
      shouldFocusSearch,
      onBlur,
      onFocus,
      hideMobileSearchPage,
      enableOneStepSearch,
      shouldShowExposedSearchAndReg,
      searchInputIsFocused,
      className,
      smallSearchBar,
      hideSearch,
    } = this.props;

    return (
      <SearchBarContent
        collectionRecommendations={collectionRecommendations}
        onBlur={onBlur}
        onFocus={onFocus}
        searchIsOpen={searchIsOpen}
        hideMobileSearchPage={hideMobileSearchPage}
        enableOneStepSearch={enableOneStepSearch}
        shouldShowExposedSearchAndReg={shouldShowExposedSearchAndReg}
        searchInputIsFocused={searchInputIsFocused}
        isSearchPage={isSearchPage}
        shouldFocusSearch={shouldFocusSearch}
        className={className}
        smallSearchBar={smallSearchBar}
        hideSearch={hideSearch}
      />
    );
  }
}

export default withApollo<PropsFromCaller, {}>(SearchBar);
