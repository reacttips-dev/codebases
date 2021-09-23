'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import colr from './vendor/colr';
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
var BoardContainer = styled.div.withConfig({
  displayName: "Board__BoardContainer",
  componentId: "sc-1gmb41s-0"
})(["position:relative;height:100%;min-height:146px;min-width:146px;user-select:none;& > img{height:100%;}"]);
var BoardInner = styled.div.withConfig({
  displayName: "Board__BoardInner",
  componentId: "sc-1gmb41s-1"
})(["position:absolute;top:0;right:0;bottom:0;left:0;"]);
var BoardPanel = styled.div.withConfig({
  displayName: "Board__BoardPanel",
  componentId: "sc-1gmb41s-2"
})(["width:100%;height:100%;position:relative;z-index:1;border-radius:2px;"]);
var BoardPanelValue = styled.div.withConfig({
  displayName: "Board__BoardPanelValue",
  componentId: "sc-1gmb41s-3"
})(["border-radius:2px;position:absolute;width:100%;height:100%;left:0;top:0;z-index:2;background-image:linear-gradient(to bottom,transparent 0%,#000000 100%);"]);
var BoardPanelSaturation = styled.div.withConfig({
  displayName: "Board__BoardPanelSaturation",
  componentId: "sc-1gmb41s-4"
})(["border-radius:2px;position:absolute;width:100%;height:100%;left:0;top:0;z-index:1;background-image:linear-gradient(to right,#ffffff 0%,transparent 100%);"]);
var BoardPanelIndicator = styled.span.withConfig({
  displayName: "Board__BoardPanelIndicator",
  componentId: "sc-1gmb41s-5"
})(["position:absolute;border-radius:10px;border:1px solid #ffffff;width:9px;height:9px;left:-999px;top:-999px;box-shadow:0 0 1px rgba(120,120,120,0.7);z-index:2;"]);
var BoardHandler = styled.div.withConfig({
  displayName: "Board__BoardHandler",
  componentId: "sc-1gmb41s-6"
})(["box-shadow:0 0 2px #808080 inset;border-radius:2px;cursor:crosshair;user-select:none;position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;"]);

var Board = /*#__PURE__*/function (_Component) {
  _inherits(Board, _Component);

  function Board() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Board);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Board)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onBoardMouseDown = function (evt) {
      var x = evt.clientX;
      var y = evt.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });

      window.addEventListener('mousemove', _this.onBoardDrag);
      window.addEventListener('mouseup', _this.onBoardDragEnd);
    };

    _this.onBoardDrag = function (evt) {
      var x = evt.clientX;
      var y = evt.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });
    };

    _this.onBoardDragEnd = function (evt) {
      var x = evt.clientX;
      var y = evt.clientY;

      _this.pointMoveTo({
        x: x,
        y: y
      });

      _this.removeMouseListeners();
    };

    _this.pointMoveTo = function (pos) {
      var rect = _this.measureBounds();

      var width = rect.width;
      var height = rect.height;
      var left = pos.x - rect.left;
      var top = pos.y - rect.top;
      left = Math.max(0, left);
      left = Math.min(left, width);
      top = Math.max(0, top);
      top = Math.min(top, height);
      var hsv = {
        h: _this.props.hue,
        s: left / width * 100,
        v: (1 - top / height) * 100
      };
      var hex = colr.fromHsvObject(hsv).toHex();

      _this.props.onChange({
        hex: hex
      });
    };

    return _this;
  }

  _createClass(Board, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeMouseListeners();
    }
  }, {
    key: "removeMouseListeners",
    value: function removeMouseListeners() {
      window.removeEventListener('mousemove', this.onBoardDrag);
      window.removeEventListener('mouseup', this.onBoardDragEnd);
    }
  }, {
    key: "measureBounds",
    value: function measureBounds() {
      return this.board && this.board.getBoundingClientRect();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          hex = _this$props.hex,
          hue = _this$props.hue;

      var _colr$fromHex$toHsvOb = colr.fromHex(hex).toHsvObject(),
          s = _colr$fromHex$toHsvOb.s,
          v = _colr$fromHex$toHsvOb.v;

      var x = "calc(" + s + "% - 4px)";
      var y = "calc(" + (100 - v) + "% - 4px)";
      var hueHsv = [hue, 100, 100];
      var backgroundColor = colr.fromHsvArray(hueHsv).toHex();
      return /*#__PURE__*/_jsxs(BoardContainer, {
        ref: function ref(el) {
          return _this2.board = el;
        },
        className: className,
        children: [/*#__PURE__*/_jsx("img", {
          src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        }), /*#__PURE__*/_jsxs(BoardInner, {
          children: [/*#__PURE__*/_jsxs(BoardPanel, {
            "data-test-id": "board-inner-panel",
            style: {
              backgroundColor: backgroundColor
            },
            children: [/*#__PURE__*/_jsx(BoardPanelValue, {}), /*#__PURE__*/_jsx(BoardPanelSaturation, {})]
          }), /*#__PURE__*/_jsx(BoardPanelIndicator, {
            "data-test-id": "board-slider-indicator",
            style: {
              left: x,
              top: y
            }
          }), /*#__PURE__*/_jsx(BoardHandler, {
            "data-test-id": "board-handler",
            onMouseDown: this.onBoardMouseDown
          })]
        })]
      });
    }
  }]);

  return Board;
}(Component);

export { Board as default };
Board.propTypes = {
  className: PropTypes.string,
  hex: PropTypes.string,
  hue: PropTypes.number,
  onChange: PropTypes.func
};