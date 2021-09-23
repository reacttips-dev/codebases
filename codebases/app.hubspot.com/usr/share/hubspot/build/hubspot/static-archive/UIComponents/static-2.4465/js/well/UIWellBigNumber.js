'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LINK_HOVER } from 'HubStyleTokens/colors';
import { BASE_FONT_COLOR } from 'HubStyleTokens/theme';
import { FONT_FAMILIES, setFontSmoothing } from '../utils/Styles';
var StyledNumber = styled.span.withConfig({
  displayName: "UIWellBigNumber__StyledNumber",
  componentId: "ik5om2-0"
})(["display:inline-block;", ";", ";color:", ";vertical-align:baseline;font-size:28px;line-height:38px;margin-bottom:0;button,a{:hover &{color:", ";}}"], FONT_FAMILIES.default, setFontSmoothing(), BASE_FONT_COLOR, LINK_HOVER);

var UIWellBigNumber = function UIWellBigNumber(props) {
  return /*#__PURE__*/_jsx(StyledNumber, Object.assign({}, props));
};

UIWellBigNumber.propTypes = {
  children: PropTypes.node
};
UIWellBigNumber.displayName = 'UIWellBigNumber';
export default UIWellBigNumber;