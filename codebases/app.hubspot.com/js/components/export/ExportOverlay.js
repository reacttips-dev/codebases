'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIModal from 'UIComponents/dialog/UIModal';
import ExportDialog from './ExportDialog';
import ExportSuccess from './ExportSuccess';

var ExportOverlay = /*#__PURE__*/function (_Component) {
  _inherits(ExportOverlay, _Component);

  function ExportOverlay() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ExportOverlay);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ExportOverlay)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onExport = function (email) {
      _this.props.exportBroadcasts(email, _this.props.exportType);
    };

    return _this;
  }

  _createClass(ExportOverlay, [{
    key: "isSuccessful",
    value: function isSuccessful() {
      return typeof this.props.export.get('lastSucceeded') !== 'undefined' && this.props.export.get('lastSucceeded');
    }
  }, {
    key: "renderDialogContent",
    value: function renderDialogContent() {
      var _this$props = this.props,
          exportType = _this$props.exportType,
          closeModal = _this$props.closeModal,
          user = _this$props.user,
          isExporting = _this$props.isExporting;

      if (this.isSuccessful()) {
        return /*#__PURE__*/_jsx(ExportSuccess, {
          exportType: exportType,
          closeModal: closeModal
        });
      }

      return /*#__PURE__*/_jsx(ExportDialog, {
        exportType: exportType,
        closeModal: closeModal,
        user: user,
        onExport: this.onExport,
        isExporting: isExporting
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("section", {
        className: "export",
        children: /*#__PURE__*/_jsx(UIModal, {
          className: "export-modal",
          use: this.isSuccessful() ? 'info' : 'default',
          children: this.renderDialogContent()
        })
      });
    }
  }]);

  return ExportOverlay;
}(Component);

ExportOverlay.propTypes = {
  closeModal: PropTypes.func,
  exportType: PropTypes.string.isRequired,
  exportBroadcasts: PropTypes.func,
  export: PropTypes.object,
  user: PropTypes.object,
  isExporting: PropTypes.bool
};
export { ExportOverlay as default };