'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import { canEditObjectPermissions } from 'SequencesUI/lib/permissions';
import SalesContentPartitioning from 'sales-content-partitioning';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';

var ShareHoverButton = function ShareHoverButton(_ref) {
  var _ref$searchResult = _ref.searchResult,
      contentId = _ref$searchResult.contentId,
      contentType = _ref$searchResult.contentType,
      userId = _ref$searchResult.userId;

  if (!canEditObjectPermissions(userId)) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIButton, {
    onClick: function onClick() {
      SalesContentPartitioning.openAssignmentPanel({
        objectId: contentId,
        objectType: contentType,
        ownerId: userId
      });
    },
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.sequenceTable.rows.hoverButtons.share"
    })
  });
};

ShareHoverButton.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired
};
export default ShareHoverButton;