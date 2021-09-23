'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import FolderTreeContainer from '../containers/FolderTreeContainer';
import { getHomeFolder } from '../utils/FoldersAndFiles';

var SelectFolderPopover = /*#__PURE__*/function (_Component) {
  _inherits(SelectFolderPopover, _Component);

  function SelectFolderPopover(props) {
    var _this;

    _classCallCheck(this, SelectFolderPopover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectFolderPopover).call(this, props));
    _this.state = {
      open: false,
      selectedFolder: props.folder
    };
    _this.handleSelect = _this.handleSelect.bind(_assertThisInitialized(_this));
    _this.handleSave = _this.handleSave.bind(_assertThisInitialized(_this));
    _this.handleOpenChange = _this.handleOpenChange.bind(_assertThisInitialized(_this));
    _this.handleClickChangeFolder = _this.handleClickChangeFolder.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SelectFolderPopover, [{
    key: "handleSelect",
    value: function handleSelect(folder) {
      this.setState({
        selectedFolder: folder
      });
    }
  }, {
    key: "handleSave",
    value: function handleSave() {
      var onChangeFolder = this.props.onChangeFolder;
      var selectedFolder = this.state.selectedFolder;
      onChangeFolder(selectedFolder);
      this.setState({
        open: false
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
    key: "handleClickChangeFolder",
    value: function handleClickChangeFolder() {
      var onTrackInteraction = this.props.onTrackInteraction;

      if (onTrackInteraction) {
        onTrackInteraction('Browse Shutterstock', 'clicked-change-folder');
      }

      this.setState({
        open: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          open = _this$state.open,
          selectedFolder = _this$state.selectedFolder;
      return /*#__PURE__*/_jsx(UIPopover, {
        open: open,
        closeOnOutsideClick: true,
        onOpenChange: this.handleOpenChange,
        placement: "top right",
        content: {
          header: /*#__PURE__*/_jsx("h4", {
            children: I18n.text('FileManagerCore.selectFolder')
          }),
          body: /*#__PURE__*/_jsx("div", {
            className: "select-folder-popover__folder-tree",
            children: /*#__PURE__*/_jsx(FolderTreeContainer, {
              selectedFolder: selectedFolder || getHomeFolder(),
              onSelect: this.handleSelect
            })
          }),
          footer: /*#__PURE__*/_jsx("div", {
            children: /*#__PURE__*/_jsx(UIButton, {
              use: "tertiary",
              size: "small",
              disabled: !selectedFolder,
              onClick: this.handleSave,
              children: I18n.text('FileManagerCore.actions.save')
            })
          })
        },
        children: /*#__PURE__*/_jsx(UILink, {
          className: "m-left-4",
          use: "on-dark",
          onClick: this.handleClickChangeFolder,
          children: I18n.text('FileManagerCore.actions.changeFolder')
        })
      });
    }
  }]);

  return SelectFolderPopover;
}(Component);

export { SelectFolderPopover as default };
SelectFolderPopover.propTypes = {
  folder: PropTypes.instanceOf(Immutable.Map),
  onChangeFolder: PropTypes.func.isRequired,
  onTrackInteraction: PropTypes.func
};