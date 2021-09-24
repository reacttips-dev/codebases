'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import missingFunction from './lib/missingFunction';

var toDfcResolverConfig = function toDfcResolverConfig() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var __registerQuery = _ref.registerQuery,
      __useDataFetchingClientFetchAllResolver = _ref.useDataFetchingClientFetchAllResolver,
      __useDataFetchingClientFetchResolver = _ref.useDataFetchingClientFetchResolver,
      __useDataFetchingClientSearchResolver = _ref.useDataFetchingClientSearchResolver,
      rest = _objectWithoutProperties(_ref, ["registerQuery", "useDataFetchingClientFetchAllResolver", "useDataFetchingClientFetchResolver", "useDataFetchingClientSearchResolver"]);

  return rest;
};

var toGqlResolverConfig = function toGqlResolverConfig() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var __useGraphQLFetchResolver = _ref2.useGraphQLFetchResolver,
      __useGraphQLSearchResolver = _ref2.useGraphQLSearchResolver,
      rest = _objectWithoutProperties(_ref2, ["useGraphQLFetchResolver", "useGraphQLSearchResolver"]);

  return rest;
};

var ReferenceResolver = {
  queryKey: null,
  useFetchQuery: null,
  useSearchQuery: null,
  api: {
    all: missingFunction,
    byId: missingFunction,
    search: missingFunction,
    refreshCache: missingFunction
  },
  dfc: {
    args: [],
    fieldName: null,
    fetchQueryOptions: {},
    searchQueryOptions: {},
    fetchQuery: null,
    searchQuery: null
  },
  gql: {
    fetchVariables: {},
    searchVariables: {},
    fetchQuery: null,
    searchQuery: null
  },
  toString: missingFunction
};
export var makeReferenceResolver = function makeReferenceResolver(definition) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ReferenceResolver';

  var api = definition.api,
      dfc = definition.dfc,
      gql = definition.gql,
      rest = _objectWithoutProperties(definition, ["api", "dfc", "gql"]);

  var resolver = Object.assign({}, ReferenceResolver, {}, rest, {
    api: Object.assign({}, ReferenceResolver.api, {}, api),
    dfc: Object.assign({}, ReferenceResolver.dfc, {}, toDfcResolverConfig(dfc)),
    gql: Object.assign({}, ReferenceResolver.gql, {}, toGqlResolverConfig(gql)),
    name: name + "_" + definition.queryKey,
    toString: function toString() {
      return this.name;
    }
  });

  if (!dfc) {
    delete resolver.dfc;
  }

  if (!gql) {
    delete resolver.gql;
  }

  return resolver;
};