'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIFlex from 'UIComponents/layout/UIFlex';

var IndexErrorState = function IndexErrorState(_ref) {
  var FailureMarker = _ref.FailureMarker;
  return /*#__PURE__*/_jsxs(UIFlex, {
    align: "center",
    direction: "column",
    className: "sales-content-table-error-state m-top-3",
    children: [/*#__PURE__*/_jsx(FailureMarker, {}), /*#__PURE__*/_jsx(UIIllustration, {
      name: "errors/general",
      width: 150,
      className: "m-bottom-3"
    }), /*#__PURE__*/_jsx("h2", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.errorState.errorTitle"
      })
    }), /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.errorState.errorDescription"
      })
    })]
  });
};

IndexErrorState.propTypes = {
  FailureMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
};
export default IndexErrorState;