'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import styled from 'styled-components';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
var CallingOnboardingWrapper = styled.div.withConfig({
  displayName: "OnboardingResizeWrapper__CallingOnboardingWrapper",
  componentId: "ezbvym-0"
})(["height:100vh;"]);

var OnboardingResizeWrapper = /*#__PURE__*/function (_PureComponent) {
  _inherits(OnboardingResizeWrapper, _PureComponent);

  function OnboardingResizeWrapper() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, OnboardingResizeWrapper);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(OnboardingResizeWrapper)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.hasQueuedDimensionsUpdate = false;
    return _this;
  }

  _createClass(OnboardingResizeWrapper, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return /*#__PURE__*/_jsx(CallingOnboardingWrapper, {
        className: "twilio-not-enabled flex-column align-center",
        children: children
      });
    }
  }]);

  return OnboardingResizeWrapper;
}(PureComponent);

OnboardingResizeWrapper.contextType = CallExtensionsContext;
export { OnboardingResizeWrapper as default };