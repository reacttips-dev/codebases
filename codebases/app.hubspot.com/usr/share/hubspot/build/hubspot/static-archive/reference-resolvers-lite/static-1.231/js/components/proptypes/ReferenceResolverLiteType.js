'use es6';

import PropTypes from 'prop-types';
var ReferenceResolverLiteType = PropTypes.shape({
  queryKey: PropTypes.string.isRequired,
  useFetchQuery: PropTypes.func.isRequired,
  useSearchQuery: PropTypes.func.isRequired,
  api: PropTypes.shape({
    all: PropTypes.func,
    byId: PropTypes.func.isRequired,
    search: PropTypes.func,
    refreshCache: PropTypes.func.isRequired
  }).isRequired,
  dfc: PropTypes.shape({
    args: PropTypes.array,
    fieldName: PropTypes.string,
    fetchQueryOptions: PropTypes.object,
    searchQueryOptions: PropTypes.object,
    fetchQuery: PropTypes.object,
    searchQuery: PropTypes.object
  }),
  gql: PropTypes.shape({
    fetchVariables: PropTypes.object,
    searchVariables: PropTypes.object,
    fetchQuery: PropTypes.object,
    searchQuery: PropTypes.object
  }),
  toString: PropTypes.func.isRequired
});
export default ReferenceResolverLiteType;