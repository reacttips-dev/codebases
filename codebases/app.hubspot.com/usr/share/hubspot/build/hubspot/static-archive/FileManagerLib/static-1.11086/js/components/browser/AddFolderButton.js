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
import UILink from 'UIComponents/link/UILink';
import AddFolderModal from 'FileManagerCore/components/AddFolderModal';
import ScopedFeatureTooltip from 'FileManagerCore/components/permissions/ScopedFeatureTooltip';

var AddFolderButton = /*#__PURE__*/function (_Component) {
  _inherits(AddFolderButton, _Component);

  function AddFolderButton(props) {
    var _this;

    _classCallCheck(this, AddFolderButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AddFolderButton).call(this, props));
    _this.state = {
      open: false
    };
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleCreate = _this.handleCreate.bind(_assertThisInitialized(_this));
    _this.handleClose = _this.handleClose.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AddFolderButton, [{
    key: "handleClick",
    value: function handleClick() {
      this.setState({
        open: !this.state.open
      });
    }
  }, {
    key: "handleClose",
    value: function handleClose() {
      this.setState({
        open: false
      });
    }
  }, {
    key: "handleCreate",
    value: function handleCreate(folderName) {
      var _this$props = this.props,
          onCreate = _this$props.onCreate,
          selectedFolder = _this$props.selectedFolder;
      onCreate(folderName, selectedFolder);
      this.setState({
        open: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          folders = _this$props2.folders,
          children = _this$props2.children,
          use = _this$props2.use,
          className = _this$props2.className,
          isReadOnly = _this$props2.isReadOnly;
      var open = this.state.open;
      return /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx(ScopedFeatureTooltip, {
          placement: "left",
          children: /*#__PURE__*/_jsx(UILink, {
            className: className,
            use: use,
            onClick: this.handleClick,
            "data-test-id": "add-folder",
            disabled: isReadOnly,
            children: children
          })
        }), open && /*#__PURE__*/_jsx(AddFolderModal, {
          objects: folders,
          onClose: this.handleClose,
          onCreate: this.handleCreate
        })]
      });
    }
  }]);

  return AddFolderButton;
}(Component);

export { AddFolderButton as default };
AddFolderButton.propTypes = {
  className: PropTypes.string,
  use: UILink.propTypes.use,
  folders: PropTypes.instanceOf(Immutable.List).isRequired,
  onCreate: PropTypes.func.isRequired,
  selectedFolder: PropTypes.instanceOf(Immutable.Map),
  children: PropTypes.node.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};
AddFolderButton.defaultProps = {
  use: 'blue',
  isReadOnly: false
};