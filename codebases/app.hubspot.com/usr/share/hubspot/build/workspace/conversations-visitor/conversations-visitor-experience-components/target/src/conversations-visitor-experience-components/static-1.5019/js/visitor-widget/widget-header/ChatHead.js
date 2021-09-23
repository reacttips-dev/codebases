'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { isAway } from 'conversations-internal-schema/responders/operators/isAway';
import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';

var ChatHead = /*#__PURE__*/function (_Component) {
  _inherits(ChatHead, _Component);

  function ChatHead() {
    _classCallCheck(this, ChatHead);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChatHead).apply(this, arguments));
  }

  _createClass(ChatHead, [{
    key: "renderAvatar",
    value: function renderAvatar() {
      var _this$props = this.props,
          avatar = _this$props.avatar,
          size = _this$props.size,
          responder = _this$props.responder,
          showStatus = _this$props.showStatus,
          style = _this$props.style;

      var avatarJSX = /*#__PURE__*/_jsx(VizExAvatar, {
        style: style,
        src: avatar,
        className: "chat-head-avatar",
        size: size
      });

      if (showStatus && responder) {
        var status = isAway(responder) ? OFFLINE : ONLINE;
        return /*#__PURE__*/_jsx(VizExStatusIndicator, {
          status: status,
          size: size,
          children: avatarJSX
        });
      }

      return avatarJSX;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          onClick = _this$props2.onClick,
          className = _this$props2.className,
          disabled = _this$props2.disabled;
      var classes = classNames('chat-head', className, disabled && 'chat-head-disabled');
      return /*#__PURE__*/_jsx("div", {
        className: classes,
        onClick: onClick,
        children: this.renderAvatar()
      });
    }
  }]);

  return ChatHead;
}(Component);

ChatHead.propTypes = {
  avatar: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  responder: RecordPropType('Responder'),
  showStatus: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
  style: PropTypes.object
};
ChatHead.defaultProps = {
  avatar: null,
  away: false,
  disabled: false,
  online: false,
  showStatus: false,
  isVisitorWidget: false,
  size: 'md'
};
ChatHead.displayName = 'ChatHead';
export default ChatHead;