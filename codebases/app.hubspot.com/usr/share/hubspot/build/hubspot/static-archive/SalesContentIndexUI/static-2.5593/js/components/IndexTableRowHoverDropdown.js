'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';

var IndexTableRowHoverDropdown = function IndexTableRowHoverDropdown(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick;
  return /*#__PURE__*/_jsx(UIDropdown, {
    buttonSize: "extra-small",
    buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentIndexUI.tableRowHoverButtons.actions"
    }),
    "data-selenium-test": "index-actions-dropdown",
    onClick: onClick,
    children: /*#__PURE__*/_jsx(UIList, {
      "data-selenium-test": "index-actions-dropdown-list",
      children: children
    })
  });
};

IndexTableRowHoverDropdown.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func
};
export default IndexTableRowHoverDropdown;