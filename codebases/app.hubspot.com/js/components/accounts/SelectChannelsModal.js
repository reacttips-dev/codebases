'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIButton from 'UIComponents/button/UIButton';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UIOptimisticProgress from 'UIComponents/progress/UIOptimisticProgress';
import { ACCOUNT_TYPES, CHANNEL_CONNECTION_STATE } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import { accountProp, appSectionProp, logicalChannelsProp, mapProp } from '../../lib/propTypes';
import { passPropsFor } from '../../lib/utils';
import ChannelsModalList from './ChannelsModalList';
import AccountLimitAlert from './AccountLimitAlert';
import H2 from 'UIComponents/elements/headings/H2';
import { unhideChannel } from '../../redux/actions/channels';
var LOADING_INCREMENT_PERCENTAGE = 0.15;
var LOADING_INCREMENT_INTERVAL_MS = 250;
var mapDispatchToProps = {
  unhideChannel: unhideChannel
};

var SelectChannelsModal = /*#__PURE__*/function (_Component) {
  _inherits(SelectChannelsModal, _Component);

  function SelectChannelsModal(props) {
    var _this;

    _classCallCheck(this, SelectChannelsModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectChannelsModal).call(this, props));

    _this.onSubmit = function () {
      _this.context.trackInteraction('submit accounts', {
        count: _this.state.changedChannelKeys.size
      });

      _this.state.changedChannelKeys.forEach(function (attrs, channelKey) {
        _this.props.unhideChannel(_this.props.channels.get(channelKey));
      });

      var opts = {
        initialConnection: true,
        accountGuid: _this.props.account.accountGuid,
        accountSlug: _this.props.account.accountSlug
      };

      _this.props.activateNewAccountChannels({
        account: _this.props.account,
        channelMap: _this.state.changedChannelKeys,
        options: opts
      });
    };

    _this.onCancel = function () {
      _this.props.onClose();
    };

    _this.onChannelCheck = function (channel, e) {
      var hidden = !e.target.checked;
      var changedChannelKeys;

      if (_this.state.changedChannelKeys.has(channel.channelKey)) {
        changedChannelKeys = _this.state.changedChannelKeys.delete(channel.channelKey);
      } else {
        changedChannelKeys = _this.state.changedChannelKeys.mergeIn([channel.channelKey], {
          hidden: hidden
        });
      }

      _this.setState({
        changedChannelKeys: changedChannelKeys
      });
    };

    _this.state = {
      changedChannelKeys: _this.props.connectedChannels.isEmpty() ? ImmutableMap() : _this.props.connectedChannels.reduce(function (acc, cur) {
        return acc.concat(cur);
      }).map(function () {
        return ImmutableMap({
          hidden: false
        });
      }),
      selectedChannelKey: null,
      progressValue: 0
    };
    return _this;
  }

  _createClass(SelectChannelsModal, [{
    key: "getChannelsCount",
    value: function getChannelsCount(channels) {
      if (channels.isEmpty()) {
        return 0;
      }

      return channels.reduce(function (acc, cur) {
        return acc.concat(cur);
      }).size;
    }
  }, {
    key: "getMissingScopesModalId",
    value: function getMissingScopesModalId() {
      return this.props.account.missingScopes.isEmpty() ? CHANNEL_CONNECTION_STATE.lackScopesChannels : CHANNEL_CONNECTION_STATE.lackScopesAccount;
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      return /*#__PURE__*/_jsx("div", {
        className: "m-bottom-5",
        style: {
          position: 'relative'
        },
        children: /*#__PURE__*/_jsx(UIOptimisticProgress, {
          incrementFactor: LOADING_INCREMENT_PERCENTAGE,
          incrementInterval: LOADING_INCREMENT_INTERVAL_MS,
          children: /*#__PURE__*/_jsx(UINanoProgress, {})
        })
      });
    }
  }, {
    key: "renderAccountLimitAlert",
    value: function renderAccountLimitAlert() {
      var _this$props = this.props,
          connectedChannels = _this$props.connectedChannels,
          totalConnectedChannels = _this$props.totalConnectedChannels;
      return /*#__PURE__*/_jsx("div", {
        className: "account-limit-alert",
        children: /*#__PURE__*/_jsx(AccountLimitAlert, Object.assign({}, passPropsFor(this.props, AccountLimitAlert), {
          connectedChannels: totalConnectedChannels - connectedChannels.size + this.state.changedChannelKeys.filter(function (c) {
            return !c.hidden;
          }).size
        }))
      });
    }
  }, {
    key: "renderChannelLists",
    value: function renderChannelLists() {
      var _this$props2 = this.props,
          connectableChannels = _this$props2.connectableChannels,
          connectedChannels = _this$props2.connectedChannels,
          lackPermissionsChannels = _this$props2.lackPermissionsChannels,
          lackScopesChannels = _this$props2.lackScopesChannels;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(ChannelsModalList, Object.assign({}, passPropsFor(this.props, ChannelsModalList), {
          channels: connectableChannels,
          onChannelCheck: this.onChannelCheck,
          changedChannelKeys: this.state.changedChannelKeys,
          id: CHANNEL_CONNECTION_STATE.connectableChannels,
          totalAccounts: this.getChannelsCount(connectableChannels),
          showInstagramNote: this.props.account.accountSlug === ACCOUNT_TYPES.facebook,
          defaultOpen: true
        })), /*#__PURE__*/_jsx(ChannelsModalList, Object.assign({}, passPropsFor(this.props, ChannelsModalList), {
          channels: connectedChannels,
          onChannelCheck: this.onChannelCheck,
          changedChannelKeys: this.state.changedChannelKeys,
          id: CHANNEL_CONNECTION_STATE.connectedChannels,
          totalAccounts: this.getChannelsCount(connectedChannels)
        })), /*#__PURE__*/_jsx(ChannelsModalList, Object.assign({}, passPropsFor(this.props, ChannelsModalList), {
          channels: lackPermissionsChannels,
          onChannelCheck: this.onChannelCheck,
          changedChannelKeys: this.state.changedChannelKeys,
          id: CHANNEL_CONNECTION_STATE.lackPermissionsChannels,
          totalAccounts: this.getChannelsCount(lackPermissionsChannels),
          showCheckbox: false
        })), /*#__PURE__*/_jsx(ChannelsModalList, Object.assign({}, passPropsFor(this.props, ChannelsModalList), {
          channels: lackScopesChannels,
          onChannelCheck: this.onChannelCheck,
          changedChannelKeys: this.state.changedChannelKeys,
          id: this.getMissingScopesModalId(),
          totalAccounts: this.getChannelsCount(lackScopesChannels),
          showCheckbox: false
        }))]
      });
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      var isSaving = this.props.isSaving;
      return /*#__PURE__*/_jsxs("div", {
        className: "buttons",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          disabled: isSaving,
          onClick: this.onSubmit,
          children: I18n.text('sui.accounts.postConnect.buttons.submit')
        }), /*#__PURE__*/_jsx(UIButton, {
          onClick: this.onCancel,
          disabled: isSaving,
          children: I18n.text('sui.accounts.postConnect.buttons.cancel')
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs(UIModal, {
        className: "select-channels-modal",
        width: 650,
        children: [/*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: I18n.text('sui.accounts.postConnect.header')
          })
        }), this.props.isSaving && this.renderLoading(), !this.props.isSaving && this.renderAccountLimitAlert(), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [this.props.isSaving && /*#__PURE__*/_jsx("h5", {
            children: I18n.text('sui.accounts.postConnect.addingChannels')
          }), !this.props.isSaving && this.renderChannelLists()]
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          children: !this.props.isSaving && this.renderButtons()
        })]
      });
    }
  }]);

  return SelectChannelsModal;
}(Component);

SelectChannelsModal.propTypes = {
  channels: logicalChannelsProp,
  connectedChannels: mapProp,
  connectableChannels: mapProp,
  lackPermissionsChannels: mapProp,
  lackScopesChannels: mapProp,
  account: accountProp,
  appSection: appSectionProp,
  portalId: PropTypes.number.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  unhideChannel: PropTypes.func,
  updateAccountChannel: PropTypes.func,
  activateNewAccountChannels: PropTypes.func,
  isTrial: PropTypes.bool.isRequired,
  connectedChannelsLimit: PropTypes.number.isRequired,
  totalConnectedChannels: PropTypes.number.isRequired
};
SelectChannelsModal.defaultProps = {
  onSubmit: function onSubmit() {}
};
SelectChannelsModal.contextType = SocialContext;
export default connect(null, mapDispatchToProps)(SelectChannelsModal);