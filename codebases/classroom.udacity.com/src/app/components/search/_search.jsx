import { mapProps, renameProp } from 'recompose';

import LocalStorage from 'components/common/local-storage';
import SearchLayout from './_layout';
import SearchService from 'services/search-service';

const SearchWithStorage = (props) => (
  <LocalStorage storageKey="recentSearchTerms" defaultValue={[]}>
    {({ value, setValue }) => (
      <SearchLayout
        recentSearches={value}
        setRecentSearches={setValue}
        {...props}
      />
    )}
  </LocalStorage>
);

const cachedSearch = _.memoize(
  SearchService.search,
  ({ term, root, partKeys }) => `${root.id}--${term}--${partKeys.join(',')}`
);

const Search = mapProps(({ onSearch, ...rest }) => ({
  ...rest,
  onSearch: (searchTerm, root) => {
    onSearch();
    return cachedSearch(searchTerm, root);
  },
}))(SearchWithStorage);

export default Search;

// ----------------------------------------------------------------
// Temporary for easy layout testing at /nanodegrees/<ndkey>/search
// TODO: (dcwither) remove before release
export const Test = renameProp('nanodegree', 'root')(Search);

Search.defaultProps = {
  trackSearchFlow: _.noop,
};

// ----------------------------------------------------------------
