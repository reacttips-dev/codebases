'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
/**
  IE11 Fix
  This is to ensure thead's in IE11 inherit the width of the table
  and subsequently make the table stretch the correct width.

  Unlike other browsers, thead's in IE11 do not inherit their width.

  https://git.hubteam.com/HubSpot/customer-data-table/pull/464
**/

var StyledThead = styled.thead.withConfig({
  displayName: "Thead__StyledThead",
  componentId: "trr7ft-0"
})(["width:inherit;"]);

var Thead = function Thead(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx(StyledThead, {
    children: children
  });
};

export default Thead;