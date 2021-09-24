'use es6';

import { useSearchQuery } from '../../searchQuery/hooks/useSearchQuery';
import { useQuery } from '@apollo/client';
import getIn from 'transmute/getIn';
export var PermissionsQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"PermissionsQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"FilterGroup\"}}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"}},\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Sort\"}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"}},\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"editQuery\"},\"name\":{\"kind\":\"Name\",\"value\":\"crmObjectsSearch\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"requestAction\"},\"value\":{\"kind\":\"EnumValue\",\"value\":\"EDIT\"}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"count\"},\"value\":{\"kind\":\"IntValue\",\"value\":\"0\"}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"offset\"},\"value\":{\"kind\":\"IntValue\",\"value\":\"0\"}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"total\"}}]}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"deleteQuery\"},\"name\":{\"kind\":\"Name\",\"value\":\"crmObjectsSearch\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"requestAction\"},\"value\":{\"kind\":\"EnumValue\",\"value\":\"DELETE\"}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"filterGroups\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"sorts\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"query\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"count\"},\"value\":{\"kind\":\"IntValue\",\"value\":\"0\"}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"offset\"},\"value\":{\"kind\":\"IntValue\",\"value\":\"0\"}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"total\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: [{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "PermissionsQuery"
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
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        alias: {
          kind: "Name",
          value: "editQuery"
        },
        name: {
          kind: "Name",
          value: "crmObjectsSearch"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "requestAction"
          },
          value: {
            kind: "EnumValue",
            value: "EDIT"
          }
        }, {
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
            kind: "IntValue",
            value: "0"
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "offset"
          },
          value: {
            kind: "IntValue",
            value: "0"
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
          }]
        }
      }, {
        kind: "Field",
        alias: {
          kind: "Name",
          value: "deleteQuery"
        },
        name: {
          kind: "Name",
          value: "crmObjectsSearch"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "requestAction"
          },
          value: {
            kind: "EnumValue",
            value: "DELETE"
          }
        }, {
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
            kind: "IntValue",
            value: "0"
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "offset"
          },
          value: {
            kind: "IntValue",
            value: "0"
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
          }]
        }
      }]
    }
  }]
});
export var useCanUserEditEntireQuery = function useCanUserEditEntireQuery(_ref) {
  var skip = _ref.skip,
      count = _ref.count;
  var query = useSearchQuery();

  var _useQuery = useQuery(PermissionsQuery, {
    skip: skip,
    fetchPolicy: 'cache-and-network',
    variables: {
      filterGroups: query.filterGroups,
      sorts: query.sorts,
      query: query.query,
      objectTypeId: query.objectTypeId
    }
  }),
      data = _useQuery.data,
      loading = _useQuery.loading,
      error = _useQuery.error;

  var editTotal = getIn(['editQuery', 'total'], data);
  var deleteTotal = getIn(['deleteQuery', 'total'], data);
  return {
    // If loading, disable buttons.
    // If error, fail open - the backend will enforce permissions in this case, FE enforcement is always just best-effort.
    // In all other cases, compare counts to confirm the user can edit as many objects as they can view.
    canEditQuery: !loading && (Boolean(error) || editTotal === count),
    canDeleteQuery: !loading && (Boolean(error) || deleteTotal === count)
  };
};