'use es6';

import styled, { css } from 'styled-components';
import UITruncateString from '../../text/UITruncateString';
import { isFirefox } from '../../utils/BrowserTest'; // In Firefox, the truncated text will overlap the arrows unless the width is reduced.

var reducedWidthMixin = css(["width:calc(100% - 14px);"]);
var SortTH_TruncateString = styled(UITruncateString).withConfig({
  displayName: "SortTH_TruncateString",
  componentId: "sc-1cboy5k-0"
})(["&&{", ";}"], isFirefox() ? reducedWidthMixin : null);
SortTH_TruncateString.propTypes = UITruncateString.propTypes;
SortTH_TruncateString.defaultProps = UITruncateString.defaultProps;
export default SortTH_TruncateString;