'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import mrHubBot from 'bender-url!../../img/visitor-widget/bot-avatar.svg';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
export default createReactClass({
  displayName: 'ChatHead',
  propTypes: {
    avatar: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    isBot: PropTypes.bool,
    onClick: PropTypes.func,
    online: PropTypes.bool.isRequired,
    showStatus: PropTypes.bool.isRequired,
    size: PropTypes.string.isRequired,
    style: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      avatar: null,
      away: false,
      disabled: false,
      online: false,
      showStatus: false,
      isVisitorWidget: false,
      size: 'md'
    };
  },
  renderAvatar: function renderAvatar() {
    var _this$props = this.props,
        isBot = _this$props.isBot,
        avatar = _this$props.avatar,
        style = _this$props.style,
        size = _this$props.size,
        online = _this$props.online,
        showStatus = _this$props.showStatus;
    var avatarSrc = avatar;

    if (avatar === null && isBot) {
      avatarSrc = mrHubBot;
    }

    var avatarJSX = /*#__PURE__*/_jsx(VizExAvatar, {
      style: style,
      src: avatarSrc,
      className: "chat-head-avatar",
      size: size
    });

    if (showStatus) {
      var status = online ? OFFLINE : ONLINE;
      return /*#__PURE__*/_jsx(VizExStatusIndicator, {
        status: status,
        size: size,
        children: avatarJSX
      });
    }

    return avatarJSX;
  },
  render: function render() {
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
});