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
import { deleteAccount, createAccount, refreshAfterAccountConnect } from '../redux/actions/accounts';
import { initBroadcastGroup } from '../redux/actions/broadcastGroup';
import { goToManageUrl } from '../manage/actions';
import { saveTwitterChannel, activateNewAccountChannels, updateAccountChannel, fetchAccountsWithChannels } from '../redux/actions/channels';
import { setConnectStep, setConnectingAccountGuid, showNotification, updateUi } from '../redux/actions/ui';
import { getAppSection, currentLocation, getFromApp, isLoading, getAccountsForDisplay } from '../redux/selectors';
import { getConnectableAccountTypes, getConnectingAccount, getConnectingAccountGuid, getConnectStep, getLackPermissionsChannels, getLackScopesChannels, getConnectableChannels, getConnectedChannels, getAccountChannelsByAccount, getChannelsConnectingCount } from '../redux/selectors/accounts';
import { accountProp, appSectionProp, connectStepProp, logicalChannelsProp, listProp, mapProp, setProp } from '../lib/propTypes';
import { APP_SECTIONS, CONNECT_STEPS, ACCOUNT_TYPES } from '../lib/constants';
import { getTotalConnectedChannels, getConnectedChannelsLimit, portalIsTrial } from '../redux/selectors/gates';
import { passPropsFor } from '../lib/utils';
import ConnectModal from '../components/accounts/ConnectModal';
import SelectChannelsModal from '../components/accounts/SelectChannelsModal';
import ConnectSuccessModal from '../components/accounts/ConnectSuccessModal';
import ConnectFailureModal from '../components/accounts/ConnectFailureModal';
import TwitterPublishAnywhereModal from '../components/accounts/TwitterPublishAnywhereModal';
import { getUserId } from '../redux/selectors/user';

var mapStateToProps = function mapStateToProps(state) {
  return {
    accounts: getAccountsForDisplay(state),
    lackScopesChannels: getLackScopesChannels(state),
    lackPermissionsChannels: getLackPermissionsChannels(state),
    connectableChannels: getConnectableChannels(state),
    connectedChannels: getConnectedChannels(state),
    connectingAccount: getConnectingAccount(state),
    accountChannels: getAccountChannelsByAccount(state),
    accountsConnected: state.accountsConnected,
    newUserAppInstall: state.newUserAppInstall,
    users: state.users,
    appSection: getAppSection(state),
    location: currentLocation(state),
    fromReports: getFromApp(state) === 'reports',
    ui: state.ui,
    userId: getUserId(state),
    portalId: state.portal.portal_id,
    isSaving: isLoading('activateNewAccountChannels')(state),
    connectStep: getConnectStep(state),
    connectingAccountGuid: getConnectingAccountGuid(state),
    connectableAccountTypes: getConnectableAccountTypes(state),
    totalConnectedChannels: getTotalConnectedChannels(state),
    connectedChannelsLimit: getConnectedChannelsLimit(state),
    isTrial: portalIsTrial(state),
    channelsConnectingCount: getChannelsConnectingCount(state)
  };
};

var mapDispatchToProps = {
  createAccount: createAccount,
  deleteAccount: deleteAccount,
  updateUi: updateUi,
  push: push,
  setConnectStep: setConnectStep,
  setConnectingAccountGuid: setConnectingAccountGuid,
  fetchAccountsWithChannels: fetchAccountsWithChannels,
  goToManageUrl: goToManageUrl,
  refreshAfterAccountConnect: refreshAfterAccountConnect,
  initBroadcastGroup: initBroadcastGroup,
  saveTwitterChannel: saveTwitterChannel,
  activateNewAccountChannels: activateNewAccountChannels,
  updateAccountChannel: updateAccountChannel,
  showNotification: showNotification
};

var OAuthContainer = /*#__PURE__*/function (_Component) {
  _inherits(OAuthContainer, _Component);

  function OAuthContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, OAuthContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(OAuthContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.exitConnectFlow = function () {
      _this.props.setConnectStep(null);

      _this.props.setConnectingAccountGuid(null);

      if (_this.props.connectingAccount) {
        var url = 'settings';

        if (_this.props.appSection === APP_SECTIONS.onboarding) {
          url = 'getting-started';
        }

        _this.props.push(url);
      }
    };

    _this.onCloseSuccess = function () {
      _this.exitConnectFlow();

      _this.props.refreshAfterAccountConnect(_this.props.appSection === APP_SECTIONS.onboarding);
    };

    _this.onSelectNetwork = function () {
      _this.props.setConnectStep(CONNECT_STEPS.auth);
    };

    _this.onCloseSelectChannels = function () {
      _this.exitConnectFlow();

      _this.props.fetchAccountsWithChannels();
    };

    return _this;
  }

  _createClass(OAuthContainer, [{
    key: "renderConnectModal",
    value: function renderConnectModal() {
      var _this$props = this.props,
          connectingAccount = _this$props.connectingAccount,
          connectStep = _this$props.connectStep,
          location = _this$props.location;

      if (connectingAccount) {
        if ([CONNECT_STEPS.selectChannels].includes(connectStep) && this.props.accountChannels) {
          return /*#__PURE__*/_jsx(SelectChannelsModal, Object.assign({}, passPropsFor(this.props, SelectChannelsModal), {
            channels: this.props.accountChannels,
            connectedChannels: this.props.connectedChannels,
            connectableChannels: this.props.connectableChannels,
            lackPermissionsChannels: this.props.lackPermissionsChannels,
            lackScopesChannels: this.props.lackScopesChannels,
            appSection: this.props.appSection,
            portalId: this.props.portalId,
            isSaving: this.props.isSaving,
            updateAccountChannel: this.props.updateAccountChannel,
            activateNewAccountChannels: this.props.activateNewAccountChannels,
            isTrial: this.props.isTrial,
            connectedChannelsLimit: this.props.connectedChannelsLimit,
            totalConnectedChannels: this.props.totalConnectedChannels,
            account: connectingAccount,
            isOpen: true,
            onClose: this.onCloseSelectChannels
          }));
        } else if (connectStep === CONNECT_STEPS.publishAnywhere && connectingAccount.accountSlug === ACCOUNT_TYPES.twitter) {
          return /*#__PURE__*/_jsx(TwitterPublishAnywhereModal, Object.assign({}, passPropsFor(this.props, TwitterPublishAnywhereModal), {
            channel: this.props.accountChannels.first(),
            account: connectingAccount,
            isOpen: true,
            onClose: this.onCloseSelectChannels,
            isNewChannel: !this.props.connectableChannels.isEmpty()
          }));
        }
      }

      var focusedNetwork;

      if (location.pathname.includes('connect')) {
        if (this.props.connectableAccountTypes.includes(location.query.network)) {
          focusedNetwork = location.query.network;
        }
      }

      return /*#__PURE__*/_jsx(ConnectModal, Object.assign({}, passPropsFor(this.props, ConnectModal), {
        focusedAccountType: focusedNetwork,
        isOpen: this.props.connectStep === CONNECT_STEPS.selectNetwork,
        onClose: this.exitConnectFlow,
        onSelectNetwork: this.onSelectNetwork
      }));
    }
  }, {
    key: "renderSuccessModal",
    value: function renderSuccessModal() {
      var _this$props2 = this.props,
          connectingAccount = _this$props2.connectingAccount,
          connectStep = _this$props2.connectStep;

      if (connectingAccount && connectStep === CONNECT_STEPS.success) {
        return /*#__PURE__*/_jsx(ConnectSuccessModal, {
          account: connectingAccount,
          numberOfNewlyConnectedChannels: this.props.channelsConnectingCount,
          goToManageUrl: this.props.goToManageUrl,
          initBroadcastGroup: this.props.initBroadcastGroup,
          onClose: this.onCloseSuccess
        });
      }

      return null;
    }
  }, {
    key: "renderFailureModal",
    value: function renderFailureModal() {
      var _this$props3 = this.props,
          connectingAccount = _this$props3.connectingAccount,
          connectStep = _this$props3.connectStep;

      if (connectStep === CONNECT_STEPS.error && this.props.ui.get('accountConnectFailure')) {
        return /*#__PURE__*/_jsx(ConnectFailureModal, Object.assign({}, passPropsFor(this.props, ConnectFailureModal), {
          account: connectingAccount // not necessarily present if we failed /complete-auth
          ,
          accountConnectFailure: this.props.ui.get('accountConnectFailure'),
          onClose: this.exitConnectFlow
        }));
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.accounts) {
        return null;
      }

      return /*#__PURE__*/_jsxs("div", {
        className: "oauth-container",
        children: [this.renderConnectModal(), this.renderFailureModal(), this.renderSuccessModal()]
      });
    }
  }]);

  return OAuthContainer;
}(Component);

OAuthContainer.propTypes = {
  connectingAccount: accountProp,
  connectStep: connectStepProp,
  accounts: listProp,
  accountChannels: mapProp,
  channels: logicalChannelsProp,
  lackAccountLevelPermission: PropTypes.bool,
  lackPermissionsChannels: mapProp,
  lackScopesChannels: mapProp,
  connectableChannels: mapProp,
  connectedChannels: mapProp,
  accountsConnected: setProp,
  appSection: appSectionProp,
  portalId: PropTypes.number,
  userId: PropTypes.number,
  ui: mapProp,
  route: PropTypes.object.isRequired,
  params: PropTypes.object,
  location: PropTypes.object.isRequired,
  goToManageUrl: PropTypes.func,
  fromReports: PropTypes.bool.isRequired,
  connectableAccountTypes: setProp,
  setConnectStep: PropTypes.func,
  setConnectingAccountGuid: PropTypes.func,
  showNotification: PropTypes.func,
  fetchAccountsWithChannels: PropTypes.func,
  refreshAfterAccountConnect: PropTypes.func,
  createAccount: PropTypes.func,
  saveTwitterChannel: PropTypes.func,
  updateAccountChannel: PropTypes.func,
  isSaving: PropTypes.bool.isRequired,
  activateNewAccountChannels: PropTypes.func,
  initBroadcastGroup: PropTypes.func,
  updateUi: PropTypes.func,
  push: PropTypes.func,
  totalConnectedChannels: PropTypes.number,
  connectedChannelsLimit: PropTypes.number,
  isTrial: PropTypes.bool,
  channelsConnectingCount: PropTypes.number
};
export default connect(mapStateToProps, mapDispatchToProps)(OAuthContainer);