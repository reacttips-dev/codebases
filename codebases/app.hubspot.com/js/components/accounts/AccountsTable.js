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
import { List } from 'immutable';
import I18n from 'I18n';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIIcon from 'UIComponents/icon/UIIcon';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UITable from 'UIComponents/table/UITable';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import { listProp, orderedMapProp, usersProp, connectStepProp, setProp } from '../../lib/propTypes';
import { passPropsFor } from '../../lib/utils';
import { SOCIAL_ACCOUNTS_SETTINGS, USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN, FAVORITE_CHANNELS_LIMIT, DAYS_DATA_REMAINS_AFTER_DISCONNECT_ACCOUNT } from '../../lib/constants';
import AccountRow from './AccountRow';
import ConnectButton from './ConnectButton';
import ZeroState from '../../containers/ZeroStateContainer';
import AccountFilter from './AccountFilter';
import SocialContext from '../app/SocialContext';

var AccountsTable = /*#__PURE__*/function (_Component) {
  _inherits(AccountsTable, _Component);

  function AccountsTable() {
    var _this;

    _classCallCheck(this, AccountsTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AccountsTable).call(this));

    _this.onSearchChange = function (e) {
      _this.setState({
        query: e.target.value
      });
    };

    _this.onDisconnectChannel = function (channel) {
      _this.setState({
        confirmDeleteChannel: channel
      });
    };

    _this.onConfirmDeleteChannel = function () {
      // its possible to click submit twice before modal fades out
      if (!_this.state.confirmDeleteChannel) {
        return;
      }

      _this.props.deleteChannel(_this.state.confirmDeleteChannel.channelKey);

      _this.setState({
        confirmDeleteChannel: undefined
      });
    };

    _this.onDismissFavoriteChannelTooltip = function () {
      _this.props.saveUserAttribute({
        key: USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN,
        value: true
      });

      _this.context.trackInteraction('dismiss favorite channels popover');
    };

    _this.filterChannels = function (channels) {
      if (_this.props.accountFilter) {
        return channels.filter(function (channel) {
          return channel.accountSlug === _this.props.accountFilter;
        });
      }

      return channels;
    };

    _this.renderOne = function (channel, logicalKey) {
      var _this$props = _this.props,
          isFavoriteChannelKey = _this$props.isFavoriteChannelKey,
          showFavoriteChannelsPopover = _this$props.showFavoriteChannelsPopover,
          getFavoriteChannelsForNetwork = _this$props.getFavoriteChannelsForNetwork;

      var accounts = _this.props.accounts.filter(function (a) {
        return channel.accountGuids.includes(a.accountGuid);
      }).sortBy(function (a) {
        return a.name;
      });

      return /*#__PURE__*/_jsx(AccountRow, {
        portalId: _this.props.portalId,
        defaultsOnly: _this.props.defaultsOnly,
        connectableAccountTypes: _this.props.connectableAccountTypes,
        createAccount: _this.props.createAccount,
        saveBlogAutoPublish: _this.props.saveBlogAutoPublish,
        blogs: _this.props.blogs,
        editingBapForChannel: _this.props.editingBapForChannel,
        updateUi: _this.props.updateUi,
        onChangeFavorite: _this.props.onChangeFavorite,
        isOverFavoriteChannelsLimit: _this.props.isOverFavoriteChannelsLimit,
        sortKey: channel.getSortKey(),
        channel: channel,
        accounts: accounts,
        isFavorite: isFavoriteChannelKey(logicalKey),
        showFavorite: true,
        showFavoriteChannelsPopover: showFavoriteChannelsPopover(channel),
        dismissFavoriteChannelTooltip: _this.onDismissFavoriteChannelTooltip,
        onDisconnect: _this.onDisconnectChannel,
        blogsEnabledForNetwork: _this.getBlogsEnabledForNetwork(channel.accountSlug),
        favoriteEnabledForNetwork: getFavoriteChannelsForNetwork(channel.accountSlug)
      }, logicalKey);
    };

    _this.renderReportingDataTooltip = function () {
      var LineBreak = function LineBreak() {
        return /*#__PURE__*/_jsx("br", {});
      };

      return /*#__PURE__*/_jsx(UITooltipContent, {
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: 'sui.accounts.table.info.reportingDataSource.message_jsx',
          elements: {
            UILink: UILink,
            LineBreak: LineBreak
          },
          options: {
            url: SOCIAL_ACCOUNTS_SETTINGS
          }
        })
      });
    };

    _this.state = {
      query: '',
      confirmDeleteChannel: undefined
    };
    return _this;
  }

  _createClass(AccountsTable, [{
    key: "getBlogsEnabledForNetwork",
    value: function getBlogsEnabledForNetwork(accountSlug) {
      var channelsOfNetwork = this.props.channels.filter(function (c) {
        return c.accountSlug === accountSlug;
      });
      return this.props.blogs.filter(function (b) {
        return channelsOfNetwork.find(function (c) {
          return c.autoPublishBlogIds.includes(b.id);
        });
      });
    }
  }, {
    key: "renderZeroState",
    value: function renderZeroState() {
      var _this$props2 = this.props,
          isLoading = _this$props2.isLoading,
          isSaving = _this$props2.isSaving;
      return /*#__PURE__*/_jsx("section", {
        className: 'accounts accounts-table-empty' + (!isLoading && !isSaving ? " loaded" : ""),
        children: /*#__PURE__*/_jsx(ZeroState, {})
      });
    }
  }, {
    key: "renderPublishAnywhereColumn",
    value: function renderPublishAnywhereColumn() {
      return /*#__PURE__*/_jsxs("th", {
        className: "publish-anywhere",
        children: [I18n.text('sui.accounts.table.headers.reportingDataSource'), /*#__PURE__*/_jsx(UITooltip, {
          Content: this.renderReportingDataTooltip,
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "info",
            className: "info"
          })
        })]
      });
    }
  }, {
    key: "renderTable",
    value: function renderTable(channels) {
      var _this$props3 = this.props,
          isLoading = _this$props3.isLoading,
          isSaving = _this$props3.isSaving;
      var filteredChannels = this.filterChannels(channels);
      return /*#__PURE__*/_jsxs(UITable, {
        className: 'accounts-table publish-anywhere-enabled' + (!isLoading && !isSaving ? " loaded" : ""),
        children: [/*#__PURE__*/_jsx("thead", {
          children: /*#__PURE__*/_jsxs("tr", {
            children: [/*#__PURE__*/_jsx("th", {
              className: "avatar",
              colSpan: 2,
              children: I18n.text('sui.accounts.table.headers.account')
            }), !this.props.defaultsOnly && /*#__PURE__*/_jsx("th", {
              className: "hide-channel"
            }), !this.props.defaultsOnly && /*#__PURE__*/_jsx("th", {
              className: "user",
              children: I18n.text('sui.accounts.table.headers.user')
            }), !this.props.defaultsOnly && /*#__PURE__*/_jsxs("th", {
              className: "bap",
              children: [I18n.text('sui.accounts.table.headers.bap'), /*#__PURE__*/_jsx(UITooltip, {
                title: I18n.text('sui.accounts.table.info.autoPublish'),
                children: /*#__PURE__*/_jsx(UIIcon, {
                  name: "info",
                  className: "info"
                })
              })]
            }), this.renderPublishAnywhereColumn(), !this.props.defaultsOnly && /*#__PURE__*/_jsxs("th", {
              className: "share",
              children: [I18n.text('sui.accounts.table.headers.share'), /*#__PURE__*/_jsx(UITooltip, {
                title: I18n.text('sui.accounts.table.info.shareWithTeam'),
                children: /*#__PURE__*/_jsx(UIIcon, {
                  name: "info",
                  className: "info"
                })
              })]
            }), /*#__PURE__*/_jsxs("th", {
              className: "favorite",
              children: [I18n.text('sui.accounts.table.headers.favorite'), /*#__PURE__*/_jsx(UITooltip, {
                title: I18n.text('sui.accounts.table.info.favorite', {
                  limit: FAVORITE_CHANNELS_LIMIT
                }),
                children: /*#__PURE__*/_jsx(UIIcon, {
                  name: "info",
                  className: "info"
                })
              })]
            }, "favorite text-center")]
          })
        }), /*#__PURE__*/_jsx("tbody", {
          children: filteredChannels.map(this.renderOne).toArray()
        })]
      });
    }
  }, {
    key: "renderConfirmMessage",
    value: function renderConfirmMessage() {
      return /*#__PURE__*/_jsx("span", {
        children: I18n.text('sui.accounts.deleteChannel.description', {
          accountName: this.state.confirmDeleteChannel.name,
          days: DAYS_DATA_REMAINS_AFTER_DISCONNECT_ACCOUNT
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var channels = this.props.channels;
      var _this$props4 = this.props,
          isLoading = _this$props4.isLoading,
          isSaving = _this$props4.isSaving;

      if (!channels || channels.isEmpty()) {
        return this.renderZeroState();
      }

      channels = channels.filter(function (lc) {
        return lc.matchesQuery(_this2.state.query);
      });

      if (this.props.defaultsOnly) {
        return this.renderTable(this.props.channels);
      }

      return /*#__PURE__*/_jsxs("section", {
        className: 'accounts' + (!isLoading && !isSaving ? " loaded" : ""),
        children: [/*#__PURE__*/_jsxs(UIGrid, {
          className: "header",
          children: [/*#__PURE__*/_jsx(UIGridItem, {
            size: 6,
            children: /*#__PURE__*/_jsx(AccountFilter, Object.assign({}, passPropsFor(this.props, AccountFilter)))
          }), /*#__PURE__*/_jsxs(UIGridItem, {
            size: 6,
            className: "right-actions",
            children: [/*#__PURE__*/_jsx(UISearchInput, {
              className: "search-container",
              placeholder: I18n.text('sui.accounts.search.placeholder'),
              value: this.state.query,
              onChange: this.onSearchChange
            }), this.props.userCanConnectAccounts && /*#__PURE__*/_jsx(ConnectButton, Object.assign({}, passPropsFor(this.props, ConnectButton)))]
          })]
        }), this.renderTable(channels), this.state.confirmDeleteChannel && /*#__PURE__*/_jsx(UIConfirmModal, {
          message: I18n.text('sui.accounts.deleteChannel.message', {
            accountName: this.state.confirmDeleteChannel.name
          }),
          description: this.renderConfirmMessage(),
          confirmLabel: I18n.text('sui.accounts.deleteChannel.confirmLabel'),
          confirmUse: "danger",
          use: "danger",
          width: 650,
          rejectLabel: I18n.text('sui.confirm.rejectLabel'),
          onConfirm: this.onConfirmDeleteChannel,
          onReject: function onReject() {
            return _this2.setState({
              confirmDeleteChannel: undefined
            });
          }
        })]
      });
    }
  }]);

  return AccountsTable;
}(Component);

AccountsTable.propTypes = {
  accounts: listProp.isRequired,
  channels: orderedMapProp.isRequired,
  users: usersProp.isRequired,
  userId: PropTypes.number.isRequired,
  portalId: PropTypes.number.isRequired,
  userAttributes: PropTypes.object,
  isAdmin: PropTypes.bool,
  linkedinV2Enabled: PropTypes.bool,
  defaultsOnly: PropTypes.bool.isRequired,
  connectStep: connectStepProp,
  connectableAccountTypes: setProp,
  isLoading: PropTypes.bool,
  isSaving: PropTypes.bool,
  push: PropTypes.func,
  saveUserAttribute: PropTypes.func,
  setConnectStep: PropTypes.func,
  createAccount: PropTypes.func,
  deleteChannel: PropTypes.func,
  updateFilter: PropTypes.func,
  accountFilter: PropTypes.string,
  blogs: listProp,
  saveBlogAutoPublish: PropTypes.func,
  editingBapForChannel: PropTypes.string,
  updateUi: PropTypes.func,
  userCanConnectAccounts: PropTypes.bool.isRequired,
  totalConnectedChannels: PropTypes.number.isRequired,
  connectedChannelsLimit: PropTypes.number.isRequired,
  isTrial: PropTypes.bool,
  onChangeFavorite: PropTypes.func.isRequired,
  isFavoriteChannelKey: PropTypes.func.isRequired,
  showFavoriteChannelsPopover: PropTypes.func.isRequired,
  getFavoriteChannelsForNetwork: PropTypes.func.isRequired,
  isOverFavoriteChannelsLimit: PropTypes.bool.isRequired
};
AccountsTable.defaultProps = {
  defaultsOnly: false,
  blogs: List()
};
AccountsTable.contextType = SocialContext;
export { AccountsTable as default };