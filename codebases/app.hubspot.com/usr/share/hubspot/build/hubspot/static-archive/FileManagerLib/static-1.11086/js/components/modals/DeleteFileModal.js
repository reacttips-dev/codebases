'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import { getFileDetailsFileManagerAppLink } from 'FileManagerCore/utils/file';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import { MODAL_WIDTH } from 'FileManagerCore/Constants';

var DeleteFileModal = /*#__PURE__*/function (_Component) {
  _inherits(DeleteFileModal, _Component);

  function DeleteFileModal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DeleteFileModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DeleteFileModal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.getI18nKey = function (suffix) {
      return "FileManagerCore." + (_this.props.isUngatedForRecycleBin ? 'trashModal' : 'deleteModal') + "." + suffix;
    };

    return _this;
  }

  _createClass(DeleteFileModal, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onCancel = _this$props.onCancel,
          onDelete = _this$props.onDelete,
          file = _this$props.file;
      return /*#__PURE__*/_jsx(UIConfirmModal, {
        confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
          message: this.getI18nKey('deleteFileConfirmLabel')
        }),
        rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
          message: this.getI18nKey('cancel')
        }),
        confirmUse: "danger",
        rejectUse: "tertiary-light",
        width: MODAL_WIDTH,
        description: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: this.getI18nKey('deleteFileDescription'),
            options: {
              name: file.get('name')
            }
          }), /*#__PURE__*/_jsx("div", {
            className: "m-top-3",
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: this.getI18nKey('fileMightBeUsed'),
              options: {
                href: getFileDetailsFileManagerAppLink(file)
              }
            })
          })]
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: this.getI18nKey('deleteFileMessage')
        }),
        use: "danger",
        onConfirm: onDelete,
        onReject: onCancel,
        "data-test-id": "delete-file-modal"
      });
    }
  }]);

  return DeleteFileModal;
}(Component);

export { DeleteFileModal as default };
DeleteFileModal.propTypes = {
  file: PropTypes.instanceOf(Immutable.Map).isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isUngatedForRecycleBin: PropTypes.bool.isRequired
};