'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { getRealPath } from '../filterQueryFormat/logic/LogicGroup';
import { getAssociationValueFromFilterBranch } from './strategies/ObjectSegStrategyUtils';
import FilterType from './propTypes/FilterType';
import UISelect from 'UIComponents/input/UISelect';
import { List } from 'immutable';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { FLINT } from 'HubStyleTokens/colors';
import FilterFamilyHeadingAssociationSelectValueComponent from './FilterFamilyHeadingAssociationSelectValueComponent';
import { USER_DEFINED } from '../filterQueryFormat/associations/AssociationCategory';
import { useCallback } from 'react';
import { findAssociationOptionByValue } from '../filters_redesign/hooks/useFlexibleAssociations';
import FilterUserAction from '../filterQueryFormat/FilterUserAction';
import { CHANGED_ASSOCIATION } from '../filterQueryFormat/UsageActionTypes';
export var StyledUISelect = styled(UISelect).withConfig({
  displayName: "FilterFamilyHeadingWithAssociations__StyledUISelect",
  componentId: "sc-1iugwo9-0"
})(["padding:0 !important;"]);
export var StyledDiv = styled.div.withConfig({
  displayName: "FilterFamilyHeadingWithAssociations__StyledDiv",
  componentId: "sc-1iugwo9-1"
})(["max-width:320px;"]);

var getTrackingAssociationType = function getTrackingAssociationType(associationOption) {
  if (associationOption.isPublicPrimary) {
    return 'primary';
  }

  if (associationOption.isWildcard) {
    return 'all';
  }

  return 'label';
};

var getFilterFamilyHeadingWithAssociation = function getFilterFamilyHeadingWithAssociation() {
  var associationOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var associationValue = arguments.length > 1 ? arguments[1] : undefined;
  var flattenedOptions = [];
  associationOptions.forEach(function (option) {
    if (option.options) {
      flattenedOptions.push.apply(flattenedOptions, _toConsumableArray(option.options));
    } else {
      flattenedOptions.push(option);
    }
  });
  var option = flattenedOptions.find(function (opt) {
    return opt.value === associationValue;
  });
  return option ? option.text : associationValue;
};

var FilterFamilyHeadingWithAssociations = function FilterFamilyHeadingWithAssociations(props) {
  var conditionPath = props.conditionPath,
      filterFamily = props.filterFamily,
      getFilterFamilyObjectName = props.getFilterFamilyObjectName,
      getObjectAssociationOptions = props.getObjectAssociationOptions,
      isReadOnly = props.isReadOnly,
      onBranchAssociationChange = props.onBranchAssociationChange,
      value = props.value,
      baseFilterFamily = props.baseFilterFamily,
      onUserAction = props.onUserAction;
  var baseObjectName = getFilterFamilyObjectName(baseFilterFamily);
  var associatedObjectName = getFilterFamilyObjectName(filterFamily);
  var associationOptions = getObjectAssociationOptions(filterFamily);
  var associationValue = getAssociationValueFromFilterBranch(value.getIn(getRealPath(conditionPath)));
  var onAssociationChange = useCallback(function (evt) {
    var newAssociationValue = evt.target.value;
    onBranchAssociationChange(conditionPath, newAssociationValue);

    if (typeof onUserAction === 'function') {
      var associationOption = findAssociationOptionByValue(associationOptions, newAssociationValue);
      onUserAction(FilterUserAction({
        action: CHANGED_ASSOCIATION,
        condition: value,
        filterFamily: filterFamily,
        subAction: getTrackingAssociationType(associationOption)
      }));
    }
  }, [associationOptions, conditionPath, filterFamily, onBranchAssociationChange, onUserAction, value]); // show raw association value initially (e.g. `1--HUBSPOT_DEFINED`)

  var associationLabel = associationValue; // if associations are loaded but empty render "Any" association label

  if (associationOptions && associationOptions.length === 0) {
    associationLabel = /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterFamilyGroupHeadingTranslator.CRM_OBJECT_ANY",
      options: {
        entityName: associatedObjectName
      }
    });
  } // in read only mode render association label as a text
  else if (associationOptions && associationOptions.length && isReadOnly) {
      var message = associationValue.endsWith(USER_DEFINED) ? 'customerDataFilters.FilterFamilyGroupHeadingAssociation.labeled' : 'customerDataFilters.FilterFamilyGroupHeadingAssociation.primaryOrAny';
      associationLabel = /*#__PURE__*/_jsx(FormattedMessage, {
        message: message,
        options: {
          associationLabel: getFilterFamilyHeadingWithAssociation(associationOptions, associationValue)
        }
      });
    } // in edit mode render association label as a select
    else if (associationOptions && associationOptions.length && !isReadOnly) {
        associationLabel = /*#__PURE__*/_jsx(StyledUISelect, {
          buttonUse: "transparent",
          className: "inline-block",
          menuWidth: 300,
          onChange: onAssociationChange,
          options: associationOptions,
          placement: "bottom right",
          value: associationValue,
          valueComponent: FilterFamilyHeadingAssociationSelectValueComponent
        });
      }

  return /*#__PURE__*/_jsxs("span", {
    className: "display-block p-left-4 p-right-3",
    children: [/*#__PURE__*/_jsx("strong", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterFamilyGroupHeadingTranslator.CRM_OBJECT_ASSOCIATED",
        options: {
          baseObjectName: baseObjectName,
          entityName: associatedObjectName
        }
      })
    }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(StyledDiv, {
      className: "association-label",
      children: associationLabel
    }), /*#__PURE__*/_jsx("span", {
      style: {
        color: FLINT
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterFamilyGroupHeadingAssociation.where"
      })
    })]
  });
};

FilterFamilyHeadingWithAssociations.propTypes = {
  baseFilterFamily: PropTypes.string.isRequired,
  conditionPath: PropTypes.instanceOf(List),
  filterFamily: PropTypes.string.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  getObjectAssociationOptions: PropTypes.func,
  isReadOnly: PropTypes.bool.isRequired,
  onBranchAssociationChange: PropTypes.func,
  onUserAction: PropTypes.func,
  value: FilterType.isRequired
};
export default FilterFamilyHeadingWithAssociations;