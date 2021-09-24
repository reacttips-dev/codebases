'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UILink from 'UIComponents/link/UILink';
import { ACCOUNT_TYPES } from '../../lib/constants';
import { abstractChannelProp } from '../../lib/propTypes';
var SHOW_USERNAME_ACCOUNT_TYPES = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.instagram];

var ChannelName = function ChannelName(_ref) {
  var channel = _ref.channel,
      onClick = _ref.onClick;

  if (!channel) {
    return null;
  }

  var channelName = onClick ? /*#__PURE__*/_jsx(UILink, {
    onClick: onClick,
    children: channel.name
  }) : channel.name;
  return /*#__PURE__*/_jsxs("span", {
    className: "channel-text",
    children: [/*#__PURE__*/_jsx("span", {
      className: "channel-name",
      children: channelName
    }), SHOW_USERNAME_ACCOUNT_TYPES.includes(channel.accountSlug) && /*#__PURE__*/_jsxs("span", {
      className: "username",
      children: ["@", channel.username]
    })]
  });
};

ChannelName.propTypes = {
  channel: abstractChannelProp,
  onClick: PropTypes.func
};
export default ChannelName;