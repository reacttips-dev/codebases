'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Component, Fragment } from 'react';
import Raven from 'Raven';
import { omit, debounce } from '../../utils';
import keyMirror from 'react-utils/keyMirror';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { submitPql } from 'ui-addon-upgrades/_core/pql/submitPql';
import { ContactSalesButtonPropsInterface } from 'ui-addon-upgrades/_core/contactSales/ContactSalesPropsInterface';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import { DEFAULT_PHONE_NUMBER } from 'ui-addon-upgrades/_core/common/constants/salesPhoneNumbers';
import UnassignableModal from '../communicationMethods/UnassignableModal';
import { RetailModal } from '../communicationMethods/RetailModal';
import { AssignableModal } from '../communicationMethods/AssignableModal';
import { fetchTreatment } from 'ui-addon-upgrades/_core/utils/laboratoryClient';
import { getParameter } from '../../utils';
import { MON481_TREATMENT_KEY, MON481_GROUP_PARAMETER_KEY, MON481_GROUP_PARAMETER_OPTIONS } from '../common/constants/experimentKeys';
import PortalIdParser from 'PortalIdParser';
import { getIsRetailPortal } from '../common/api/fetchRetail';
import { HAS_ASSIGNABLE_OVERRIDE, HAS_UNASSIGNABLE_OVERRIDE } from 'ui-addon-upgrades/_core/utils/commMethodOverrides';
import { getOwnedProducts } from 'self-service-api/api/getProducts';
var BUTTON_STATUSES = keyMirror({
  INITIAL: null,
  LOADING: null,
  SUCCESS: null
});
var COMM_METHODS_MODAL_TYPES = keyMirror({
  ASSIGNABLE: null,
  UNASSIGNABLE: null
});
var CLICK_DELAY = 50;

function sequence() {
  for (var _len = arguments.length, handlers = new Array(_len), _key = 0; _key < _len; _key++) {
    handlers[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    handlers.forEach(function (handler) {
      return handler && handler.apply(void 0, args);
    });
  };
}

var retailPortalPromise;

var ContactSalesButton = /*#__PURE__*/function (_Component) {
  _inherits(ContactSalesButton, _Component);

  function ContactSalesButton(props) {
    var _this;

    _classCallCheck(this, ContactSalesButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactSalesButton).call(this, props));

    _this.fetchIsFreeUserForMon481Variant = function () {
      getOwnedProducts().then(function (productsOwned) {
        if (!productsOwned || !Array.isArray(productsOwned)) return;

        _this.setState({
          isFreeUser: productsOwned.length === 0
        });
      });
    };

    _this.fetchMon481Treatment = function () {
      fetchTreatment(MON481_TREATMENT_KEY, PortalIdParser.get()).then(function (treatment) {
        var value = getParameter(treatment.parameters, MON481_GROUP_PARAMETER_KEY, Object.values(MON481_GROUP_PARAMETER_OPTIONS));

        if (value === MON481_GROUP_PARAMETER_OPTIONS.variation) {
          _this.fetchIsFreeUserForMon481Variant();
        }

        _this.setState({
          mon481Treatment: value
        });
      }).catch(function (error) {
        if (error.status !== 0) {
          Raven.captureMessage('Failed to fetch MON481 treatment', {
            extra: {
              error: error
            }
          });
        }

        _this.setState({
          mon481Treatment: MON481_GROUP_PARAMETER_OPTIONS.control
        });
      });
    };

    _this.handleClose = function () {
      var _this$props = _this.props,
          onCancel = _this$props.onCancel,
          upgradeData = _this$props.upgradeData;
      tracker.track('communicationMethodsInteraction', Object.assign({
        action: 'closed'
      }, upgradeData));

      _this.setState({
        commMethodsModalType: null
      });

      onCancel();
    };

    _this.state = {
      buttonStatus: BUTTON_STATUSES.INITIAL,
      commMethodsModalType: null,
      isRetailPortal: null,
      mon481Treatment: null,
      isFreeUser: null
    };
    _this.debouncedHandleClick = debounce(_this.handleClick.bind(_assertThisInitialized(_this)), CLICK_DELAY);
    return _this;
  }

  _createClass(ContactSalesButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props2 = this.props,
          upgradeData = _this$props2.upgradeData,
          termId = _this$props2.termId,
          additionalUnitQuantity = _this$props2.additionalUnitQuantity,
          subscreen = _this$props2.subscreen;
      tracker.track('contactSalesButtonInteraction', Object.assign({
        action: 'viewed'
      }, upgradeData, {
        termId: termId,
        additionalUnitQuantity: additionalUnitQuantity,
        subscreen: subscreen
      }));

      if (!retailPortalPromise) {
        retailPortalPromise = getIsRetailPortal();
        retailPortalPromise.catch(function (error) {
          // The endpoint throws a 404 when a hub has no company,
          // meaning that it can't be enrolled in retail
          if (error.status !== '404') {
            Raven.captureException(error);
          }
        });
      }

      retailPortalPromise.then(function (isRetailPortal) {
        return _this2.setState({
          isRetailPortal: isRetailPortal
        });
      }, function () {
        return _this2.setState({
          isRetailPortal: false
        });
      });
      this.fetchMon481Treatment();
    }
  }, {
    key: "handleContactSales",
    value: function handleContactSales(isRetail) {
      var _this3 = this;

      var _this$props3 = this.props,
          upgradeData = _this$props3.upgradeData,
          allowModal = _this$props3.allowModal,
          termId = _this$props3.termId,
          additionalUnitQuantity = _this$props3.additionalUnitQuantity,
          subscreen = _this$props3.subscreen;
      tracker.track('contactSalesButtonInteraction', Object.assign({
        action: 'clicked'
      }, upgradeData, {
        termId: termId,
        additionalUnitQuantity: additionalUnitQuantity,
        subscreen: subscreen
      }));
      var pqlData = Object.assign({}, upgradeData, {
        isAssignable: false,
        isRetail: isRetail,
        termId: termId,
        additionalUnitQuantity: additionalUnitQuantity
      });

      if (allowModal) {
        this.setState({
          commMethodsModalType: COMM_METHODS_MODAL_TYPES.ASSIGNABLE
        });
        return;
      }

      this.setState({
        buttonStatus: BUTTON_STATUSES.LOADING
      });
      submitPql(pqlData).then(function () {
        _this3.setState({
          buttonStatus: BUTTON_STATUSES.SUCCESS
        });
      });
    }
  }, {
    key: "handleContactIsc",
    value: function handleContactIsc(isRetail) {
      var _this4 = this;

      var _this$props4 = this.props,
          upgradeData = _this$props4.upgradeData,
          termId = _this$props4.termId,
          allowModal = _this$props4.allowModal,
          additionalUnitQuantity = _this$props4.additionalUnitQuantity,
          subscreen = _this$props4.subscreen;
      tracker.track('contactSalesButtonInteraction', Object.assign({
        action: 'clicked talk to ISC'
      }, upgradeData, {
        termId: termId,
        additionalUnitQuantity: additionalUnitQuantity,
        subscreen: subscreen
      }));
      var pqlData = Object.assign({}, upgradeData, {
        isAssignable: true,
        isRetail: isRetail,
        termId: termId,
        additionalUnitQuantity: additionalUnitQuantity
      });

      if (allowModal) {
        this.setState({
          commMethodsModalType: COMM_METHODS_MODAL_TYPES.UNASSIGNABLE
        });
        return;
      }

      this.setState({
        buttonStatus: BUTTON_STATUSES.LOADING
      }); // when allowModal = false, clicking talk to sales should trigger pql

      submitPql(pqlData).then(function () {
        _this4.setState({
          buttonStatus: BUTTON_STATUSES.SUCCESS
        });
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      var _this5 = this;

      var repInfo = this.props.upgradeData.repInfo;

      var runWhenLoaded = function runWhenLoaded(isRetailPortal) {
        _this5.setState({
          buttonStatus: BUTTON_STATUSES.INITIAL
        }); // Use unassignable modals when missing rep info or when user is in the retail segment


        var isMissingRepInfo = !(repInfo && repInfo.link);
        var isAssignable = !(isRetailPortal || isMissingRepInfo);

        if (!isAssignable) {
          return _this5.handleContactIsc();
        } else if (HAS_ASSIGNABLE_OVERRIDE) {
          return _this5.handleContactSales(isRetailPortal);
        }

        return !_this5.props.isAssignable || HAS_UNASSIGNABLE_OVERRIDE ? _this5.handleContactIsc() : _this5.handleContactSales(isRetailPortal);
      };

      var isRetailPortal = this.state.isRetailPortal;
      if (isRetailPortal !== null) runWhenLoaded(isRetailPortal);else {
        this.setState({
          buttonStatus: BUTTON_STATUSES.LOADING
        });
        retailPortalPromise.then(runWhenLoaded, function () {
          return runWhenLoaded(false);
        });
      }
    }
  }, {
    key: "renderSuccess",
    value: function renderSuccess() {
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.contactSalesButton.success"
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.contactSalesButton.callNow"
          })
        }), /*#__PURE__*/_jsx("h4", {
          children: DEFAULT_PHONE_NUMBER
        })]
      });
    }
  }, {
    key: "renderButton",
    value: function renderButton(loading) {
      var _this$props5 = this.props,
          onClick = _this$props5.onClick,
          forwardedRef = _this$props5.forwardedRef,
          _buttonOverride = _this$props5._buttonOverride;
      var onClickSequence = sequence(this.debouncedHandleClick, onClick);
      var propsToPass = omit(this.props, ['forwardedRef', 'onClick', 'upgradeData', 'allowModal', 'isAssignable', 'termId', 'additionalUnitQuantity', '_textOverride', '_overrideCommunicationMethodKey', '_buttonOverride', '_overrideModalHeaderText']);

      var buttonText = this.props._textOverride || /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.contactSalesButton.text"
      }); // For use cases that require a different component than a UIButton


      if (_buttonOverride) {
        return /*#__PURE__*/_jsx("div", {
          onClick: onClickSequence,
          "data-selenium": "contact-sales-button",
          "data-reagan-primary-cta": true,
          children: _buttonOverride
        });
      }

      return /*#__PURE__*/_jsx(UILoadingButton, Object.assign({
        loading: loading,
        buttonRef: forwardedRef,
        onClick: onClickSequence
      }, propsToPass, {
        "data-selenium": "contact-sales-button",
        "data-reagan-primary-cta": true,
        children: buttonText
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          buttonStatus = _this$state.buttonStatus,
          commMethodsModalType = _this$state.commMethodsModalType,
          mon481Treatment = _this$state.mon481Treatment,
          isFreeUser = _this$state.isFreeUser,
          isRetailPortal = _this$state.isRetailPortal;
      var _this$props6 = this.props,
          upgradeData = _this$props6.upgradeData,
          _overrideCommunicationMethodKey = _this$props6._overrideCommunicationMethodKey,
          _overrideModalHeaderText = _this$props6._overrideModalHeaderText;
      var button;

      if (buttonStatus === BUTTON_STATUSES.SUCCESS) {
        button = this.renderSuccess();
      } else {
        button = this.renderButton(buttonStatus === BUTTON_STATUSES.LOADING);
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [button, commMethodsModalType === COMM_METHODS_MODAL_TYPES.UNASSIGNABLE && (isRetailPortal ? /*#__PURE__*/_jsx(RetailModal, {
          upgradeData: upgradeData,
          onClose: this.handleClose
        }) : /*#__PURE__*/_jsx(UnassignableModal, {
          upgradeData: upgradeData,
          onClose: this.handleClose
        })), commMethodsModalType === COMM_METHODS_MODAL_TYPES.ASSIGNABLE && /*#__PURE__*/_jsx(AssignableModal, {
          _overrideCommunicationMethodKey: _overrideCommunicationMethodKey,
          _overrideModalHeaderText: _overrideModalHeaderText,
          upgradeData: upgradeData,
          onClose: this.handleClose,
          mon481Treatment: mon481Treatment,
          isFreeUser: Boolean(isFreeUser)
        })]
      });
    }
  }]);

  return ContactSalesButton;
}(Component);

ContactSalesButton.defaultProps = {
  use: 'primary',
  onClick: function onClick() {},
  onCancel: function onCancel() {},
  allowModal: true,
  isAssignable: true,
  _textOverride: null,
  _buttonOverride: null,
  _overrideCommunicationMethodKey: null,
  _overrideModalHeaderText: null
};
ContactSalesButton.propTypes = ContactSalesButtonPropsInterface;
export default ContactSalesButton;