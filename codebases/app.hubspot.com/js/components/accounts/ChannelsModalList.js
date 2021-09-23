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
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIList from 'UIComponents/list/UIList';
import UILink from 'UIComponents/link/UILink';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
import ChannelsModalSingleChannel from './ChannelsModalSingleChannel';
import { logicalChannelsProp, mapProp } from '../../lib/propTypes';
import { CHANNEL_TYPES, CONNECTION_ISSUE_LEARN_MORE_URL } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
var PERSONAL_CHANNELS = [CHANNEL_TYPES.linkedinstatus];

var ChannelsModalList = /*#__PURE__*/function (_Component) {
  _inherits(ChannelsModalList, _Component);

  function ChannelsModalList() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ChannelsModalList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ChannelsModalList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.renderChannel = function (channel) {
      var disabled = _this.isDisabled(channel);

      return /*#__PURE__*/_jsx(ChannelsModalSingleChannel, {
        channel: channel,
        checked: _this.isChecked(channel),
        disabled: disabled,
        showTasks: _this.props.id === 'lackPermissionsChannels',
        onChannelCheck: _this.props.onChannelCheck,
        showCheckbox: _this.props.showCheckbox
      }, channel.channelKey);
    };

    _this.renderChannelType = function (channelsByType, channelType) {
      var channelTypeHeaders = _this.props.channelTypeHeaders;
      var channelName = PERSONAL_CHANNELS.includes(channelType) ? I18n.text('sui.accounts.postConnect.personal') : channelsByType.first().getDisplayName();

      if (channelTypeHeaders) {
        return [/*#__PURE__*/_jsx("h6", {
          children: channelName
        }, channelType), channelsByType.toArray().map(function (c) {
          return _this.renderChannel(c);
        })];
      }

      return channelsByType.toArray().map(function (c) {
        return _this.renderChannel(c);
      });
    };

    return _this;
  }

  _createClass(ChannelsModalList, [{
    key: "isDisabled",
    value: function isDisabled(channel) {
      return !channel.hidden;
    }
  }, {
    key: "isChecked",
    value: function isChecked(channel) {
      var changedChannelKeys = this.props.changedChannelKeys;
      return changedChannelKeys.has(channel.channelKey) ? !changedChannelKeys.get(channel.channelKey).get('hidden') : !channel.hidden;
    }
  }, {
    key: "getAccordionTitleText",
    value: function getAccordionTitleText() {
      return /*#__PURE__*/_jsx("span", {
        "data-test-id": this.props.id,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sui.accounts.postConnect." + this.props.id + ".heading",
          options: {
            count: this.props.totalAccounts
          }
        })
      });
    }
  }, {
    key: "getAccordionBodyText",
    value: function getAccordionBodyText() {
      var id = this.props.id;
      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "sui.accounts.postConnect." + id + ".content_jsx",
            elements: {
              UILink: UILink
            },
            options: {
              url: CONNECTION_ISSUE_LEARN_MORE_URL[id]
            },
            style: {
              'margin-bottom': '1rem'
            }
          })
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          channels = _this$props.channels,
          id = _this$props.id;

      if (channels.isEmpty()) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIAccordionItem, {
        title: this.getAccordionTitleText(),
        size: "small",
        defaultOpen: this.props.defaultOpen,
        onOpenChange: function onOpenChange() {
          _this2.context.trackInteraction('toggle accounts accordion', {
            accountsType: id
          });
        },
        children: [this.getAccordionBodyText(id), /*#__PURE__*/_jsx(UIList, {
          className: "connect-modal-channels-list no-headers",
          children: channels.map(this.renderChannelType).toArray()
        }), /*#__PURE__*/_jsx("p", {
          children: this.props.showInstagramNote && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "sui.accounts.postConnect.instagramNote"
          })
        })]
      });
    }
  }]);

  return ChannelsModalList;
}(Component);

ChannelsModalList.propTypes = {
  id: PropTypes.string.isRequired,
  channels: logicalChannelsProp,
  totalAccounts: PropTypes.number,
  onChannelCheck: PropTypes.func.isRequired,
  changedChannelKeys: mapProp.isRequired,
  channelTypeHeaders: PropTypes.bool.isRequired,
  showInstagramNote: PropTypes.bool.isRequired,
  defaultOpen: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  lackAccountLevelPermission: PropTypes.bool
};
ChannelsModalList.defaultProps = {
  channelTypeHeaders: true,
  showInstagramNote: false,
  defaultOpen: false,
  showCheckbox: true
};
ChannelsModalList.contextType = SocialContext;
export { ChannelsModalList as default };