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
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import I18n from 'I18n';
import UIModal from 'UIComponents/dialog/UIModal';
import UIWizard from 'UIComponents/dialog/UIWizard';
import UIWizardHeaderWithOverview from 'UIComponents/dialog/UIWizardHeaderWithOverview';
import UIWizardStep from 'UIComponents/dialog/UIWizardStep';
import { goToManageUrl } from '../manage/actions';
import { createAccount, deleteAccount } from '../redux/actions/accounts';
import { fetchSchedule, saveSchedule, updateSchedule } from '../redux/actions/schedule';
import { saveUnboxing, setConnectStep } from '../redux/actions/ui';
import { fetchEmailSettings, updateEmailSettings, saveEmailSettings, updateHubSetting, onChangeFavorite, fetchHubSettings, saveUserAttribute } from '../redux/actions/users';
import { getAccountsForDisplay } from '../redux/selectors';
import { accountSettingsChannels, getShowFavoriteChannelsPopover } from '../redux/selectors/channels';
import { getConnectableAccountTypes } from '../redux/selectors/accounts';
import { getTotalConnectedChannels, getConnectedChannelsLimit, portalIsTrial } from '../redux/selectors/gates';
import { getUserIsPublisher, getUserId, getUserCanConnectAccounts } from '../redux/selectors/user';
import { getUserAttributes, makeGetIsFavoriteChannel, getOverFavoriteChannelsLimit, makeGetFavoriteChannelsForNetwork } from '../redux/selectors/users';
import { connectStepProp, mapProp, orderedMapProp, scheduleProp, setProp, hubSettingsProp } from '../lib/propTypes';
import { passPropsFor } from '../lib/utils';
import OnboardingAccounts from '../components/onboarding/OnboardingAccounts';
import AccountsTable from '../components/accounts/AccountsTable';
import ScheduleForm from '../components/schedule/ScheduleForm';
import EmailSettingsForm from '../components/notifications/EmailSettingsForm';
import { ACCOUNT_TYPES } from '../lib/constants';
import { trackScreen, trackInteraction } from '../redux/actions/usage';
import AMPLITUDE_EVENTS from '../lib/usageEvents';
import { NavMarker } from 'react-rhumb';
import ErrorBoundary from '../components/app/ErrorBoundary';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import ZeroState from './ZeroStateContainer';

var mapStateToProps = function mapStateToProps(state) {
  return {
    accounts: getAccountsForDisplay(state),
    channels: accountSettingsChannels(state),
    user: state.user,
    users: state.users,
    userId: getUserId(state),
    portalId: state.portal.portal_id,
    connectStep: state.ui.get('connectStep'),
    schedule: state.schedule,
    emailSettings: state.emailSettings,
    userAttributes: getUserAttributes(state),
    hubSettings: state.hubSettings,
    userIsPublisher: getUserIsPublisher(state),
    userCanConnectAccounts: getUserCanConnectAccounts(state),
    connectableAccountTypes: getConnectableAccountTypes(state),
    isTrial: portalIsTrial(state),
    totalConnectedChannels: getTotalConnectedChannels(state),
    connectedChannelsLimit: getConnectedChannelsLimit(state),
    isFavoriteChannelKey: makeGetIsFavoriteChannel(state),
    showFavoriteChannelsPopover: getShowFavoriteChannelsPopover(state),
    getFavoriteChannelsForNetwork: makeGetFavoriteChannelsForNetwork(state),
    isOverFavoriteChannelsLimit: getOverFavoriteChannelsLimit(state)
  };
};

var mapDispatchToProps = {
  push: push,
  setConnectStep: setConnectStep,
  fetchEmailSettings: fetchEmailSettings,
  updateEmailSettings: updateEmailSettings,
  saveEmailSettings: saveEmailSettings,
  saveUnboxing: saveUnboxing,
  saveSchedule: saveSchedule,
  updateSchedule: updateSchedule,
  createAccount: createAccount,
  deleteAccount: deleteAccount,
  fetchSchedule: fetchSchedule,
  fetchHubSettings: fetchHubSettings,
  updateHubSetting: updateHubSetting,
  trackScreen: trackScreen,
  trackInteraction: trackInteraction,
  onChangeFavorite: onChangeFavorite,
  goToManageUrl: goToManageUrl,
  saveUserAttribute: saveUserAttribute
};

var OnboardingContainer = /*#__PURE__*/function (_Component) {
  _inherits(OnboardingContainer, _Component);

  function OnboardingContainer() {
    var _this;

    _classCallCheck(this, OnboardingContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OnboardingContainer).call(this));

    _this.onConfirm = function () {
      _this.props.saveUnboxing('ssOnboarding');

      _this.props.goToManageUrl();

      _this.props.trackInteraction('onboarding complete');
    };

    _this.onConnectAccountsClick = function () {
      _this.props.trackInteraction('onboarding connect accounts button');
    };

    _this.state = {};
    return _this;
  }

  _createClass(OnboardingContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.trackScreen(AMPLITUDE_EVENTS.beta);

      if (!this.props.hubSettings) {
        this.props.fetchHubSettings();
      }

      if (!this.props.emailSettings) {
        this.props.fetchEmailSettings(this.props.userId);
      }

      if (!this.props.schedule) {
        this.props.fetchSchedule();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.props.route.id === 'welcome' || !this.props.userCanConnectAccounts) {
        return /*#__PURE__*/_jsx(ZeroState, {
          showIllustration: true
        });
      }

      var bitlyAccount = this.props.accounts && this.props.accounts.find(function (a) {
        return a.accountSlug === ACCOUNT_TYPES.bitly;
      });
      return /*#__PURE__*/_jsx(NavMarker, {
        name: "ONBOARDING_ACCOUNT_LOADED",
        children: /*#__PURE__*/_jsx(UIModal, {
          use: "fullscreen",
          children: /*#__PURE__*/_jsxs(UIWizard, {
            className: "onboarding",
            headerComponent: UIWizardHeaderWithOverview,
            cancellable: true,
            disablePrimaryButton: Boolean(this.props.channels && this.props.channels.isEmpty()),
            onReject: function onReject() {
              return _this2.props.goToManageUrl();
            },
            onConfirm: this.onConfirm,
            children: [/*#__PURE__*/_jsx(UIWizardStep, {
              name: I18n.text('sui.onboarding.connect.title'),
              children: /*#__PURE__*/_jsx("div", {
                className: "onboarding-step onboarding-step-connect",
                children: /*#__PURE__*/_jsx(OnboardingAccounts, Object.assign({}, passPropsFor(this.props, OnboardingAccounts)))
              })
            }), /*#__PURE__*/_jsx(UIWizardStep, {
              name: I18n.text('sui.onboarding.defaults.title'),
              children: /*#__PURE__*/_jsxs("div", {
                className: "onboarding-step onboarding-step-defaults",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "intro",
                  children: [/*#__PURE__*/_jsx(H4, {
                    children: /*#__PURE__*/_jsx(FormattedMessage, {
                      message: "sui.onboarding.defaults.heading"
                    })
                  }), /*#__PURE__*/_jsx("p", {
                    children: /*#__PURE__*/_jsx(FormattedMessage, {
                      message: "sui.onboarding.defaults.blurb"
                    })
                  })]
                }), /*#__PURE__*/_jsx(AccountsTable, Object.assign({}, passPropsFor(this.props, AccountsTable), {
                  defaultsOnly: true
                }))]
              })
            }), /*#__PURE__*/_jsx(UIWizardStep, {
              name: I18n.text('sui.onboarding.setup.title'),
              children: /*#__PURE__*/_jsxs("div", {
                className: "onboarding-step onboarding-step-setup",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "intro",
                  children: [/*#__PURE__*/_jsx(H4, {
                    children: /*#__PURE__*/_jsx(FormattedMessage, {
                      message: "sui.onboarding.setup.heading"
                    })
                  }), /*#__PURE__*/_jsx("p", {
                    children: /*#__PURE__*/_jsx(FormattedMessage, {
                      message: "sui.onboarding.setup.blurb"
                    })
                  })]
                }), this.props.schedule && /*#__PURE__*/_jsx(ErrorBoundary, {
                  errorName: "SCHEDULE_FORM_FAILED",
                  children: /*#__PURE__*/_jsx(ScheduleForm, Object.assign({}, passPropsFor(this.props, ScheduleForm), {
                    showExtensionFirst: true,
                    bitlyAccount: bitlyAccount
                  }))
                })]
              })
            }), /*#__PURE__*/_jsx(UIWizardStep, {
              className: "onboarding-step",
              name: I18n.text('sui.onboarding.notifications.heading'),
              children: /*#__PURE__*/_jsxs("div", {
                className: "onboarding-step onboarding-step-notifications",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "intro",
                  children: [/*#__PURE__*/_jsx(H4, {
                    children: /*#__PURE__*/_jsx(FormattedMessage, {
                      message: "sui.onboarding.notifications.heading"
                    })
                  }), /*#__PURE__*/_jsx("p", {
                    children: /*#__PURE__*/_jsx(FormattedMessage, {
                      message: "sui.onboarding.notifications.blurb"
                    })
                  })]
                }), /*#__PURE__*/_jsx(ErrorBoundary, {
                  errorName: "EMAIL_NOTIFICATIONS_SETTINGS_FAILED",
                  children: /*#__PURE__*/_jsx(EmailSettingsForm, Object.assign({}, passPropsFor(this.props, EmailSettingsForm)))
                })]
              })
            })]
          })
        })
      });
    }
  }]);

  return OnboardingContainer;
}(Component);

OnboardingContainer.propTypes = {
  accounts: PropTypes.object,
  channels: orderedMapProp,
  portalId: PropTypes.number,
  user: PropTypes.object.isRequired,
  users: orderedMapProp,
  connectStep: connectStepProp,
  schedule: scheduleProp,
  emailSettings: mapProp,
  route: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired,
  userAttributes: PropTypes.object,
  hubSettings: hubSettingsProp,
  push: PropTypes.func,
  fetchSchedule: PropTypes.func,
  fetchEmailSettings: PropTypes.func,
  updateEmailSettings: PropTypes.func,
  updateSchedule: PropTypes.func,
  fetchHubSettings: PropTypes.func,
  updateHubSetting: PropTypes.func,
  createAccount: PropTypes.func,
  deleteAccount: PropTypes.func,
  saveEmailSettings: PropTypes.func,
  saveUnboxing: PropTypes.func,
  setConnectStep: PropTypes.func,
  goToManageUrl: PropTypes.func,
  trackScreen: PropTypes.func.isRequired,
  trackInteraction: PropTypes.func.isRequired,
  accountsFailed: PropTypes.bool,
  userIsPublisher: PropTypes.bool.isRequired,
  userCanConnectAccounts: PropTypes.bool.isRequired,
  connectableAccountTypes: setProp,
  totalConnectedChannels: PropTypes.number,
  connectedChannelsLimit: PropTypes.number,
  isTrial: PropTypes.bool,
  onChangeFavorite: PropTypes.func.isRequired,
  isFavoriteChannelKey: PropTypes.func.isRequired,
  showFavoriteChannelsPopover: PropTypes.func.isRequired,
  getFavoriteChannelsForNetwork: PropTypes.func,
  isOverFavoriteChannelsLimit: PropTypes.bool.isRequired
};

var OnboardingContainerWithErrorBoundary = function OnboardingContainerWithErrorBoundary(props) {
  return /*#__PURE__*/_jsx(ErrorBoundary, {
    errorName: "ONBOARDING_LOAD_FAILED",
    children: /*#__PURE__*/_jsx(OnboardingContainer, Object.assign({}, props))
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingContainerWithErrorBoundary);