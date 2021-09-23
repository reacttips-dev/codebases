'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UICheckbox from 'UIComponents/input/UICheckbox';

var IndexTableCheckboxCell = function IndexTableCheckboxCell(_ref) {
  var contentId = _ref.contentId,
      selectionData = _ref.selectionData,
      toggleSelection = _ref.toggleSelection,
      isFolder = _ref.isFolder,
      disabled = _ref.disabled;
  var selectedFolders = selectionData.selectedFolders,
      selectedRows = selectionData.selectedRows;
  var checkboxNotCorrectType = isFolder ? !selectedRows.isEmpty() : !selectedFolders.isEmpty();
  var checked = isFolder ? selectedFolders.has(contentId) : selectedRows.has(contentId);
  return /*#__PURE__*/_jsx("td", {
    className: "table-check-box-cell p-all-0",
    children: /*#__PURE__*/_jsx("div", {
      className: "justify-center align-center",
      children: /*#__PURE__*/_jsx(UICheckbox, {
        className: "display-flex",
        "aria-label": I18n.text('salesContentIndexUI.tableRow.checkbox'),
        checked: checked,
        disabled: disabled || checkboxNotCorrectType,
        onChange: toggleSelection
      })
    })
  });
};

IndexTableCheckboxCell.propTypes = {
  contentId: PropTypes.number,
  selectionData: PropTypes.object.isRequired,
  toggleSelection: PropTypes.func.isRequired,
  isFolder: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};
IndexTableCheckboxCell.defaultProps = {
  isFolder: false,
  disabled: false
};
export default IndexTableCheckboxCell;