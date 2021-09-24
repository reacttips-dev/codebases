'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { logCallingError } from 'calling-error-reporting/report/error';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import styled from 'styled-components';
var StyledUIErrorMessage = styled(UIErrorMessage).withConfig({
  displayName: "WidgetError__StyledUIErrorMessage",
  componentId: "sc-1l5vurf-0"
})(["img{margin-bottom:15px;}"]);

function WidgetError(_ref) {
  var title = _ref.title,
      body = _ref.body,
      errorMessage = _ref.errorMessage;

  var titleText = title || /*#__PURE__*/_jsx(FormattedMessage, {
    message: "callHostWidget.widgetError.title"
  });

  var bodyText = body || /*#__PURE__*/_jsx(FormattedMessage, {
    message: "callHostWidget.widgetError.body"
  });

  useMemo(function () {
    return errorMessage && logCallingError({
      errorMessage: errorMessage
    });
  }, [errorMessage]);
  return /*#__PURE__*/_jsx(StyledUIErrorMessage, {
    illustration: "errors/general",
    illustrationProps: {
      width: 80
    },
    title: /*#__PURE__*/_jsx("div", {
      className: "is--heading-4",
      children: titleText
    }),
    className: "p-x-4 m-y-3",
    children: bodyText
  });
}

WidgetError.propTypes = {
  title: PropTypes.node,
  body: PropTypes.node,
  errorMessage: PropTypes.string
};
export default /*#__PURE__*/memo(WidgetError);