'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Map as ImmutableMap, Set as ImmutableSet, fromJS } from 'immutable';
import get from 'transmute/get';
import * as ViewTypes from 'customer-data-objects/view/ViewTypes';
import { filtersChangedAction, columnsChangedAction, sortChangedAction, resetViewAction, saveViewAction, deleteViewAction, createNewViewAction } from '../actions/viewsActions';
import { useCurrentView } from './useCurrentView';
import { useCurrentViewId } from './useCurrentViewId';
import { useUserSettingsActions } from '../../userSettings/hooks/useUserSettingsActions';
import { getFavoriteColumnsUserSettingsKey } from '../../userSettings/utils/getFavoriteColumnsUserSettingsKey';
import { deleteGridState, updateGridState } from '../../../crm_ui/grid/utils/gridStateLocalStorage';
import { trackEditSavedView, trackDeleteView, trackCreateView } from '../../../crm_ui/tracking/indexPageTracking';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useIsVisibleGridColumnName } from './useIsVisibleGridColumnName';
import { applyColumnRules } from '../utils/applyColumnRules';
import { useIsVisibleFilterPropertyName } from '../../properties/hooks/useIsVisibleFilterPropertyName';
import { CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { isGenericAssociation } from 'customer-data-objects/associations/isGenericAssociation';
import InboundDbListMembershipProperty from 'customer-data-objects/property/special/InboundDbListMembershipProperty';
import ListMembershipsProperty from 'customer-data-objects/property/special/ListMembershipsProperty';
import { alertFailure } from '../../utils/alerts';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import { UserSettingsErrors } from '../../userSettings/constants/UserSettingsErrors';
import { getDoesViewExist } from '../api/viewsAPI';
import debounce from 'transmute/debounce';

var doSetDefaultColumnsFailureAlert = function doSetDefaultColumnsFailureAlert() {
  return alertFailure({
    message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      elements: {
        Link: KnowledgeBaseButton
      },
      message: "GenericGrid.error.maxColumns_jsx",
      options: {
        useZorse: true,
        url: 'https://knowledge.hubspot.com/articles/kcs_article/contacts/create-saved-filters'
      }
    })
  });
};

export var useViewActions = function useViewActions() {
  var dispatch = useDispatch();
  var typeDef = useSelectedObjectTypeDef();
  var objectTypeId = typeDef.objectTypeId,
      primaryDisplayLabelPropertyName = typeDef.primaryDisplayLabelPropertyName;
  var currentView = useCurrentView();
  var columns = currentView.columns;
  var viewId = useCurrentViewId();
  var isDefault = currentView.type === ViewTypes.DEFAULT;
  var checkIfViewExists = useCallback(debounce(300, function (name, onSuccess, onFailure) {
    return getDoesViewExist({
      objectTypeId: objectTypeId,
      name: name
    }).then(onSuccess).catch(onFailure).done();
  }), []);
  var resetCurrentView = useCallback(function () {
    dispatch(resetViewAction({
      objectTypeId: objectTypeId,
      viewId: viewId,
      isDefault: isDefault
    }));
    deleteGridState({
      objectType: objectTypeId,
      viewId: viewId
    });
  }, [dispatch, objectTypeId, viewId, isDefault]);
  var saveView = useCallback(function (view) {
    trackEditSavedView();
    return dispatch(saveViewAction({
      objectTypeId: objectTypeId,
      view: view
    })).then(function () {
      deleteGridState({
        objectType: objectTypeId,
        viewId: view.id
      });
    }).catch();
  }, [dispatch, objectTypeId]);
  var saveCurrentView = useCallback(function () {
    return saveView(currentView);
  }, [currentView, saveView]);
  var deleteView = useCallback(function (viewIdToDelete) {
    trackDeleteView();
    return dispatch(deleteViewAction({
      objectTypeId: objectTypeId,
      viewId: viewIdToDelete
    }));
  }, [dispatch, objectTypeId]);
  var createView = useCallback(function (_ref) {
    var view = _ref.view,
        _ref$isClone = _ref.isClone,
        isClone = _ref$isClone === void 0 ? false : _ref$isClone;
    trackCreateView({
      isClone: isClone
    });
    return dispatch(createNewViewAction({
      objectTypeId: objectTypeId,
      view: view
    }));
  }, [dispatch, objectTypeId]);

  var _useUserSettingsActio = useUserSettingsActions(),
      setUserSetting = _useUserSettingsActio.setUserSetting,
      stageUserSetting = _useUserSettingsActio.stageUserSetting;

  var isVisibleGridColumnName = useIsVisibleGridColumnName();
  var onColumnsChanged = useCallback(function (newColumns) {
    var autoPersistDefaultViewColumnChanges = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var columnsToUse = fromJS(applyColumnRules({
      columns: newColumns,
      primaryDisplayLabelPropertyName: primaryDisplayLabelPropertyName,
      isVisibleGridColumnName: isVisibleGridColumnName
    })); // Default view columns (for the majority of cases) are autosaved to user settings and shared across all default views,
    // while custom view columns are stored in the views BE and must be manually saved by the user

    if (isDefault) {
      var columnNames = columnsToUse.map(function (col) {
        return get('name', col);
      });
      var settingsKey = getFavoriteColumnsUserSettingsKey(objectTypeId); // There are cases where we do not want to immediately persist changes to default view columns, so
      // we can pass this flag to toggle that behavior off.

      var action = autoPersistDefaultViewColumnChanges ? setUserSetting : stageUserSetting;
      action(settingsKey, columnNames).catch(function (error) {
        var message = get('message', error) || '';

        if (message === UserSettingsErrors.TOO_LONG) {
          doSetDefaultColumnsFailureAlert();
        }
      });
    } else {
      dispatch(columnsChangedAction({
        objectTypeId: objectTypeId,
        viewId: viewId,
        columns: columnsToUse
      })); // Since default view columns autosave, we do not need to cache them. Because custom view columns
      // don't autosave, we do need to cache those changes.

      updateGridState({
        objectType: objectTypeId,
        viewId: viewId,
        key: 'columns',
        value: columnsToUse
      });
    }
  }, [dispatch, isDefault, isVisibleGridColumnName, objectTypeId, primaryDisplayLabelPropertyName, setUserSetting, stageUserSetting, viewId]);
  var isVisibleFilterPropertyName = useIsVisibleFilterPropertyName();
  var onFiltersChanged = useCallback(function (incomingFilters) {
    var filters = incomingFilters.filter(function (_ref2) {
      var property = _ref2.property;
      return (// HACK: The salesforce integration generates ILS lists to power their sync errors experience. They then
        // link to a view filtered by that list, which flows through this code for validation. For now we'll bypass
        // the existing validation just for contacts to allow those filters to work, but once the ILS migration is
        // complete we should remove this bypass asap in favor of just isVisibleFilterPropertyName.
        // We're also bypassing the check on the old list membership property here because during the ILS migration
        // it's possible for both values to be present so we always want to consider them valid filters. Similar to
        // the case for the ILS list membership property, this case can be removed when the ILS migration is done.
        objectTypeId === CONTACT_TYPE_ID && property === InboundDbListMembershipProperty.name || objectTypeId === CONTACT_TYPE_ID && property === ListMembershipsProperty.name || // HACK: We want to allow generic association filters through to support the record's "view all x objects" feature.
        // Once we officially support these filters we can remove this hack and allow them through isVisibleFilterPropertyName.
        isGenericAssociation(property) || isVisibleFilterPropertyName(property)
      );
    });
    var filterProperties = ImmutableSet(filters.map(function (_ref3) {
      var property = _ref3.property;
      return property;
    }));
    var columnProperties = columns.map(function (col) {
      return col.get('name');
    });
    var propsToAddToColumns = filterProperties.subtract(columnProperties).map(function (name) {
      return ImmutableMap({
        name: name
      });
    });
    dispatch(filtersChangedAction({
      objectTypeId: objectTypeId,
      viewId: viewId,
      filters: filters
    }));

    if (propsToAddToColumns.size) {
      onColumnsChanged(columns.concat(propsToAddToColumns));
    }

    updateGridState({
      objectType: objectTypeId,
      viewId: viewId,
      key: 'filters',
      value: filters
    });
  }, [columns, dispatch, isVisibleFilterPropertyName, objectTypeId, onColumnsChanged, viewId]);
  var onSortChanged = useCallback(function (_ref4) {
    var sortKey = _ref4.sortKey,
        sortColumnName = _ref4.sortColumnName,
        order = _ref4.direction;
    dispatch(sortChangedAction({
      sortKey: sortKey,
      sortColumnName: sortColumnName,
      order: order,
      objectTypeId: objectTypeId,
      viewId: viewId
    }));
    updateGridState({
      objectType: objectTypeId,
      viewId: viewId,
      key: 'state',
      value: {
        sortColumnName: sortColumnName,
        sortKey: sortKey,
        order: order
      }
    });
  }, [dispatch, objectTypeId, viewId]);
  return {
    onFiltersChanged: onFiltersChanged,
    onColumnsChanged: onColumnsChanged,
    onSortChanged: onSortChanged,
    checkIfViewExists: checkIfViewExists,
    saveView: saveView,
    deleteView: deleteView,
    saveCurrentView: saveCurrentView,
    createView: createView,
    resetCurrentView: resetCurrentView
  };
};