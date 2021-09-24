'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var ContentUsage = function ContentUsage(_ref) {
  var _ref$usage = _ref.usage,
      count = _ref$usage.count,
      limit = _ref$usage.limit,
      contentType = _ref.contentType;
  var usageToolipMessage = count >= limit ? "salesContentIndexUI.header.usageAtLimitTooltip." + contentType : "salesContentIndexUI.header.usageTooltip." + contentType;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: usageToolipMessage,
      options: {
        count: count,
        limit: limit
      }
    }),
    placement: "bottom",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      className: "m-right-3",
      message: "salesContentIndexUI.header.usageText",
      options: {
        count: count,
        limit: limit
      }
    })
  });
};

ContentUsage.propTypes = {
  usage: PropTypes.shape({
    count: PropTypes.number,
    limit: PropTypes.number
  }).isRequired,
  contentType: PropTypes.string.isRequired
};
export default ContentUsage;