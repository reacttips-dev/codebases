'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import FilterEditorOperatorDisplay from '../FilterEditorOperatorDisplay';
import FilterOperatorDescriptionType from '../propTypes/FilterOperatorDescriptionType';
import FilterOperatorErrorRecord from 'customer-data-filters/filterQueryFormat/FilterOperatorErrorRecord';
import PropTypes from 'prop-types';
import { memo } from 'react';
import always from 'transmute/always';
import emptyFunction from 'react-utils/emptyFunction';
var FilterEditorOperatorDescription = /*#__PURE__*/memo(function (props) {
  var index = props.index,
      baseFilterFamily = props.baseFilterFamily,
      value = props.value,
      rest = _objectWithoutProperties(props, ["index", "baseFilterFamily", "value"]);

  var filterFamily = value.filterFamily,
      operator = value.operator;
  return /*#__PURE__*/_jsx(FilterEditorOperatorDisplay, Object.assign({}, rest, {
    filterFamily: filterFamily || baseFilterFamily,
    handleOpenEdit: emptyFunction,
    handleOperatorRemove: emptyFunction,
    isReadOnly: true,
    isZeroLevel: true,
    operator: operator,
    path: List.of(index),
    showInvalidOptionErrors: false,
    validateOperator: always(FilterOperatorErrorRecord({
      error: false
    }))
  }));
});
FilterEditorOperatorDescription.propTypes = {
  baseFilterFamily: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: FilterOperatorDescriptionType
};
export default FilterEditorOperatorDescription;