'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import CallDispositionsContainer from '../../call-types-outcomes/containers/CallDispositionsContainer';
import ActivityTypesContainer from '../../call-types-outcomes/containers/ActivityTypesContainer';
import AsyncBETActivityTypeSelect from '../../bet-activity-types/components/AsyncBETActivityTypeSelect';
import SectionLabel from '../../active-call-settings/components/SectionLabel';
var CallDispositionsWrapper = styled.div.withConfig({
  displayName: "PostCallHeader__CallDispositionsWrapper",
  componentId: "kxowro-0"
})(["flex-shrink:2;font-size:90%;"]);
var ActivityTypesWrapper = styled.div.withConfig({
  displayName: "PostCallHeader__ActivityTypesWrapper",
  componentId: "kxowro-1"
})(["flex-shrink:2;font-size:90%;height:24px;"]);

var PostCallHeader = /*#__PURE__*/function (_PureComponent) {
  _inherits(PostCallHeader, _PureComponent);

  function PostCallHeader() {
    _classCallCheck(this, PostCallHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(PostCallHeader).apply(this, arguments));
  }

  _createClass(PostCallHeader, [{
    key: "renderBETActivityType",
    value: function renderBETActivityType() {
      var disabled = this.props.disabled;
      return /*#__PURE__*/_jsx(AsyncBETActivityTypeSelect, {
        disabled: disabled,
        selectedDisposition: this.props.selectedDisposition
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          activityTypesAreEnabled = _this$props.activityTypesAreEnabled,
          isScopedForBETActivityTypes = _this$props.isScopedForBETActivityTypes,
          disabled = _this$props.disabled,
          hasCallTypesCapability = _this$props.hasCallTypesCapability,
          hasCalloutcomesCapability = _this$props.hasCalloutcomesCapability;

      if (!hasCallTypesCapability && !hasCalloutcomesCapability && !isScopedForBETActivityTypes) {
        return null;
      }

      return /*#__PURE__*/_jsxs("div", {
        className: "call-done-properties align-center p-x-3 p-y-2",
        children: [/*#__PURE__*/_jsx(SectionLabel, {
          className: "m-right-3",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.dispositions.label"
          })
        }), hasCalloutcomesCapability && /*#__PURE__*/_jsx(CallDispositionsWrapper, {
          children: /*#__PURE__*/_jsx(CallDispositionsContainer, {
            disabled: disabled
          })
        }), hasCallTypesCapability && activityTypesAreEnabled && !isScopedForBETActivityTypes && /*#__PURE__*/_jsx(ActivityTypesWrapper, {
          children: /*#__PURE__*/_jsx(ActivityTypesContainer, {
            disabled: disabled
          })
        }), isScopedForBETActivityTypes && this.renderBETActivityType()]
      });
    }
  }]);

  return PostCallHeader;
}(PureComponent);

PostCallHeader.propTypes = {
  activityTypesAreEnabled: PropTypes.bool.isRequired,
  isScopedForBETActivityTypes: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  selectedDisposition: PropTypes.string,
  hasCalloutcomesCapability: PropTypes.bool.isRequired,
  hasCallTypesCapability: PropTypes.bool.isRequired
};
export { PostCallHeader as default };