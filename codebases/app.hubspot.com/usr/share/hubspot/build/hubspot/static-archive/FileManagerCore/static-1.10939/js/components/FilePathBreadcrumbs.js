'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIBreadcrumbs from 'UIComponents/nav/UIBreadcrumbs';
import { removeLeadingSlashFromPath } from '../utils/stringUtils';

var FilePathBreadcrumbs = function FilePathBreadcrumbs(_ref) {
  var fullPath = _ref.fullPath,
      breadcrumbsClassName = _ref.breadcrumbsClassName;

  if (!fullPath) {
    return null;
  }

  fullPath = removeLeadingSlashFromPath(fullPath);
  var pathParts = fullPath.split('/');
  pathParts.pop();

  var renderFolder = function renderFolder(folderName, i) {
    return /*#__PURE__*/_jsx("span", {
      children: folderName
    }, i);
  };

  return /*#__PURE__*/_jsx(UIBreadcrumbs, {
    className: breadcrumbsClassName || 'm-top-0 m-bottom-2',
    flush: true,
    singleBreadcrumbIsBackLink: false,
    wrapLevels: true,
    children: pathParts.map(renderFolder)
  });
};

FilePathBreadcrumbs.propTypes = {
  fullPath: PropTypes.string.isRequired,
  breadcrumbsClassName: PropTypes.string
};
export default FilePathBreadcrumbs;