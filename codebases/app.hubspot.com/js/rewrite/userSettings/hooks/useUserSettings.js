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
import PortalIdParser from 'PortalIdParser';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getUserSettingsToFetch } from '../constants/UserSettingsKeys';
var portalId = PortalIdParser.get();
export var UserSettingsFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"UserSettingsFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"UserAttributeValue\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"key\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "UserSettingsFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "UserAttributeValue"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "key"
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
export var UserSettingsQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"UserSettingsQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"userSettingsKeys\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userAttributeValues\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"keys\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"userSettingsKeys\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"UserSettingsFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "UserSettingsQuery"
    },
    variableDefinitions: [{
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "userSettingsKeys"
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
          value: "userAttributeValues"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "keys"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "userSettingsKeys"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "UserSettingsFragment"
            }
          }]
        }
      }]
    }
  }].concat(UserSettingsFragment.definitions))
});
export var useUserSettings = function useUserSettings() {
  var objectTypeId = useSelectedObjectTypeId();

  var _useQuery = useQuery(UserSettingsQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      userSettingsKeys: getUserSettingsToFetch(objectTypeId, portalId)
    }
  }),
      data = _useQuery.data;

  var rawSettings = get('userAttributeValues', data);
  invariant(Boolean(rawSettings), 'useUserSettings:userAttributeValues was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', rawSettings, data);
  return rawSettings;
};