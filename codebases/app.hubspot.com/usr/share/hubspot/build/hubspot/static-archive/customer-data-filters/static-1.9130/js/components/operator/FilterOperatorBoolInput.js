'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import PropTypes from 'prop-types';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIViewController from 'UIComponents/input/UIViewController';
import unescapedText from 'I18n/utils/unescapedText';
import I18n from 'I18n';

var FilterOperatorBoolInput = function FilterOperatorBoolInput(_ref) {
  var className = _ref.className,
      error = _ref.error,
      onChange = _ref.onChange,
      value = _ref.value;
  return /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('customerDataFilters.FilterOperatorInput.ariaLabel'),
    error: error.get('error'),
    validationMessage: error.get('error') ? error.get('message') : null,
    children: /*#__PURE__*/_jsx(UIViewController, {
      className: className,
      onChange: onChange,
      options: [{
        text: unescapedText('customerDataFilters.DisplayValue.booleanTrue'),
        value: true
      }, {
        text: unescapedText('customerDataFilters.DisplayValue.booleanFalse'),
        value: false
      }],
      size: "sm",
      value: value
    })
  });
};

FilterOperatorBoolInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool
};
export default FilterOperatorBoolInput;