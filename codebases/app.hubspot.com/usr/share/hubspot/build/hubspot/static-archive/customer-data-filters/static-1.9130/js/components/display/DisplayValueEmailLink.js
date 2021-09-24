'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { __ANY_LINK } from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';

var DisplayValueEmailLink = function DisplayValueEmailLink(_ref) {
  var value = _ref.value;
  return value === __ANY_LINK ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "customerDataFilters.FilterEditor.specialOptionValues.anyLink"
  }) : /*#__PURE__*/_jsx("span", {
    children: value
  });
};

DisplayValueEmailLink.propTypes = {
  value: PropTypes.string.isRequired
};
export default DisplayValueEmailLink;