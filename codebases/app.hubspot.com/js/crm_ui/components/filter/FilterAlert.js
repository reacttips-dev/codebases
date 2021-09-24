'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIAlert from 'UIComponents/alert/UIAlert';

var FilterAlert = function FilterAlert(_ref) {
  var type = _ref.type,
      text = _ref.text,
      linkLocation = _ref.linkLocation;
  return /*#__PURE__*/_jsx(UIAlert, {
    type: type,
    children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: text,
      options: {
        linkLocation: linkLocation
      }
    })
  });
};

FilterAlert.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  linkLocation: PropTypes.string
};
export default FilterAlert;