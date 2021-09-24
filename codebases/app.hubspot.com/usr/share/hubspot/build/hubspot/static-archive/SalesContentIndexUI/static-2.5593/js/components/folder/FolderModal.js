'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import UITextInput from 'UIComponents/input/UITextInput';
import H2 from 'UIComponents/elements/headings/H2';
import UIForm from 'UIComponents/form/UIForm';
import UIFormControl from 'UIComponents/form/UIFormControl';
var FolderModal = createReactClass({
  displayName: "FolderModal",
  propTypes: {
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    folder: PropTypes.instanceOf(SearchResultRecord).isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      folder: SearchResultRecord({
        name: ''
      })
    };
  },
  getInitialState: function getInitialState() {
    return {
      folderName: this.props.folder.name
    };
  },
  isNew: function isNew() {
    return !this.props.folder.contentId;
  },
  handleNameChange: function handleNameChange(e) {
    return this.setState({
      folderName: e.target.value
    });
  },
  confirm: function confirm() {
    var _this$props = this.props,
        onConfirm = _this$props.onConfirm,
        folder = _this$props.folder;
    return onConfirm(folder.set('name', this.state.folderName));
  },
  render: function render() {
    var _this = this;

    var folderName = this.state.folderName;
    var onReject = this.props.onReject;
    var i18nKey = this.isNew() ? 'new' : 'edit';
    return /*#__PURE__*/_jsx(UIModal, {
      size: "auto",
      "data-selenium-test": "sales-content-index-new-folder-modal",
      children: /*#__PURE__*/_jsxs(UIForm, {
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          if (folderName) _this.confirm();
        },
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.props.onReject
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.createEditFolderModal." + i18nKey + ".title"
            })
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx(UIFormControl, {
            label: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.createEditFolderModal.folderLabel"
            }),
            children: /*#__PURE__*/_jsx(UITextInput, {
              "data-selenium-test": "sales-content-index-new-folder-input",
              autoFocus: true,
              value: folderName,
              onChange: this.handleNameChange
            })
          })
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "primary",
            onClick: this.confirm,
            disabled: !this.state.folderName,
            "data-selenium-test": "sales-content-index-new-folder-save-button",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.createEditFolderModal." + i18nKey + ".confirm"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: onReject,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.createEditFolderModal.cancel"
            })
          })]
        })]
      })
    });
  }
});
export default FolderModal;