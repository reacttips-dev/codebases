'use es6';

import PropTypes from 'prop-types';
import UIFlex from 'UIComponents/layout/UIFlex';
import styled from 'styled-components';
import globalNavHeight from 'nav-meta/global-nav-height';
import { HEADER_PADDING_TOP, HEADER_PADDING_BOTTOM, LAYOUT_MAIN_PADDING_TOP } from 'HubStyleTokens/sizes'; // HACK: This was measured via devtools and is not guaranteed to be accurate. It represents the height
// of the buttons/dropdowns in the header on the board page only.

var BOARD_HEADER_CONTENT_HEIGHT = '35px'; // HACK: The negative margin overrides the default set by UIListingPage so we can use our own smaller value

var MainContentWrapper = styled(UIFlex).attrs({
  direction: 'column'
}).withConfig({
  displayName: "MainContentWrapper",
  componentId: "sc-12dvx7u-0"
})(["margin-bottom:-48px;", ""], function (_ref) {
  var $isBoard = _ref.$isBoard;
  return $isBoard && "\n    height: calc(100vh - " + globalNavHeight + " - " + HEADER_PADDING_TOP + " - " + BOARD_HEADER_CONTENT_HEIGHT + " - " + HEADER_PADDING_BOTTOM + " - " + LAYOUT_MAIN_PADDING_TOP + ");\n    padding-bottom: " + LAYOUT_MAIN_PADDING_TOP + "\n    ";
});
MainContentWrapper.propTypes = {
  $isBoard: PropTypes.bool.isRequired
};
export default MainContentWrapper;