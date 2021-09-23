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
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import ScopedFeatureTooltip from 'FileManagerCore/components/permissions/ScopedFeatureTooltip';
import DeleteFileModal from '../modals/DeleteFileModal';

var DeleteFileContainer = /*#__PURE__*/function (_Component) {
  _inherits(DeleteFileContainer, _Component);

  function DeleteFileContainer(props) {
    var _this;

    _classCallCheck(this, DeleteFileContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DeleteFileContainer).call(this, props));
    _this.state = {
      isModalOpen: false
    };
    _this.handleDelete = _this.handleDelete.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    _this.handleButtonClick = _this.handleButtonClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DeleteFileContainer, [{
    key: "handleDelete",
    value: function handleDelete() {
      var _this$props = this.props,
          onDelete = _this$props.onDelete,
          file = _this$props.file;
      onDelete(file);
      this.setState({
        isModalOpen: false
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.setState({
        isModalOpen: false
      });
    }
  }, {
    key: "handleButtonClick",
    value: function handleButtonClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        isModalOpen: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          file = _this$props2.file,
          isReadOnly = _this$props2.isReadOnly,
          isUngatedForRecycleBin = _this$props2.isUngatedForRecycleBin;
      return /*#__PURE__*/_jsxs("span", {
        className: "p-left-3",
        children: [/*#__PURE__*/_jsx(ScopedFeatureTooltip, {
          children: /*#__PURE__*/_jsx(UIButton, {
            size: "extra-small",
            use: "tertiary-light",
            onClick: this.handleButtonClick,
            disabled: isReadOnly,
            "data-test-id": "file-detail-delete-button",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "FileManagerCore.actions." + (isUngatedForRecycleBin ? 'trash' : 'delete')
            })
          })
        }), this.state.isModalOpen && /*#__PURE__*/_jsx(DeleteFileModal, {
          file: file,
          onCancel: this.handleCancel,
          onDelete: this.handleDelete,
          isUngatedForRecycleBin: isUngatedForRecycleBin
        })]
      });
    }
  }]);

  return DeleteFileContainer;
}(Component);

export { DeleteFileContainer as default };
DeleteFileContainer.propTypes = {
  file: PropTypes.instanceOf(Immutable.Map),
  onDelete: PropTypes.func,
  isReadOnly: PropTypes.bool.isRequired,
  isUngatedForRecycleBin: PropTypes.bool.isRequired
};