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
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIMatchTextArea from 'UIComponents/input/UIMatchTextArea';
import UIModal from 'UIComponents/dialog/UIModal';
import UIList from 'UIComponents/list/UIList';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import UIAlert from 'UIComponents/alert/UIAlert';
import styled from 'styled-components';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
var StyledUIAlert = styled(UIAlert).withConfig({
  displayName: "DeleteDialog__StyledUIAlert",
  componentId: "szn633-0"
})(["&&{margin-bottom:8px;margin-top:8px;}"]);
var StyledGdprNoteUIAlert = styled(UIAlert).withConfig({
  displayName: "DeleteDialog__StyledGdprNoteUIAlert",
  componentId: "szn633-1"
})(["&&{margin-left:0;margin-bottom:16px;}"]);

var DeleteDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(DeleteDialog, _PureComponent);

  function DeleteDialog(props) {
    var _this;

    _classCallCheck(this, DeleteDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DeleteDialog).call(this, props));

    _this.handleChange = function (_ref) {
      var value = _ref.target.value;

      _this.setState({
        gdprDelete: value === 'gdpr-delete'
      });
    };

    _this.handleConfirm = function () {
      _this.props.onConfirm(_this.state);
    };

    _this.handleMatch = function (_ref2) {
      var value = _ref2.target.value;

      _this.setState({
        matched: value
      });
    };

    _this.state = {
      gdprDelete: false,
      matched: props.match === '',
      applyToAll: false
    };
    return _this;
  }

  _createClass(DeleteDialog, [{
    key: "getGdprNote",
    value: function getGdprNote() {
      var gdprNote = this.props.gdprNote;
      return gdprNote && /*#__PURE__*/_jsx(StyledUIAlert, {
        type: "tip",
        children: gdprNote
      });
    }
  }, {
    key: "renderDialogBody",
    value: function renderDialogBody() {
      var _this$props = this.props,
          dialogBody = _this$props.dialogBody,
          match = _this$props.match;
      var marginClass = match ? 'm-bottom-0' : 'm-bottom-4';

      if (!dialogBody) {
        return null;
      }

      return /*#__PURE__*/_jsx("div", {
        className: marginClass,
        children: dialogBody
      });
    }
  }, {
    key: "renderApplyToAll",
    value: function renderApplyToAll() {
      var _this2 = this;

      var _this$props2 = this.props,
          hasNoFilters = _this$props2.hasNoFilters,
          objectType = _this$props2.objectType;
      var applyToAll = this.state.applyToAll;

      if (!hasNoFilters) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIFormControl, {
        required: true,
        children: /*#__PURE__*/_jsx(UICheckbox, {
          id: "apply-to-all-checkbox",
          checked: applyToAll,
          onChange: function onChange(_ref3) {
            var checked = _ref3.target.checked;

            _this2.setState({
              applyToAll: checked
            });
          },
          className: "m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataUiUtilities.DeleteDialog.confirmApplyToAll." + objectType
          })
        })
      });
    }
  }, {
    key: "renderMatch",
    value: function renderMatch() {
      var _this$props3 = this.props,
          match = _this$props3.match,
          matchLabel = _this$props3.matchLabel;

      if (!match) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIFormControl, {
        className: "m-bottom-4 m-left-0",
        label: matchLabel,
        children: /*#__PURE__*/_jsx(UIMatchTextArea, {
          match: match,
          onMatchedChange: this.handleMatch,
          size: "xxl",
          "data-selenium-test": "delete-dialog-match"
        })
      });
    }
  }, {
    key: "renderNote",
    value: function renderNote() {
      var dialogNote = this.props.dialogNote;

      if (!dialogNote) {
        return null;
      }

      return /*#__PURE__*/_jsx(StyledGdprNoteUIAlert, {
        type: "tip",
        children: dialogNote
      });
    }
  }, {
    key: "renderGdprRadioSelect",
    value: function renderGdprRadioSelect() {
      var gdprDelete = this.state.gdprDelete;
      var _this$props4 = this.props,
          gdprEnabled = _this$props4.gdprEnabled,
          gdprDeletePossible = _this$props4.gdprDeletePossible,
          isScopedForGdprDelete = _this$props4.isScopedForGdprDelete;

      if (!gdprEnabled || !gdprDeletePossible) {
        return null;
      }

      var gdprNoteElement = this.getGdprNote();
      return /*#__PURE__*/_jsxs(UIList, {
        className: "m-left-0",
        childClassName: "m-bottom-4",
        children: [/*#__PURE__*/_jsx(UIRadioInput, {
          id: "normal-delete-radio-input",
          name: "normal",
          value: "normal-delete",
          checked: !gdprDelete,
          onChange: this.handleChange,
          children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "crm_components.GDPRDeleteDialog.normalDeleteLabel_jsx",
            elements: {
              Link: UILink
            }
          })
        }), /*#__PURE__*/_jsx(UITooltip, {
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "crm_components.GDPRDeleteDialog.permissions.cantDelete"
          }),
          disabled: isScopedForGdprDelete,
          children: /*#__PURE__*/_jsxs(UIRadioInput, {
            id: "gdpr-delete-radio-input",
            name: "gdpr",
            disabled: !isScopedForGdprDelete,
            value: "gdpr-delete",
            checked: gdprDelete,
            onChange: this.handleChange,
            children: [/*#__PURE__*/_jsx(FormattedJSXMessage, {
              message: "crm_components.GDPRDeleteDialog.gdprDeleteLabel_jsx",
              elements: {
                Link: UILink
              }
            }), gdprDelete && gdprNoteElement]
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          confirmLabel = _this$props5.confirmLabel,
          hasNoFilters = _this$props5.hasNoFilters,
          message = _this$props5.message,
          onReject = _this$props5.onReject,
          rejectLabel = _this$props5.rejectLabel,
          title = _this$props5.title;
      var _this$state = this.state,
          applyToAll = _this$state.applyToAll,
          matched = _this$state.matched;
      var isApplyToAllGuardSatisfied = hasNoFilters ? applyToAll : true;
      return /*#__PURE__*/_jsxs(UIModal, {
        use: "danger",
        onEsc: onReject,
        "data-selenium-test": 'delete-dialog',
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onReject
          }), /*#__PURE__*/_jsx(H2, {
            children: title
          })]
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [message, this.renderDialogBody(), this.renderMatch(), this.renderApplyToAll(), this.renderGdprRadioSelect(), this.renderNote()]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            className: "m-left-0",
            "data-selenium-test": "delete-dialog-confirm-button",
            "data-confirm-button": "accept",
            onClick: this.handleConfirm,
            use: "danger",
            disabled: !matched || !isApplyToAllGuardSatisfied,
            autoFocus: true,
            children: confirmLabel
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: onReject,
            use: "tertiary-light",
            "data-selenium-test": "delete-dialog-reject-button",
            children: rejectLabel
          })]
        })]
      });
    }
  }]);

  return DeleteDialog;
}(PureComponent);

var propTypes = Object.assign({
  confirmLabel: PropTypes.node.isRequired,
  gdprDeletePossible: PropTypes.bool.isRequired,
  gdprEnabled: PropTypes.bool.isRequired,
  gdprNote: PropTypes.element,
  isScopedForGdprDelete: PropTypes.bool.isRequired,
  match: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.element.isRequired]),
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  rejectLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element.isRequired]),
  title: PropTypes.node.isRequired
}, PromptablePropInterface);
var defaultProps = {
  dialogBody: null,
  gdprDeletePossible: false,
  gdprEnabled: false,
  hasNoFilters: false,
  isScopedForGdprDelete: false,
  match: '',
  rejectLabel: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "customerDataUiUtilities.DeleteDialog.rejectLabel"
  })
};
DeleteDialog.propTypes = propTypes;
DeleteDialog.defaultProps = defaultProps;
export default DeleteDialog;