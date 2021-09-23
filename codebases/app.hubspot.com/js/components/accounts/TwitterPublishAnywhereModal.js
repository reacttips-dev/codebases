'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIList from 'UIComponents/list/UIList';
import UISelectableButton from 'UIComponents/button/UISelectableButton';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UIOptimisticProgress from 'UIComponents/progress/UIOptimisticProgress';
import UIButton from 'UIComponents/button/UIButton';
import Small from 'UIComponents/elements/Small';
import { passPropsFor } from '../../lib/utils';
import { accountProp, channelProp } from '../../lib/propTypes';
import { LOADING_INCREMENT_PERCENTAGE, LOADING_INCREMENT_INTERVAL_MS, TWITTER_PUBLISH_ANYWHERE_OPTIONS } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import ChannelsModalSingleChannel from './ChannelsModalSingleChannel';
import AccountLimitAlert from './AccountLimitAlert';
import H2 from 'UIComponents/elements/headings/H2';

var TwitterPublishAnywhereModal = /*#__PURE__*/function (_Component) {
  _inherits(TwitterPublishAnywhereModal, _Component);

  function TwitterPublishAnywhereModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TwitterPublishAnywhereModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TwitterPublishAnywhereModal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onRadioChange = function (selectedOption) {
      var _this$props = _this.props,
          updateAccountChannel = _this$props.updateAccountChannel,
          channel = _this$props.channel,
          account = _this$props.account;
      var settings = channel.mergeIn(['settings'], {
        publishAnywhere: selectedOption.value
      }).settings;
      updateAccountChannel(account.accountGuid, channel.channelKey, {
        settings: settings
      });
    };

    _this.onSubmit = function () {
      var _this$props2 = _this.props,
          channel = _this$props2.channel,
          account = _this$props2.account;
      var publishAnywhere = channel.getPublishAnywhereSetting();

      _this.context.trackInteraction('submit publishAnywhere setting', {
        network: 'twitter',
        publishAnywhere: publishAnywhere
      });

      _this.props.saveTwitterChannel(channel, account.accountGuid, {
        publishAnywhere: publishAnywhere
      });
    };

    return _this;
  }

  _createClass(TwitterPublishAnywhereModal, [{
    key: "getLabelContent",
    value: function getLabelContent(data) {
      return /*#__PURE__*/_jsxs("div", {
        className: "twitter-account-settings-radio",
        children: [/*#__PURE__*/_jsx("h4", {
          children: data.title
        }), /*#__PURE__*/_jsx("p", {
          children: data.description
        }), /*#__PURE__*/_jsx(Small, {
          children: data.hint
        })]
      });
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
      var totalConnectedChannels = this.props.totalConnectedChannels;
      return /*#__PURE__*/_jsx("div", {
        className: "account-limit-alert",
        children: /*#__PURE__*/_jsx(AccountLimitAlert, Object.assign({}, passPropsFor(this.props, AccountLimitAlert), {
          connectedChannels: totalConnectedChannels + 1
        }))
      });
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      var channel = this.props.channel;

      if (this.props.isSaving) {
        return null;
      }

      var isSubmitDisabled = !channel.getPublishAnywhereSetting();
      return /*#__PURE__*/_jsx("div", {
        className: "buttons",
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          disabled: isSubmitDisabled,
          onClick: this.onSubmit,
          "data-test-id": "channel-modal-submit",
          children: I18n.text('sui.accounts.postConnect.buttons.done')
        })
      });
    }
  }, {
    key: "renderTiles",
    value: function renderTiles() {
      var _this2 = this;

      var channel = this.props.channel;
      var twitterAccountSettingsOptions = [{
        value: TWITTER_PUBLISH_ANYWHERE_OPTIONS.ENABLED,
        title: I18n.text('sui.accounts.postConnect.twitter.publishAnywhere.header'),
        description: I18n.text('sui.accounts.postConnect.twitter.publishAnywhere.description'),
        hint: I18n.text('sui.accounts.postConnect.twitter.publishAnywhere.hint')
      }, {
        value: TWITTER_PUBLISH_ANYWHERE_OPTIONS.DISABLED,
        title: I18n.text('sui.accounts.postConnect.twitter.hsOnly.header'),
        description: I18n.text('sui.accounts.postConnect.twitter.hsOnly.description'),
        hint: I18n.text('sui.accounts.postConnect.twitter.hsOnly.hint')
      }];
      return /*#__PURE__*/_jsx("div", {
        className: "twitter-account-options",
        children: twitterAccountSettingsOptions.map(function (option, key) {
          var isChecked = channel.getPublishAnywhereSetting() === option.value;
          return /*#__PURE__*/_jsx(UIList, {
            childClassName: "m-bottom-4",
            children: /*#__PURE__*/_jsx(UISelectableButton, {
              block: true,
              name: "twitter-account-settings",
              className: "twitter-account-option",
              onClick: function onClick() {
                return _this2.onRadioChange(option);
              },
              selected: isChecked,
              textLabel: _this2.getLabelContent(option),
              type: "radio",
              truncatable: false,
              selectionMarkLocation: "top-left",
              "data-test-id": "publish-anywhere-" + option.value
            })
          }, key);
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.channel) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIModal, {
        className: "select-channels-modal",
        width: 600,
        children: [/*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: I18n.text('sui.accounts.postConnect.publishAnywhere.header')
          })
        }), this.props.isSaving && this.renderLoading(), !this.props.isSaving && this.renderAccountLimitAlert(), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [this.props.isSaving && /*#__PURE__*/_jsx("h5", {
            children: I18n.text('sui.accounts.postConnect.addingChannels')
          }), !this.props.isSaving && /*#__PURE__*/_jsxs("div", {
            className: "twitter-account-settings",
            children: [/*#__PURE__*/_jsx(ChannelsModalSingleChannel, {
              channel: this.props.channel,
              checked: true,
              disabled: true,
              showTasks: false,
              showCheckbox: false
            }), this.renderTiles()]
          })]
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          children: this.renderButtons()
        })]
      });
    }
  }]);

  return TwitterPublishAnywhereModal;
}(Component);

TwitterPublishAnywhereModal.propTypes = {
  channel: channelProp,
  account: accountProp,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateAccountChannel: PropTypes.func.isRequired,
  saveTwitterChannel: PropTypes.func.isRequired,
  totalConnectedChannels: PropTypes.number.isRequired,
  connectedChannelsLimit: PropTypes.number.isRequired,
  isTrial: PropTypes.bool.isRequired,
  isNewChannel: PropTypes.bool.isRequired
};
TwitterPublishAnywhereModal.defaultProps = {
  onSubmit: function onSubmit() {}
};
TwitterPublishAnywhereModal.contextType = SocialContext;
export { TwitterPublishAnywhereModal as default };