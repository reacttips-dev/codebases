'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import H4 from 'UIComponents/elements/headings/H4';
import FormattedMessage from 'I18n/components/FormattedMessage';
var BizObjectiveTitle = styled(H4).withConfig({
  displayName: "BizObjective__BizObjectiveTitle",
  componentId: "sc-1p3jga5-0"
})(["font-size:16px;text-transform:uppercase;"]);
var BizObjectiveContainer = styled.div.withConfig({
  displayName: "BizObjective__BizObjectiveContainer",
  componentId: "sc-1p3jga5-1"
})(["max-width:300px;flex-basis:25%;"]);

function BizObjective(_ref) {
  var bizObjective = _ref.bizObjective,
      children = _ref.children;
  return /*#__PURE__*/_jsxs(BizObjectiveContainer, {
    children: [/*#__PURE__*/_jsx(BizObjectiveTitle, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "pricing-pages.bizObjectives." + bizObjective
      })
    }), /*#__PURE__*/_jsx("div", {
      children: children
    })]
  });
}

export default BizObjective;