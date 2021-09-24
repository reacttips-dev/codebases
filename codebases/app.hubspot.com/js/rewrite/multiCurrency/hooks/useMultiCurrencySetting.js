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
export var MultiCurrencyFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"MultiCurrencyFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"HomeCurrency\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currencyCode\"}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "MultiCurrencyFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "HomeCurrency"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "currencyCode"
        }
      }]
    }
  }]
});
export var MultiCurrencyQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"MultiCurrencyQuery\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"homeCurrency\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"MultiCurrencyFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "MultiCurrencyQuery"
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "homeCurrency"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "MultiCurrencyFragment"
            }
          }]
        }
      }]
    }
  }].concat(MultiCurrencyFragment.definitions))
});
export var useMultiCurrencySetting = function useMultiCurrencySetting() {
  var _useQuery = useQuery(MultiCurrencyQuery, {
    fetchPolicy: 'cache-only'
  }),
      data = _useQuery.data;

  var setting = get('homeCurrency', data);
  invariant(Boolean(setting), 'useMultiCurrencySetting:\nhomeCurrency was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', setting, data);
  return setting;
};