'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { List } from 'immutable';
import SuggestionsListItem from './SuggestionsListItem';

var SuggestionsList = function SuggestionsList(_ref) {
  var suggestions = _ref.suggestions,
      className = _ref.className;
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: suggestions.map(function (suggestion, index) {
      return /*#__PURE__*/_jsx(SuggestionsListItem, {
        suggestion: suggestion
      }, "suggestion-list-item-" + index);
    })
  });
};

SuggestionsList.propTypes = {
  suggestions: PropTypes.instanceOf(List).isRequired,
  className: PropTypes.string
};
export default SuggestionsList;