'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import UITextInput from 'UIComponents/input/UITextInput';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import { isFile } from '../utils/FoldersAndFiles';
import validateFolderName from '../utils/validateFolderName';
import H2 from 'UIComponents/elements/headings/H2';

var AddFolderModal = /*#__PURE__*/function (_Component) {
  _inherits(AddFolderModal, _Component);

  function AddFolderModal(props) {
    var _this;

    _classCallCheck(this, AddFolderModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AddFolderModal).call(this, props));
    _this.state = {
      isValid: false,
      folderName: '',
      validationMessage: null
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleConfirm = _this.handleConfirm.bind(_assertThisInitialized(_this));
    _this.handleKeyUp = _this.handleKeyUp.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AddFolderModal, [{
    key: "handleConfirm",
    value: function handleConfirm() {
      var onCreate = this.props.onCreate;
      var _this$state = this.state,
          isValid = _this$state.isValid,
          folderName = _this$state.folderName;

      if (isValid) {
        onCreate(folderName.trim());
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      var objects = this.props.objects;
      var folderName = event.target.value;

      if (folderName) {
        var validationError = validateFolderName(folderName);
        var existingName = objects.find(function (object) {
          return !isFile(object) && (object.get('name') === folderName.trim() || object.get('name') === folderName);
        });
        var validationMessage = null;

        if (validationError) {
          validationMessage = validationError.message;
        } else if (existingName) {
          validationMessage = I18n.text('FileManagerCore.folderNameValidation.existingFolder');
        }

        this.setState({
          isValid: !validationMessage,
          validationMessage: validationMessage,
          folderName: folderName
        });
      } else {
        this.setState({
          isValid: false,
          validationMessage: null,
          folderName: folderName
        });
      }
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event) {
      if (event.key === 'Enter') {
        this.handleConfirm();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var onClose = this.props.onClose;
      var _this$state2 = this.state,
          isValid = _this$state2.isValid,
          validationMessage = _this$state2.validationMessage,
          folderName = _this$state2.folderName;
      return /*#__PURE__*/_jsxs(UIModal, {
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: I18n.text('FileManagerCore.addFolderModal.createFolder')
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          children: /*#__PURE__*/_jsx(UIFormControl, {
            error: !!validationMessage,
            validationMessage: validationMessage,
            label: I18n.text('FileManagerCore.addFolderModal.folderName'),
            children: /*#__PURE__*/_jsx(UITextInput, {
              "data-test-id": "add-folder-input",
              autoFocus: true,
              value: folderName,
              onKeyUp: this.handleKeyUp,
              onChange: this.handleChange
            })
          })
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            "data-test-id": "confirm-add-folder-button",
            use: "primary",
            disabled: !isValid,
            onClick: this.handleConfirm,
            children: I18n.text('FileManagerCore.actions.save')
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: onClose,
            children: I18n.text('FileManagerCore.actions.cancel')
          })]
        })]
      });
    }
  }]);

  return AddFolderModal;
}(Component);

export { AddFolderModal as default };
AddFolderModal.propTypes = {
  objects: PropTypes.instanceOf(Immutable.List).isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};