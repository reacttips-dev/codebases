'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getDefaultNullValue, isOperatorIncludesObjectsWithNoValueSet } from '../../utilities/defaultNullValue';
import After from '../../filterQueryFormat/operator/After';
import DefaultNullValueRecord from '../../filterQueryFormat/DefaultNullValueRecord';
import FilterOperatorType from '../propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import UICheckbox from 'UIComponents/input/UICheckbox';

function FilterOperatorIncludeObjectsWithNoValueSetInput(props) {
  var onChange = props.onChange,
      value = props.value,
      filterFamily = props.filterFamily,
      getObjectPropertyLabel = props.getObjectPropertyLabel;
  var onCheckboxChange = useCallback(function (evt) {
    var isChecked = evt.target.checked;
    var defaultNullValue = isChecked ? getDefaultNullValue(value, true) : DefaultNullValueRecord();
    onChange(defaultNullValue);
  }, [value, onChange]);
  var unknownFieldLabel = value.field.label;

  if (After.isAfter(value)) {
    unknownFieldLabel = getObjectPropertyLabel(filterFamily, value.value);
  }

  var isChecked = isOperatorIncludesObjectsWithNoValueSet(value);
  return /*#__PURE__*/_jsx(UICheckbox, {
    checked: isChecked,
    onChange: onCheckboxChange,
    size: "small",
    style: {
      minHeight: 'auto'
    },
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoValueSet",
      options: {
        label: unknownFieldLabel
      }
    })
  });
}

FilterOperatorIncludeObjectsWithNoValueSetInput.propTypes = {
  filterFamily: PropTypes.string.isRequired,
  getObjectPropertyLabel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: FilterOperatorType.isRequired
};
export default FilterOperatorIncludeObjectsWithNoValueSetInput;