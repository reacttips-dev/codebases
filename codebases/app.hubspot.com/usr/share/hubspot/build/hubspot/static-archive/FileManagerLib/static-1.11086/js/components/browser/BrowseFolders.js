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
import Small from 'UIComponents/elements/Small';
import { getHomeFolder } from 'FileManagerCore/utils/FoldersAndFiles';
import FolderTreeContainer from 'FileManagerCore/containers/FolderTreeContainer';

var BrowseFolders = /*#__PURE__*/function (_Component) {
  _inherits(BrowseFolders, _Component);

  function BrowseFolders(props) {
    var _this;

    _classCallCheck(this, BrowseFolders);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowseFolders).call(this, props));
    _this.state = {
      open: false,
      selectedFolder: null
    };
    _this.handleSelect = _this.handleSelect.bind(_assertThisInitialized(_this));
    _this.handleChangeFolder = _this.handleChangeFolder.bind(_assertThisInitialized(_this));
    _this.handleOpenChange = _this.handleOpenChange.bind(_assertThisInitialized(_this));
    _this.handleClickChangeFolder = _this.handleClickChangeFolder.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BrowseFolders, [{
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
    key: "handleChangeFolder",
    value: function handleChangeFolder() {
      var onChangeFolder = this.props.onChangeFolder;
      var selectedFolder = this.state.selectedFolder;
      onChangeFolder(selectedFolder);
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
    key: "handleClickChangeFolder",
    value: function handleClickChangeFolder() {
      this.props.onTrackInteraction('fileManagerExploreFiles', 'browse-all-folders-from-popover');
      this.setState({
        open: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var className = this.props.className;
      var _this$state = this.state,
          open = _this$state.open,
          selectedFolder = _this$state.selectedFolder;
      return /*#__PURE__*/_jsx(UIPopover, {
        open: open,
        closeOnOutsideClick: true,
        onOpenChange: this.handleOpenChange,
        placement: "bottom",
        autoPlacement: false,
        content: {
          header: /*#__PURE__*/_jsx("h5", {
            children: I18n.text('FileManagerLib.selectFolder')
          }),
          body: /*#__PURE__*/_jsx("div", {
            className: "browse-folders__folder-tree",
            "data-test-id": "browse-folder-tree",
            children: /*#__PURE__*/_jsx(FolderTreeContainer, {
              selectedFolder: this.getSelectedFolder(),
              onSelect: this.handleSelect
            })
          }),
          footer: /*#__PURE__*/_jsx("div", {
            children: /*#__PURE__*/_jsx(UIButton, {
              use: "tertiary",
              size: "small",
              disabled: !selectedFolder,
              onClick: this.handleChangeFolder,
              children: I18n.text('FileManagerLib.actions.select')
            })
          })
        },
        children: /*#__PURE__*/_jsx(UILink, {
          className: className,
          onClick: this.handleClickChangeFolder,
          "data-test-id": "browse-all-folders",
          children: /*#__PURE__*/_jsx(Small, {
            children: I18n.text('FileManagerLib.actions.browseFolders')
          })
        })
      });
    }
  }]);

  return BrowseFolders;
}(Component);

export { BrowseFolders as default };
BrowseFolders.propTypes = {
  className: PropTypes.string,
  folder: PropTypes.instanceOf(Immutable.Map),
  onChangeFolder: PropTypes.func.isRequired,
  onTrackInteraction: PropTypes.func.isRequired
};