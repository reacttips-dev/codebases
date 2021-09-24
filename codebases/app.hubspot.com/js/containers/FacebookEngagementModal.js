'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { goToManageUrl } from '../manage/actions';
import { push } from 'react-router-redux';
import { orderedMapProp } from '../lib/propTypes';
import { ACCOUNT_TYPES, APP_SECTIONS, CONNECT_STEPS } from '../lib/constants';
import FacebookConnectedModal from 'ads-social-boost-panel/components/external-modals/FacebookConnectedModal';
import FacebookNotConnectedModal from 'ads-social-boost-panel/components/external-modals/FacebookNotConnectedModal';
import { getChannelsForComposerPicker } from '../redux/selectors/channels';
import { getAppSection, getFacebookEngagementModalVisible } from '../redux/selectors/index';
import { setConnectingAccountGuid, setConnectStep, updateUi } from '../redux/actions/ui';

var mapStateToProps = function mapStateToProps(state) {
  return {
    channels: getChannelsForComposerPicker(state),
    isFacebookEngagementModalVisible: getFacebookEngagementModalVisible(state),
    isSettings: getAppSection(state) === APP_SECTIONS.settings
  };
};

var mapDispatchToProps = {
  updateUi: updateUi,
  setConnectStep: setConnectStep,
  setConnectingAccountGuid: setConnectingAccountGuid,
  goToManageUrl: goToManageUrl,
  push: push
};

var FacebookEngagementModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(FacebookEngagementModal, _PureComponent);

  function FacebookEngagementModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FacebookEngagementModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FacebookEngagementModal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onDismissNoAccountsModal = function () {
      _this.props.updateUi({
        isFacebookEngagementModalVisible: false
      });
    };

    _this.onDismissFacebookConnectedModal = function () {
      _this.props.updateUi({
        isFacebookEngagementModalVisible: false
      });

      if (_this.props.isSettings) {
        _this.props.goToManageUrl();
      }
    };

    _this.onClickConnectAccount = function () {
      _this.props.push('/settings/connect?network=facebook');

      _this.props.setConnectStep(CONNECT_STEPS.selectNetwork);

      _this.props.updateUi({
        isFacebookEngagementModalVisible: false
      });
    };

    return _this;
  }

  _createClass(FacebookEngagementModal, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          channels = _this$props.channels,
          isFacebookEngagementModalVisible = _this$props.isFacebookEngagementModalVisible;

      if (!isFacebookEngagementModalVisible || !channels) {
        return null;
      }

      var facebookChannels = channels.filter(function (c) {
        return c.accountSlug === ACCOUNT_TYPES.facebook;
      });

      if (facebookChannels.isEmpty()) {
        return /*#__PURE__*/_jsx(FacebookNotConnectedModal, {
          onDismiss: this.onDismissNoAccountsModal,
          onClickConnectAccount: this.onClickConnectAccount
        });
      }

      return /*#__PURE__*/_jsx(FacebookConnectedModal, {
        onDismiss: this.onDismissFacebookConnectedModal
      });
    }
  }]);

  return FacebookEngagementModal;
}(PureComponent);

FacebookEngagementModal.propTypes = {
  channels: orderedMapProp,
  isSettings: PropTypes.bool.isRequired,
  isFacebookEngagementModalVisible: PropTypes.bool.isRequired,
  updateUi: PropTypes.func.isRequired,
  goToManageUrl: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  setConnectStep: PropTypes.func,
  setConnectingAccountGuid: PropTypes.func
};
FacebookEngagementModal.defaultProps = {
  isFacebookEngagementModalVisible: false,
  isSettings: false
};
export default connect(mapStateToProps, mapDispatchToProps)(FacebookEngagementModal);