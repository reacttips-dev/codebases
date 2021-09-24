'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import ChatHead from '../ChatHead';
import { getUserId, getAvatar, getIsBot } from 'conversations-internal-schema/responders/operators/responderGetters';
import { isAvailable } from 'conversations-internal-schema/responders/operators/isAvailable';
import { getChatHeadGroupStyle } from '../../util/getChatHeadGroupStyle';

function getChatHeadClassName(total, index) {
  switch (true) {
    case total === 3 && index === 0:
      return 'chat-head-left chat-head-shrink';

    case total === 3 && index === 1:
      return 'chat-head-center';

    case total === 3 && index === 2:
      return 'chat-head-right chat-head-shrink';

    case total === 2 && index === 0:
      return 'chat-head-left';

    case total === 2 && index === 1:
      return 'chat-head-right';

    default:
      return '';
  }
}

function InitialMessageChatHeadGroup(_ref) {
  var showStatusIndicator = _ref.showStatusIndicator,
      size = _ref.size,
      responders = _ref.responders,
      mobile = _ref.mobile;
  var numResponders = responders.size;
  var chatHeadElements = responders.map(function (responder, index) {
    var avatar = getAvatar(responder);
    var online = isAvailable(responder);
    var isBot = getIsBot(responder);
    var userId = getUserId(responder);
    var className = getChatHeadClassName(numResponders, index);
    return /*#__PURE__*/_jsx(ChatHead, {
      className: className,
      size: size,
      avatar: avatar,
      online: online,
      responder: responder,
      isBot: isBot,
      showStatus: showStatusIndicator,
      isVisitorWidget: true
    }, "chat-head." + userId);
  });
  return /*#__PURE__*/_jsx("div", {
    className: "justify-center",
    style: getChatHeadGroupStyle({
      mobile: mobile
    }),
    children: chatHeadElements
  });
}

InitialMessageChatHeadGroup.propTypes = {
  mobile: PropTypes.bool,
  responders: PropTypes.instanceOf(List).isRequired,
  showStatusIndicator: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired
};
InitialMessageChatHeadGroup.defaultProps = {
  showStatusIndicator: false
};
InitialMessageChatHeadGroup.displayName = 'InitialMessageChatHeadGroup';
export default InitialMessageChatHeadGroup;