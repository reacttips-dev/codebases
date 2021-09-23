'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import * as FilterContactSearch from 'customer-data-filters/converters/contactSearch/FilterContactSearch';
import * as LogicGroup from 'customer-data-filters/filterQueryFormat/logic/LogicGroup';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { fromJS, Map as ImmutableMap } from 'immutable';
import { CALYPSO_LIGHT, FLINT } from 'HubStyleTokens/colors';
import { MEDIUM_CLOSE_BUTTON_SIZE } from 'HubStyleTokens/sizes';
import DatetimeQuickFilter from './quickFilters/DatetimeQuickFilter';
import NumberQuickFilter from './quickFilters/NumberQuickFilter';
import EnumQuickFilter from './quickFilters/EnumQuickFilter';
import StringQuickFilter from './quickFilters/StringQuickFilter';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import identity from 'transmute/identity';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import get from 'transmute/get';
import styled from 'styled-components';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import { useProperties } from '../rewrite/properties/hooks/useProperties';
import { useIsVisibleFilterPropertyName } from '../rewrite/properties/hooks/useIsVisibleFilterPropertyName';
import DurationQuickFilter from './quickFilters/DurationQuickFilter';

var getQuickFilterComponentForPropertyRecord = function getQuickFilterComponentForPropertyRecord(_ref) {
  var type = _ref.type,
      name = _ref.name,
      numberDisplayHint = _ref.numberDisplayHint;

  if (numberDisplayHint === 'duration') {
    return DurationQuickFilter;
  }

  switch (type) {
    case PropertyTypes.DATE_TIME:
      return DatetimeQuickFilter;

    case PropertyTypes.ENUMERATION:
      return EnumQuickFilter;

    case PropertyTypes.BOOLEAN:
      if (name === 'hs_call_has_transcript') {
        return EnumQuickFilter;
      }

      return null;

    case PropertyTypes.NUMBER:
      return NumberQuickFilter;

    case PropertyTypes.STRING:
      return StringQuickFilter;

    default:
      return null;
  }
};

export var QuickFilterWrapper = styled.div.attrs(function (props) {
  return {
    'data-selenium-info': props.isActive ? 'filterbar-highlighted' : 'filterbar-plain',
    'data-selenium-name': "quickfilters-" + props.name + "-wrapper",
    'data-selenium-test': 'quick-filter-wrapper',
    className: 'm-right-3'
  };
}).withConfig({
  displayName: "QuickFilterContainer__QuickFilterWrapper",
  componentId: "sc-1d4ql6q-0"
})(["display:inline-flex;", ";"], function (props) {
  return props.isActive && "background-color: " + CALYPSO_LIGHT + ";border-radius: 3px;";
});
var QuickFilterButtonWrapper = styled.div.withConfig({
  displayName: "QuickFilterContainer__QuickFilterButtonWrapper",
  componentId: "sc-1d4ql6q-1"
})(["display:flex;"]);
var RemoveQuickFilterButton = styled(UIIconButton).attrs({
  size: 'extra-small',
  use: 'transparent',
  color: FLINT
}).withConfig({
  displayName: "QuickFilterContainer__RemoveQuickFilterButton",
  componentId: "sc-1d4ql6q-2"
})(["&&{font-size:", ";}"], MEDIUM_CLOSE_BUTTON_SIZE);
var QuickFilterContainer = /*#__PURE__*/forwardRef(function (_ref2, ref) {
  var filters = _ref2.filters,
      objectType = _ref2.objectType,
      onUpdateQuery = _ref2.onUpdateQuery,
      quickFilterPropertyNames = _ref2.quickFilterPropertyNames;
  var allProperties = useProperties();
  var isVisibleFilterPropertyName = useIsVisibleFilterPropertyName();
  var quickFilterProperties = useMemo(function () {
    return fromJS(quickFilterPropertyNames.map(function (quickFilter) {
      return allProperties.get(quickFilter);
    }).filter(identity).filter(function (property) {
      return isVisibleFilterPropertyName(property.get('name'));
    }));
  }, [allProperties, quickFilterPropertyNames, isVisibleFilterPropertyName]);
  var onQuickFilterChange = useCallback(function (property, newFilter) {
    var unchangedFilters = filters.filter(function (filter) {
      return get('property', filter) !== property;
    }).toJS();

    if (!newFilter) {
      onUpdateQuery(unchangedFilters);
      return;
    }

    var unchangedFiltersInFilterQueryFormat = FilterContactSearch.fromContactSearch(allProperties, unchangedFilters, objectType);
    onUpdateQuery(FilterContactSearch.toContactSearch(LogicGroup.addCondition(newFilter, unchangedFiltersInFilterQueryFormat)));
    CrmLogger.log('filterInteractions', {
      action: 'add property to quick filter',
      property: property
    });
  }, [allProperties, objectType, onUpdateQuery, filters]);
  var onQuickFilterClear = useCallback(function (property) {
    onQuickFilterChange(property, null);
  }, [onQuickFilterChange]);

  var changedFilter = function changedFilter(property) {
    return filters.some(function (filter) {
      return get('property', filter) === property.name;
    });
  };

  return /*#__PURE__*/_jsx("div", {
    ref: ref,
    "data-selenium-test": "quick-filter-container",
    "data-onboarding": "gob385-filters-wrapper",
    children: quickFilterProperties.toList().map(function (propertyRecord) {
      var filterForProperty = filters.find(function (filter) {
        return get('property', filter) === propertyRecord.name;
      });
      var QuickFilterComponent = getQuickFilterComponentForPropertyRecord(propertyRecord);

      if (!QuickFilterComponent) {
        return null;
      }

      var name = propertyRecord.name;
      return /*#__PURE__*/_jsxs(QuickFilterWrapper, {
        isActive: changedFilter(propertyRecord),
        name: name,
        children: [/*#__PURE__*/_jsx(QuickFilterComponent, {
          filter: filterForProperty,
          objectType: objectType,
          onValueChange: onQuickFilterChange,
          property: propertyRecord
        }, name), changedFilter(propertyRecord) && /*#__PURE__*/_jsx(QuickFilterButtonWrapper, {
          children: /*#__PURE__*/_jsx(RemoveQuickFilterButton, {
            "data-selenium-test": "quickfilters-clear-" + name,
            onClick: function onClick() {
              return onQuickFilterClear(name);
            },
            children: /*#__PURE__*/_jsx(UIIcon, {
              name: "remove",
              color: FLINT
            })
          })
        })]
      }, name);
    })
  });
});
QuickFilterContainer.propTypes = {
  filters: ImmutablePropTypes.listOf(PropTypes.instanceOf(ImmutableMap)).isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  quickFilterPropertyNames: PropTypes.arrayOf(PropTypes.string)
};
export default QuickFilterContainer;