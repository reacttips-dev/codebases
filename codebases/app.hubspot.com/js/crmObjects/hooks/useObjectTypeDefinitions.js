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

import { Map as ImmutableMap } from 'immutable';
import { useStoreDependency } from 'general-store';
import { crmObjectDefinitionsDep } from '../deps/crmObjectDefinitionsDep';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import get from 'transmute/get';
import { CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import memoizeOne from 'react-utils/memoizeOne';
import { useQuery } from '@apollo/client';
import { CrmObjectTypeRecord } from 'crm_data/crmObjectTypes/CrmObjectTypeRecords';
import invariant from 'react-utils/invariant';
export var ObjectTypeDefinitionFragment = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"FragmentDefinition\",\"name\":{\"kind\":\"Name\",\"value\":\"ObjectTypeDefinitionFragment\"},\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"ObjectTypeDefinition\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"metaTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"isRestorable\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"},\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"singularForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"accessScopeName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"createDatePropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"defaultSearchPropertyNames\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasPipelines\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"lastModifiedPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"permissioningType\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineCloseDatePropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelinePropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineStagePropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineTimeToClosePropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"readScopeName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"requiredProperties\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"scopeMappings\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"accessLevel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"requestAction\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"scopeName\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabelPropertyNames\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"writeScopeName\"}}]}}]}", {
  kind: "Document",
  definitions: [{
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: "ObjectTypeDefinitionFragment"
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: "ObjectTypeDefinition"
      }
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
          value: "isRestorable"
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
          value: "singularForm"
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
          value: "accessScopeName"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "createDatePropertyName"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "defaultSearchPropertyNames"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "hasPipelines"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "lastModifiedPropertyName"
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
          value: "permissioningType"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "pipelineCloseDatePropertyName"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "pipelinePropertyName"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "pipelineStagePropertyName"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "pipelineTimeToClosePropertyName"
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
          value: "readScopeName"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "requiredProperties"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "scopeMappings"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "accessLevel"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "requestAction"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "scopeName"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "secondaryDisplayLabelPropertyNames"
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "writeScopeName"
        }
      }]
    }
  }]
});
var ObjectTypeDefinitionQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"ObjectTypeDefinitionQuery\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allObjectTypes\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"ObjectTypeDefinitionFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "ObjectTypeDefinitionQuery"
    },
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "allObjectTypes"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "ObjectTypeDefinitionFragment"
            }
          }]
        }
      }]
    }
  }].concat(ObjectTypeDefinitionFragment.definitions))
});
export var parseObjectTypeDefRecords = memoizeOne(function (allObjectTypes) {
  return allObjectTypes.reduce(function (objectTypes, typeDef) {
    var objectTypeId = typeDef.id;
    var isContact = objectTypeId === CONTACT_TYPE_ID;
    return objectTypes.set(objectTypeId, CrmObjectTypeRecord.fromJSON(Object.assign({}, typeDef, {
      objectTypeId: objectTypeId,
      // HACK: We have a fake FE-only 'name' property that we use as a contact's primary display label.
      // This property is a combination of 'firstname', 'lastname', and 'email'. The label property marked
      // on the typeDef is just 'firstname', so we overwrite it to avoid confusing the system.
      primaryDisplayLabelPropertyName: isContact ? 'name' : typeDef.primaryDisplayLabelPropertyName,
      restorable: typeDef.isRestorable
    })));
  }, ImmutableMap());
});
export var useObjectTypeDefinitions = function useObjectTypeDefinitions() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _useQuery = useQuery(ObjectTypeDefinitionQuery, {
      fetchPolicy: 'cache-only'
    }),
        data = _useQuery.data;

    var allObjectTypes = get('allObjectTypes', data);
    invariant(Boolean(allObjectTypes), 'useObjectTypeDefinitions:\nallObjectTypes was "%s", because data was "%s".\nPlease make sure all data requested here is prefetched in useFetchAllData.\nDo not change the fetchPolicy in this hook.', allObjectTypes, data);
    return parseObjectTypeDefRecords(allObjectTypes);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  var _useStoreDependency = useStoreDependency(crmObjectDefinitionsDep),
      typeDefs = _useStoreDependency.data;

  return typeDefs;
};