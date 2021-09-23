'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from 'react';
import I18n from 'I18n';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { useViewActions } from '../../views/hooks/useViewActions';
import ContactSearchFilterEditor from '../../../crm_ui/filter/ContactSearchFilterEditor';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getSingularForm } from '../../../crmObjects/methods/getSingularForm';
import { useProperties } from '../../properties/hooks/useProperties';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import HR from 'UIComponents/elements/HR';
import TableObjectCount from './TableObjectCount';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { useMultiCurrencySetting } from '../../multiCurrency/hooks/useMultiCurrencySetting';
import { usePropertyGroupsWithProperties } from '../../propertyGroups/hooks/usePropertyGroupsWithProperties';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import styled from 'styled-components';
import update from 'transmute/update';
import get from 'transmute/get';
import set from 'transmute/set';
import getIn from 'transmute/getIn';
import PropertyGroupRecord from 'customer-data-objects/property/PropertyGroupRecord';
import { useRecentlyUsedPropertyNames } from '../../recentlyUsedProperties/hooks/useRecentlyUsedPropertyNames';
import { useRecentlyUsedPropertiesActions } from '../../recentlyUsedProperties/hooks/useRecentlyUsedPropertiesActions';
import { useIsVisibleFilterPropertyName } from '../../properties/hooks/useIsVisibleFilterPropertyName';
import identity from 'transmute/identity';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { LIST } from '../../views/constants/PageType';
export var RECENTLY_USED_GROUP_NAME = 'most_used_properties';
export var generateRecentlyUsedPropertyGroup = function generateRecentlyUsedPropertyGroup(recentlyUsedProperties, properties) {
  return PropertyGroupRecord.fromJS({
    displayName: I18n.text('filterSidebar.mostUsedProperties'),
    displayOrder: -Infinity,
    hubspotDefined: true,
    name: RECENTLY_USED_GROUP_NAME,
    properties: recentlyUsedProperties.map(function (propertyName) {
      return get(propertyName, properties);
    }).filter(Boolean).slice(0, 5)
  }, // HACK: PropertyGroupRecord tries to convert properties to property records if its input is an array
  // using the second argument to "fromJS" as a transformer. recentlyUsedProperties is an array which
  // activates the transform, but properties are already PropertyRecords, so we pass the identity function
  // to no-op the transform.
  identity);
};
var filtersStyle = {
  minHeight: '300px',
  width: '100%',
  flex: '1 0 auto'
};
var filterPanelStyle = {
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column'
}; // Hide the object count using css when filters are in edit mode, instead
// of skipping rendering it. This avoids unmounting the component and losing
// the cached crm search query results (including the total count) from
// `useCrmSearchQuery`. Otherwise every time you click to edit a filter,
// then click back/apply, a fresh object count component would need to re-run
// the crm search query.

export var StyledObjectCountPanelSection = styled(UIPanelSection).withConfig({
  displayName: "FilterEditor__StyledObjectCountPanelSection",
  componentId: "sc-2iywrr-0"
})(["display:", ";"], function (_ref) {
  var isEditingFilter = _ref.isEditingFilter;
  return isEditingFilter ? 'none' : 'block';
});

var FilterEditor = function FilterEditor() {
  var typeDef = useSelectedObjectTypeDef();

  var _useCurrentView = useCurrentView(),
      filters = _useCurrentView.filters;

  var _useMultiCurrencySett = useMultiCurrencySetting(),
      currencyCode = _useMultiCurrencySett.currencyCode;

  var pageType = useCurrentPageType();
  var isListView = pageType === LIST;
  var hasAllGates = useHasAllGates();
  var isVisiblePropertyName = useIsVisibleFilterPropertyName();
  var properties = useProperties();
  var fields = useMemo(function () {
    return properties.filter(function (_ref2) {
      var name = _ref2.name;
      return isVisiblePropertyName(name);
    });
  }, [isVisiblePropertyName, properties]);
  var groups = usePropertyGroupsWithProperties();
  var recentlyUsedProperties = useRecentlyUsedPropertyNames();
  var fieldGroups = useMemo(function () {
    var propertyGroups = set(RECENTLY_USED_GROUP_NAME, generateRecentlyUsedPropertyGroup(recentlyUsedProperties, properties), groups);
    return propertyGroups.map(function (group) {
      return update('properties', function (groupProperties) {
        return groupProperties.filter(function (_ref3) {
          var name = _ref3.name;
          return isVisiblePropertyName(name);
        });
      }, group);
    });
  }, [groups, isVisiblePropertyName, properties, recentlyUsedProperties]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isEditingFilter = _useState2[0],
      setIsEditingFilter = _useState2[1];

  var _useViewActions = useViewActions(),
      onFiltersChanged = _useViewActions.onFiltersChanged;

  var handleEditingChange = useCallback(function (_ref4) {
    var value = _ref4.target.value;
    setIsEditingFilter(value);
  }, [setIsEditingFilter]);

  var _useRecentlyUsedPrope = useRecentlyUsedPropertiesActions(),
      onPropertyUsed = _useRecentlyUsedPrope.onPropertyUsed;

  var handleOperatorChangeConfirmed = useCallback(function (_ref5) {
    var value = _ref5.target.value;

    if (value && value.field) {
      var propertyName = getIn(['field', 'name'], value);
      CrmLogger.log('filterInteractions', {
        action: 'add property to advanced filter',
        property: propertyName
      });
      onPropertyUsed(propertyName);
    }
  }, [onPropertyUsed]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [isListView && /*#__PURE__*/_jsxs(StyledObjectCountPanelSection, {
      isEditingFilter: isEditingFilter,
      children: [/*#__PURE__*/_jsx(TableObjectCount, {}), /*#__PURE__*/_jsx(HR, {})]
    }), /*#__PURE__*/_jsx(UIPanelSection, {
      style: filterPanelStyle,
      children: /*#__PURE__*/_jsx(ContactSearchFilterEditor, {
        hasILSListsGate: hasAllGates('crm:segments:ilsSegmentsUiRollup'),
        className: "overflow-y-auto",
        currencyCode: currencyCode,
        fields: fields,
        fieldGroups: fieldGroups,
        value: filters.toJSON(),
        filterFamily: denormalizeTypeId(typeDef.objectTypeId),
        isCrmObject: true,
        isInitialScreenCreate: filters.size === 0,
        isXoEnabled: true,
        objectName: getSingularForm(typeDef),
        onChange: onFiltersChanged,
        onDraftChange: onFiltersChanged,
        onEditingChange: handleEditingChange,
        onOperatorConfirmed: handleOperatorChangeConfirmed,
        style: filtersStyle,
        isFiscalYearEnabled: hasAllGates('settings:accountdefaults:fiscalyear')
      })
    })]
  });
};

export default FilterEditor;