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
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeaderImage from 'UIComponents/dialog/UIDialogHeaderImage';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';

var ExportSuccess = /*#__PURE__*/function (_Component) {
  _inherits(ExportSuccess, _Component);

  function ExportSuccess() {
    _classCallCheck(this, ExportSuccess);

    return _possibleConstructorReturn(this, _getPrototypeOf(ExportSuccess).apply(this, arguments));
  }

  _createClass(ExportSuccess, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          closeModal = _this$props.closeModal,
          exportType = _this$props.exportType;
      var type = exportType.toLowerCase();
      return /*#__PURE__*/_jsxs("section", {
        className: "export-success",
        children: [/*#__PURE__*/_jsx(UIDialogHeaderImage, {
          offsetBottom: -23,
          offsetTop: 56,
          children: /*#__PURE__*/_jsx(UIIllustration, {
            name: "success-green",
            width: 118
          })
        }), /*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: closeModal
          }), /*#__PURE__*/_jsx("h2", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.exportModal.success.header"
            })
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            options: {
              exportType: exportType
            },
            message: "sui.exportModal.success.message." + type
          })
        }), /*#__PURE__*/_jsx(UIDialogFooter, {
          align: "center",
          children: /*#__PURE__*/_jsx(UIButton, {
            use: "primary",
            onClick: closeModal,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.exportModal.success.footer"
            })
          })
        })]
      });
    }
  }]);

  return ExportSuccess;
}(Component);

ExportSuccess.propTypes = {
  exportType: PropTypes.string.isRequired,
  closeModal: PropTypes.func
};
export { ExportSuccess as default };