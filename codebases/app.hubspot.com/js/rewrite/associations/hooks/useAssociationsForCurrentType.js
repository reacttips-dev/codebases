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

import { associationDefinitionsDep } from '../../../associations/deps/associationDefinitionsDep';
import { useStoreDependency } from 'general-store';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import invariant from 'react-utils/invariant';
import { useObjectTypeDefinitions } from '../../../crmObjects/hooks/useObjectTypeDefinitions';
import get from 'transmute/get';
import keyBy from '../../../utils/keyBy';
import { makeAssociationId } from '../utils/associationIdUtils';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import memoizeOne from 'react-utils/memoizeOne';
export var AssociationDefinitionsFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"AssociationDefinitionsFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"AssociationDefinition\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationCategory\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"cardinality\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"fromObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasAllAssociatedObjects\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"inverseAssociationTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"isPrimary\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"label\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"metaTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"},\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"singularForm\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"fromObjectTypeDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"metaTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"},\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"singularForm\"}}]}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "AssociationDefinitionsFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "AssociationDefinition"
      }
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "associationCategory"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "associationTypeId"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "cardinality"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "fromObjectTypeId"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "hasAllAssociatedObjects"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "inverseAssociationTypeId"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "isPrimary"
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
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "toObjectTypeId"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "toObjectTypeDefinition"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "metaTypeId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "name"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "id"
            }
          }, {
            kind: "Field",
            alias: {
              kind: "Name",
              value: "objectTypeId"
            },
            name: {
              kind: "Name",
              value: "id"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "pluralForm"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "primaryDisplayLabelPropertyName"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "singularForm"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "fromObjectTypeDefinition"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "metaTypeId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "name"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "id"
            }
          }, {
            kind: "Field",
            alias: {
              kind: "Name",
              value: "objectTypeId"
            },
            name: {
              kind: "Name",
              value: "id"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "pluralForm"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "primaryDisplayLabelPropertyName"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "singularForm"
            }
          }]
        }
      }]
    }
  }]
});
export var AssociationDefinitionsQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"AssociationDefinitionsQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allAssociationTypesFromObjectType\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectType\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"AssociationDefinitionsFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "AssociationDefinitionsQuery"
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
          value: "allAssociationTypesFromObjectType"
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
              value: "AssociationDefinitionsFragment"
            }
          }]
        }
      }]
    }
  }].concat(AssociationDefinitionsFragment.definitions))
});
export var generateAssociationData = memoizeOne(function (associationDefs) {
  return keyBy(makeAssociationId, associationDefs);
});
export var useAssociationsForCurrentType = function useAssociationsForCurrentType() {
  var isRewriteEnabled = useIsRewriteEnabled();
  var objectTypeId = useSelectedObjectTypeId();

  if (isRewriteEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _useQuery = useQuery(AssociationDefinitionsQuery, {
      variables: {
        objectTypeId: objectTypeId
      },
      fetchPolicy: 'cache-only'
    }),
        data = _useQuery.data;

    var associationDefs = get('allAssociationTypesFromObjectType', data);
    invariant(Boolean(associationDefs), 'useAssociationsForSelectedObject:\nAssociations was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', associationDefs); // eslint-disable-next-line react-hooks/rules-of-hooks

    return generateAssociationData(associationDefs);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  var associations = useStoreDependency(associationDefinitionsDep, objectTypeId); // eslint-disable-next-line react-hooks/rules-of-hooks

  var objectTypeDefinitions = useObjectTypeDefinitions(); // Some context here, we expect all association definitions to be fetched and
  // populated in the store at the root of the app in IndexLoaderHelper and
  // friends because they are required to parse the view columns in the startup
  // code. Since this code will very rapidly be removed with the release of IKEA
  // making this assumption allows all the consuming code to act like it would
  // in IKEA (where data is available synchronously from the data store) which
  // saves us a lot of complexity.

  invariant(!isLoading(associations), 'Associations must be fetched at the root of the app'); // GraphQL gives us all this data merged together and it's a lot easier to work
  // with so we're replicating it here so we can use the nicer format in the new
  // code.
  // This will be going away soon so I don't mind the extra complexity.
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return useMemo(function () {
    return Object.keys(associations).reduce(function (acc, associationId) {
      var associationDefinition = associations[associationId];
      var toObjectTypeDefinition = get(associationDefinition.toObjectTypeId, objectTypeDefinitions);
      var fromObjectTypeDefinition = get(associationDefinition.fromObjectTypeId, objectTypeDefinitions);

      if (!toObjectTypeDefinition || !fromObjectTypeDefinition) {
        return acc;
      }

      acc[associationId] = Object.assign({}, associationDefinition, {
        toObjectTypeDefinition: {
          metaTypeId: toObjectTypeDefinition.metaTypeId,
          name: toObjectTypeDefinition.name,
          objectTypeId: toObjectTypeDefinition.objectTypeId,
          pluralForm: toObjectTypeDefinition.pluralForm,
          primaryDisplayLabelPropertyName: toObjectTypeDefinition.primaryDisplayLabelPropertyName,
          singularForm: toObjectTypeDefinition.singularForm
        },
        fromObjectTypeDefinition: {
          metaTypeId: fromObjectTypeDefinition.metaTypeId,
          name: fromObjectTypeDefinition.name,
          objectTypeId: fromObjectTypeDefinition.objectTypeId,
          pluralForm: fromObjectTypeDefinition.pluralForm,
          primaryDisplayLabelPropertyName: fromObjectTypeDefinition.primaryDisplayLabelPropertyName,
          singularForm: fromObjectTypeDefinition.singularForm
        }
      });
      return acc;
    }, {});
  }, [associations, objectTypeDefinitions]);
};