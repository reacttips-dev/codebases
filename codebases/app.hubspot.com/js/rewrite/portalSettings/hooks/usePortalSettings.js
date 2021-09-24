'use es6';

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

import { useQuery } from '@apollo/client';
import get from 'transmute/get';
import invariant from 'react-utils/invariant';
import { getPortalSettingsToFetch } from '../constants/PortalSettingsKeys';
export var PortalSettingsFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"PortalSettingsFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"HubSettingValue\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "PortalSettingsFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "HubSettingValue"
      }
    },
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
  }]
});
export var PortalSettingsQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"PortalSettingsQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"portalSettingsKeys\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hubSettingValues\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"portalSettingsKeys\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"PortalSettingsFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "PortalSettingsQuery"
    },
    variableDefinitions: [{
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "portalSettingsKeys"
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
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "hubSettingValues"
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
              value: "portalSettingsKeys"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "PortalSettingsFragment"
            }
          }]
        }
      }]
    }
  }].concat(PortalSettingsFragment.definitions))
});
export var usePortalSettings = function usePortalSettings() {
  var _useQuery = useQuery(PortalSettingsQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      portalSettingsKeys: getPortalSettingsToFetch()
    }
  }),
      data = _useQuery.data;

  var rawSettings = get('hubSettingValues', data);
  invariant(Boolean(rawSettings), 'usePortalSettings:hubSettingValues was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', rawSettings, data);
  return rawSettings;
};