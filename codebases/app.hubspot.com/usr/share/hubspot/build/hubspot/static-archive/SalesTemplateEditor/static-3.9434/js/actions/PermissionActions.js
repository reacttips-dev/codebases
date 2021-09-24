'use es6';

import createAction from './createAction';
import Raven from 'Raven';
import PermissionApi from 'SalesTemplateEditor/api/PermissionApi';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
var _currentlyFetching = false;
var _currentlyFetchingObjectId = null;

var handleError = function handleError(errorMessage, err, extra) {
  if (!err || err.status === 0) {
    return;
  }

  Raven.captureMessage(errorMessage + " " + err.status, {
    extra: Object.assign({
      err: err
    }, extra)
  });
};

export var fetchById = function fetchById(objectId) {
  return function (dispatch) {
    if (!_currentlyFetching || _currentlyFetchingObjectId !== objectId) {
      _currentlyFetching = true;
      _currentlyFetchingObjectId = objectId;
      dispatch(createAction(ActionTypes.FETCH_PERMISSIONS_STARTED));
      return PermissionApi.fetchById(objectId).then(function (permissionsData) {
        dispatch(createAction(ActionTypes.FETCH_PERMISSIONS_SUCCESS, permissionsData));
      }, function (err) {
        dispatch(createAction(ActionTypes.FETCH_PERMISSIONS_ERROR));
        handleError('[SalesTemplateEditor] Permission fetch error', err);
      }).finally(function () {
        return _currentlyFetching = false;
      });
    }

    return Promise.resolve();
  };
};
export var initTemplatePermissions = function initTemplatePermissions(template) {
  return function (dispatch) {
    if (template.has('id')) {
      dispatch(fetchById(template.get('id')));
    } else {
      dispatch(createAction(ActionTypes.INIT_PERMISSIONS_FOR_NEW_TEMPLATE));
    }
  };
};
export var setShared = function setShared(isPrivate) {
  return function (dispatch) {
    dispatch(createAction(ActionTypes.SET_TEMPLATE_SHARED, isPrivate));
  };
};
export var save = function save(savedTemplate, permissionsData) {
  return PermissionApi.save(savedTemplate, permissionsData).then(function () {
    return savedTemplate;
  }, function (err) {
    handleError('[SalesTemplateEditor] Error when saving content permissions', err, {
      permissionsData: permissionsData
    });
    throw err;
  });
};