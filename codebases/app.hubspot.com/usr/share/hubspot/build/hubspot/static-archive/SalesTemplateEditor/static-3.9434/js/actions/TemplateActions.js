'use es6';

import { Map as ImmutableMap } from 'immutable';
import createAction from './createAction';
import * as TemplateApi from 'SalesTemplateEditor/api/TemplateApi';
import * as PermissionActions from './PermissionActions';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
export var editName = function editName(name) {
  return function (dispatch) {
    dispatch(createAction(ActionTypes.EDIT_TEMPLATE_NAME, name));
  };
};
export var selectFolder = function selectFolder(folderId) {
  return function (dispatch) {
    dispatch(createAction(ActionTypes.SELECT_TEMPLATE_FOLDER, folderId));
  };
};
export var maybeSetPermissions = function maybeSetPermissions(_ref) {
  var template = _ref.template,
      savedAsNew = _ref.savedAsNew,
      permissionsModified = _ref.permissionsModified,
      permissions = _ref.permissions;
  var updateExistingTemplate = !savedAsNew && permissionsModified; // If it's shared specific, we stick to default permissions instead of saving them
  // because the editor UI does not show WHICH users & teams are being shared to

  var sharedSpecific = !permissions.get('visibleToAll') && !permissions.get('private');
  var canSavePermissionsOnNewTemplate = savedAsNew && !sharedSpecific;

  if (updateExistingTemplate || canSavePermissionsOnNewTemplate) {
    return PermissionActions.save(template, permissions).then(function () {
      return {
        template: template
      };
    }, function () {
      return {
        template: template,
        permissionsSaveError: true
      };
    });
  }

  return {
    template: template
  };
};
export var save = function save(_ref2) {
  var template = _ref2.template,
      _ref2$savedAsNew = _ref2.savedAsNew,
      savedAsNew = _ref2$savedAsNew === void 0 ? false : _ref2$savedAsNew,
      _ref2$permissionsModi = _ref2.permissionsModified,
      permissionsModified = _ref2$permissionsModi === void 0 ? false : _ref2$permissionsModi,
      _ref2$permissions = _ref2.permissions,
      permissions = _ref2$permissions === void 0 ? ImmutableMap() : _ref2$permissions;
  var isNew = !template.has('id');
  var saveMethod = isNew ? TemplateApi.create : TemplateApi.update;
  return saveMethod(template).then(function (savedTemplate) {
    return maybeSetPermissions({
      template: savedTemplate,
      savedAsNew: savedAsNew,
      permissionsModified: permissionsModified,
      permissions: permissions
    });
  });
};
export var clearEditor = function clearEditor() {
  return function (dispatch) {
    dispatch(createAction(ActionTypes.CLEAR_EDITOR));
  };
};
export var openEditor = function openEditor(_ref3) {
  var template = _ref3.template;
  return function (dispatch) {
    dispatch(createAction(ActionTypes.OPEN_EDITOR, template));
    dispatch(PermissionActions.initTemplatePermissions(template));
  };
};