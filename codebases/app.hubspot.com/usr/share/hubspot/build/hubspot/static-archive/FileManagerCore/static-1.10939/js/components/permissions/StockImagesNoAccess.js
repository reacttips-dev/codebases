'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { readOnlyReasonProp } from '../../constants/propTypes';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerCore.permissions.stockImages." + suffix;
};

var StockImagesNoAccess = function StockImagesNoAccess(_ref) {
  var readOnlyReason = _ref.readOnlyReason,
      showIllustration = _ref.showIllustration;

  var primaryContent = /*#__PURE__*/_jsx(FormattedMessage, {
    message: getI18nKey(readOnlyReason)
  });

  if (!showIllustration) {
    return /*#__PURE__*/_jsx("div", {
      className: "text-center",
      children: primaryContent
    });
  }

  return /*#__PURE__*/_jsx(UIEmptyState, {
    primaryContent: primaryContent,
    secondaryContent: /*#__PURE__*/_jsx(UIIllustration, {
      name: "keys"
    }),
    secondaryContentWidth: 150,
    reverseOrder: true
  });
};

StockImagesNoAccess.propTypes = {
  readOnlyReason: readOnlyReasonProp,
  showIllustration: PropTypes.bool.isRequired
};
StockImagesNoAccess.defaultProps = {
  showIllustration: true
};
export default StockImagesNoAccess;