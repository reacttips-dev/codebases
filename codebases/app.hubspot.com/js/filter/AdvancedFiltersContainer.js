'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as GridProperties from 'crm_data/properties/GridProperties';
import * as LoadingStatus from 'crm_data/flux/LoadingStatus';
import * as RecentlyUsedPropertiesActions from '../crm_ui/property/actions/RecentlyUsedPropertiesActions';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { Map as ImmutableMap, OrderedMap } from 'immutable';
import { useStoreDependency } from 'general-store';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ContactSearchFilterEditor from '../crm_ui/filter/ContactSearchFilterEditor';
import CurrencyCodeDependency from '../crm_ui/components/formatting/CurrencyCodeDependency';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import HR from 'UIComponents/elements/HR';
import I18n from 'I18n';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ViewObjectCount from '../views/components/ViewObjectCount';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import PropertyGroupRecord from 'customer-data-objects/property/PropertyGroupRecord';
import PropertyGroupsStore from 'crm_data/properties/PropertyGroupsStore';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import ScopesContainer from '../containers/ScopesContainer';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UserPortalSettingsKeys from 'crm_data/settings/UserPortalSettingsKeys';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import FullPageError from '../errorBoundary/FullPageError';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import { useSelectedObjectTypeDef } from '../crmObjects/hooks/useSelectedObjectTypeDef';
import { getSingularForm } from '../crmObjects/methods/getSingularForm';
import { useHasAllGates } from '../rewrite/auth/hooks/useHasAllGates';
var NUM_TOP_FIELDS = 5;

var ErrorBoundaryComponent = function ErrorBoundaryComponent() {
  return /*#__PURE__*/_jsx(UIPanelSection, {
    children: /*#__PURE__*/_jsx(FullPageError, {})
  });
};

export var fieldsDependency = {
  propTypes: {
    objectType: PropTypes.string.isRequired
  },
  stores: [PropertiesStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType;
    var properties = PropertiesStore.get(objectType);
    var scopes = ScopesContainer.get();

    var getIsUngated = function getIsUngated(gate) {
      return IsUngatedStore.get(gate);
    };

    if (!properties) {
      return undefined;
    }

    return properties.filter(function (property) {
      return GridProperties.isVisibleFilterProperty(scopes, property, objectType, getIsUngated);
    });
  }
};
export var isUngatedForFiscalYearDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return IsUngatedStore.get('settings:accountdefaults:fiscalyear');
  }
};
export var fieldGroupsDependency = {
  propTypes: {
    objectType: PropTypes.string.isRequired
  },
  stores: [PropertiesStore, PropertyGroupsStore],
  deref: function deref(_ref2) {
    var objectType = _ref2.objectType;
    var groups = PropertyGroupsStore.get(objectType);
    var properties = PropertiesStore.get(objectType);
    var scopes = ScopesContainer.get();

    var getIsUngated = function getIsUngated(gate) {
      return IsUngatedStore.get(gate);
    };

    if (!groups || !properties) {
      return undefined;
    }

    var getPropertyList = function getPropertyList(groupProperties) {
      return groupProperties.valueSeq().map(function (name) {
        return properties.get(name);
      }).filter(function (property) {
        return GridProperties.isVisibleFilterProperty(scopes, property, objectType, getIsUngated);
      }).toList();
    };

    return groups.map(function (group) {
      return group.update('properties', getPropertyList);
    });
  }
};
export var recentlyUsedPropertiesDependency = {
  stores: [UserSettingsStore, PropertiesStore],
  deref: function deref(props) {
    var objectType = props.objectType;
    var key = "RECENTLY_USED_PROPERTIES_" + objectType;
    var settingsKey = UserPortalSettingsKeys[key];
    return settingsKey ? UserSettingsStore.get(settingsKey) : LoadingStatus.LOADING;
  }
};

var parseRecentlyUsedProperties = function parseRecentlyUsedProperties(recentlyUsedProperties, properties) {
  var scopes = ScopesContainer.get();

  if (!LoadingStatus.isResolved(recentlyUsedProperties, properties)) {
    return LoadingStatus.LOADING;
  }

  if (recentlyUsedProperties.size === 0) {
    return LoadingStatus.EMPTY;
  }

  var usageCountsByPropertyName = recentlyUsedProperties.reduce(function (tail, next) {
    var name = next.get('name');
    var count = tail.get(name) || 0;
    return tail.set(name, count + 1);
  }, OrderedMap());
  return PropertyGroupRecord({
    displayName: I18n.text('filterSidebar.mostUsedProperties'),
    displayOrder: -Infinity,
    hubspotDefined: true,
    name: 'most_used_properties',
    properties: usageCountsByPropertyName.sort(function (propACount, propBCount) {
      return propBCount - propACount;
    }).keySeq().filter(function (name) {
      return properties.has(name);
    }).take(NUM_TOP_FIELDS).map(function (name) {
      return properties.get(name);
    }).filter(function (property) {
      return GridProperties.isVisibleFilterProperty(scopes, property);
    }).toList()
  });
};

var AdvancedFiltersContainer = function AdvancedFiltersContainer(_ref3) {
  var filters = _ref3.filters,
      isBoardView = _ref3.isBoardView,
      isCrmObject = _ref3.isCrmObject,
      isPipelineable = _ref3.isPipelineable,
      objectType = _ref3.objectType,
      onClose = _ref3.onClose,
      onUpdateQuery = _ref3.onUpdateQuery,
      pipelineId = _ref3.pipelineId,
      view = _ref3.view;
  var hasAllGates = useHasAllGates();
  var currencyCode = useStoreDependency(CurrencyCodeDependency);
  var fields = useStoreDependency(fieldsDependency, {
    objectType: objectType
  });
  var fieldGroups = useStoreDependency(fieldGroupsDependency, {
    objectType: objectType
  });
  var isUngatedForFiscalYear = useStoreDependency(isUngatedForFiscalYearDependency);
  var recentlyUsedProperties = useStoreDependency(recentlyUsedPropertiesDependency, {
    objectType: objectType
  });
  var typeDef = useSelectedObjectTypeDef();
  var objectName = getSingularForm(typeDef);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isEditingFilter = _useState2[0],
      setIsEditingFilter = _useState2[1];

  var recentlyUsedPropertiesGroup = useMemo(function () {
    return parseRecentlyUsedProperties(recentlyUsedProperties, fields);
  }, [fields, recentlyUsedProperties]);
  var fieldGroupsWithRecentlyUsed = LoadingStatus.isResolved(recentlyUsedPropertiesGroup, fieldGroups) ? fieldGroups.set(recentlyUsedPropertiesGroup.get('name'), recentlyUsedPropertiesGroup) : fieldGroups;
  var handleOperatorChangeConfirmed = useCallback(function (_ref4) {
    var value = _ref4.target.value;

    if (value) {
      var propertyRecord = value.field;

      if (propertyRecord) {
        RecentlyUsedPropertiesActions.usedProperty(propertyRecord, recentlyUsedProperties, objectType);
      }

      CrmLogger.log('filterInteractions', {
        action: 'add property to advanced filter',
        property: value.field.name
      });
    }
  }, [objectType, recentlyUsedProperties]);
  var handleEditingChange = useCallback(function (_ref5) {
    var value = _ref5.target.value;
    setIsEditingFilter(value);
  }, [setIsEditingFilter]);
  return /*#__PURE__*/_jsxs(UIPanel, {
    width: 400,
    "data-selenium-test": "more-filters-panel",
    children: [/*#__PURE__*/_jsxs(UIPanelHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onClose
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.moreFilters.header"
        })
      })]
    }), /*#__PURE__*/_jsx(UIPanelBody, {
      style: {
        display: 'flex',
        flexDirection: 'column'
      },
      children: /*#__PURE__*/_jsxs(ErrorBoundary, {
        ErrorComponent: ErrorBoundaryComponent,
        boundaryName: "AdvancedFilters_ModalError",
        showRefreshAlert: false,
        children: [!isEditingFilter && !isBoardView && /*#__PURE__*/_jsxs(UIPanelSection, {
          children: [/*#__PURE__*/_jsx(ViewObjectCount, {
            isCrmObject: isCrmObject,
            isPipelineable: isPipelineable,
            objectType: objectType,
            pipelineId: pipelineId,
            view: view
          }), /*#__PURE__*/_jsx(HR, {})]
        }), /*#__PURE__*/_jsx(UIPanelSection, {
          style: {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column'
          },
          children: /*#__PURE__*/_jsx(ContactSearchFilterEditor, {
            hasILSListsGate: hasAllGates('crm:segments:ilsSegmentsUiRollup'),
            className: "overflow-y-auto",
            currencyCode: currencyCode,
            fieldGroups: fieldGroupsWithRecentlyUsed,
            fields: fields,
            filterFamily: objectType,
            isFiscalYearEnabled: isUngatedForFiscalYear,
            isCrmObject: isCrmObject,
            isInitialScreenCreate: filters.size === 0,
            isXoEnabled: true,
            objectName: objectName,
            onChange: onUpdateQuery,
            onDraftChange: onUpdateQuery,
            onEditingChange: handleEditingChange,
            onOperatorConfirmed: handleOperatorChangeConfirmed,
            style: {
              minHeight: '300px',
              width: '100%',
              flex: '1 0 auto'
            },
            value: filters.toJSON()
          })
        })]
      })
    })]
  });
};

AdvancedFiltersContainer.propTypes = {
  filters: ImmutablePropTypes.listOf(PropTypes.instanceOf(ImmutableMap)).isRequired,
  isBoardView: PropTypes.bool.isRequired,
  isCrmObject: PropTypes.bool.isRequired,
  isPipelineable: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  view: ViewType.isRequired
};
export default AdvancedFiltersContainer;