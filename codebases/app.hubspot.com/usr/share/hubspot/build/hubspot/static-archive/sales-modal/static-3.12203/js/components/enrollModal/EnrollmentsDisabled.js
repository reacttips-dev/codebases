'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import H4 from 'UIComponents/elements/headings/H4';
import { statusPage } from 'sales-modal/lib/links';

var EnrollmentsDisabled = function EnrollmentsDisabled(_ref) {
  var onReject = _ref.onReject;
  return /*#__PURE__*/_jsx(UIFlex, {
    align: "center",
    justify: "center",
    className: "enrollments-disabled",
    children: /*#__PURE__*/_jsxs(UIErrorMessage, {
      title: /*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.enrollmentsDisabled.header"
        })
      }),
      children: [/*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: "enrollModal.enrollmentsDisabled.body_jsx",
          options: {
            external: true,
            href: statusPage()
          },
          elements: {
            Link: UILink
          }
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        onClick: onReject,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.enrollmentsDisabled.buttons.gotIt"
        })
      })]
    })
  });
};

EnrollmentsDisabled.propTypes = {
  onReject: PropTypes.func.isRequired
};
export default EnrollmentsDisabled;