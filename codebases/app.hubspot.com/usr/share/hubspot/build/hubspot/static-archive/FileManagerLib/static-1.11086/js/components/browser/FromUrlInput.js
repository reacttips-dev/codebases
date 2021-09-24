'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UITextInput from 'UIComponents/input/UITextInput';
import UIButton from 'UIComponents/button/UIButton';
export default function FromUrlInput(_ref) {
  var error = _ref.error,
      value = _ref.value,
      onKeyUp = _ref.onKeyUp,
      onChange = _ref.onChange,
      onPreview = _ref.onPreview,
      disabled = _ref.disabled;
  return /*#__PURE__*/_jsxs(UIMedia, {
    children: [/*#__PURE__*/_jsx(UIMediaBody, {
      children: /*#__PURE__*/_jsx(UITextInput, {
        value: value,
        placeholder: I18n.text('FileManagerLib.fromUrlPlaceholder'),
        error: !!error,
        onKeyUp: onKeyUp,
        onChange: onChange
      })
    }), /*#__PURE__*/_jsx(UIMediaRight, {
      children: /*#__PURE__*/_jsx(UIButton, {
        onClick: onPreview,
        use: "tertiary-light",
        disabled: disabled,
        children: I18n.text('FileManagerLib.actions.preview')
      })
    })]
  });
}
FromUrlInput.propTypes = {
  error: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired
};
FromUrlInput.defaultProps = {
  disabled: false
};