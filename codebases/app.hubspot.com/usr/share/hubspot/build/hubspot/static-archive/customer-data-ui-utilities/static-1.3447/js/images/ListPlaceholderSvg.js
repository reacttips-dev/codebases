'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import memoize from 'transmute/memoize';
import { GYPSUM } from 'HubStyleTokens/colors';

var _getRandomInteger = function _getRandomInteger(max, min) {
  return Math.floor((max - min) * Math.random()) + min;
};

var getRowWidth = memoize(function (_) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _getRandomInteger.apply(void 0, args);
});

var ListPlaceholderSvg = function ListPlaceholderSvg(props) {
  var fill = props.fill,
      height = props.height,
      rowHeight = props.rowHeight,
      rowMinWidth = props.rowMinWidth,
      rowPaddingX = props.rowPaddingX,
      width = props.width,
      rest = _objectWithoutProperties(props, ["fill", "height", "rowHeight", "rowMinWidth", "rowPaddingX", "width"]);

  var rowOuterHight = rowHeight + rowPaddingX;
  var count = Math.max(Math.floor(height / rowOuterHight), 0);
  return /*#__PURE__*/_jsx("svg", Object.assign({}, rest, {
    height: height,
    width: width,
    children: _toConsumableArray(Array(count).fill()).map(function (_, i) {
      return /*#__PURE__*/_jsx("rect", {
        height: rowHeight,
        rx: 3,
        ry: 3,
        style: {
          fill: fill,
          borderRadius: '3px'
        },
        width: getRowWidth(i, width, rowMinWidth),
        x: 0,
        y: rowOuterHight * i
      }, "ListPlaceholderSvg-" + i);
    })
  }));
};

ListPlaceholderSvg.propTypes = {
  fill: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowMinWidth: PropTypes.number,
  rowPaddingX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};
ListPlaceholderSvg.defaultProps = {
  fill: GYPSUM,
  rowHeight: 14,
  rowMinWidth: 30,
  rowPaddingX: 16
};
export default ListPlaceholderSvg;