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
import UIMultiColumn from 'UIComponents/layout/UIMultiColumn';
import UIMultiColumnGroup from 'UIComponents/layout/UIMultiColumnGroup';
import UIMultiColumnItem from 'UIComponents/layout/UIMultiColumnItem';
import UIToggle from 'UIComponents/input/UIToggle';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UIButton from 'UIComponents/button/UIButton';
import UISelect from 'UIComponents/input/UISelect';
import { COMPOSER_NEXT_MESSAGE_DELAY_KEY } from '../../data/model/HubSettings';
import { ACCOUNT_TYPES, COMPOSER_NEXT_MESSAGE_DELAYS, USER_ATTR_DEFAULT_PUBLISH_NOW } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import { getHubSpotSocialExtensionUrl } from '../../lib/extension';
import { accountProp, scheduleProp, hubSettingsProp } from '../../lib/propTypes';
import { NavMarker } from 'react-rhumb';

var ScheduleForm = /*#__PURE__*/function (_Component) {
  _inherits(ScheduleForm, _Component);

  function ScheduleForm() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScheduleForm);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScheduleForm)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onChangeFuzzy = function (e) {
      _this.props.updateSchedule({
        fuzzy: e.target.checked
      });

      _this.props.saveSchedule();

      _this.context.trackInteraction("set fuzzy - " + e.target.checked);
    };

    _this.onConnectBitly = function () {
      _this.props.createAccount(ACCOUNT_TYPES.bitly);
    };

    _this.onDeleteBitly = function () {
      _this.props.deleteAccount(_this.props.bitlyAccount.accountGuid);

      _this.context.trackInteraction('disconnect bitly');
    };

    _this.onChangePublishNow = function (e) {
      _this.props.saveUserAttribute({
        key: USER_ATTR_DEFAULT_PUBLISH_NOW,
        value: e.target.checked.toString()
      });

      _this.context.trackInteraction("set default publish now - " + e.target.checked);
    };

    _this.onClickInstallExtension = function () {
      _this.context.trackInteraction('click install extension');
    };

    _this.onChangeNextMessageDelay = function (e) {
      _this.props.updateHubSetting(COMPOSER_NEXT_MESSAGE_DELAY_KEY, e.target.value);

      _this.context.trackInteraction('change next message delay');
    };

    return _this;
  }

  _createClass(ScheduleForm, [{
    key: "renderBitlySection",
    value: function renderBitlySection() {
      // todo - add tooltip when disabled
      var disabled = !this.props.userCanConnectAccounts;
      var button = this.props.bitlyAccount ? /*#__PURE__*/_jsx(UIButton, {
        className: "disconnect-bitly",
        use: "tertiary-light",
        onClick: this.onDeleteBitly,
        disabled: disabled,
        children: I18n.text('sui.bitly.button.connected')
      }) : /*#__PURE__*/_jsx(UIButton, {
        className: "connect-bitly",
        use: "tertiary-light",
        onClick: this.onConnectBitly,
        disabled: disabled,
        children: I18n.text('sui.bitly.button.none')
      });
      var blurb = this.props.bitlyAccount ? I18n.text('sui.bitly.connected', {
        name: this.props.bitlyAccount.name
      }) : I18n.text('sui.bitly.none');
      return /*#__PURE__*/_jsxs(UIMultiColumnGroup, {
        children: [/*#__PURE__*/_jsxs(UIMultiColumnItem, {
          children: [/*#__PURE__*/_jsx(UIFormLabel, {
            children: /*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.bitly.heading')
            })
          }), /*#__PURE__*/_jsx("p", {
            children: blurb
          })]
        }), /*#__PURE__*/_jsx(UIMultiColumnItem, {
          className: "right-col",
          children: button
        })]
      });
    }
  }, {
    key: "renderFuzzySection",
    value: function renderFuzzySection() {
      return /*#__PURE__*/_jsxs(UIMultiColumnGroup, {
        children: [/*#__PURE__*/_jsxs(UIMultiColumnItem, {
          children: [/*#__PURE__*/_jsx(UIFormLabel, {
            children: /*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.schedule.fuzzy.heading')
            })
          }), /*#__PURE__*/_jsx("p", {
            children: I18n.text('sui.schedule.fuzzy.blurb')
          })]
        }), /*#__PURE__*/_jsx(UIMultiColumnItem, {
          className: "right-col",
          children: /*#__PURE__*/_jsx(UIToggle, {
            checked: this.props.schedule.fuzzy,
            onChange: this.onChangeFuzzy,
            size: "extra-small"
          })
        })]
      });
    }
  }, {
    key: "renderNextMessageDelay",
    value: function renderNextMessageDelay() {
      if (!this.props.hubSettings) {
        return null;
      }

      var options = Object.keys(COMPOSER_NEXT_MESSAGE_DELAYS).map(function (k) {
        return {
          value: k,
          text: I18n.text("sui.schedule.nextMessageDelay.options." + k)
        };
      });
      return /*#__PURE__*/_jsxs(UIMultiColumnGroup, {
        className: "next-message-delay",
        children: [/*#__PURE__*/_jsxs(UIMultiColumnItem, {
          children: [/*#__PURE__*/_jsx(UIFormLabel, {
            children: /*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.schedule.nextMessageDelay.heading')
            })
          }), /*#__PURE__*/_jsx("p", {
            children: I18n.text('sui.schedule.nextMessageDelay.blurb')
          })]
        }), /*#__PURE__*/_jsx(UIMultiColumnItem, {
          className: "right-col",
          children: /*#__PURE__*/_jsx(UISelect, {
            value: this.props.hubSettings.get(COMPOSER_NEXT_MESSAGE_DELAY_KEY),
            options: options,
            onChange: this.onChangeNextMessageDelay
          })
        })]
      });
    }
  }, {
    key: "renderPublishNowSection",
    value: function renderPublishNowSection() {
      return /*#__PURE__*/_jsxs(UIMultiColumnGroup, {
        children: [/*#__PURE__*/_jsx(UIMultiColumnItem, {
          children: /*#__PURE__*/_jsx(UIFormLabel, {
            children: /*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.schedule.defaultPublishNow.heading')
            })
          })
        }), /*#__PURE__*/_jsx(UIMultiColumnItem, {
          className: "right-col",
          children: /*#__PURE__*/_jsx(UIToggle, {
            checked: this.props.defaultPublishNow,
            onChange: this.onChangePublishNow,
            size: "extra-small"
          })
        })]
      });
    }
  }, {
    key: "renderInstallExtension",
    value: function renderInstallExtension() {
      if (!window.chrome) {
        return null;
      }

      var buttonEl = /*#__PURE__*/_jsx(UIButton, {
        href: getHubSpotSocialExtensionUrl(),
        use: "tertiary",
        external: true,
        onClick: this.onClickInstallExtension,
        children: I18n.text('sui.schedule.extension.install')
      });

      return /*#__PURE__*/_jsxs(UIMultiColumnGroup, {
        className: "install-extension",
        children: [/*#__PURE__*/_jsx(UIMultiColumnItem, {
          children: /*#__PURE__*/_jsx(UIFormLabel, {
            children: /*#__PURE__*/_jsx("h5", {
              children: I18n.text('sui.schedule.extension.heading')
            })
          })
        }), /*#__PURE__*/_jsx(UIMultiColumnItem, {
          className: "right-col",
          children: buttonEl
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(NavMarker, {
        name: "SCHEDULE_FORM_LOADED",
        children: /*#__PURE__*/_jsxs(UIMultiColumn, {
          className: "schedule-form",
          children: [this.props.showExtensionFirst && this.renderInstallExtension(), this.renderPublishNowSection(), this.renderFuzzySection(), this.renderNextMessageDelay(), this.renderBitlySection(), !this.props.showExtensionFirst && this.renderInstallExtension()]
        })
      });
    }
  }]);

  return ScheduleForm;
}(Component);

ScheduleForm.propTypes = {
  schedule: scheduleProp,
  bitlyAccount: accountProp,
  hubSettings: hubSettingsProp,
  showExtensionFirst: PropTypes.bool,
  createAccount: PropTypes.func,
  updateSchedule: PropTypes.func,
  saveSchedule: PropTypes.func,
  deleteAccount: PropTypes.func,
  updateHubSetting: PropTypes.func,
  saveUserAttribute: PropTypes.func,
  userCanConnectAccounts: PropTypes.bool.isRequired,
  defaultPublishNow: PropTypes.bool
};
ScheduleForm.contextType = SocialContext;
export { ScheduleForm as default };