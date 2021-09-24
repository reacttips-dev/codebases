'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIListingPage from 'UIComponents/page/UIDashboardPage';
import UIAlert from 'UIComponents/alert/UIAlert';

var ErrorPage = function ErrorPage(props) {
  return /*#__PURE__*/_jsx(UIListingPage, {
    children: /*#__PURE__*/_jsxs(UIAlert, {
      type: "danger",
      children: ["Sorry, an error has occurred.", ' ', props.withLinkToDashboard && /*#__PURE__*/_jsx("a", {
        href: "/",
        children: "Return to Dashboard."
      })]
    })
  });
};

ErrorPage.propTypes = {
  code: PropTypes.number.isRequired,
  withLinkToDashboard: PropTypes.bool
};
ErrorPage.defaultProps = {
  code: 400,
  withLinkToDashboard: true
};
export default ErrorPage;