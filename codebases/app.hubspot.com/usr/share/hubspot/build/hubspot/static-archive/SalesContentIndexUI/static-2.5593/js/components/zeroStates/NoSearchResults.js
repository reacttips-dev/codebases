'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import Big from 'UIComponents/elements/Big';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';

var getTitleText = function getTitleText(selectedViewFilter, contentType) {
  var emptyStateType = 'createdByMe';

  if (selectedViewFilter.id === DefaultFilterNames.CREATED_BY_MY_TEAM || selectedViewFilter.id === DefaultFilterNames.OWNED_BY_MY_TEAM) {
    emptyStateType = 'createdByMyTeam';
  } else if (selectedViewFilter.type === DefaultFilterNames.TEAM) {
    emptyStateType = 'createdByAnotherTeam';
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "salesContentIndexUI.emptyState.filter." + contentType + ".titleText." + emptyStateType
  });
};

var NoSearchResults = function NoSearchResults(_ref) {
  var contentType = _ref.contentType,
      selectedViewFilter = _ref.selectedViewFilter;

  var primaryContent = /*#__PURE__*/_jsx(Big, {
    tagName: "p",
    use: "help",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentIndexUI.emptyState.filter." + contentType + ".subText"
    })
  });

  var emptyState = /*#__PURE__*/_jsx(UIEmptyState, {
    flush: true,
    primaryContent: primaryContent,
    secondaryContent: /*#__PURE__*/_jsx(UIIllustration, {
      name: "empty-state-charts",
      width: 200
    }),
    secondaryContentWidth: 200,
    titleText: getTitleText(selectedViewFilter, contentType)
  });

  return /*#__PURE__*/_jsx("div", {
    style: {
      paddingTop: '48px'
    },
    className: "empty-state-message sales-content-index-zero-state",
    "data-selenium-test": "EmptyStateMessage",
    children: /*#__PURE__*/_jsx("div", {
      className: "m-x-auto",
      children: emptyState
    })
  });
};

export default NoSearchResults;