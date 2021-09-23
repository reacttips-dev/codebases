'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { listOf } from 'react-immutable-proptypes';
import FilterEditorOperatorDescription from './FilterEditorOperatorDescription';
import FilterEditorOperatorDescriptionGroupHeader from './FilterEditorOperatorDescriptionGroupHeader';
import FilterOperatorDescriptionType from '../propTypes/FilterOperatorDescriptionType';
import PropTypes from 'prop-types';
import { memo, Fragment, isValidElement } from 'react';

var FilterEditorOperatorDescriptionGroup = function FilterEditorOperatorDescriptionGroup(props) {
  var OperatorDescriptionComponent = props.OperatorDescriptionComponent,
      baseFilterFamily = props.baseFilterFamily,
      currencyCode = props.currencyCode,
      descriptions = props.descriptions,
      filterFamily = props.filterFamily,
      getFieldDefinitions = props.getFieldDefinitions,
      getFilterFamilyGroupHeading = props.getFilterFamilyGroupHeading,
      getLabelString = props.getLabelString,
      getOperatorLabel = props.getOperatorLabel,
      getOperators = props.getOperators,
      getReferencedObjectType = props.getReferencedObjectType,
      getSpecialOptionsForReferenceType = props.getSpecialOptionsForReferenceType,
      getValueResolver = props.getValueResolver,
      isXoEnabled = props.isXoEnabled;
  var content = descriptions.reduce(function (acc, description, index) {
    var children = /*#__PURE__*/_jsx(FilterEditorOperatorDescription, {
      baseFilterFamily: baseFilterFamily,
      currencyCode: currencyCode,
      getFieldDefinitions: getFieldDefinitions,
      getLabelString: getLabelString,
      getOperatorLabel: getOperatorLabel,
      getOperators: getOperators,
      getReferencedObjectType: getReferencedObjectType,
      getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
      getValueResolver: getValueResolver,
      index: index,
      isXoEnabled: isXoEnabled,
      value: description
    }, description.operator.name + "-" + index);

    var WrapperComponent = OperatorDescriptionComponent({
      children: children,
      description: description
    });

    if ( /*#__PURE__*/isValidElement(WrapperComponent)) {
      acc.push(WrapperComponent);
    }

    return acc;
  }, []);

  if (content.length === 0) {
    return null;
  }

  var filterFamilyHeading = getFilterFamilyGroupHeading(filterFamily);
  return filterFamily === baseFilterFamily ? /*#__PURE__*/_jsx(Fragment, {
    children: content
  }) : /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(FilterEditorOperatorDescriptionGroupHeader, {
      children: filterFamilyHeading
    }), content]
  }, filterFamily);
};

FilterEditorOperatorDescriptionGroup.propTypes = {
  OperatorDescriptionComponent: PropTypes.func.isRequired,
  baseFilterFamily: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  descriptions: listOf(FilterOperatorDescriptionType).isRequired,
  filterFamily: PropTypes.string.isRequired,
  getFieldDefinitions: PropTypes.func.isRequired,
  getFilterFamilyGroupHeading: PropTypes.func.isRequired,
  getLabelString: PropTypes.func.isRequired,
  getOperatorLabel: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  getValueResolver: PropTypes.func.isRequired,
  isXoEnabled: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(FilterEditorOperatorDescriptionGroup);