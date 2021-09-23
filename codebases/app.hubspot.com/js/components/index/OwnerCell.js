'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import formatName from 'I18n/utils/formatName';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';

var OwnerCell = function OwnerCell(_ref) {
  var searchResult = _ref.searchResult;

  var _searchResult$userVie = searchResult.userView.toObject(),
      firstName = _searchResult$userVie.firstName,
      lastName = _searchResult$userVie.lastName;

  return /*#__PURE__*/_jsx("span", {
    children: formatName({
      firstName: firstName,
      lastName: lastName
    })
  });
};

OwnerCell.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired
};
export default OwnerCell;