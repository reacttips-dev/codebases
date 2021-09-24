'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

var _unique = function _unique(definitions) {
  var names = {};
  return definitions.filter(function (definition) {
    if (definition.kind !== 'FragmentDefinition') {
      return true;
    }

    var name = definition.name.value;

    if (names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  });
};

import { useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { javascriptErrorFromValidationErrors } from '../errors/javascriptErrorFromValidationErrors';
import { useVisibilityChange } from '../../../crm_ui/hooks/useVisibilityChange';
import { rewriteObjectPropertiesAsMap } from '../utils/rewriteObjectPropertiesAsMap';
export var CrmObjectFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"CrmObjectFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"CrmObject\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"objectId\"},\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userPermissions\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanEdit\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanDelete\"}}]}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "CrmObjectFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "CrmObject"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "id"
        }
      }, {
        kind: "Field",
        alias: {
          kind: "Name",
          value: "objectId"
        },
        name: {
          kind: "Name",
          value: "id"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "properties"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "names"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "properties"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "name"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "value"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "userPermissions"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "currentUserCanEdit"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "currentUserCanDelete"
            }
          }]
        }
      }]
    }
  }]
});
export var CrmIndexSearchQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"CrmIndexSearchQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"FilterGroup\"}}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"}},\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Sort\"}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"}},\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"count\"}},\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Int\"}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"offset\"}},\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Int\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"crmObjectsSearch\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"count\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"count\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"offset\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"offset\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"total\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"offset\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"results\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"CrmObjectFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"validationErrors\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"__typename\"}},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"GenericValidationError\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"message\"}}]}}]}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "CrmIndexSearchQuery"
    },
    variableDefinitions: [{
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "filterGroups"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "ListType",
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "FilterGroup"
              }
            }
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "sorts"
        }
      },
      type: {
        kind: "ListType",
        type: {
          kind: "NonNullType",
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Sort"
            }
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "query"
        }
      },
      type: {
        kind: "NamedType",
        name: {
          kind: "Name",
          value: "String"
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "objectTypeId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "String"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "properties"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "ListType",
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String"
              }
            }
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "count"
        }
      },
      type: {
        kind: "NamedType",
        name: {
          kind: "Name",
          value: "Int"
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "offset"
        }
      },
      type: {
        kind: "NamedType",
        name: {
          kind: "Name",
          value: "Int"
        }
      }
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "crmObjectsSearch"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "filterGroups"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "filterGroups"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "sorts"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "sorts"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "query"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "query"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "type"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "objectTypeId"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "count"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "count"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "offset"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "offset"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "total"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "offset"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "results"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "FragmentSpread",
                name: {
                  kind: "Name",
                  value: "CrmObjectFragment"
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "validationErrors"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "__typename"
                }
              }, {
                kind: "InlineFragment",
                typeCondition: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "GenericValidationError"
                  }
                },
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "message"
                    }
                  }]
                }
              }]
            }
          }]
        }
      }]
    }
  }].concat(CrmObjectFragment.definitions))
});
/**
 * Given a CrmSearch query, fetches results for the query via GraphQL.
 *
 * `useCrmSearchQuery` is a thin wrapper around Apollo's `useQuery`;
 * all options supported by `useQuery` are accepted, and all results
 * from `useQuery` are returned.
 *
 * @see {@link https://www.apollographql.com/docs/react/data/queries/#usequery-api|useQuery API}
 *     for the full list of options available to pass to the hook, and for the returned values
 *
 * @example
 * const { loading, error, data } = useCrmSearchQuery({
 *   sorts: [{ property: 'hs_createdate', order: 'ASC' }],
 *   requestOptions: {
 *     properties: ['name', 'hs_createdate'],
 *   },
 *   query: 'hello',
 *   offset: 0,
 *   count: 25,
 *   filterGroups: [
 *     {
 *       filters: [
 *         {
 *           "property": "name",
 *           "operator": "EQ",
 *           "value": "test"
 *         }
 *       ],
 *     }
 *   ],
 *   objectTypeId: '2-123',
 * });
 *
 * if (loading) {
 *   return <UILoadingSpinner />;
 * }
 *
 * if (error) {
 *   return <UIErrorMessage />;
 * }
 *
 * return data.results.map(result => ...);
 */

export var useCrmSearchQuery = function useCrmSearchQuery(query) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref$fetchPolicy = _ref.fetchPolicy,
      fetchPolicy = _ref$fetchPolicy === void 0 ? 'cache-and-network' : _ref$fetchPolicy,
      _ref$nextFetchPolicy = _ref.nextFetchPolicy,
      nextFetchPolicy = _ref$nextFetchPolicy === void 0 ? 'cache-first' : _ref$nextFetchPolicy,
      apolloOptions = _objectWithoutProperties(_ref, ["fetchPolicy", "nextFetchPolicy"]);

  var count = query.count,
      filterGroups = query.filterGroups,
      objectTypeId = query.objectTypeId,
      offset = query.offset,
      searchQuery = query.query,
      _query$requestOptions = query.requestOptions,
      requestOptions = _query$requestOptions === void 0 ? {
    properties: []
  } : _query$requestOptions,
      sorts = query.sorts;

  var _useQuery = useQuery(CrmIndexSearchQuery, Object.assign({}, apolloOptions, {
    fetchPolicy: fetchPolicy,
    nextFetchPolicy: nextFetchPolicy,
    variables: {
      count: count,
      filterGroups: filterGroups,
      objectTypeId: objectTypeId,
      offset: offset,
      properties: requestOptions.properties,
      query: searchQuery,
      sorts: sorts
    }
  })),
      rawError = _useQuery.error,
      rawLoading = _useQuery.loading,
      rawData = _useQuery.data,
      rest = _objectWithoutProperties(_useQuery, ["error", "loading", "data"]); // This ensures we return loading: false when apollo reports loading: true but also provides data.
  // This can occur when a refresh of the current query is triggered for any reason (such as polling).
  // It simply means that there is data that matches the current query in the cache and apollo is
  // refreshing the current query in the background. In these cases we do not want to render a
  // loading spinner, as we have valid data to show.


  var loading = rawLoading && !rawData;
  var timeHiddenRef = useRef(0);
  var pollInterval = apolloOptions.pollInterval;
  var stopPolling = rest.stopPolling,
      startPolling = rest.startPolling,
      refetch = rest.refetch;
  var handlePageVisible = useCallback(function () {
    var timeSinceHidden = Date.now() - timeHiddenRef.current;
    var shouldRefetch = pollInterval && timeSinceHidden >= pollInterval;

    if (shouldRefetch) {
      refetch();
    }

    startPolling(pollInterval);
  }, [pollInterval, refetch, startPolling]);
  var handlePageHidden = useCallback(function () {
    timeHiddenRef.current = Date.now();
    stopPolling();
  }, [stopPolling]);
  useVisibilityChange({
    enabled: pollInterval > 0,
    onVisible: handlePageVisible,
    onHidden: handlePageHidden
  });
  var data = useMemo(function () {
    if (!rawData || !rawData.crmObjectsSearch) {
      return rawData;
    } // HACK: Without this shallow copy we end up mutating the apollo cache and breaking
    // subsequent rerenders. Please do not remove!


    var searchData = Object.assign({}, rawData.crmObjectsSearch);

    if (Object.prototype.hasOwnProperty.call(searchData, 'results')) {
      searchData.results = searchData.results.map(rewriteObjectPropertiesAsMap);
    }

    return searchData;
  }, [rawData]);
  var error = useMemo(function () {
    if (rawError) {
      rawError.status = 500;
      rawError.responseJSON = Object.assign({}, rawError);
      return rawError;
    }

    var validationErrors = rawData && rawData.crmObjectsSearch && rawData.crmObjectsSearch.validationErrors;
    return javascriptErrorFromValidationErrors(validationErrors);
  }, [rawData, rawError]);
  return Object.assign({
    loading: loading,
    error: error,
    data: data
  }, rest);
};