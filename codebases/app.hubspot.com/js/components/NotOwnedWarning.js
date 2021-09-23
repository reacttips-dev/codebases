'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap, List } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isOwnedByCurrentUser, getOwnerName } from 'SequencesUI/util/owner';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIBreakString from 'UIComponents/text/UIBreakString';
export var NotOwnedWarning = function NotOwnedWarning(_ref) {
  var type = _ref.type,
      searchResults = _ref.searchResults;
  var count = searchResults.size;
  var userView = searchResults.first().get('userView');
  var isOwned = searchResults.every(function (result) {
    return isOwnedByCurrentUser(result);
  });

  if (isOwned) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIAlert, {
    className: "m-bottom-4",
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "notOwnedWarning.title"
    }),
    type: "warning",
    children: /*#__PURE__*/_jsx(UIBreakString, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "notOwnedWarning." + type,
        options: {
          count: count,
          owner: getOwnerName(userView)
        }
      })
    })
  });
};
NotOwnedWarning.propTypes = {
  type: PropTypes.string.isRequired,
  searchResults: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.instanceOf(List)]).isRequired
};
export default NotOwnedWarning;