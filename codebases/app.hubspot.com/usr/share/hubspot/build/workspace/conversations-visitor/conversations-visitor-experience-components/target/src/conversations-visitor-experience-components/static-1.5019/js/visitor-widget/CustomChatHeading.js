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
import { getChatHeadGroupStyle } from '../util/getChatHeadGroupStyle';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';

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
          chatHeadingConfig = _this$props.chatHeadingConfig,
          mobile = _this$props.mobile,
          size = _this$props.size;
      var src = getAnyCompanyLogo(chatHeadingConfig);

      if (!chatHeadingConfig) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: "justify-center align-center",
        style: getChatHeadGroupStyle({
          mobile: mobile
        }),
        children: /*#__PURE__*/_jsx(VizExAvatar, {
          src: src,
          className: "chat-head-avatar",
          size: size
        })
      });
    }
  }]);

  return CustomChatHeading;
}(Component);

CustomChatHeading.propTypes = {
  chatHeadingConfig: PropTypes.oneOfType([RecordPropType('CompanyChatHeadingConfig'), RecordPropType('OwnerChatHeadingConfig')]),
  mobile: PropTypes.bool,
  size: PropTypes.string.isRequired
};
CustomChatHeading.displayName = 'CustomChatHeading';
export default CustomChatHeading;