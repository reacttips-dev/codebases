'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as colors from 'HubStyleTokens/colors';
import UIIcon from 'UIComponents/icon/UIIcon';
import { millisecondsToTimer } from '../../utils/utils';
var StyledVideoDuration = styled.div.withConfig({
  displayName: "ThumbnailVideoDuration__StyledVideoDuration",
  componentId: "sc-5dc70w-0"
})(["position:absolute;right:0;bottom:0;padding:0 4px;font-size:12px;height:20px;opacity:0.8;background-color:", ";color:", ";"], colors.OBSIDIAN, colors.OLAF);

function ThumbnailVideoDuration(_ref) {
  var duration = _ref.duration;
  return /*#__PURE__*/_jsxs(StyledVideoDuration, {
    className: "flex-row align-center",
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "playerPlay",
      color: colors.OLAF,
      size: 9,
      className: 'm-top-1' + (!duration ? " m-right-0" : "")
    }), duration && /*#__PURE__*/_jsx("span", {
      children: millisecondsToTimer(duration)
    })]
  });
}

ThumbnailVideoDuration.propTypes = {
  duration: PropTypes.number
};
export default ThumbnailVideoDuration;