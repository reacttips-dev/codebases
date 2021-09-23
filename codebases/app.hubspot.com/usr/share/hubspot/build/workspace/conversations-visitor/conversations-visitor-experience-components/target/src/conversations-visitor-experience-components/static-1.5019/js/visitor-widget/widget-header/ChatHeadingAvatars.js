'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import ChatHeadGroup from './ChatHeadGroup';
import CustomChatHeading from './CustomChatHeading';

var ChatHeadingAvatars = /*#__PURE__*/function (_PureComponent) {
  _inherits(ChatHeadingAvatars, _PureComponent);

  function ChatHeadingAvatars() {
    _classCallCheck(this, ChatHeadingAvatars);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChatHeadingAvatars).apply(this, arguments));
  }

  _createClass(ChatHeadingAvatars, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          chatHeadingConfig = _this$props.chatHeadingConfig,
          chatHeadingResponders = _this$props.chatHeadingResponders,
          mobile = _this$props.mobile,
          showStatusIndicator = _this$props.showStatusIndicator,
          borderColor = _this$props.borderColor,
          size = _this$props.size;
      var AvatarComponent = chatHeadingResponders.size ? ChatHeadGroup : CustomChatHeading;
      return /*#__PURE__*/_jsx(AvatarComponent, {
        chatHeadingConfig: chatHeadingConfig,
        mobile: mobile,
        responders: chatHeadingResponders,
        showStatusIndicator: showStatusIndicator,
        borderColor: borderColor,
        size: size
      });
    }
  }]);

  return ChatHeadingAvatars;
}(PureComponent);

ChatHeadingAvatars.propTypes = {
  borderColor: PropTypes.string.isRequired,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  mobile: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired
};
ChatHeadingAvatars.defaultProps = {
  mobile: false,
  showStatusIndicator: false,
  size: 'sm'
};
ChatHeadingAvatars.displayName = 'ChatHeadingAvatars';
export default ChatHeadingAvatars;