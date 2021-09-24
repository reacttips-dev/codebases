'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import H4 from 'UIComponents/elements/headings/H4';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UISection from 'UIComponents/section/UISection';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import styled from 'styled-components';
var StyledFullPage = styled.div.withConfig({
  displayName: "ForbiddenPage__StyledFullPage",
  componentId: "sc-1xpsehd-0"
})(["width:100%;"]);
export var ForbiddenPage = function ForbiddenPage(_ref) {
  var _ref$RhumbMarker = _ref.RhumbMarker,
      RhumbMarker = _ref$RhumbMarker === void 0 ? null : _ref$RhumbMarker;
  return /*#__PURE__*/_jsx(StyledFullPage, {
    children: /*#__PURE__*/_jsx(UISection, {
      use: "island",
      children: /*#__PURE__*/_jsx(UIErrorMessage, {
        illustration: "lock",
        illustrationProps: {
          width: 200
        },
        title: /*#__PURE__*/_jsx(H4, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "forbiddenPage.title"
          })
        }),
        children: /*#__PURE__*/_jsxs("p", {
          children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
            "data-selenium-test": "error-message",
            message: "forbiddenPage.body"
          }), RhumbMarker]
        })
      })
    })
  });
};
ForbiddenPage.propTypes = {
  RhumbMarker: PropTypes.node
};