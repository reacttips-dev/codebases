'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { HR_BORDER_COLOR } from 'HubStyleTokens/theme';
import styled from 'styled-components';
import { allSizes } from '../utils/propTypes/tshirtSize';
import { setDistance } from '../utils/Styles';
var StyledHR = styled.hr.withConfig({
  displayName: "HR__StyledHR",
  componentId: "sc-1z0ctnl-0"
})(["background-color:", ";border:0;height:1px;min-height:1px;width:100%;", ";"], HR_BORDER_COLOR, function (_ref) {
  var distance = _ref.distance;
  return setDistance(distance);
});
export default function HR(props) {
  return /*#__PURE__*/_jsx(StyledHR, Object.assign({}, props));
}
HR.propTypes = {
  distance: PropTypes.oneOfType([allSizes, PropTypes.oneOf(['flush'])])
};
HR.defaultProps = {
  distance: 'md'
};
HR.displayName = 'HR';