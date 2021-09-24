'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { FLINT } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip'; // needs padding to show ends of the entire icon
// context: https://git.hubteam.com/HubSpot/customer-data-table/pull/565#discussion_r1554663

var Icon = styled(UIIcon).withConfig({
  displayName: "RestrictedPropertyCell__Icon",
  componentId: "sc-11knuac-0"
})(["padding:0 1px;"]);

var RestrictedPropertyCell = function RestrictedPropertyCell() {
  return /*#__PURE__*/_jsx(UITooltip, {
    placement: "top",
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.cells.restrictedProperty"
    }),
    use: "longform",
    children: /*#__PURE__*/_jsx(Icon, {
      color: FLINT,
      name: "hide"
    })
  });
};

export default RestrictedPropertyCell;