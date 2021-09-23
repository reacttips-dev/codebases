'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import styled from 'styled-components';
import { microInputMixin } from './internal/inputMixins';
import UITimeInput from './UITimeInput';
var TimeInputWrapper = styled(UITimeInput).withConfig({
  displayName: "UIMicroTimeInput__TimeInputWrapper",
  componentId: "sc-1x9idnk-0"
})(["display:inline-block;"]);
var MicroInput = styled(UITimeInput.defaultProps.Input).withConfig({
  displayName: "UIMicroTimeInput__MicroInput",
  componentId: "sc-1x9idnk-1"
})(["&&{", ";}"], microInputMixin);

var UIMicroTimeInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIMicroTimeInput, _PureComponent);

  function UIMicroTimeInput() {
    _classCallCheck(this, UIMicroTimeInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIMicroTimeInput).apply(this, arguments));
  }

  _createClass(UIMicroTimeInput, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(TimeInputWrapper, Object.assign({
        iconSize: 14,
        inputWidth: 124
      }, this.props));
    }
  }]);

  return UIMicroTimeInput;
}(PureComponent);

UIMicroTimeInput.propTypes = UITimeInput.propTypes;
UIMicroTimeInput.defaultProps = Object.assign({}, UITimeInput.defaultProps, {
  Input: MicroInput
});
UIMicroTimeInput.displayName = 'UIMicroTimeInput';
export default UIMicroTimeInput;