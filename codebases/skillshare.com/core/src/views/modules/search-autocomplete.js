import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { ApolloProvider } from '@skillshare/ui-components/components/providers';
import { ApolloClientManager } from '@skillshare/ui-components/shared/apollo';
import { SearchBox } from '@skillshare/ui-components/components/search/search-box/linked';
import deepRetrieve from 'core/src/utils/deep-retrieve';
import SSView from 'core/src/views/base/ss-view';
import PageOverlay from 'core/src/views/modules/page-overlay';

const SearchAutocomplete = SSView.extend({

  initialize: function(options) {
    SSView.prototype.initialize.apply(this, arguments);

    _.extend(this, options);

    const apiHost = deepRetrieve(SS, 'serverBootstrap', 'apiData', 'host');
    const query = options.value;

    const client = ApolloClientManager.getClient({ uri: `${apiHost}/api/graphql` });
    const targets = $('.js-search-box');

    for (const target of targets) {
      ReactDOM.render(
        <ApolloProvider client={client}>
          <DefaultThemeProvider>
            <SearchBox onQuerySubmit={this.onQuerySubmit} defaultValue={query} onCancel={this.onSearchCancel} />
          </DefaultThemeProvider>
        </ApolloProvider>,
        target
      );
    }
  },

  onQuerySubmit: function(query) {
    if(SS.EventTracker){
      SS.EventTracker.track('Search Performed', null, {
        query,
      });
    }
  },

  onSearchCancel: function() {
    PageOverlay.close(true);
    $('.js-mobile-search-overlay').hide();
  },
});

export default SearchAutocomplete;
