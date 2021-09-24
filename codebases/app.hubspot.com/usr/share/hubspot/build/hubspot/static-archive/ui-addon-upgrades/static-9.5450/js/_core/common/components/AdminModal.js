'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

var _REQUEST_FUNCTION_BY_;

import PropTypes from 'prop-types';
import { Component } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { requestSeatUpgrade } from 'ui-addon-upgrades/_core/upgrade/requestSeatUpgrade';
import { requestAdditionalSeats } from 'ui-addon-upgrades/_core/upgrade/requestAdditionalSeats';
import { requestSKU } from 'ui-addon-upgrades/_core/upgrade/requestSKU';
import { requestTrial } from 'ui-addon-upgrades/_core/upgrade/requestTrial';
import { requestQuotePurchase } from 'ui-addon-upgrades/_core/upgrade/requestQuotePurchase';
import * as AdminModalTypes from 'ui-addon-upgrades/_core/common/constants/AdminModalTypes';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { getProductNameTextOrDefault } from '../adapters/getProductNameText';
import ApiNameToUpgradeProductMap from 'self-service-api/constants/ApiNameToUpgradeProductMap';
import { productLineToHub } from 'self-service-api/constants/ProductLineToHub';
import * as ProductLines from 'self-service-api/constants/ProductLines';
export var REQUEST_FUNCTION_BY_TYPE = (_REQUEST_FUNCTION_BY_ = {}, _defineProperty(_REQUEST_FUNCTION_BY_, AdminModalTypes.REQUEST_ADDITIONAL_SEATS, requestAdditionalSeats), _defineProperty(_REQUEST_FUNCTION_BY_, AdminModalTypes.REQUEST_SEAT_UPGRADE, requestSeatUpgrade), _defineProperty(_REQUEST_FUNCTION_BY_, AdminModalTypes.REQUEST_SEAT_UPGRADE_BANNER, requestSeatUpgrade), _defineProperty(_REQUEST_FUNCTION_BY_, AdminModalTypes.REQUEST_SKU, requestSKU), _defineProperty(_REQUEST_FUNCTION_BY_, AdminModalTypes.REQUEST_TRIAL, requestTrial), _defineProperty(_REQUEST_FUNCTION_BY_, AdminModalTypes.REQUEST_QUOTE, requestQuotePurchase), _REQUEST_FUNCTION_BY_);

var AdminModal = /*#__PURE__*/function (_Component) {
  _inherits(AdminModal, _Component);

  function AdminModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AdminModal);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AdminModal)).call.apply(_getPrototypeOf2, [this].concat(_args)));

    _this.getUpgradeSource = function (_ref) {
      var app = _ref.app,
          screen = _ref.screen,
          uniqueId = _ref.uniqueId;
      return app + "-" + screen + "-admin-modal-" + uniqueId;
    };

    _this.handleError = function () {
      FloatingAlertStore.addAlert({
        message: I18n.text('upgrades.adminModal.alertNotification.error.message'),
        titleText: I18n.text('upgrades.adminModal.alertNotification.error.titleText'),
        type: 'danger'
      });
    };

    _this.handleSuccess = function () {
      FloatingAlertStore.addAlert({
        message: I18n.text('upgrades.adminModal.alertNotification.success.message'),
        titleText: I18n.text('upgrades.adminModal.alertNotification.success.titleText'),
        type: 'success'
      });
    };

    _this.handleClick = function () {
      var _this$props = _this.props,
          apiName = _this$props.apiName,
          productLine = _this$props.productLine,
          modalType = _this$props.modalType,
          onClose = _this$props.onClose;
      var hasRequestFunction = Object.keys(REQUEST_FUNCTION_BY_TYPE).includes(modalType);

      if (hasRequestFunction) {
        var args = modalType === AdminModalTypes.REQUEST_QUOTE ? {
          hub: productLineToHub[productLine]
        } : {
          apiName: apiName
        };
        REQUEST_FUNCTION_BY_TYPE[modalType](args).then(_this.handleSuccess).catch(_this.handleError);
      }

      onClose();
    };

    return _this;
  }

  _createClass(AdminModal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          apiName = _this$props2.apiName,
          modalType = _this$props2.modalType,
          _this$props2$upgradeD = _this$props2.upgradeData,
          upgradeData = _this$props2$upgradeD === void 0 ? {} : _this$props2$upgradeD;
      tracker.track('viewUpgradeAdminPrompt', Object.assign({
        apiName: apiName,
        modalType: modalType,
        upgradeSource: upgradeData.source || this.getUpgradeSource(upgradeData)
      }, upgradeData));
    }
  }, {
    key: "getApiName",
    value: function getApiName() {
      var upgradeProduct = ApiNameToUpgradeProductMap[this.props.apiName];
      return getProductNameTextOrDefault(upgradeProduct);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          modalType = _this$props3.modalType,
          onClose = _this$props3.onClose;
      return /*#__PURE__*/_jsxs(UIModal, {
        size: "auto",
        width: 540,
        use: "success",
        "data-selenium": "admin-only-modal",
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              "data-unit-test": "admin-modal__title",
              message: "upgrades.adminModal." + modalType + ".title"
            })
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx("p", {
            className: "p-right-4",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              "data-unit-test": "admin-modal__paragraph",
              message: "upgrades.adminModal." + modalType + ".paragraph",
              options: {
                productName: this.getApiName()
              }
            })
          })
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          children: /*#__PURE__*/_jsx("div", {
            "data-selenium": "admin-modal-close-button",
            children: /*#__PURE__*/_jsx(UIButton, {
              className: "m-left-0",
              use: "primary",
              onClick: this.handleClick,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                "data-unit-test": "admin-modal__button",
                message: "upgrades.adminModal." + modalType + ".button"
              })
            })
          })
        })]
      });
    }
  }]);

  return AdminModal;
}(Component);

AdminModal.propTypes = {
  apiName: PropTypes.string.isRequired,
  modalType: PropTypes.oneOf(Object.values(AdminModalTypes || {})),
  onClose: PropTypes.func.isRequired,
  productLine: PropTypes.oneOf(Object.values(ProductLines)),
  upgradeData: PropTypes.object.isRequired
};
export default AdminModal;