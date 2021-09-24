'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import styled from 'styled-components';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
var StyledUIErrorMessage = styled(UIErrorMessage).withConfig({
  displayName: "CallingWidgetErrorMessage__StyledUIErrorMessage",
  componentId: "sc-8lb4ir-0"
})(["img{margin-bottom:15px;}"]);

function CallingWidgetErrorMessage(_ref) {
  var onReset = _ref.onReset;
  return /*#__PURE__*/_jsx("div", {
    className: "align-center",
    children: /*#__PURE__*/_jsx(StyledUIErrorMessage, {
      illustration: "errors/general",
      illustrationProps: {
        width: 80
      },
      title: /*#__PURE__*/_jsx("div", {
        className: "is--heading-4",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-communicator-ui.genericError.sorry"
        })
      }),
      className: "p-x-4 m-y-0",
      children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "calling-communicator-ui.genericError.failedMsg_jsx",
        elements: {
          UILink: UILink
        },
        options: {
          onClick: onReset
        }
      })
    })
  });
}

CallingWidgetErrorMessage.propTypes = {
  onReset: PropTypes.func.isRequired
};
export default /*#__PURE__*/memo(CallingWidgetErrorMessage);