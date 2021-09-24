'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { OLAF } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import { getUserId, getAvatar, getIsBot } from 'conversations-internal-schema/responders/operators/responderGetters';
import { isAvailable } from 'conversations-internal-schema/responders/operators/isAvailable';
import ChatHead from './ChatHead';
var BORDER_WIDTH = 2;

var chatHeadCenter = function chatHeadCenter() {
  var borderColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : OLAF;
  return {
    border: BORDER_WIDTH + "px solid " + borderColor,
    background: "" + borderColor,
    borderRadius: '50%',
    zIndex: 0
  };
};

var getMarginLeft = function getMarginLeft(size) {
  switch (size) {
    case 'sm':
      return -10;

    case 'xs':
      return -15;

    default:
      return -10;
  }
};

var chatHeadRight = function chatHeadRight(borderColor, zIndex, size) {
  return Object.assign({}, chatHeadCenter(borderColor), {
    zIndex: zIndex,
    marginLeft: getMarginLeft(size)
  });
};

var ChatHeadGroupWrapper = styled.div.withConfig({
  displayName: "ChatHeadGroup__ChatHeadGroupWrapper",
  componentId: "w9aqu3-0"
})(["display:flex;flex:0 0 ", "px;height:", "px;justify-content:center;"], function (_ref) {
  var size = _ref.size;
  return size;
}, function (_ref2) {
  var size = _ref2.size;
  return AVATAR_SIZES[size] + BORDER_WIDTH * 2;
});

function getChatHeadStyle(index, borderColor, size) {
  if (index >= 1) {
    return chatHeadRight(borderColor, index, size);
  }

  return chatHeadCenter(borderColor);
}

function ChatHeadGroup(_ref3) {
  var showStatusIndicator = _ref3.showStatusIndicator,
      responders = _ref3.responders,
      borderColor = _ref3.borderColor,
      size = _ref3.size;
  var chatHeadElements = responders.map(function (responder, index) {
    var avatar = getAvatar(responder);
    var online = isAvailable(responder);
    var isBot = getIsBot(responder);
    var userId = getUserId(responder);
    var style = getChatHeadStyle(index, borderColor, size);
    var className = 'chat-head' + (index >= 1 ? " chat-group-head-right" : "");
    return /*#__PURE__*/_jsx(ChatHead, {
      avatar: avatar,
      className: className,
      isBot: isBot,
      isVisitorWidget: true,
      online: online,
      responder: responder,
      showStatus: showStatusIndicator,
      size: size,
      style: style
    }, "chat-head." + userId);
  });
  return /*#__PURE__*/_jsx(ChatHeadGroupWrapper, {
    size: size,
    children: chatHeadElements
  });
}

ChatHeadGroup.propTypes = {
  borderColor: PropTypes.string.isRequired,
  responders: PropTypes.instanceOf(List).isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired
};
ChatHeadGroup.defaultProps = {
  showStatusIndicator: false,
  size: 'sm'
};
ChatHeadGroup.displayName = 'ChatHeadGroup';
export default ChatHeadGroup;