'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { getAnyCompanyLogo } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCompanyLogo';
import styled from 'styled-components';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
var BORDER_WIDTH = 2;
var CustomUIAvatarWrapper = styled.div.withConfig({
  displayName: "CustomChatHeading__CustomUIAvatarWrapper",
  componentId: "u69och-0"
})(["display:flex;flex:0 0 ", "px;height:", "px;justify-content:center;"], function (_ref) {
  var size = _ref.size;
  return size;
}, function (_ref2) {
  var size = _ref2.size;
  return AVATAR_SIZES[size] + BORDER_WIDTH * 2;
});
var CustomUIAvatar = styled(VizExAvatar).withConfig({
  displayName: "CustomChatHeading__CustomUIAvatar",
  componentId: "u69och-1"
})(["border-radius:50%;background:", ";border-color:", ";border-width:2px;border-style:solid;"], function (props) {
  return props.borderColor;
}, function (props) {
  return props.borderColor;
});

var CustomChatHeading = /*#__PURE__*/function (_Component) {
  _inherits(CustomChatHeading, _Component);

  function CustomChatHeading() {
    _classCallCheck(this, CustomChatHeading);

    return _possibleConstructorReturn(this, _getPrototypeOf(CustomChatHeading).apply(this, arguments));
  }

  _createClass(CustomChatHeading, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          borderColor = _this$props.borderColor,
          chatHeadingConfig = _this$props.chatHeadingConfig,
          size = _this$props.size;
      var borderStyles = {
        border: "2px solid " + borderColor,
        background: "" + borderColor,
        borderRadius: '50%'
      };
      var src = getAnyCompanyLogo(chatHeadingConfig);

      if (!chatHeadingConfig) {
        return null;
      }

      return /*#__PURE__*/_jsx(CustomUIAvatarWrapper, {
        children: /*#__PURE__*/_jsx(CustomUIAvatar, {
          className: "chat-head-avatar",
          size: size,
          src: src,
          style: borderStyles
        })
      });
    }
  }]);

  return CustomChatHeading;
}(Component);

CustomChatHeading.propTypes = {
  borderColor: PropTypes.string.isRequired,
  chatHeadingConfig: PropTypes.oneOfType([RecordPropType('CompanyChatHeadingConfig'), RecordPropType('OwnerChatHeadingConfig'), RecordPropType('UsersAndTeamsChatHeadingConfig')]),
  size: PropTypes.string.isRequired
};
CustomChatHeading.defaultProps = {
  size: 'sm'
};
CustomChatHeading.displayName = 'CustomChatHeading';
export default CustomChatHeading;