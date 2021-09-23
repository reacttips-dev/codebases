'use es6';

import { GREAT_WHITE, OLAF } from 'HubStyleTokens/colors';
import { memo } from 'react';
import styled, { keyframes } from 'styled-components';

var isNumber = function isNumber(value) {
  return typeof value === 'number';
};

var pulse = keyframes(["0%{background-position:0% 0%;}100%{background-position:-135% 0%;}"]);

var makeDimension = function makeDimension(value) {
  return value ? isNumber(value) ? value + "px" : value : '100%';
};

var Skeleton = /*#__PURE__*/memo(styled.div.withConfig({
  displayName: "Skeleton",
  componentId: "sc-3ocwtg-0"
})(["display:", ";width:", ";height:", ";background:linear-gradient( -90deg,", " 0%,", " 50%,", " 100% );background-size:400% 400%;animation:", " 3s ease-in-out infinite;"], function (_ref) {
  var _ref$inline = _ref.inline,
      inline = _ref$inline === void 0 ? false : _ref$inline;
  return inline ? 'inline-block' : 'block';
}, function (_ref2) {
  var width = _ref2.width;
  return makeDimension(width);
}, function (_ref3) {
  var height = _ref3.height;
  return makeDimension(height);
}, GREAT_WHITE, OLAF, GREAT_WHITE, pulse));
export default Skeleton;