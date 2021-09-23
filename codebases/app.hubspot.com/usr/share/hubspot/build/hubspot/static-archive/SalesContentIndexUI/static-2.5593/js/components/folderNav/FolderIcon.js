'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIIcon from 'UIComponents/icon/UIIcon';

var FolderIcon = function FolderIcon(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_jsx(UIIcon, {
    className: className,
    name: "folder"
  });
};

FolderIcon.propTypes = {
  className: PropTypes.string
};
export default FolderIcon;