'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { DISTANCE_MEASUREMENT_MEDIUM } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIHeader from '../layout/UIHeader';
import omit from '../utils/underscore/omit';
var Subheader = styled(UIHeader).withConfig({
  displayName: "UISubheader__Subheader",
  componentId: "sc-8osd8u-0"
})(["margin-bottom:", ";padding-top:0;"], DISTANCE_MEASUREMENT_MEDIUM);

function UISubheader(_ref) {
  var props = Object.assign({}, _ref);
  return /*#__PURE__*/_jsx(Subheader, Object.assign({}, props, {
    fullWidth: true,
    flush: true,
    use: "condensed"
  }));
}

UISubheader.propTypes = Object.assign({}, omit(UIHeader.propTypes, ['flush', 'fullWidth', 'headingLevel', 'use']), {
  headingLevel: PropTypes.oneOf(['h2', 'h3', 'h4', 'h5', 'h6'])
});
UISubheader.defaultProps = {
  headingLevel: 'h2',
  role: 'presentation'
};
UISubheader.displayName = 'UISubheader';
export default UISubheader;