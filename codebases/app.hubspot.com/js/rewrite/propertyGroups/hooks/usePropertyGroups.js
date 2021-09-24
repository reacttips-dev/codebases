'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

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

import { OrderedMap } from 'immutable';
import { useQuery } from '@apollo/client';
import memoizeOne from 'react-utils/memoizeOne';
import set from 'transmute/set';
import get from 'transmute/get';
import invariant from 'react-utils/invariant';
import PropertyGroupRecord from 'customer-data-objects/property/PropertyGroupRecord';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var PropertyGroupFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"PropertyGroupFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"PropertyGroup\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"displayOrder\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hubspotDefined\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"label\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "PropertyGroupFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "PropertyGroup"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "displayOrder"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "hubspotDefined"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "label"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "name"
        }
      }]
    }
  }]
});
export var PropertyGroupsQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"PropertyGroupsQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allPropertyGroups\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"PropertyGroupFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "PropertyGroupsQuery"
    },
    variableDefinitions: [{
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
        name: {
          kind: "Name",
          value: "allPropertyGroups"
        },
        arguments: [{
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
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "PropertyGroupFragment"
            }
          }]
        }
      }]
    }
  }].concat(PropertyGroupFragment.definitions))
});
export var parseGroupsToLegacyFormat = memoizeOne(function (groups) {
  return _toConsumableArray(groups).sort(function (a, b) {
    return a.displayOrder - b.displayOrder;
  }).map(function (_ref) {
    var displayOrder = _ref.displayOrder,
        hubspotDefined = _ref.hubspotDefined,
        displayName = _ref.label,
        name = _ref.name;
    return PropertyGroupRecord.fromJS({
      displayOrder: displayOrder,
      hubspotDefined: hubspotDefined,
      displayName: displayName,
      name: name
    });
  }).reduce(function (groupsMap, group) {
    return set(group.name, group, groupsMap);
  }, OrderedMap());
});
export var usePropertyGroups = function usePropertyGroups() {
  var objectTypeId = useSelectedObjectTypeId();

  var _useQuery = useQuery(PropertyGroupsQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      objectTypeId: objectTypeId
    }
  }),
      data = _useQuery.data;

  var allPropertyGroups = get('allPropertyGroups', data);
  invariant(Boolean(allPropertyGroups), 'usePropertyGroups:\nallPropertyGroups was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', allPropertyGroups, data);
  return parseGroupsToLegacyFormat(allPropertyGroups);
};