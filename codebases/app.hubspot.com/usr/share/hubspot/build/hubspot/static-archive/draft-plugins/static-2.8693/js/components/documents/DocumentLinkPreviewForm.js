'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { ENTER, ESCAPE } from 'draft-plugins/lib/keyCodes';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import UIPopoverFooter from 'UIComponents/tooltip/UIPopoverFooter';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import UIButton from 'UIComponents/button/UIButton';
export default createReactClass({
  displayName: "DocumentLinkPreviewForm",
  propTypes: {
    previewTitle: PropTypes.string.isRequired,
    previewDescription: PropTypes.string.isRequired,
    previousPreviewTitle: PropTypes.string.isRequired,
    previousPreviewDescription: PropTypes.string.isRequired,
    setProperty: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  },
  cancelOrConfirmKeys: function cancelOrConfirmKeys(e) {
    switch (e.keyCode) {
      case ESCAPE:
        {
          e.preventDefault();
          this.props.onCancel();
          return;
        }

      case ENTER:
        {
          e.preventDefault();
          this.props.onConfirm();
          return;
        }

      default:
        return;
    }
  },
  renderInputField: function renderInputField(fieldName) {
    var _this = this;

    var message = "draftPlugins.documentLinkPlugin.editPopover." + fieldName;
    var value = this.props[fieldName];
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: message
      }),
      className: "p-top-0",
      children: /*#__PURE__*/_jsx(UITextInput, {
        onChange: function onChange(e) {
          return _this.props.setProperty(fieldName, e.target.value);
        },
        onKeyDown: this.cancelOrConfirmKeys,
        value: value
      })
    });
  },
  renderHeader: function renderHeader() {
    return /*#__PURE__*/_jsx(UIPopoverHeader, {
      children: /*#__PURE__*/_jsx("h4", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.documentLinkPlugin.editPopover.title"
        })
      })
    });
  },
  renderBody: function renderBody() {
    return /*#__PURE__*/_jsxs(UIPopoverBody, {
      children: [this.renderInputField('previewTitle'), this.renderInputField('previewDescription')]
    });
  },
  renderFooter: function renderFooter() {
    var _this$props = this.props,
        previewTitle = _this$props.previewTitle,
        previewDescription = _this$props.previewDescription,
        previousPreviewTitle = _this$props.previousPreviewTitle,
        previousPreviewDescription = _this$props.previousPreviewDescription,
        onConfirm = _this$props.onConfirm,
        onCancel = _this$props.onCancel;
    var inputHasNotChanged = previewTitle === previousPreviewTitle && previewDescription === previousPreviewDescription;
    var disabled = previewTitle === '' || inputHasNotChanged;
    return /*#__PURE__*/_jsxs(UIPopoverFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "tertiary",
        size: "small",
        onClick: onConfirm,
        disabled: disabled,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.documentLinkPlugin.editPopover.save"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        size: "small",
        onClick: onCancel,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.documentLinkPlugin.editPopover.cancel"
        })
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs("div", {
      style: {
        width: 300
      },
      children: [this.renderHeader(), this.renderBody(), this.renderFooter()]
    });
  }
});