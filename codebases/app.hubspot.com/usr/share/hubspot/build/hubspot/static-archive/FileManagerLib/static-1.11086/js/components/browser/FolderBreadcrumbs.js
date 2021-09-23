'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIBreadcrumbs from 'UIComponents/nav/UIBreadcrumbs';
import UILink from 'UIComponents/link/UILink';
import { listProp } from 'FileManagerCore/constants/propTypes';
import { getHomeFolder } from 'FileManagerCore/utils/FoldersAndFiles';

var FolderBreadcrumbs = function FolderBreadcrumbs(_ref) {
  var folderWithAncestors = _ref.folderWithAncestors,
      onSelectFolder = _ref.onSelectFolder;

  if (!folderWithAncestors && folderWithAncestors.isEmpty()) {
    return null;
  }

  var ancestorPathItems = folderWithAncestors.toArray().map(function (folder) {
    return {
      name: folder.get('name'),
      folderId: folder.get('id')
    };
  });
  var currentFolder = ancestorPathItems.pop();

  var renderFolder = function renderFolder(_ref2, i) {
    var name = _ref2.name,
        folderId = _ref2.folderId;

    var handleClick = function handleClick() {
      var folder = folderId ? folderWithAncestors.find(function (f) {
        return f.get('id') === folderId;
      }) : getHomeFolder();
      onSelectFolder(folder);
    };

    return /*#__PURE__*/_jsx(UILink, {
      onClick: handleClick,
      children: name
    }, i);
  };

  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(UIBreadcrumbs, {
      className: "m-top-0 m-bottom-2",
      flush: true,
      singleBreadcrumbIsBackLink: false,
      wrapLevels: true,
      children: ancestorPathItems.map(renderFolder)
    }), currentFolder && /*#__PURE__*/_jsx("h5", {
      "data-test-id": "file-picker-folder-name",
      children: currentFolder.name
    })]
  });
};

FolderBreadcrumbs.propTypes = {
  folderWithAncestors: listProp.isRequired,
  onSelectFolder: PropTypes.func.isRequired
};
export default FolderBreadcrumbs;