'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import UIDateRange from './UIDateRange';
import UIMicroDateInput from './UIMicroDateInput';
var DateRange = styled(UIDateRange).withConfig({
  displayName: "UIMicroDateRange__DateRange",
  componentId: "ejmoci-0"
})(["display:inline-flex;"]);

var UIMicroDateRange = function UIMicroDateRange(props) {
  return /*#__PURE__*/_jsx(DateRange, Object.assign({}, props));
};

UIMicroDateRange.propTypes = UIDateRange.propTypes;
UIMicroDateRange.defaultProps = Object.assign({}, UIDateRange.defaultProps, {
  DateInput: UIMicroDateInput
});
UIMicroDateRange.displayName = 'UIMicroDateRange';
export default UIMicroDateRange;