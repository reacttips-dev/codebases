'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import formatPhoneNumber from 'I18n/utils/formatPhoneNumber';
import formatPhoneNumberWithExtension from 'I18n/utils/formatPhoneNumberWithExtension';
export default createReactClass({
  displayName: "FormattedPhoneNumber",
  propTypes: {
    value: PropTypes.string.isRequired,
    extension: PropTypes.string
  },
  render: function render() {
    var _this$props = this.props,
        value = _this$props.value,
        extension = _this$props.extension,
        passThroughProps = _objectWithoutProperties(_this$props, ["value", "extension"]);

    return /*#__PURE__*/_jsx("span", Object.assign({}, passThroughProps, {
      children: extension ? formatPhoneNumberWithExtension(value, extension) : formatPhoneNumber(value)
    }));
  }
});