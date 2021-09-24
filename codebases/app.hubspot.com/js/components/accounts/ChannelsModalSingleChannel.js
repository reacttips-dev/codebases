'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Small from 'UIComponents/elements/Small';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIFlex from 'UIComponents/layout/UIFlex';
import ChannelName from '../channel/ChannelName';
import { channelProp } from '../../lib/propTypes';
import ChannelPageRoles from './ChannelPageRoles';
import { ACCOUNT_TYPES } from '../../lib/constants';

var ChannelsModalSingleChannel = /*#__PURE__*/function (_Component) {
  _inherits(ChannelsModalSingleChannel, _Component);

  function ChannelsModalSingleChannel() {
    _classCallCheck(this, ChannelsModalSingleChannel);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChannelsModalSingleChannel).apply(this, arguments));
  }

  _createClass(ChannelsModalSingleChannel, [{
    key: "isInstagramOrFacebook",
    value: function isInstagramOrFacebook(channelSlug) {
      return [ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.facebook].includes(channelSlug);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          channel = _this$props.channel,
          checked = _this$props.checked,
          disabled = _this$props.disabled;
      var pageLocation = channel.get('pageLocation');

      var channelContent = /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsxs(UIFlex, {
          align: pageLocation ? null : 'center',
          direction: "row",
          children: [/*#__PURE__*/_jsx(UIAvatar, {
            className: "channel-avatar",
            socialNetwork: channel.accountSlug,
            src: channel.getAvatarUrl()
          }), /*#__PURE__*/_jsxs(UIFlex, {
            direction: "column",
            children: [/*#__PURE__*/_jsx(ChannelName, {
              channel: channel
            }), !!pageLocation.size && /*#__PURE__*/_jsxs(Small, {
              use: "help",
              children: [pageLocation.get('city'), ", ", pageLocation.get('state'), " (", pageLocation.get('country'), ")"]
            }), this.isInstagramOrFacebook(channel.channelSlug) && /*#__PURE__*/_jsx(ChannelPageRoles, {
              pageRoles: channel.facebookPageTasks,
              showTasks: this.props.showTasks
            })]
          })]
        })
      });

      if (this.props.showCheckbox) {
        return /*#__PURE__*/_jsx("div", {
          className: "channel channel-type-" + channel.channelSlug,
          children: /*#__PURE__*/_jsx(UICheckbox, {
            checked: checked,
            disabled: disabled,
            onChange: function onChange() {
              var _this$props2;

              for (var _len = arguments.length, partialArgs = new Array(_len), _key = 0; _key < _len; _key++) {
                partialArgs[_key] = arguments[_key];
              }

              return (_this$props2 = _this.props).onChannelCheck.apply(_this$props2, [channel].concat(partialArgs));
            },
            children: channelContent
          })
        }, channel.channelKey);
      }

      return /*#__PURE__*/_jsx("div", {
        className: "channel channel-type-" + channel.channelSlug + " no-checkbox",
        children: channelContent
      }, channel.channelKey);
    }
  }]);

  return ChannelsModalSingleChannel;
}(Component);

ChannelsModalSingleChannel.propTypes = {
  channel: channelProp,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChannelCheck: PropTypes.func,
  showTasks: PropTypes.bool,
  showCheckbox: PropTypes.bool.isRequired
};
ChannelsModalSingleChannel.defaultProps = {
  showTasks: false,
  showCheckbox: true
};
export { ChannelsModalSingleChannel as default };