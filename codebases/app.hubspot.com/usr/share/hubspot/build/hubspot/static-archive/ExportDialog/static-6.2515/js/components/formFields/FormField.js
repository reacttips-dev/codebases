'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

function createChangeHandler(changeCallback, key) {
  return function (newValue) {
    return changeCallback(key, newValue);
  };
} // High-order component to create a consistent API for adding form fields
// to the dialog.


export default function createFormField(WrappedComponent, key) {
  function FormField(_ref) {
    var onChange = _ref.onChange,
        value = _ref.value,
        rest = _objectWithoutProperties(_ref, ["onChange", "value"]);

    return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({
      value: value,
      onChange: createChangeHandler(onChange, key)
    }, rest), key);
  }

  FormField.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
  };
  FormField.key = key;
  return FormField;
}