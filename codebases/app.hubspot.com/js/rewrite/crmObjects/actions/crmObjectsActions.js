'use es6';

import { CREATED_CRM_OBJECT, DELETE_CRM_OBJECTS_FAILED, DELETE_CRM_OBJECTS_STARTED, DELETE_CRM_OBJECTS_SUCCEEDED, FETCH_CRM_OBJECTS_FAILED, FETCH_CRM_OBJECTS_STARTED, FETCH_CRM_OBJECTS_SUCCEEDED, UPDATE_CRM_OBJECTS_FAILED, UPDATE_CRM_OBJECTS_STARTED, UPDATE_CRM_OBJECTS_SUCCEEDED, BATCH_DELETE_CRM_OBJECTS_FAILED, BATCH_DELETE_CRM_OBJECTS_STARTED, BATCH_DELETE_CRM_OBJECTS_SUCCEEDED, BATCH_UPDATE_CRM_OBJECTS_FAILED, BATCH_UPDATE_CRM_OBJECTS_STARTED, BATCH_UPDATE_CRM_OBJECTS_SUCCEEDED } from './crmObjectsActionTypes';
import { deleteCrmObjectsByIds as deleteCrmObjectsByIdsV1, deleteCrmObjectsByIdsV2, deleteCrmObjectsByFilters, writeCrmObjectPropertiesByIds as writeCrmObjectPropertiesByIdsV1, writeCrmObjectPropertiesByIdsV2, writeCrmObjectPropertiesByFilters } from '../api/crmObjectsAPI';
export var createdCrmObjectAction = function createdCrmObjectAction(_ref) {
  var objectTypeId = _ref.objectTypeId,
      objectId = _ref.objectId;
  return {
    type: CREATED_CRM_OBJECT,
    payload: {
      objectTypeId: objectTypeId,
      objectId: objectId
    }
  };
};
export var getCrmObjectsStartedAction = function getCrmObjectsStartedAction(_ref2) {
  var objectTypeId = _ref2.objectTypeId,
      objectIds = _ref2.objectIds;
  return {
    type: FETCH_CRM_OBJECTS_STARTED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds
    }
  };
};
export var getCrmObjectsSucceededAction = function getCrmObjectsSucceededAction(_ref3) {
  var objectTypeId = _ref3.objectTypeId,
      objectIds = _ref3.objectIds,
      objects = _ref3.objects;
  return {
    type: FETCH_CRM_OBJECTS_SUCCEEDED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      objects: objects
    }
  };
};
export var getCrmObjectsFailedAction = function getCrmObjectsFailedAction(_ref4) {
  var objectTypeId = _ref4.objectTypeId,
      objectIds = _ref4.objectIds;
  return {
    type: FETCH_CRM_OBJECTS_FAILED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds
    }
  };
};
export var deleteCrmObjectsSucceededAction = function deleteCrmObjectsSucceededAction(_ref5) {
  var objectTypeId = _ref5.objectTypeId,
      objectIds = _ref5.objectIds;
  return {
    type: DELETE_CRM_OBJECTS_SUCCEEDED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds
    }
  };
};
export var deleteCrmObjectsAction = function deleteCrmObjectsAction(_ref6) {
  var objectTypeId = _ref6.objectTypeId,
      objectIds = _ref6.objectIds,
      _ref6$isUngatedForUni = _ref6.isUngatedForUnifiedBatchMutation,
      isUngatedForUnifiedBatchMutation = _ref6$isUngatedForUni === void 0 ? false : _ref6$isUngatedForUni;
  return function (dispatch) {
    dispatch({
      type: DELETE_CRM_OBJECTS_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        objectIds: objectIds
      }
    });
    var deleteCrmObjectsByIds = isUngatedForUnifiedBatchMutation ? deleteCrmObjectsByIdsV2 : deleteCrmObjectsByIdsV1;
    return deleteCrmObjectsByIds({
      objectTypeId: objectTypeId,
      objectIds: objectIds
    }).then(function () {
      return dispatch(deleteCrmObjectsSucceededAction({
        objectTypeId: objectTypeId,
        objectIds: objectIds
      }));
    }).catch(function (error) {
      dispatch({
        type: DELETE_CRM_OBJECTS_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          objectIds: objectIds
        }
      });
      throw error;
    });
  };
};
export var batchDeleteCrmObjectsSucceededAction = function batchDeleteCrmObjectsSucceededAction(_ref7) {
  var objectTypeId = _ref7.objectTypeId,
      objectIds = _ref7.objectIds;
  return {
    type: BATCH_DELETE_CRM_OBJECTS_SUCCEEDED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds
    }
  };
};
export var batchDeleteCrmObjectsAction = function batchDeleteCrmObjectsAction(_ref8) {
  var objectTypeId = _ref8.objectTypeId,
      objectIds = _ref8.objectIds,
      filterGroups = _ref8.filterGroups,
      query = _ref8.query;
  return function (dispatch) {
    dispatch({
      type: BATCH_DELETE_CRM_OBJECTS_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        objectIds: objectIds
      }
    });
    return deleteCrmObjectsByFilters({
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      filterGroups: filterGroups,
      query: query
    }).then(function () {
      return dispatch(deleteCrmObjectsSucceededAction({
        objectTypeId: objectTypeId,
        objectIds: objectIds
      }));
    }).catch(function (error) {
      dispatch({
        type: BATCH_DELETE_CRM_OBJECTS_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          objectIds: objectIds
        }
      });
      throw error;
    });
  };
};
export var updateCrmObjectsSucceededAction = function updateCrmObjectsSucceededAction(_ref9) {
  var objectTypeId = _ref9.objectTypeId,
      objectIds = _ref9.objectIds,
      propertyValues = _ref9.propertyValues;
  return {
    type: UPDATE_CRM_OBJECTS_SUCCEEDED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      propertyValues: propertyValues
    }
  };
};
export var updateCrmObjectsAction = function updateCrmObjectsAction(_ref10) {
  var objectTypeId = _ref10.objectTypeId,
      objectIds = _ref10.objectIds,
      propertyValues = _ref10.propertyValues,
      _ref10$isUngatedForUn = _ref10.isUngatedForUnifiedBatchMutation,
      isUngatedForUnifiedBatchMutation = _ref10$isUngatedForUn === void 0 ? false : _ref10$isUngatedForUn;
  return function (dispatch) {
    dispatch({
      type: UPDATE_CRM_OBJECTS_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        objectIds: objectIds,
        propertyValues: propertyValues
      }
    });
    var writeCrmObjectPropertiesByIds = isUngatedForUnifiedBatchMutation ? writeCrmObjectPropertiesByIdsV2 : writeCrmObjectPropertiesByIdsV1;
    return writeCrmObjectPropertiesByIds({
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      propertyValues: propertyValues
    }).then(function () {
      return dispatch(updateCrmObjectsSucceededAction({
        objectTypeId: objectTypeId,
        objectIds: objectIds,
        propertyValues: propertyValues
      }));
    }).catch(function (error) {
      dispatch({
        type: UPDATE_CRM_OBJECTS_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          objectIds: objectIds,
          propertyValues: propertyValues
        }
      });
      throw error;
    });
  };
};
export var batchUpdateCrmObjectsSucceededAction = function batchUpdateCrmObjectsSucceededAction(_ref11) {
  var objectTypeId = _ref11.objectTypeId,
      objectIds = _ref11.objectIds,
      propertyValues = _ref11.propertyValues;
  return {
    type: BATCH_UPDATE_CRM_OBJECTS_SUCCEEDED,
    payload: {
      objectTypeId: objectTypeId,
      objectIds: objectIds,
      propertyValues: propertyValues
    }
  };
};
export var batchUpdateCrmObjectsAction = function batchUpdateCrmObjectsAction(_ref12) {
  var objectTypeId = _ref12.objectTypeId,
      objectIds = _ref12.objectIds,
      propertyValues = _ref12.propertyValues,
      filterGroups = _ref12.filterGroups,
      query = _ref12.query;
  return function (dispatch) {
    dispatch({
      type: BATCH_UPDATE_CRM_OBJECTS_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        propertyValues: propertyValues
      }
    });
    return writeCrmObjectPropertiesByFilters({
      objectTypeId: objectTypeId,
      propertyValues: propertyValues,
      filterGroups: filterGroups,
      query: query
    }).then(function () {
      return dispatch(batchUpdateCrmObjectsSucceededAction({
        objectTypeId: objectTypeId,
        objectIds: objectIds,
        propertyValues: propertyValues
      }));
    }).catch(function (error) {
      dispatch({
        type: BATCH_UPDATE_CRM_OBJECTS_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          propertyValues: propertyValues
        }
      });
      throw error;
    });
  };
};