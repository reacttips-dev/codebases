'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BASE_FONT_COLOR } from 'HubStyleTokens/theme';
import { FONT_FAMILIES, setFontSmoothing } from '../utils/Styles';
var StyledLabel = styled.div.withConfig({
  displayName: "UIWellLabel__StyledLabel",
  componentId: "sc-1sbby51-0"
})(["font-size:12px;", ";", ";color:", ";line-height:normal;text-transform:uppercase;margin-bottom:4px;"], FONT_FAMILIES.demibold, setFontSmoothing(), BASE_FONT_COLOR);

var UIWellLabel = function UIWellLabel(props) {
  return /*#__PURE__*/_jsx(StyledLabel, Object.assign({}, props));
};

UIWellLabel.propTypes = {
  children: PropTypes.node
};
UIWellLabel.displayName = 'UIWellLabel';
export default UIWellLabel;