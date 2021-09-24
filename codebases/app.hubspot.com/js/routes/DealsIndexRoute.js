'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useLayoutEffect } from 'react';
import I18n from 'I18n';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import { useParams } from 'react-router-dom';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { useBodyClass } from '../router/useBodyClass';
import { INDEX } from 'customer-data-objects/view/PageTypes';
import IndexLoaderHelper from '../crm_ui/routes/shared/IndexLoaderHelper';
import { searchDebounced, updateDisplayQuery, reset, changeSavedFilter } from '../crm_ui/flux/grid/GridUIActions';
import { getTruncatedQuery } from 'customer-data-objects/search/ElasticSearchQuery';
import { useQueryParams } from '../router/useQueryParams';
import { buildRouteParams } from '../crm_ui/routes/shared/buildRouteParams';
import localSettings from '../utils/localSettings';
import IndexPageWrapperAsync from '../pages/IndexPageWrapperAsync';
import { saveUserSetting } from 'crm_data/settings/UserSettingsActions';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import { withFullPageErrorBoundary } from '../errorBoundary/withFullPageErrorBoundary';
import { useStoreDependency } from 'general-store';
import { crmObjectDefinitionsDep } from '../crmObjects/deps/crmObjectDefinitionsDep';
import { pinnedViewsDep } from '../pinnedViews/deps/pinnedViewsDep';
import { withProvidedObjectTypeId } from '../objectTypeIdContext/components/withProvidedObjectTypeId';
import { useSelectedObjectTypeId } from '../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { fetchFieldLevelPermissionsDependency } from '../crm_ui/property/fieldLevelPermissionsUIDependencies';
import { pipelinePermissionsDep } from 'crm_data/pipelinePermissions/pipelinePermissionsDep';
import { isResolved } from 'crm_data/flux/LoadingStatus';
import { useHasAllGates } from '../rewrite/auth/hooks/useHasAllGates';
import withGateOverride from 'crm_data/gates/withGateOverride';
export var dealsIndexLoaderCallback = function dealsIndexLoaderCallback(_ref) {
  var associations = _ref.associations,
      favoriteColumns = _ref.favoriteColumns,
      hasAllGates = _ref.hasAllGates,
      normalizedQuery = _ref.normalizedQuery,
      properties = _ref.properties,
      query = _ref.query,
      requiredColumns = _ref.requiredColumns,
      setDataCallback = _ref.setDataCallback,
      view = _ref.view,
      viewId = _ref.viewId;
  localSettings.set('deals.default', INDEX);
  saveUserSetting(UserSettingsKeys.DEAL_VIEWTYPE_DEFAULT, INDEX);
  reset({
    objectType: DEAL,
    displayQuery: query.query
  });
  var searchQuery = normalizedQuery.query ? normalizedQuery.query : '';
  searchDebounced({
    query: getTruncatedQuery(searchQuery),
    objectType: DEAL
  });
  updateDisplayQuery({
    displayQuery: getTruncatedQuery(searchQuery),
    objectType: DEAL
  });
  changeSavedFilter({
    viewId: viewId,
    objectType: DEAL,
    pageType: INDEX
  });
  var isFlexibleAssociationsUngated = withGateOverride('flexible-associations', hasAllGates('flexible-associations'));
  var isNewAssociationsUngated = withGateOverride('CRM:Datasets:NewAssociations', hasAllGates('CRM:Datasets:NewAssociations'));
  var params = buildRouteParams({
    associations: associations,
    favoriteColumns: favoriteColumns,
    isFlexibleAssociationsUngated: isFlexibleAssociationsUngated,
    isNewAssociationsUngated: isNewAssociationsUngated,
    normalizedQuery: normalizedQuery,
    objectType: DEAL,
    properties: properties,
    query: query,
    requiredColumns: requiredColumns,
    view: view,
    viewId: viewId
  });
  setDataCallback(params);
};

function DealsIndexRoute() {
  var query = useQueryParams();

  var _useParams = useParams(),
      viewIdParam = _useParams.viewId;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      routeData = _useState2[0],
      setRouteData = _useState2[1];

  var objectTypeId = useSelectedObjectTypeId();
  useBodyClass(DEAL);
  var hasAllGates = useHasAllGates();
  var isNewAssociationsUngated = withGateOverride('CRM:Datasets:NewAssociations', hasAllGates('CRM:Datasets:NewAssociations'));
  useLayoutEffect(function () {
    document.title = I18n.text('documentTitles.deals');
    IndexLoaderHelper({
      getRouteURL: function getRouteURL(viewId) {
        return "/deals/list/view/" + viewId + "/";
      },
      objectType: DEAL,
      query: query,
      viewIdParam: viewIdParam
    }, function (_ref2) {
      var associations = _ref2.associations,
          view = _ref2.view,
          viewId = _ref2.viewId,
          favoriteColumns = _ref2.favoriteColumns,
          normalizedQuery = _ref2.normalizedQuery,
          properties = _ref2.properties;
      dealsIndexLoaderCallback({
        associations: associations,
        favoriteColumns: favoriteColumns,
        normalizedQuery: normalizedQuery,
        properties: properties,
        query: query,
        requiredColumns: isNewAssociationsUngated ? ['dealname'] : ['relatesTo', 'dealname'],
        setDataCallback: setRouteData,
        view: view,
        viewId: viewId,
        hasAllGates: hasAllGates
      });
    });
  }, [hasAllGates, isNewAssociationsUngated, query, viewIdParam]);
  useStoreDependency(pinnedViewsDep, {
    objectTypeId: objectTypeId
  });
  useStoreDependency(fetchFieldLevelPermissionsDependency, {
    objectType: DEAL
  });
  var pipelinePermissions = useStoreDependency(pipelinePermissionsDep, {
    objectTypeId: objectTypeId
  });
  var arePipelinePermissionsFetched = isResolved(pipelinePermissions);

  var _useStoreDependency = useStoreDependency(crmObjectDefinitionsDep, {
    objectTypeId: objectTypeId
  }),
      crmObjectDefsFetched = _useStoreDependency.isResolved;

  var showContent = crmObjectDefsFetched && arePipelinePermissionsFetched && routeData;
  return showContent ? /*#__PURE__*/_jsx(IndexPageWrapperAsync, Object.assign({}, routeData, {
    objectType: DEAL,
    pageType: INDEX
  })) : /*#__PURE__*/_jsx(UILoadingOverlay, {});
}

export default withFullPageErrorBoundary(withProvidedObjectTypeId(DealsIndexRoute, '0-3'));