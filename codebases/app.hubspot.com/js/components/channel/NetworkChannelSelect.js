'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { Set as ImmutableSet } from 'immutable';
import cx from 'classnames';
import { memoize } from 'underscore';
import I18n from 'I18n';
import UISelect from 'UIComponents/input/UISelect';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import UILink from 'UIComponents/link/UILink';
import { ACCOUNT_TYPES, getAccountColor, getAccountDisplayName, getAccountIcon, getAppRoot } from '../../lib/constants';
import defaultAvatarUrl from 'bender-url!../../../img/missing-avatar.png';
import { accountTypeProp, setProp } from '../../lib/propTypes';
import ChannelName from './ChannelName';
import PortalIdParser from 'PortalIdParser';
/**
 * A select for network with another multi select to drill down to specific channels within the network
 * Channel selection is remembered in localStorage on a per-network basis
 */

var NetworkChannelSelect = /*#__PURE__*/function (_PureComponent) {
  _inherits(NetworkChannelSelect, _PureComponent);

  function NetworkChannelSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, NetworkChannelSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(NetworkChannelSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onChange = function (e) {
      var value = e.target.value;

      _this.onUpdateSelectedChannelKeys(ImmutableSet(value));
    };

    _this.getNetworkOption = function (network) {
      return {
        text: I18n.text('sui.networkSelect.network', {
          network: getAccountDisplayName(network)
        }),
        value: network,
        avatar: NetworkChannelSelect.renderNetworkIconCircle(network),
        className: "network network-" + network
      };
    };

    _this.getNetworkOptions = function () {
      var _this$props = _this.props,
          channels = _this$props.channels,
          groupedForReporting = _this$props.groupedForReporting;
      var networks = channels.groupBy(function (c) {
        return c.accountSlug;
      }).keySeq().toArray();
      var overviewOptions = [{
        text: I18n.text('sui.networkSelect.all'),
        value: 'all',
        className: 'network-all'
      }];
      overviewOptions = overviewOptions.concat(networks.map(function (n) {
        return _this.getNetworkOption(n);
      }));
      var overviewAndAdvancedGrouped = [{
        text: I18n.text('sui.networkSelect.overview'),
        options: overviewOptions
      }, {
        text: I18n.text('sui.networkSelect.advancedReporting')
      }];
      return groupedForReporting ? overviewAndAdvancedGrouped : overviewOptions;
    };

    _this.onUpdateSelectedChannelKeys = function (selectedChannelKeys) {
      var dataFilter = _this.props.dataFilter;

      var excludedChannelKeysForNetwork = _this.getChannelKeys().subtract(ImmutableSet(selectedChannelKeys));

      var excludedChannelKeys = dataFilter.excludedChannelKeys.subtract(_this.getChannelKeys()).concat(excludedChannelKeysForNetwork);

      _this.props.updateDataFilter({
        excludedChannelKeys: excludedChannelKeys
      });
    };

    _this.onChangeNetwork = function (e) {
      var value = e.target.value;

      _this.props.updateSelectedNetwork(value);
    };

    _this.goToSettingsConnect = function () {
      var groupedForReporting = _this.props.groupedForReporting;

      if (groupedForReporting) {
        window.location.href = "/" + getAppRoot() + "/" + PortalIdParser.get() + "/settings/connect";
      } else {
        _this.props.push('/settings/connect');
      }
    };

    _this.renderButton = function () {
      var value = _this.getValue();

      var channels = _this.getChannels();

      var text;
      var imageUrl;
      var networkLabel = getAccountDisplayName(_this.getNetwork());

      if (value.length === 1) {
        var channel = channels.get(value[0]);
        text = channel.name;
        imageUrl = channel.avatarUrl;
      } else if (value.length === channels.size) {
        text = I18n.text('sui.channelPicker.dropdownLink.allNetworkAccounts', {
          count: channels.size,
          network: networkLabel
        });
      } else {
        text = I18n.text('sui.channelPicker.dropdownLink.selection', {
          count: value.length,
          network: networkLabel
        });
      }

      return /*#__PURE__*/_jsxs("span", {
        className: 'channel-select-value' + (imageUrl ? " has-avatar" : ""),
        children: [imageUrl && /*#__PURE__*/_jsx(UIAvatar, {
          src: imageUrl,
          size: "xs",
          className: "avatar"
        }), /*#__PURE__*/_jsx("span", {
          className: "channel-name",
          children: text
        })]
      });
    };

    return _this;
  }

  _createClass(NetworkChannelSelect, [{
    key: "getNetwork",
    value: function getNetwork() {
      return this.props.network || this.props.dataFilter.network;
    }
  }, {
    key: "getChannels",
    value: function getChannels() {
      var _this2 = this;

      var channels = this.props.channels;

      if (this.getNetwork()) {
        return channels.filter(function (c) {
          return c.accountSlug === _this2.getNetwork();
        });
      }

      return channels;
    }
  }, {
    key: "getChannelKeys",
    value: function getChannelKeys() {
      return this.getChannels().map(function (c) {
        return c.channelKey;
      }).toSet();
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.props.value.toArray();
    }
  }, {
    key: "renderNetworkSelect",
    value: function renderNetworkSelect() {
      var _this$props2 = this.props,
          dataFilter = _this$props2.dataFilter,
          groupedForReporting = _this$props2.groupedForReporting;
      return /*#__PURE__*/_jsx(UISelect, {
        dropdownFooter: /*#__PURE__*/_jsx(UILink, {
          onClick: this.goToSettingsConnect,
          external: true,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sui.connectAccount"
          })
        }),
        className: 'network-select' + (!dataFilter.network ? " all-networks" : ""),
        buttonUse: this.props.onDarkBg ? 'form-on-dark' : 'form',
        dropdownClassName: "network-select-options",
        menuStyle: {
          minHeight: groupedForReporting ? 346 : 0
        },
        menuWidth: "auto",
        options: this.getNetworkOptions(),
        onChange: this.onChangeNetwork,
        value: dataFilter.network || 'all',
        disabled: this.props.shouldDisableNetworkDropdown
      }, "network-select");
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.channels) {
        return null;
      }

      var channels = this.getChannels();
      var value = this.getValue();
      var network = this.getNetwork();
      var hasAvatar = this.getValue().length === 1;
      var isOnlyChannel = channels.size === 1;
      return /*#__PURE__*/_jsxs("div", {
        className: "channel-select-wrapper",
        children: [this.props.showNetworkSelect && this.renderNetworkSelect(), network && !channels.isEmpty() && /*#__PURE__*/_jsx(UISelect, {
          className: cx('channel-select', hasAvatar && 'has-avatar', isOnlyChannel && 'only-channel'),
          multi: true,
          dropdownClassName: "channel-select-options",
          open: isOnlyChannel ? false : undefined,
          buttonUse: isOnlyChannel ? 'unstyled' : 'transparent',
          menuWidth: 500,
          anchorType: "button",
          placeholder: I18n.text('sui.channelPicker.dropdownLink.allAccounts'),
          value: value,
          ButtonContent: this.renderButton,
          options: NetworkChannelSelect.getChannelOptions(this.getNetwork(), channels),
          onChange: this.onChange
        })]
      });
    }
  }]);

  return NetworkChannelSelect;
}(PureComponent);

NetworkChannelSelect.propTypes = {
  channels: PropTypes.object,
  value: setProp,
  dataFilter: PropTypes.object,
  onDarkBg: PropTypes.bool.isRequired,
  network: accountTypeProp,
  groupedForReporting: PropTypes.bool,
  push: PropTypes.func.isRequired,
  // The network dropdown can be disabled on the "Followers" page
  shouldDisableNetworkDropdown: PropTypes.bool,
  showNetworkSelect: PropTypes.bool,
  updateDataFilter: PropTypes.func.isRequired,
  updateSelectedNetwork: PropTypes.func.isRequired
};
NetworkChannelSelect.defaultProps = {
  onDarkBg: true,
  shouldDisableNetworkDropdown: false,
  showNetworkSelect: true
};
NetworkChannelSelect.getChannelOptions = memoize(function (accountSlug, channels) {
  if (channels.isEmpty()) {
    return [];
  }

  var options = [];
  var groupOpts = channels.toArray().map(function (channel) {
    return {
      imageUrl: channel.avatarUrl || defaultAvatarUrl,
      text: channel.name,
      dropdownText: /*#__PURE__*/_jsx(ChannelName, {
        channel: channel
      }),
      value: channel.channelKey,
      network: channel.accountSlug
    };
  });
  options.push({
    text: I18n.text('sui.channelPicker.checkboxes.networkGroup', {
      network: getAccountDisplayName(accountSlug)
    }),
    avatar: NetworkChannelSelect.renderNetworkIconCircle(accountSlug),
    selectAll: true,
    options: groupOpts
  });
  return options;
});

NetworkChannelSelect.renderNetworkIconCircle = function (n) {
  var iconName = n === ACCOUNT_TYPES.youtube ? 'socialBlockYoutubeplay' : getAccountIcon(n);
  return /*#__PURE__*/_jsx(UIIconCircle, {
    className: "network-icon-circle network-" + n,
    name: iconName,
    size: 16,
    color: "white",
    backgroundColor: getAccountColor(n),
    borderColor: getAccountColor(n)
  });
};

export { NetworkChannelSelect as default };