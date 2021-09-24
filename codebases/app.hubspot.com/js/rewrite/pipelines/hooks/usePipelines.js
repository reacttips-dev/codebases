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

import get from 'transmute/get';
import invariant from 'react-utils/invariant';
import { useQuery } from '@apollo/client';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var PipelineFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"PipelineFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Pipeline\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"label\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"displayOrder\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"permission\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"accessLevel\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"stages\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"label\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"stageId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"metadata\"}}]}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "PipelineFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "Pipeline"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "pipelineId"
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
          value: "displayOrder"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "permission"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "accessLevel"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "stages"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "label"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "stageId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "metadata"
            }
          }]
        }
      }]
    }
  }]
});
export var PipelinesQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"Pipelines\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allPipelines\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectType\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"PipelineFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "Pipelines"
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
          value: "allPipelines"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "objectType"
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
              value: "PipelineFragment"
            }
          }]
        }
      }]
    }
  }].concat(PipelineFragment.definitions))
});
export var usePipelines = function usePipelines() {
  var objectTypeId = useSelectedObjectTypeId();

  var _useQuery = useQuery(PipelinesQuery, {
    variables: {
      objectTypeId: objectTypeId
    },
    fetchPolicy: 'cache-only'
  }),
      data = _useQuery.data;

  var allPipelines = get('allPipelines', data);
  invariant(Boolean(allPipelines), 'usePipelines:\nallPipelines was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', allPipelines, data);
  return allPipelines;
};