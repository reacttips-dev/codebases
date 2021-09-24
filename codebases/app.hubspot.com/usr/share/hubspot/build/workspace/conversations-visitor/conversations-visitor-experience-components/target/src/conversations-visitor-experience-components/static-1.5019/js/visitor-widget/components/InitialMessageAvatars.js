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
import InitialMessageChatHeadGroup from './InitialMessageChatHeadGroup';
import CustomChatHeading from '../CustomChatHeading';

var InitialMessageAvatars = /*#__PURE__*/function (_PureComponent) {
  _inherits(InitialMessageAvatars, _PureComponent);

  function InitialMessageAvatars() {
    _classCallCheck(this, InitialMessageAvatars);

    return _possibleConstructorReturn(this, _getPrototypeOf(InitialMessageAvatars).apply(this, arguments));
  }

  _createClass(InitialMessageAvatars, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          chatHeadingConfig = _this$props.chatHeadingConfig,
          chatHeadingResponders = _this$props.chatHeadingResponders,
          mobile = _this$props.mobile,
          showStatusIndicator = _this$props.showStatusIndicator;
      var size = mobile ? 'sm' : 'md';
      var AvatarComponent = chatHeadingResponders.size ? InitialMessageChatHeadGroup : CustomChatHeading;
      return /*#__PURE__*/_jsx(AvatarComponent, {
        size: size,
        mobile: mobile,
        responders: chatHeadingResponders,
        chatHeadingConfig: chatHeadingConfig,
        showStatusIndicator: showStatusIndicator
      });
    }
  }]);

  return InitialMessageAvatars;
}(PureComponent);

InitialMessageAvatars.propTypes = {
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List).isRequired,
  mobile: PropTypes.bool.isRequired,
  showStatusIndicator: PropTypes.bool.isRequired
};
InitialMessageAvatars.defaultProps = {
  mobile: false,
  showStatusIndicator: false
};
InitialMessageAvatars.displayName = 'InitialMessageAvatars';
export default InitialMessageAvatars;