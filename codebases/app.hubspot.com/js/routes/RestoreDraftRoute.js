'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _PAGE_TYPE_SETTINGS_K, _LOCAL_SETTINGS_KEYS;

import { useEffect, useState, useMemo } from 'react';
import { useStoreDependency } from 'general-store';
import { Redirect } from 'react-router-dom';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import ViewsActions from '../crm_ui/flux/views/ViewsActions';
import { pinnedViewsDep } from '../pinnedViews/deps/pinnedViewsDep';
import { crmObjectDefinitionsDep } from '../crmObjects/deps/crmObjectDefinitionsDep';
import { propertiesDep } from '../properties/deps/propertiesDep';
import { favoriteColumnsDep } from '../table/deps/favoriteColumnsDep';
import { viewsDep } from '../views/deps/viewsDep';
import { defaultViewDep } from '../views/deps/defaultViewDep';
import { fetchFieldLevelPermissionsDependency } from '../crm_ui/property/fieldLevelPermissionsUIDependencies';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import links from 'crm-legacy-links/links';
import { getDefaultViewsFromTypeDef } from '../views/utils/getDefaultViewsFromTypeDef';
import { getUIState } from '../crm_ui/grid/utils/gridStateLocalStorage';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import localSettings from '../utils/localSettings';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { BOARD } from 'customer-data-objects/view/PageTypes';
var STATES = {
  NOT_STARTED: 'NOT_STARTED',
  RESTORING: 'RESTORING',
  HAS_RESTORED: 'HAS_RESTORED'
};
var PAGE_TYPE_SETTINGS_KEYS = (_PAGE_TYPE_SETTINGS_K = {}, _defineProperty(_PAGE_TYPE_SETTINGS_K, DEAL_TYPE_ID, UserSettingsKeys.DEAL_VIEWTYPE_DEFAULT), _defineProperty(_PAGE_TYPE_SETTINGS_K, TICKET_TYPE_ID, UserSettingsKeys.TICKET_VIEWTYPE_DEFAULT), _PAGE_TYPE_SETTINGS_K);
var LOCAL_SETTINGS_KEYS = (_LOCAL_SETTINGS_KEYS = {}, _defineProperty(_LOCAL_SETTINGS_KEYS, CONTACT_TYPE_ID, 'contacts.default'), _defineProperty(_LOCAL_SETTINGS_KEYS, COMPANY_TYPE_ID, 'companies.default'), _defineProperty(_LOCAL_SETTINGS_KEYS, DEAL_TYPE_ID, 'deals.default'), _defineProperty(_LOCAL_SETTINGS_KEYS, TICKET_TYPE_ID, 'tickets.default'), _LOCAL_SETTINGS_KEYS);
export var getLinkPageType = function getLinkPageType(pageType) {
  return pageType === BOARD ? 'board' : 'list';
};
export var pageTypeDependency = {
  stores: [UserSettingsStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId;
    var key = PAGE_TYPE_SETTINGS_KEYS[objectTypeId];

    if (key) {
      return UserSettingsStore.get(key);
    }

    return false;
  }
};
export var generateLocationToRoute = function generateLocationToRoute(objectTypeId, pageType) {
  var _getUIState = getUIState(objectTypeId),
      query = _getUIState.query,
      viewId = _getUIState.viewId;

  var queryString = query ? "?query=" + query : '';
  var link = links.indexFromObjectTypeId({
    objectTypeId: objectTypeId,
    viewId: viewId,
    pageType: pageType
  });
  return {
    pathname: link,
    search: queryString
  };
};
export var RestoreDraftRoute = function RestoreDraftRoute(_ref2) {
  var objectTypeId = _ref2.objectTypeId;

  var _useState = useState(STATES.NOT_STARTED),
      _useState2 = _slicedToArray(_useState, 2),
      restoreState = _useState2[0],
      setRestoreState = _useState2[1]; // Legacy routes access data via objectType, not objectTypeId. To make
  // sure we're prefetching data they can use, we have to normalize them to objectType


  var objectTypeParam = ObjectTypeFromIds[objectTypeId] || objectTypeId;
  useStoreDependency(favoriteColumnsDep, {
    objectTypeId: objectTypeParam
  });
  useStoreDependency(propertiesDep, {
    objectTypeId: objectTypeParam
  });
  useStoreDependency(defaultViewDep, {
    objectTypeId: objectTypeParam
  });
  useStoreDependency(pinnedViewsDep, {
    objectTypeId: objectTypeParam
  });

  var _useStoreDependency = useStoreDependency(crmObjectDefinitionsDep, {
    objectTypeId: objectTypeId
  }),
      objectTypeDef = _useStoreDependency.data;

  useStoreDependency(fetchFieldLevelPermissionsDependency, {
    objectType: objectTypeParam
  });

  var _useStoreDependency2 = useStoreDependency(viewsDep, {
    objectTypeId: objectTypeParam
  }),
      areViewsFetched = _useStoreDependency2.isSettled;

  var localPageType = useMemo(function () {
    var type = localSettings.get(LOCAL_SETTINGS_KEYS[objectTypeId] || objectTypeId + ".default");
    return getLinkPageType(type);
  }, [objectTypeId]);
  var settingsPageType = getLinkPageType(useStoreDependency(pageTypeDependency, {
    objectTypeId: objectTypeId
  }));
  var pageTypeFetched = settingsPageType !== LOADING;
  var pageType = localPageType || settingsPageType || 'list';
  var isCrmObject = objectTypeParam === objectTypeId;
  useEffect(function () {
    if (areViewsFetched && objectTypeDef && restoreState === STATES.NOT_STARTED) {
      setRestoreState(STATES.RESTORING);
      var initialize = isCrmObject ? ViewsActions.initializeObjectType({
        objectType: objectTypeId,
        views: getDefaultViewsFromTypeDef(objectTypeDef)
      }) : Promise.resolve();
      initialize.then(function () {
        return ViewsActions.restoreDraft({
          objectType: objectTypeParam
        });
      }).then(function () {
        return setRestoreState(STATES.HAS_RESTORED);
      }).done();
    }
  }, [areViewsFetched, isCrmObject, objectTypeDef, objectTypeId, objectTypeParam, restoreState]);
  var showRedirect = pageTypeFetched && restoreState === STATES.HAS_RESTORED;
  return showRedirect ? /*#__PURE__*/_jsx(Redirect, {
    to: generateLocationToRoute(objectTypeId, pageType)
  }) : /*#__PURE__*/_jsx(UILoadingOverlay, {});
};
export default RestoreDraftRoute;