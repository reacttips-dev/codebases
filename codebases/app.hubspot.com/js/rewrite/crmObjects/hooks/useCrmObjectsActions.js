'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

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

import { useApolloClient } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useLocalMutationsActions } from '../../localMutations/hooks/useLocalMutationsActions';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import has from 'transmute/has';
import { createdCrmObjectAction, getCrmObjectsStartedAction, getCrmObjectsSucceededAction, getCrmObjectsFailedAction, deleteCrmObjectsAction, updateCrmObjectsAction, updateCrmObjectsSucceededAction, deleteCrmObjectsSucceededAction, batchDeleteCrmObjectsAction, batchUpdateCrmObjectsAction } from '../actions/crmObjectsActions';
import { CrmObjectFragment } from '../../crmSearch/hooks/useCrmSearchQuery';
import { mutableSetIn } from '../../objectUtils/mutableSetIn';
import { rewriteObjectPropertiesAsMap } from '../../crmSearch/utils/rewriteObjectPropertiesAsMap';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { usePropertyRequirementsForPipelineStages } from '../../objectRequirements/hooks/usePropertyRequirementsForPipelineStages';
import { useQueryProperties } from '../../searchQuery/hooks/useQueryProperties';
import { useHasBoardView } from '../../board/hooks/useHasBoardView';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import withGateOverride from 'crm_data/gates/withGateOverride';
export var GetCrmObjects = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"GetCrmObjects\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectIds\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Long\"}}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"crmObjects\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"ids\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectIds\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"CrmObjectFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "GetCrmObjects"
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
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "objectIds"
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
                value: "Long"
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
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "crmObjects"
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
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "ids"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "objectIds"
            }
          }
        }],
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
      }]
    }
  }].concat(CrmObjectFragment.definitions))
});
export var useCrmObjectsActions = function useCrmObjectsActions() {
  var dispatch = useDispatch();

  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      selectedObjectTypeId = _useSelectedObjectTyp.objectTypeId,
      pipelineStagePropertyName = _useSelectedObjectTyp.pipelineStagePropertyName;

  var _useLocalMutationsAct = useLocalMutationsActions(),
      setReconciledObjects = _useLocalMutationsAct.setReconciledObjects;

  var client = useApolloClient();
  var properties = useQueryProperties();
  var hasBoardView = useHasBoardView();
  var hasAllGates = useHasAllGates();
  var isUngatedForUnifiedBatchMutation = withGateOverride('IBDB:unified-batch-mutation', hasAllGates('IBDB:unified-batch-mutation'));
  var getCrmObjects = useCallback(function (_ref) {
    var objectIds = _ref.objectIds;
    dispatch(getCrmObjectsStartedAction({
      objectTypeId: selectedObjectTypeId,
      objectIds: objectIds
    }));
    return client.query({
      query: GetCrmObjects,
      variables: {
        objectTypeId: selectedObjectTypeId,
        objectIds: objectIds,
        properties: properties
      }
    }).then(function (results) {
      // HACK: Unfortunately we have to preserve the format here from before we fetched this data
      // via Apollo. When we remove the redux slice that manages this data, we can also ditch this
      // transformation (and all dispatches in this callback)
      var objects = getIn(['data', 'crmObjects'], results).reduce(function (objectsById, object) {
        mutableSetIn([object.objectId], rewriteObjectPropertiesAsMap(object), objectsById);
        return objectsById;
      }, {});
      dispatch(getCrmObjectsSucceededAction({
        objectTypeId: selectedObjectTypeId,
        objectIds: objectIds,
        objects: objects
      }));
      return objects;
    }).catch(function (error) {
      dispatch(getCrmObjectsFailedAction({
        objectTypeId: selectedObjectTypeId,
        objectIds: objectIds
      }));
      throw error;
    });
  }, [client, dispatch, properties, selectedObjectTypeId]);
  var crmObjectCreated = useCallback(function (_ref2) {
    var _ref2$objectTypeId = _ref2.objectTypeId,
        objectTypeId = _ref2$objectTypeId === void 0 ? selectedObjectTypeId : _ref2$objectTypeId,
        objectId = _ref2.objectId;

    // This can be called for any arbitrary object type because the sidebar lets you edit/create associations.
    // However we only want to actually do something if the object type is currently selected,
    // because we clear the cache when switching types.
    if (objectTypeId !== selectedObjectTypeId) {
      return Promise.resolve();
    }

    return getCrmObjects({
      objectTypeId: objectTypeId,
      objectIds: [objectId]
    }).then(function (objects) {
      dispatch(createdCrmObjectAction({
        objectTypeId: objectTypeId,
        objectId: objectId
      }));

      if (hasBoardView) {
        setReconciledObjects({
          objectIdsToStageIds: _defineProperty({}, objectId, getIn([objectId, 'properties', pipelineStagePropertyName, 'value'], objects))
        });
      }
    });
  }, [dispatch, getCrmObjects, hasBoardView, pipelineStagePropertyName, selectedObjectTypeId, setReconciledObjects]);
  var crmObjectsDeleted = useCallback(function (_ref3) {
    var _ref3$objectTypeId = _ref3.objectTypeId,
        objectTypeId = _ref3$objectTypeId === void 0 ? selectedObjectTypeId : _ref3$objectTypeId,
        objectIds = _ref3.objectIds;
    return dispatch(deleteCrmObjectsSucceededAction({
      objectTypeId: objectTypeId,
      objectIds: objectIds
    }));
  }, [dispatch, selectedObjectTypeId]);
  var deleteCrmObjects = useCallback(function (_ref4) {
    var _ref4$objectTypeId = _ref4.objectTypeId,
        objectTypeId = _ref4$objectTypeId === void 0 ? selectedObjectTypeId : _ref4$objectTypeId,
        objectIds = _ref4.objectIds,
        _ref4$isSelectingEnti = _ref4.isSelectingEntireQuery,
        isSelectingEntireQuery = _ref4$isSelectingEnti === void 0 ? false : _ref4$isSelectingEnti,
        filterGroups = _ref4.filterGroups,
        query = _ref4.query;

    if (isSelectingEntireQuery) {
      return dispatch(batchDeleteCrmObjectsAction({
        objectTypeId: objectTypeId,
        objectIds: objectIds,
        filterGroups: filterGroups,
        query: query
      }));
    }

    return dispatch(deleteCrmObjectsAction({
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      isUngatedForUnifiedBatchMutation: isUngatedForUnifiedBatchMutation
    }));
  }, [dispatch, selectedObjectTypeId, isUngatedForUnifiedBatchMutation]); // If we are updating an object's stage property, we need to reconcile that object into its new stage.
  // The stage property is based on the object's typeDef. We need to figure this out both for the sync
  // and async versions of property updates, so we've extracted it to a helper.

  var getNextStagePropertyValueIfExists = useCallback(function (_ref5) {
    var propertyValues = _ref5.propertyValues;

    if (!hasBoardView) {
      return null;
    }

    return get('value', propertyValues.find(function (_ref6) {
      var name = _ref6.name;
      return name === pipelineStagePropertyName;
    })) || null;
  }, [hasBoardView, pipelineStagePropertyName]);
  var crmObjectsUpdated = useCallback(function (_ref7) {
    var _ref7$objectTypeId = _ref7.objectTypeId,
        objectTypeId = _ref7$objectTypeId === void 0 ? selectedObjectTypeId : _ref7$objectTypeId,
        objectIds = _ref7.objectIds,
        propertyValues = _ref7.propertyValues;
    var toStageId = getNextStagePropertyValueIfExists({
      objectTypeId: objectTypeId,
      propertyValues: propertyValues
    }); // This can be called for any arbitrary object type because the sidebar lets you edit/create associations.
    // However we only want to reconcile objects when they're for the current object type, as the reconciliation
    // cache is cleared when switching object types.

    if (objectTypeId === selectedObjectTypeId && toStageId) {
      setReconciledObjects({
        objectIdsToStageIds: objectIds.reduce(function (objectIdsToStageIds, objectId) {
          objectIdsToStageIds[objectId] = toStageId;
          return objectIdsToStageIds;
        }, {})
      });
    }

    return dispatch(updateCrmObjectsSucceededAction({
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      propertyValues: propertyValues
    }));
  }, [dispatch, getNextStagePropertyValueIfExists, selectedObjectTypeId, setReconciledObjects]);
  var propertyRequirementsByStageId = usePropertyRequirementsForPipelineStages();

  var _useModalActions = useModalActions(),
      openEditStagePropertiesModal = _useModalActions.openEditStagePropertiesModal; // If we are moving an object into a different stage, we have to check if that stage has requirements.
  // If so, we'll delay the stage change until the user has filled out the property requirements modal.
  // That modal calls this action with "bypassStagePropertyRequirements" so that we do not perform this
  // validation twice.


  var updateCrmObjects = useCallback(function (_ref8) {
    var _ref8$objectTypeId = _ref8.objectTypeId,
        objectTypeId = _ref8$objectTypeId === void 0 ? selectedObjectTypeId : _ref8$objectTypeId,
        objectIds = _ref8.objectIds,
        propertyValues = _ref8.propertyValues,
        _ref8$isSelectingEnti = _ref8.isSelectingEntireQuery,
        isSelectingEntireQuery = _ref8$isSelectingEnti === void 0 ? false : _ref8$isSelectingEnti,
        filterGroups = _ref8.filterGroups,
        query = _ref8.query,
        _ref8$bypassStageProp = _ref8.bypassStagePropertyRequirements,
        bypassStagePropertyRequirements = _ref8$bypassStageProp === void 0 ? false : _ref8$bypassStageProp;
    var toStageId = getNextStagePropertyValueIfExists({
      objectTypeId: objectTypeId,
      propertyValues: propertyValues
    }); // This can be called for any arbitrary object type because the sidebar lets you edit/create associations.
    // However we only want to reconcile objects when they're for the current object type, as the reconciliation
    // cache is cleared when switching object types.

    if (objectTypeId === selectedObjectTypeId && toStageId) {
      if ( // HACK: The stage properties modal only works when editing a single object for now. It will
      // require a refactor of both the state and legacy UI code to allow this, so for now we will
      // disable it. We don't pop the modal for bulk update cases in the legacy code, so this is technically
      // just keeping feature parity.
      objectIds.length === 1 && !bypassStagePropertyRequirements && has(toStageId, propertyRequirementsByStageId)) {
        return openEditStagePropertiesModal({
          objectTypeId: objectTypeId,
          objectId: objectIds[0],
          stageId: toStageId
        });
      }

      setReconciledObjects({
        objectIdsToStageIds: objectIds.reduce(function (objectIdsToStageIds, objectId) {
          objectIdsToStageIds[objectId] = toStageId;
          return objectIdsToStageIds;
        }, {})
      });
    }

    if (isSelectingEntireQuery) {
      return dispatch(batchUpdateCrmObjectsAction({
        objectTypeId: objectTypeId,
        objectIds: objectIds,
        propertyValues: propertyValues,
        filterGroups: filterGroups,
        query: query
      }));
    }

    return dispatch(updateCrmObjectsAction({
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      propertyValues: propertyValues,
      isUngatedForUnifiedBatchMutation: isUngatedForUnifiedBatchMutation
    }));
  }, [dispatch, getNextStagePropertyValueIfExists, openEditStagePropertiesModal, propertyRequirementsByStageId, selectedObjectTypeId, setReconciledObjects, isUngatedForUnifiedBatchMutation]);
  return {
    crmObjectCreated: crmObjectCreated,
    getCrmObjects: getCrmObjects,
    crmObjectsDeleted: crmObjectsDeleted,
    deleteCrmObjects: deleteCrmObjects,
    updateCrmObjects: updateCrmObjects,
    crmObjectsUpdated: crmObjectsUpdated
  };
};