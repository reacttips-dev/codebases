import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, createContext } from 'react';
import { useQuery as useApolloQuery, useMutation as useApolloMutation, useLazyQuery as useLazyApolloQuery, ApolloLink, ApolloClient, InMemoryCache, fromPromise } from '@apollo/client';
var DataFetchingClientContext = /*#__PURE__*/createContext({});

function useDataFetchingClient() {
  var _useContext = useContext(DataFetchingClientContext),
      client = _useContext.client; // @ts-expect-error process is declared in webpack-env, but doesn't impact this module's type externally so we can leave it out


  if (process.env.NODE_ENV !== 'production') {
    if (!client) {
      throw new Error('Cannot find context. Did you forget to configure `DataFetchingClientProvider`');
    }
  }

  return client;
}

function DataFetchingClientProvider(_ref) {
  var client = _ref.client,
      children = _ref.children;
  return /*#__PURE__*/_jsx(DataFetchingClientContext.Provider, {
    value: {
      client: client
    },
    children: children
  });
} // See https://spec.graphql.org/June2018/#sec-Names


var isValidGraphQLName = function isValidGraphQLName(str) {
  return typeof str === 'string' && /^[_A-Za-z][_0-9A-Za-z]+$/.test(str);
}; // eslint-disable-next-line no-restricted-globals


var registeredQueries = new WeakMap();

var DataFetchingClientLink = /*#__PURE__*/function (_ApolloLink) {
  _inherits(DataFetchingClientLink, _ApolloLink);

  function DataFetchingClientLink(_ref2) {
    var _this;

    var client = _ref2.client;

    _classCallCheck(this, DataFetchingClientLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataFetchingClientLink).call(this));
    _this.client = client;
    return _this;
  }

  _createClass(DataFetchingClientLink, [{
    key: "request",
    value: function request(_ref3) {
      var variables = _ref3.variables,
          query = _ref3.query;
      var fieldDef = registeredQueries.get(query);

      if (!fieldDef) {
        throw new Error('`data-fetching-client` only supports queries created with `registerQuery` or `registerMutation`.');
      }

      var fetcher = fieldDef.fetcher,
          fieldName = fieldDef.fieldName;
      return fromPromise(Promise.resolve(fetcher(variables, {
        client: this.client
      }))).map(function (result) {
        return {
          data: _defineProperty({}, fieldName, result)
        };
      });
    }
  }]);

  return DataFetchingClientLink;
}(ApolloLink);

var DataFetchingClient = /*#__PURE__*/function (_ApolloClient) {
  _inherits(DataFetchingClient, _ApolloClient);

  function DataFetchingClient() {
    var _this2;

    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        queryFieldPolicies = _ref4.queryFieldPolicies;

    _classCallCheck(this, DataFetchingClient);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DataFetchingClient).call(this, {
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: Object.assign({}, queryFieldPolicies)
          }
        },
        addTypename: false
      })
    }));

    _this2.setLink(new DataFetchingClientLink({
      client: _assertThisInitialized(_this2)
    })); // @ts-expect-error process is declared in webpack-env, but doesn't impact this module's type externally so we can leave it out


    if (process.env.NODE_ENV !== 'production') {
      window.__DATA_FETCHING_CLIENT__ = _assertThisInitialized(_this2);
    }

    return _this2;
  }

  return DataFetchingClient;
}(ApolloClient);

function registerOperation(operation, _ref5) {
  var fieldName = _ref5.fieldName,
      _ref5$args = _ref5.args,
      args = _ref5$args === void 0 ? [] : _ref5$args,
      fetcher = _ref5.fetcher;

  // @ts-expect-error process is declared in webpack-env, but doesn't impact this module's type externally so we can leave it out
  if (process.env.NODE_ENV !== 'production') {
    if (!isValidGraphQLName(fieldName)) {
      throw new Error("\"" + fieldName + "\" is not a valid GraphQL Name and cannot be used as `fieldName`. https://spec.graphql.org/June2018/#sec-Names");
    }

    args.forEach(function (arg) {
      if (!isValidGraphQLName(arg)) {
        throw new Error("\"" + arg + "\" is not a valid GraphQL Name and cannot be used in `args`. https://spec.graphql.org/June2018/#sec-Names");
      }
    });
  }

  var query = {
    kind: 'Document',
    definitions: [{
      kind: 'OperationDefinition',
      operation: operation,
      name: {
        kind: 'Name',
        value: fieldName
      },
      variableDefinitions: args.map(function (arg) {
        return {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: {
              kind: 'Name',
              value: arg
            }
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'JSON'
            }
          }
        };
      }),
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{
          kind: 'Field',
          name: {
            kind: 'Name',
            value: fieldName
          },
          directives: typeof fetcher === 'undefined' ? [{
            kind: 'Directive',
            name: {
              kind: 'Name',
              value: 'client'
            }
          }] : [],
          arguments: args.map(function (arg) {
            return {
              kind: 'Argument',
              name: {
                kind: 'Name',
                value: arg
              },
              value: {
                kind: 'Variable',
                name: {
                  kind: 'Name',
                  value: arg
                }
              }
            };
          })
        }]
      }
    }]
  };
  registeredQueries.set(query, {
    fetcher: fetcher,
    fieldName: fieldName
  });
  return query;
}

function registerQuery(options) {
  return registerOperation('query', options);
}

function registerMutation(options) {
  return registerOperation('mutation', options);
}

function useQuery(query, options) {
  var _useContext2 = useContext(DataFetchingClientContext),
      client = _useContext2.client;

  return useApolloQuery(query, Object.assign({
    client: client
  }, options));
}

function useLazyQuery(query, options) {
  var _useContext3 = useContext(DataFetchingClientContext),
      client = _useContext3.client;

  return useLazyApolloQuery(query, Object.assign({
    client: client
  }, options));
}

function useMutation(query, options) {
  var _useContext4 = useContext(DataFetchingClientContext),
      client = _useContext4.client;

  return useApolloMutation(query, Object.assign({
    client: client
  }, options));
}

export { DataFetchingClientProvider, DataFetchingClient, registerQuery, registerMutation, useDataFetchingClient, useQuery, useLazyQuery, useMutation };