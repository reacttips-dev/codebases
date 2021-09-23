'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';

var DeleteHoverButton = function DeleteHoverButton(props) {
  var searchResult = props.searchResult,
      onDeleteItem = props.onDeleteItem;
  return /*#__PURE__*/_jsx(UIButton, {
    size: "extra-small",
    use: "tertiary-light",
    "data-selenium-test": "delete-hover-button",
    onClick: function onClick(e) {
      onDeleteItem(searchResult);
      e.preventDefault();
    },
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentIndexUI.tableRowHoverButtons.delete"
    })
  });
};

DeleteHoverButton.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
  onDeleteItem: PropTypes.func.isRequired
};
export default DeleteHoverButton;