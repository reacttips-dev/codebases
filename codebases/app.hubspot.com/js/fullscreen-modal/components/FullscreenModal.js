'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIForm from 'UIComponents/form/UIForm';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import styled from 'styled-components';
import { GREAT_WHITE } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import omit from 'UIComponents/utils/underscore/omit';
import UIModalDialog from 'UIComponents/dialog/UIModalDialog';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { GRID_BREAKPOINT_SMALL } from 'HubStyleTokens/sizes';
var StyledDialog = styled(UIModalDialog).withConfig({
  displayName: "FullscreenModal__StyledDialog",
  componentId: "sc-16typvx-0"
})(["> div{min-height:auto;height:calc(100vh - 16px) !important;top:16px;@media (min-width:", "){height:auto !important;top:0;}}"], GRID_BREAKPOINT_SMALL);
var StyledFooter = styled(UIDialogFooter).withConfig({
  displayName: "FullscreenModal__StyledFooter",
  componentId: "sc-16typvx-1"
})(["border-top:1px solid ", ";height:50px;align-items:center;display:flex;justify-content:", ";"], GREAT_WHITE, function (props) {
  return props.justifycontent;
});
var StyledDialogBody = styled(UIDialogBody).withConfig({
  displayName: "FullscreenModal__StyledDialogBody",
  componentId: "sc-16typvx-2"
})(["min-height:70vh;padding:12px !important;"]);

var FullscreenModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(FullscreenModal, _PureComponent);

  function FullscreenModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FullscreenModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FullscreenModal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleConfirm = function () {
      _this.props.onConfirm(true);
    };

    _this.handleConfirmClick = function (evt) {
      evt.stopPropagation();
    };

    _this.handleReject = function () {
      _this.props.onReject(false);
    };

    _this.handleRejectClick = function (evt) {
      evt.stopPropagation();

      _this.handleReject();
    };

    _this.handleSubmit = function (evt) {
      evt.preventDefault();

      _this.handleConfirm();
    };

    return _this;
  }

  _createClass(FullscreenModal, [{
    key: "renderConfirmButton",
    value: function renderConfirmButton() {
      var _this$props = this.props,
          ConfirmButton = _this$props.ConfirmButton,
          confirmLabel = _this$props.confirmLabel,
          confirmUse = _this$props.confirmUse,
          disableConfirm = _this$props.disableConfirm,
          confirmButtonSize = _this$props.confirmButtonSize,
          disabledTooltip = _this$props.disabledTooltip,
          disabledPlacement = _this$props.disabledPlacement;
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !disableConfirm,
        title: disabledTooltip,
        placement: disabledPlacement,
        children: /*#__PURE__*/_jsx(ConfirmButton, {
          responsive: false,
          type: "submit",
          disabled: disableConfirm,
          use: confirmUse,
          onClick: this.handleConfirmClick,
          size: confirmButtonSize,
          "data-selenium-test": "fullscreen-modal-save-button",
          children: confirmLabel
        })
      });
    }
  }, {
    key: "renderCancelButton",
    value: function renderCancelButton() {
      var _this$props2 = this.props,
          cancelLabel = _this$props2.cancelLabel,
          cancelUse = _this$props2.cancelUse,
          CancelButton = _this$props2.CancelButton,
          cancelButtonSize = _this$props2.cancelButtonSize;
      return /*#__PURE__*/_jsx(CancelButton, {
        responsive: false,
        onClick: this.handleRejectClick,
        use: cancelUse,
        size: cancelButtonSize,
        "data-selenium-test": "fullscreen-modal-cancel-button",
        children: cancelLabel
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          hideConfirmButton = _this$props3.hideConfirmButton,
          minHeight = _this$props3.minHeight,
          className = _this$props3.className,
          errorMessage = _this$props3.errorMessage,
          bodyClassName = _this$props3.bodyClassName;
      return /*#__PURE__*/_jsx("div", {
        className: className,
        style: {
          minHeight: minHeight
        },
        children: /*#__PURE__*/_jsxs(StyledDialog, {
          onEsc: this.handleReject,
          children: [errorMessage || null, /*#__PURE__*/_jsxs(UIForm, {
            onSubmit: this.handleSubmit,
            children: [/*#__PURE__*/_jsx(StyledDialogBody, {
              className: bodyClassName,
              children: this.props.children
            }), /*#__PURE__*/_jsxs(StyledFooter, {
              justifycontent: hideConfirmButton ? 'center' : 'flex-start',
              className: "p-y-1 p-x-6",
              children: [!hideConfirmButton && this.renderConfirmButton(), this.renderCancelButton()]
            })]
          })]
        })
      });
    }
  }]);

  return FullscreenModal;
}(PureComponent);

FullscreenModal.propTypes = Object.assign({}, omit(UIModalDialog.propTypes, 'onEsc'), {
  ConfirmButton: PropTypes.elementType,
  confirmLabel: PropTypes.node.isRequired,
  confirmUse: UIButton.propTypes.use,
  disableConfirm: PropTypes.bool,
  onConfirm: PropTypes.func,
  onReject: PropTypes.func.isRequired,
  CancelButton: PropTypes.elementType,
  cancelLabel: PropTypes.node.isRequired,
  cancelUse: UIButton.propTypes.use,
  minHeight: PropTypes.string,
  hideConfirmButton: PropTypes.bool,
  cancelButtonSize: PropTypes.string,
  confirmButtonSize: PropTypes.string,
  bodyClassName: PropTypes.string,
  disabledTooltip: PropTypes.node,
  disabledPlacement: PropTypes.string,
  errorMessage: PropTypes.node
});
FullscreenModal.defaultProps = Object.assign({}, UIModalDialog.defaultProps, {
  ConfirmButton: UIButton,
  confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "fullscreen-modal.buttons.confirm"
  }),
  confirmUse: 'tertiary',
  CancelButton: UIButton,
  cancelLabel: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "fullscreen-modal.buttons.dismiss"
  }),
  cancelUse: 'tertiary-light',
  cancelButtonSize: 'small',
  confirmButtonSize: 'small',
  hideConfirmButton: false,
  errorMessage: null
});
export default FullscreenModal;