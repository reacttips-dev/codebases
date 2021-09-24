'use es6';

var FETCH_ARGS = ['id'];
var SEARCH_ARGS = ['query', 'count', 'offset'];

var byIdFetcher = function byIdFetcher(byId) {
  return function (_ref) {
    var id = _ref.id;
    return byId(id);
  };
};

export var makeDataFetchingClientFetchAllQuery = function makeDataFetchingClientFetchAllQuery(_ref2) {
  var all = _ref2.api.all,
      _ref2$dfc = _ref2.dfc,
      args = _ref2$dfc.args,
      fieldName = _ref2$dfc.fieldName,
      registerQuery = _ref2$dfc.registerQuery;
  return registerQuery({
    fieldName: fieldName,
    args: args || [],
    fetcher: all
  });
};
export var makeDataFetchingClientFetchQuery = function makeDataFetchingClientFetchQuery(_ref3) {
  var byId = _ref3.api.byId,
      _ref3$dfc = _ref3.dfc,
      args = _ref3$dfc.args,
      fieldName = _ref3$dfc.fieldName,
      registerQuery = _ref3$dfc.registerQuery;
  return registerQuery({
    fieldName: fieldName,
    args: args || FETCH_ARGS,
    fetcher: byIdFetcher(byId)
  });
};
export var makeDataFetchingClientSearchQuery = function makeDataFetchingClientSearchQuery(_ref4) {
  var search = _ref4.api.search,
      _ref4$dfc = _ref4.dfc,
      args = _ref4$dfc.args,
      fieldName = _ref4$dfc.fieldName,
      registerQuery = _ref4$dfc.registerQuery;
  return registerQuery({
    fieldName: fieldName,
    args: args || SEARCH_ARGS,
    fetcher: search
  });
};