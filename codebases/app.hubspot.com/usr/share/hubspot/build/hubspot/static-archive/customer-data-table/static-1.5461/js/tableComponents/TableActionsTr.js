'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { FONT_FAMILIES, setFontSize } from 'UIComponents/utils/Styles';
import { GREAT_WHITE } from 'HubStyleTokens/colors';
import { TABLE_DEFAULT_FONT_SIZE } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { memo, Children } from 'react';
import styled from 'styled-components'; // TODO: use UITableActionsRow

export var StyledTr = styled.tr.withConfig({
  displayName: "TableActionsTr__StyledTr",
  componentId: "sc-16s7ida-0"
})(["display:flex;width:100%;height:auto;position:relative;"]);
var StyledTh = styled.th.withConfig({
  displayName: "TableActionsTr__StyledTh",
  componentId: "sc-16s7ida-1"
})(["height:auto;width:100%;display:flex;align-items:center;border-bottom:", " 1px solid;&&{", ";", ";padding-right:0;text-transform:none;}"], GREAT_WHITE, FONT_FAMILIES.default, setFontSize(TABLE_DEFAULT_FONT_SIZE));
var TableActionsTr = /*#__PURE__*/memo(function (props) {
  var actions = props.actions,
      children = props.children,
      openAtColumnIndex = props.openAtColumnIndex,
      __pageSize = props.pageSize,
      rest = _objectWithoutProperties(props, ["actions", "children", "openAtColumnIndex", "pageSize"]);

  return /*#__PURE__*/_jsxs(StyledTr, Object.assign({}, rest, {
    children: [Children.toArray(children).slice(0, openAtColumnIndex), /*#__PURE__*/_jsx(StyledTh, {
      colSpan: Children.count(children) - openAtColumnIndex,
      role: "cell",
      children: actions
    }, "cdt_actions")]
  }));
});
TableActionsTr.propTypes = {
  actions: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool,
  openAtColumnIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number
};
TableActionsTr.defaultProps = {
  open: false
};
export default TableActionsTr;