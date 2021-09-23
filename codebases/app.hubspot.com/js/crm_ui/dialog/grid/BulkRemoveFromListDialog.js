'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import FormattedMessage from 'I18n/components/FormattedMessage';
import BulkActionPropsType from '../../grid/utils/BulkActionPropsType';

var BulkRemoveFromListDialog = /*#__PURE__*/function (_Component) {
  _inherits(BulkRemoveFromListDialog, _Component);

  function BulkRemoveFromListDialog(props) {
    var _this;

    _classCallCheck(this, BulkRemoveFromListDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BulkRemoveFromListDialog).call(this, props));

    _this.handleConfirm = function () {
      _this.props.onConfirm({
        listId: parseInt(_this.state.value, 10)
      });
    };

    _this.state = {
      value: props.bulkActionProps.get('listId')
    };
    return _this;
  }

  _createClass(BulkRemoveFromListDialog, [{
    key: "render",
    value: function render() {
      var objectCount = this.props.bulkActionProps.get('selectionCount');
      var value = this.state.value;
      return /*#__PURE__*/_jsx(UIConfirmModal, {
        description: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'bulkRemoveFromListModal.message',
          options: {
            count: objectCount
          }
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkRemoveFromListModal.title",
          options: {
            count: objectCount
          }
        }),
        confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkRemoveFromListModal.confirmText"
        }),
        confirmDisabled: !value,
        onConfirm: this.handleConfirm,
        onReject: this.props.onReject,
        rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkRemoveFromListModal.rejectText"
        })
      });
    }
  }]);

  return BulkRemoveFromListDialog;
}(Component);

BulkRemoveFromListDialog.propTypes = Object.assign({
  bulkActionProps: BulkActionPropsType
}, PromptablePropInterface);
export default BulkRemoveFromListDialog;