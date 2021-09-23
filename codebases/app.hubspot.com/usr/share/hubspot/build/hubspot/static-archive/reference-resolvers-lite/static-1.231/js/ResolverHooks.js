'use es6';

export var useFetchAllResolver = function useFetchAllResolver(resolver) {
  var useFetchQuery = resolver.useFetchQuery;

  var _useFetchQuery = useFetchQuery(resolver),
      status = _useFetchQuery.status,
      error = _useFetchQuery.error,
      data = _useFetchQuery.data;

  return {
    status: status,
    error: error,
    references: data
  };
};
export var useFetchResolver = function useFetchResolver(resolver, id) {
  var useFetchQuery = resolver.useFetchQuery;

  var _useFetchQuery2 = useFetchQuery(resolver, id),
      status = _useFetchQuery2.status,
      error = _useFetchQuery2.error,
      data = _useFetchQuery2.data;

  return {
    status: status,
    error: error,
    reference: data
  };
};
export var usePagedSearchResolver = function usePagedSearchResolver(resolver, query) {
  var useSearchQuery = resolver.useSearchQuery;

  var _useSearchQuery = useSearchQuery(resolver, query),
      status = _useSearchQuery.status,
      error = _useSearchQuery.error,
      data = _useSearchQuery.data;

  return {
    status: status,
    error: error,
    results: data
  };
};