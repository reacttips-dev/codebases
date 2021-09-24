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
import { identity } from 'underscore';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UIButton from 'UIComponents/button/UIButton';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import ChannelName from '../channel/ChannelName';
import SocialContext from '../app/SocialContext';
import { ACCOUNT_TYPES, UI_POPOVER_WIDTH, CHANNEL_VALIDATION, TWITTER_PUBLISH_ANYWHERE_OPTIONS, FAVORITE_CHANNELS_LIMIT } from '../../lib/constants';
import { logicalChannelProp, listProp, setProp } from '../../lib/propTypes';
import BlogAutoPublish from './BlogAutoPublish';
import AccountIssues from './AccountIssues';
import { passPropsFor } from '../../lib/utils';
import { setChannelShared } from '../../redux/actions/channels';
var mapDispatchToProps = {
  setChannelShared: setChannelShared
};

var AccountRow = /*#__PURE__*/function (_Component) {
  _inherits(AccountRow, _Component);

  function AccountRow() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AccountRow);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AccountRow)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onChangeFavorite = function (e) {
      _this.props.onChangeFavorite(e.target.checked, _this.props.channel.channelKey, _this.props.channel.accountSlug);
    };

    _this.onToggleShare = function () {
      var sharedNowEnabled = !_this.props.channel.shared;

      _this.props.setChannelShared(_this.props.channel, sharedNowEnabled);

      _this.context.trackInteraction("share " + (sharedNowEnabled ? 'enable' : 'disable'), {
        network: _this.props.channel.accountSlug
      });
    };

    _this.onDisconnect = function () {
      _this.context.trackInteraction('disconnect account', {
        network: _this.props.channel.accountSlug
      });

      _this.props.onDisconnect(_this.props.channel);
    };

    _this.onClickReauthorize = function () {
      var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'v1';
      var channel = _this.props.channel;
      var network = channel.accountSlug;

      _this.context.trackInteraction('reauthorize account', {
        network: network,
        version: version
      });

      if (network === ACCOUNT_TYPES.instagram) {
        network = ACCOUNT_TYPES.facebook;
      }

      _this.props.createAccount(network);
    };

    _this.onClickMessaging = function (e) {
      if (e.target.tagName === 'A') {
        _this.onClickReauthorize();

        return false;
      }

      return null;
    };

    _this.toggleEditingBapForChannel = function () {
      if (_this.props.editingBapForChannel) {
        _this.props.updateUi({
          editingBapForChannel: null
        });
      } else {
        _this.props.updateUi({
          editingBapForChannel: _this.props.channel.channelKey
        });
      }
    };

    return _this;
  }

  _createClass(AccountRow, [{
    key: "isExpired",
    value: function isExpired() {
      return this.props.accounts.every(function (a) {
        return a.expired;
      });
    }
  }, {
    key: "getShareCheckboxDisableReason",
    value: function getShareCheckboxDisableReason() {
      var channel = this.props.channel;

      if (this.isExpired()) {
        return 'expired';
      } else if (!channel.userCanShare) {
        return 'userLacksPermissions';
      } else if (this.isTwitterAndPublishAnywhereEnabled()) {
        return 'publishAnywhere';
      }

      return null;
    }
  }, {
    key: "isTwitterAndPublishAnywhereEnabled",
    value: function isTwitterAndPublishAnywhereEnabled() {
      var channel = this.props.channel;
      return channel.channelSlug === ACCOUNT_TYPES.twitter && channel.getPublishAnywhereSetting() === TWITTER_PUBLISH_ANYWHERE_OPTIONS.ENABLED && channel.shared;
    }
  }, {
    key: "canEnableFavorite",
    value: function canEnableFavorite() {
      var _this$props = this.props,
          channel = _this$props.channel,
          isFavorite = _this$props.isFavorite,
          isOverFavoriteChannelsLimit = _this$props.isOverFavoriteChannelsLimit,
          favoriteEnabledForNetwork = _this$props.favoriteEnabledForNetwork;

      if (!isFavorite && isOverFavoriteChannelsLimit) {
        return false;
      }

      if (!channel.canPublish()) {
        return false;
      }

      if (channel.channelSlug === ACCOUNT_TYPES.twitter) {
        return favoriteEnabledForNetwork.length === 0 || isFavorite;
      }

      return true;
    }
  }, {
    key: "renderNewReconnectLink",
    value: function renderNewReconnectLink() {
      var _this2 = this;

      var channel = this.props.channel;
      var notExpiredOrSoonAndDoesntNeedManualConnect = !this.isExpired() && !channel.willExpireSoon && !(channel.publishingErrors.has(CHANNEL_VALIDATION.INSTAGRAM_PERMISSIONS) || channel.publishingErrors.has(CHANNEL_VALIDATION.LI_PERMISSION_MIGRATION));

      if (notExpiredOrSoonAndDoesntNeedManualConnect || !channel.userCanConfigure || !this.props.connectableAccountTypes.includes(channel.getActualAccountType())) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILink, {
        className: "account-reconnect",
        onClick: function onClick() {
          return _this2.onClickReauthorize('v2');
        },
        children: I18n.text('sui.accounts.table.messages.newReconnect')
      });
    }
  }, {
    key: "renderReconnectLink",
    value: function renderReconnectLink() {
      var _this3 = this;

      var channel = this.props.channel;

      if (!this.props.connectableAccountTypes.includes(channel.getActualAccountType())) {
        return null;
      }

      return /*#__PURE__*/_jsx("a", {
        onClick: function onClick() {
          return _this3.onClickReauthorize('v1');
        },
        children: I18n.text('sui.accounts.table.messages.reconnect')
      });
    }
  }, {
    key: "renderFavoriteChannelTooltip",
    value: function renderFavoriteChannelTooltip() {
      return {
        header: /*#__PURE__*/_jsx("h4", {
          children: I18n.text('sui.accounts.favorite.popover.header')
        }),
        body: /*#__PURE__*/_jsx("span", {
          children: I18n.text('sui.accounts.favorite.popover.content')
        }),
        footer: /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          onClick: this.props.dismissFavoriteChannelTooltip,
          children: I18n.text('sui.accounts.favorite.popover.submit')
        })
      };
    }
  }, {
    key: "renderFavorite",
    value: function renderFavorite() {
      var channel = this.props.channel;

      if (!this.props.showFavorite) {
        return null;
      }

      if (!(channel.userCanDraft || channel.userCanPublish)) {
        return /*#__PURE__*/_jsx("td", {
          className: "favorite text-center"
        });
      }

      var checkboxEl = /*#__PURE__*/_jsx(UICheckbox, {
        className: "favorite-checkbox",
        checked: this.props.isFavorite,
        "aria-label": I18n.text(this.props.isFavorite ? 'sui.accounts.favorite.unfavorite' : 'sui.accounts.favorite.favorite'),
        disabled: !this.canEnableFavorite(),
        onChange: this.onChangeFavorite
      });

      var toggleComponent;

      if (!this.canEnableFavorite()) {
        var tooltipText = I18n.text('sui.accounts.table.info.favoriteNotAllowedTwitter');

        if (!this.props.isFavorite && this.props.isOverFavoriteChannelsLimit) {
          tooltipText = I18n.text('sui.accounts.table.info.favoriteOverLimit', {
            limit: FAVORITE_CHANNELS_LIMIT
          });
        } else if (!this.props.channel.canPublish()) {
          tooltipText = I18n.text('sui.accounts.table.info.favoriteNotAllowedNonPublish', {
            network: this.props.channel.getAccountDisplayName()
          });
        }

        toggleComponent = /*#__PURE__*/_jsx(UITooltip, {
          title: tooltipText,
          children: checkboxEl
        });
      } else {
        toggleComponent = checkboxEl;
      }

      return /*#__PURE__*/_jsx("td", {
        className: "favorite text-center",
        children: this.props.showFavoriteChannelsPopover ? /*#__PURE__*/_jsx(UIPopover, {
          use: "shepherd",
          open: true,
          width: UI_POPOVER_WIDTH,
          placement: "bottom left",
          content: this.renderFavoriteChannelTooltip(),
          children: toggleComponent
        }) : toggleComponent
      });
    }
  }, {
    key: "renderDisconnect",
    value: function renderDisconnect() {
      if (!this.props.channel.userCanConfigure) {
        return /*#__PURE__*/_jsx("td", {});
      }

      return /*#__PURE__*/_jsx("td", {
        className: "hide-channel",
        children: /*#__PURE__*/_jsx(UILink, {
          className: "button disconnect",
          use: "danger",
          onClick: this.onDisconnect,
          children: I18n.text('sui.accounts.table.disconnect')
        })
      });
    }
  }, {
    key: "renderAccountTitleCell",
    value: function renderAccountTitleCell() {
      var _this4 = this;

      var channel = this.props.channel;
      return /*#__PURE__*/_jsxs("td", {
        className: "name",
        children: [/*#__PURE__*/_jsx("span", {
          className: "account-name",
          children: /*#__PURE__*/_jsx(UILink, {
            href: channel.profileUrl,
            use: "unstyled",
            target: "_blank",
            children: /*#__PURE__*/_jsx(ChannelName, {
              channel: channel
            })
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "account-status",
          children: [/*#__PURE__*/_jsx(AccountIssues, Object.assign({}, passPropsFor(this.props, AccountIssues), {
            publishingErrors: channel.publishingErrors,
            accountSlug: channel.accountSlug,
            userCanConfigure: channel.userCanConfigure,
            expiresAt: channel.accountExpiresAt,
            canConnect: channel.getCanBeConnected() && channel.userCanConfigure,
            onClickReauthorize: function onClickReauthorize() {
              return _this4.onClickReauthorize('v2');
            },
            trackInteraction: this.context.trackInteraction
          })), this.renderNewReconnectLink()]
        })]
      });
    }
  }, {
    key: "renderAccountCell",
    value: function renderAccountCell() {
      var channel = this.props.channel;
      return /*#__PURE__*/_jsx("td", {
        className: "avatar",
        children: /*#__PURE__*/_jsx(UILink, {
          href: channel.profileUrl,
          use: "unstyled",
          target: "_blank",
          children: /*#__PURE__*/_jsx(UIAvatar, {
            size: "md",
            socialNetwork: channel.accountSlug,
            src: channel.getAvatarUrl(),
            type: "contact"
          })
        })
      });
    }
  }, {
    key: "renderUserCell",
    value: function renderUserCell() {
      if (this.props.defaultsOnly) {
        return null;
      }

      var users = this.props.accounts.map(function (u) {
        return u.user;
      }).filter(identity).toSet();
      var restOfUsers = users.slice(1).map(function (user) {
        return "" + user.getFullName();
      }).join(', ');

      var restTooltipTarget = /*#__PURE__*/_jsxs("a", {
        className: "more-users",
        children: ["+", users.size - 1, " ", I18n.text('sui.accounts.table.more')]
      });

      return /*#__PURE__*/_jsxs("td", {
        className: "user",
        children: [users.isEmpty() ? 'N/A' : users.first().getFullName(), users.size > 1 && /*#__PURE__*/_jsx(UITooltip, {
          title: restOfUsers,
          children: restTooltipTarget
        })]
      });
    }
  }, {
    key: "renderPublishAnywhere",
    value: function renderPublishAnywhere() {
      var channel = this.props.channel;
      return /*#__PURE__*/_jsx("td", {
        className: "publish-anywhere",
        children: I18n.text("sui.accounts.table.publishAnywhere." + channel.getReportingDataSourceLabel())
      });
    }
  }, {
    key: "renderSharedCheckbox",
    value: function renderSharedCheckbox() {
      var channel = this.props.channel;

      if (this.props.defaultsOnly) {
        return null;
      }

      var disabledReason = this.getShareCheckboxDisableReason();
      var isDisabled = !!disabledReason;

      var el = /*#__PURE__*/_jsx(UICheckbox, {
        checked: channel.shared,
        disabled: isDisabled,
        className: "share-checkbox",
        "aria-label": I18n.text('sui.accounts.table.headers.share'),
        onChange: this.onToggleShare
      });

      if (isDisabled) {
        var tooltipText = I18n.text("sui.accounts.table.info.shareCheckbox." + disabledReason);
        return /*#__PURE__*/_jsx("td", {
          className: "shared text-center",
          children: /*#__PURE__*/_jsx(UITooltip, {
            title: tooltipText,
            children: el
          })
        });
      }

      return /*#__PURE__*/_jsx("td", {
        className: "shared text-center",
        children: el
      });
    }
  }, {
    key: "render",
    value: function render() {
      var channel = this.props.channel;
      return /*#__PURE__*/_jsxs("tr", {
        className: "row-" + channel.channelSlug + (!channel.autoPublishBlogIds.isEmpty() ? " bap-enabled" : ""),
        "data-channelkey": channel.channelKey,
        children: [this.renderAccountCell(), this.renderAccountTitleCell(), !this.props.defaultsOnly && this.renderDisconnect(), this.renderUserCell(), !this.props.defaultsOnly && /*#__PURE__*/_jsx("td", {
          className: "blog-auto-publish",
          children: /*#__PURE__*/_jsx(BlogAutoPublish, Object.assign({}, this.props, {
            isExpired: this.isExpired(),
            toggleEditingBapForChannel: this.toggleEditingBapForChannel
          }))
        }), this.renderPublishAnywhere(), this.renderSharedCheckbox(), this.renderFavorite()]
      });
    }
  }]);

  return AccountRow;
}(Component);

AccountRow.propTypes = {
  accounts: listProp,
  channel: logicalChannelProp,
  portalId: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool,
  defaultsOnly: PropTypes.bool,
  showFavorite: PropTypes.bool,
  userAttributes: PropTypes.object,
  showFavoriteChannelsPopover: PropTypes.bool,
  connectableAccountTypes: setProp,
  dismissFavoriteChannelTooltip: PropTypes.func,
  setChannelShared: PropTypes.func,
  createAccount: PropTypes.func,
  onDisconnect: PropTypes.func,
  saveBlogAutoPublish: PropTypes.func,
  blogsEnabledForNetwork: listProp,
  favoriteEnabledForNetwork: PropTypes.array,
  blogs: listProp,
  editingBapForChannel: PropTypes.string,
  updateUi: PropTypes.func,
  willExpireSoon: PropTypes.bool,
  onChangeFavorite: PropTypes.func.isRequired,
  isOverFavoriteChannelsLimit: PropTypes.bool.isRequired
};
AccountRow.contextType = SocialContext;
AccountRow.defaultProps = {
  isFavorite: false,
  showFavorite: true
};
export default connect(null, mapDispatchToProps)(AccountRow);