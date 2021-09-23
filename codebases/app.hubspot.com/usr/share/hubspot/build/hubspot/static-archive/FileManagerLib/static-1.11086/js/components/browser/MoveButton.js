'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { getHomeFolder } from 'FileManagerCore/utils/FoldersAndFiles';
import FolderTreeContainer from 'FileManagerCore/containers/FolderTreeContainer';
import ScopedFeatureTooltip from 'FileManagerCore/components/permissions/ScopedFeatureTooltip';

var MoveButton = /*#__PURE__*/function (_Component) {
  _inherits(MoveButton, _Component);

  function MoveButton(props) {
    var _this;

    _classCallCheck(this, MoveButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MoveButton).call(this, props));
    _this.state = {
      open: false,
      selectedFolder: null
    };
    _this.handleSelect = _this.handleSelect.bind(_assertThisInitialized(_this));
    _this.handleMove = _this.handleMove.bind(_assertThisInitialized(_this));
    _this.handleOpenChange = _this.handleOpenChange.bind(_assertThisInitialized(_this));
    _this.handleClose = _this.handleClose.bind(_assertThisInitialized(_this));
    _this.handleClickMove = _this.handleClickMove.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MoveButton, [{
    key: "getSelectedFolder",
    value: function getSelectedFolder() {
      return this.state.selectedFolder || this.props.folder;
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(folder) {
      this.setState({
        selectedFolder: folder || getHomeFolder()
      });
    }
  }, {
    key: "handleMove",
    value: function handleMove() {
      var onMove = this.props.onMove;
      var selectedFolder = this.state.selectedFolder;
      onMove(selectedFolder);
      this.setState({
        open: false,
        selectedFolder: null
      });
    }
  }, {
    key: "handleOpenChange",
    value: function handleOpenChange() {
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
    key: "handleClickMove",
    value: function handleClickMove() {
      this.setState({
        open: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          use = _this$props.use,
          size = _this$props.size,
          isReadOnly = _this$props.isReadOnly;
      var _this$state = this.state,
          open = _this$state.open,
          selectedFolder = _this$state.selectedFolder;
      return /*#__PURE__*/_jsx(UIPopover, {
        open: open,
        closeOnOutsideClick: true,
        onOpenChange: this.handleOpenChange,
        placement: "top",
        content: {
          header: /*#__PURE__*/_jsx("h5", {
            children: I18n.text('FileManagerLib.selectFolder')
          }),
          body: /*#__PURE__*/_jsx("div", {
            className: "move-button__folder-tree",
            children: /*#__PURE__*/_jsx(FolderTreeContainer, {
              selectedFolder: this.getSelectedFolder(),
              onSelect: this.handleSelect
            })
          }),
          footer: /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(UIButton, {
              use: "tertiary",
              size: "small",
              disabled: !selectedFolder,
              onClick: this.handleMove,
              children: I18n.text('FileManagerCore.actions.save')
            }), /*#__PURE__*/_jsx(UIButton, {
              use: "link",
              size: "small",
              onClick: this.handleClose,
              children: I18n.text('FileManagerCore.actions.cancel')
            })]
          })
        },
        children: /*#__PURE__*/_jsx(ScopedFeatureTooltip, {
          children: /*#__PURE__*/_jsx(UIButton, {
            use: use,
            size: size,
            disabled: isReadOnly,
            "data-test-id": "move-button",
            onClick: this.handleClickMove,
            children: I18n.text('FileManagerCore.actions.move')
          })
        })
      });
    }
  }]);

  return MoveButton;
}(Component);

export { MoveButton as default };
MoveButton.propTypes = {
  folder: PropTypes.instanceOf(Immutable.Map),
  size: UIButton.propTypes.size,
  use: UIButton.propTypes.use,
  onMove: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};
MoveButton.defaultProps = {
  use: 'tertiary-light',
  size: 'small'
};