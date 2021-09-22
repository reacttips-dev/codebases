import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Search from 'bundles/catalogP/models/search';

const SearchCollection = CatalogCollection.extend({
  model: Search,
  resourceName: 'search.v1',
});

export default SearchCollection;
