'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import UIConfirmDialog from './UIConfirmDialog';
import UIModal from './UIModal';

var UIConfirmModal = /*#__PURE__*/function (_Component) {
  _inherits(UIConfirmModal, _Component);

  function UIConfirmModal() {
    _classCallCheck(this, UIConfirmModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIConfirmModal).apply(this, arguments));
  }

  _createClass(UIConfirmModal, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIModal, Object.assign({}, this.props, {
        ModalDialog: UIConfirmDialog
      }));
    }
  }]);

  return UIConfirmModal;
}(Component);

UIConfirmModal.displayName = 'UIConfirmModal';
UIConfirmModal.propTypes = Object.assign({}, UIConfirmDialog.propTypes, {
  _contextual: PropTypes.bool
});
UIConfirmModal.defaultProps = Object.assign({}, UIConfirmDialog.defaultProps, {
  onReject: emptyFunction,
  _contextual: false
});
UIConfirmModal.contextTypes = {
  sandboxed: PropTypes.bool
};
export { UIConfirmModal as default };