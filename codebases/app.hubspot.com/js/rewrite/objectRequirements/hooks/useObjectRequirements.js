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

import invariant from 'react-utils/invariant';
import getIn from 'transmute/getIn';
import { useQuery } from '@apollo/client';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var RequirementsFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"RequirementsFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"HydratedObjectRequirements\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"requirements\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"displayOrder\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasPipeline\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineStageId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"required\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"requirementIdentifier\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"requirementType\"}}]}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "RequirementsFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "HydratedObjectRequirements"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "requirements"
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
              value: "hasPipeline"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "id"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "pipelineId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "pipelineStageId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "required"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "requirementIdentifier"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "requirementType"
            }
          }]
        }
      }]
    }
  }]
});
export var ObjectRequirementsQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"ObjectRequirementsQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allCrmObjectRequirements\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"RequirementsFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "ObjectRequirementsQuery"
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
          value: "allCrmObjectRequirements"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "objectTypeId"
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
              value: "RequirementsFragment"
            }
          }]
        }
      }]
    }
  }].concat(RequirementsFragment.definitions))
}); // NOTE: This will not return default object requirements for standard objects. Pipeline/stage-based requirements
// work as expected. See https://git.hubteam.com/HubSpot/CRM/pull/26997#discussion_r1367671

export var useObjectRequirements = function useObjectRequirements() {
  var objectTypeId = useSelectedObjectTypeId();

  var _useQuery = useQuery(ObjectRequirementsQuery, {
    fetchPolicy: 'cache-only',
    variables: {
      objectTypeId: objectTypeId
    }
  }),
      data = _useQuery.data;

  var requirements = getIn(['allCrmObjectRequirements', 'requirements'], data);
  invariant(Boolean(requirements), 'useObjectRequirements:\nObject requirements was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', requirements, data);
  return requirements;
};