'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import UIColorSquatch from 'UIComponents/color/UIColorSquatch';
import UIColorSquatchGrid from 'UIComponents/color/UIColorSquatchGrid';

var SquatchGrid = /*#__PURE__*/function (_Component) {
  _inherits(SquatchGrid, _Component);

  function SquatchGrid() {
    _classCallCheck(this, SquatchGrid);

    return _possibleConstructorReturn(this, _getPrototypeOf(SquatchGrid).apply(this, arguments));
  }

  _createClass(SquatchGrid, [{
    key: "colorMatches",
    value: function colorMatches(col1, col2) {
      // color in hex string
      return col1 && col2 && col1.toLowerCase() === col2.toLowerCase();
    }
  }, {
    key: "getValues",
    value: function getValues(data) {
      var _this$props = this.props,
          defaultAlpha = _this$props.defaultAlpha,
          defaultColor = _this$props.defaultColor; // data is hex string

      if (/^#[0-9a-fA-F]{3,6}$/.test(data)) {
        return {
          color: data,
          alpha: defaultAlpha
        };
      }

      if (data.color && data.alpha) {
        var color = data.color;
        var alpha = isNaN(data.alpha) ? defaultAlpha : data.alpha;
        return {
          color: color,
          alpha: alpha
        };
      }

      setTimeout(function () {
        throw new Error("Unable to parse color from " + data);
      }, 0);
      return {
        alpha: defaultAlpha,
        color: defaultColor
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props2 = this.props,
          className = _this$props2.className,
          currentColor = _this$props2.currentColor,
          gapSize = _this$props2.gapSize,
          grid = _this$props2.grid,
          _onClick = _this$props2.onClick,
          squatchSize = _this$props2.squatchSize,
          showMatchedSquatch = _this$props2.showMatchedSquatch;

      var _alreadyMatchedColor = !showMatchedSquatch;

      return /*#__PURE__*/_jsx(UIColorSquatchGrid, {
        "data-test-id": "colorpicker-squatch-grid",
        className: classNames('private-react-colorpicker-popover--color-grid', className),
        gapSize: gapSize,
        children: grid.map(function (data, i) {
          var _this$getValues = _this.getValues(data),
              color = _this$getValues.color,
              alpha = _this$getValues.alpha;

          var colorMatch = !_alreadyMatchedColor && _this.colorMatches(color, currentColor);

          _alreadyMatchedColor = _alreadyMatchedColor || colorMatch;
          return /*#__PURE__*/_jsx(UIColorSquatch, {
            "data-test-id": "colorpicker-squatch",
            color: color,
            onClick: function onClick() {
              _onClick({
                alpha: alpha,
                color: color
              });
            },
            opacity: alpha,
            selected: colorMatch,
            size: squatchSize
          }, i);
        })
      });
    }
  }]);

  return SquatchGrid;
}(Component);

SquatchGrid.propTypes = {
  className: PropTypes.string,
  currentColor: PropTypes.string.isRequired,
  defaultAlpha: PropTypes.number,
  defaultColor: PropTypes.string,
  gapSize: PropTypes.number,
  grid: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    color: PropTypes.string,
    alpha: PropTypes.string
  })])).isRequired,
  onClick: PropTypes.func.isRequired,
  squatchSize: PropTypes.number,
  showMatchedSquatch: PropTypes.bool
};
SquatchGrid.defaultProps = {
  defaultAlpha: 100,
  defaultColor: '#FFFFFF',
  gapSize: 5,
  squatchSize: 25,
  showMatchedSquatch: true
};
export default SquatchGrid;