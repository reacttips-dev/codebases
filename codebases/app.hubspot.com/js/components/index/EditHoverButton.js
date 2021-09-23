'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';

var EditHoverButton = function EditHoverButton(_ref) {
  var searchResult = _ref.searchResult,
      onEdit = _ref.onEdit;
  return /*#__PURE__*/_jsx(UIButton, {
    onClick: function onClick() {
      return onEdit(searchResult);
    },
    size: "extra-small",
    use: "tertiary-light",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.sequenceTable.rows.hoverButtons.edit"
    })
  }, "edit");
};

EditHoverButton.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
  onEdit: PropTypes.func.isRequired
};
export default EditHoverButton;