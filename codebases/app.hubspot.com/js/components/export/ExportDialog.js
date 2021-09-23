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
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UITextInput from 'UIComponents/input/UITextInput';
import { isValidEmail } from '../../lib/utils';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { Small } from 'UIComponents/elements';
import FormattedMessage from 'I18n/components/FormattedMessage';

var ExportDialog = /*#__PURE__*/function (_Component) {
  _inherits(ExportDialog, _Component);

  function ExportDialog() {
    var _this;

    _classCallCheck(this, ExportDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExportDialog).call(this));

    _this.onInputChange = function (e) {
      _this.setState({
        email: e.target.value
      });
    };

    _this.checkValidity = function () {
      _this.setState({
        emailIsValid: isValidEmail(_this.state.email)
      });
    };

    _this.onExportClick = function () {
      if (_this.state.emailIsValid) {
        _this.props.onExport(_this.state.email || _this.props.user.email);
      }
    };

    _this.state = {
      email: '',
      emailIsValid: true
    };
    return _this;
  }

  _createClass(ExportDialog, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.setState({
        email: this.props.user.email
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isExporting = _this$props.isExporting,
          closeModal = _this$props.closeModal,
          exportType = _this$props.exportType;
      var type = exportType.toLowerCase();
      return /*#__PURE__*/_jsxs("section", {
        className: "export-dialog",
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: closeModal
        }), /*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx("h2", {
            className: "export-header",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.exportModal.export.content." + type + ".header"
            })
          })
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [/*#__PURE__*/_jsx("p", {
            className: "export-instruct-message",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.exportModal.export.content." + type + ".instructionsMessage"
            })
          }), /*#__PURE__*/_jsx("p", {
            className: "export-instruct-note",
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "sui.exportModal.export.instructionsNote"
            })
          }), /*#__PURE__*/_jsx(UIFormLabel, {
            children: I18n.text('sui.exportModal.export.label')
          }), /*#__PURE__*/_jsx(UIFormControl, {
            className: "export-email-form",
            error: !this.state.emailIsValid,
            validationMessage: this.state.emailIsValid ? null : I18n.text('sui.exportModal.export.validEmail'),
            children: /*#__PURE__*/_jsx(UITextInput, {
              onBlur: this.checkValidity,
              onChange: this.onInputChange,
              className: "export-email m-bottom-4",
              value: this.state.email,
              type: "email"
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            className: "export-button",
            use: "primary",
            onClick: this.onExportClick,
            disabled: isExporting,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.exportModal.export.footer.submit"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            className: "cancel-export-button",
            onClick: closeModal,
            disabled: isExporting,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.exportModal.export.footer.cancel"
            })
          }), /*#__PURE__*/_jsx(Small, {
            className: "m-top-6",
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "sui.exportModal.export.microcopyNote"
            })
          })]
        })]
      });
    }
  }]);

  return ExportDialog;
}(Component);

ExportDialog.propTypes = {
  closeModal: PropTypes.func,
  exportType: PropTypes.string.isRequired,
  user: PropTypes.object,
  onExport: PropTypes.func,
  isExporting: PropTypes.bool
};
export { ExportDialog as default };