'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import NewFolderButton from './newFolder/NewFolderButton';
import ContentUsage from './ContentUsage';

var IndexHeaderButtons = function IndexHeaderButtons(_ref) {
  var createButton = _ref.createButton,
      usage = _ref.usage,
      contentType = _ref.contentType,
      location = _ref.location,
      saveFolder = _ref.saveFolder,
      showNewFolderButton = _ref.showNewFolderButton;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [usage && /*#__PURE__*/_jsx(ContentUsage, {
      usage: usage,
      contentType: contentType
    }), showNewFolderButton && /*#__PURE__*/_jsx(NewFolderButton, {
      saveFolder: saveFolder,
      location: location
    }), createButton]
  });
};

IndexHeaderButtons.propTypes = {
  createButton: PropTypes.node.isRequired,
  usage: PropTypes.shape({
    count: PropTypes.number,
    limit: PropTypes.number
  }),
  contentType: PropTypes.string.isRequired,
  saveFolder: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  showNewFolderButton: PropTypes.bool
};
IndexHeaderButtons.defaultProps = {
  showNewFolderButton: true
};
IndexHeaderButtons.displayName = 'IndexHeaderButtons';
export default IndexHeaderButtons;