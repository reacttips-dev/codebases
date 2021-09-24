'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { ChatWidgetLocaleContextConsumer } from '../ChatWidgetLocaleContext';
import ThreadListHeader from './ThreadListHeader';
import WidgetHeaderAvatarWrapper from './WidgetHeaderAvatarWrapper';

var WidgetHeaderContent = /*#__PURE__*/function (_Component) {
  _inherits(WidgetHeaderContent, _Component);

  function WidgetHeaderContent() {
    _classCallCheck(this, WidgetHeaderContent);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetHeaderContent).apply(this, arguments));
  }

  _createClass(WidgetHeaderContent, [{
    key: "render",
    value: function render() {
      var textColor = this.props.coloring.textColor;
      var _this$props = this.props,
          availabilityMessage = _this$props.availabilityMessage,
          chatHeadingConfig = _this$props.chatHeadingConfig,
          chatHeadingResponders = _this$props.chatHeadingResponders,
          createNewThread = _this$props.createNewThread,
          customHeaderText = _this$props.customHeaderText,
          mobile = _this$props.mobile,
          showAvailabilityMessage = _this$props.showAvailabilityMessage,
          showCreateThreadButton = _this$props.showCreateThreadButton,
          showStatusIndicator = _this$props.showStatusIndicator,
          showThreadListHeader = _this$props.showThreadListHeader;
      return /*#__PURE__*/_jsx(Fragment, {
        children: showThreadListHeader ? /*#__PURE__*/_jsx(ThreadListHeader, {
          createNewThread: createNewThread,
          customHeaderText: customHeaderText,
          textColor: textColor,
          mobile: mobile,
          showCreateThreadButton: showCreateThreadButton
        }) : /*#__PURE__*/_jsx(ChatWidgetLocaleContextConsumer, {
          children: function children(locale) {
            return /*#__PURE__*/_jsx(WidgetHeaderAvatarWrapper, {
              availabilityMessage: availabilityMessage,
              borderColor: textColor,
              chatHeadingConfig: chatHeadingConfig,
              chatHeadingResponders: chatHeadingResponders,
              locale: locale,
              mobile: mobile,
              showAvailabilityMessage: showAvailabilityMessage,
              showStatusIndicator: showStatusIndicator
            });
          }
        })
      });
    }
  }]);

  return WidgetHeaderContent;
}(Component);

WidgetHeaderContent.propTypes = {
  availabilityMessage: PropTypes.string,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  coloring: RecordPropType('ColoringRecord').isRequired,
  createNewThread: PropTypes.func.isRequired,
  customHeaderText: PropTypes.string,
  mobile: PropTypes.bool,
  showAvailabilityMessage: PropTypes.bool.isRequired,
  showCreateThreadButton: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  showThreadListHeader: PropTypes.bool.isRequired
};
WidgetHeaderContent.displayName = 'WidgetHeaderContent';
export default WidgetHeaderContent;