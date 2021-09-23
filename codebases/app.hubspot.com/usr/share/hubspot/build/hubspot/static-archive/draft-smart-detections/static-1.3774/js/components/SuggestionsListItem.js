'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import UIFlex from 'UIComponents/layout/UIFlex';
import Small from 'UIComponents/elements/Small';
import SuggestionsDot from './SuggestionsDot';

var SuggestionsListItem = function SuggestionsListItem(_ref) {
  var suggestion = _ref.suggestion;
  var title = suggestion.get('title');
  var description = suggestion.get('description');
  var degree = suggestion.get('degree');
  return /*#__PURE__*/_jsxs(UIFlex, {
    className: "suggestion-list-item m-bottom-6",
    children: [/*#__PURE__*/_jsx("div", {
      className: "suggestion-list-item-dot p-x-5 m-top-2",
      children: /*#__PURE__*/_jsx(SuggestionsDot, {
        degree: degree,
        use: "small"
      })
    }), /*#__PURE__*/_jsxs(UIFlex, {
      className: "p-right-6",
      direction: "column",
      children: [/*#__PURE__*/_jsx("span", {
        className: "is--text--bold",
        children: title
      }), /*#__PURE__*/_jsx(Small, {
        children: description
      })]
    })]
  });
};

SuggestionsListItem.propTypes = {
  suggestion: PropTypes.instanceOf(ImmutableMap).isRequired
};
export default SuggestionsListItem;