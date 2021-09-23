'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import UIFolderNav from 'UIComponents/nav/UIFolderNav';
import UIFolderNavItem from 'UIComponents/nav/UIFolderNavItem';
import { getHomeFolder } from '../utils/FoldersAndFiles';
import { orderedMapProp } from '../constants/propTypes';
import { ROOT_FOLDER_ID } from '../Constants';
import RestrictedAccessIcon from './RestrictedAccessIcon';

var FolderTree = /*#__PURE__*/function (_Component) {
  _inherits(FolderTree, _Component);

  function FolderTree() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FolderTree);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FolderTree)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleHomeClick = function () {
      var onSelect = _this.props.onSelect;
      onSelect(getHomeFolder());
    };

    _this.renderFolder = function (folder) {
      var _this$props = _this.props,
          onSelect = _this$props.onSelect,
          ancestors = _this$props.ancestors,
          exclusions = _this$props.exclusions,
          selectedFolder = _this$props.selectedFolder,
          isUngatedForPartitioning = _this$props.isUngatedForPartitioning,
          fetchTeams = _this$props.fetchTeams,
          teams = _this$props.teams,
          isTeamsRequestSucceeded = _this$props.isTeamsRequestSucceeded;

      if (exclusions.contains(folder.id)) {
        return null;
      }

      var children = folder.children;

      var handleClick = function handleClick() {
        onSelect(_this.getFolder(folder.id));
      };

      var open = selectedFolder.get('id') === folder.id || ancestors.has(folder.id);
      return /*#__PURE__*/_jsx(UIFolderNavItem, {
        className: "folder-tree-item",
        value: folder.id,
        title: folder.name,
        active: selectedFolder.get('id') === folder.id,
        open: open,
        onClick: handleClick,
        iconLeft: open && children ? 'folderOpen' : 'folder',
        iconRight: isUngatedForPartitioning && folder.teams.length && /*#__PURE__*/_jsx(RestrictedAccessIcon, {
          folder: Immutable.Map(folder),
          fetchTeams: fetchTeams,
          teams: teams,
          isTeamsRequestSucceeded: isTeamsRequestSucceeded
        }),
        children: children && children.length > 0 && _this.renderChildren(children)
      }, folder.id);
    };

    return _this;
  }

  _createClass(FolderTree, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.fetchFoldersByParentId(ROOT_FOLDER_ID);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.selectedFolder !== this.props.selectedFolder) {
        this.props.fetchFoldersByParentId(this.props.selectedFolder.get('id'));
      }
    }
  }, {
    key: "getFolder",
    value: function getFolder(id) {
      var folders = this.props.folders;
      return folders.get(id);
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(children) {
      return children.map(this.renderFolder);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          selectedFolder = _this$props2.selectedFolder,
          tree = _this$props2.tree;
      return /*#__PURE__*/_jsx(UIFolderNav, {
        "aria-label": tree.name,
        children: /*#__PURE__*/_jsx(UIFolderNavItem, {
          className: "folder-tree-item",
          open: true,
          active: selectedFolder === getHomeFolder(),
          title: tree.name,
          onClick: this.handleHomeClick,
          children: this.renderChildren(tree.children)
        })
      });
    }
  }]);

  return FolderTree;
}(Component);

export { FolderTree as default };
FolderTree.propTypes = {
  ancestors: orderedMapProp.isRequired,
  exclusions: PropTypes.instanceOf(Immutable.Set).isRequired,
  onSelect: PropTypes.func.isRequired,
  fetchFoldersByParentId: PropTypes.func.isRequired,
  selectedFolder: PropTypes.instanceOf(Immutable.Map),
  isUngatedForPartitioning: PropTypes.bool.isRequired,
  // POJO for performance reasons and to more easily support references
  tree: PropTypes.object.isRequired,
  folders: orderedMapProp.isRequired,
  fetchTeams: PropTypes.func.isRequired,
  teams: PropTypes.instanceOf(Immutable.Map).isRequired,
  isTeamsRequestSucceeded: PropTypes.bool.isRequired
};
FolderTree.defaultProps = {
  exclusions: new Immutable.Set()
};