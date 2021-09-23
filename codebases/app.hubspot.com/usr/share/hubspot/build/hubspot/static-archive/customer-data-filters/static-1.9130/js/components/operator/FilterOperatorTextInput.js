'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import PropTypes from 'prop-types';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';

var FilterOperatorTextInput = function FilterOperatorTextInput(props) {
  var className = props.className,
      error = props.error,
      onChange = props.onChange,
      value = props.value;
  var isError = error.get('error');
  var errorMessage = error.get('message');
  return /*#__PURE__*/_jsx(UIFormControl, {
    error: isError,
    validationMessage: isError ? errorMessage : null,
    children: /*#__PURE__*/_jsx(UITextInput, {
      autoFocus: true,
      className: className,
      onChange: onChange,
      value: value
    })
  });
};

FilterOperatorTextInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
export default FilterOperatorTextInput;