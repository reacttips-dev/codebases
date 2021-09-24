'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { FLINT, GREAT_WHITE, OLAF } from 'HubStyleTokens/colors';
import UICloseButton from '../button/UICloseButton';
import { allSizes } from '../utils/propTypes/tshirtSize';
import { setBorderRadius, setDistance } from '../utils/Styles';
import { TileContextProvider, defaultTileContext } from '../context/TileContext';
var compactTileContext = {
  compact: true
};
var spacedMixin = css([".private-tile + &{margin-top:16px;}"]);
var Tile = styled.div.withConfig({
  displayName: "UITile__Tile",
  componentId: "sc-8sc3k6-0"
})(["position:relative;", ";background-color:", ";border:1px solid ", ";", ";", ""], setBorderRadius(), OLAF, GREAT_WHITE, function (_ref) {
  var distance = _ref.distance;
  return distance && setDistance(distance);
}, function (_ref2) {
  var distance = _ref2.distance;
  return !distance && spacedMixin;
});
var CloseButton = styled(UICloseButton).withConfig({
  displayName: "UITile__CloseButton",
  componentId: "sc-8sc3k6-1"
})(["right:12px;top:12px;"]);

var UITile = /*#__PURE__*/function (_Component) {
  _inherits(UITile, _Component);

  function UITile() {
    _classCallCheck(this, UITile);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITile).apply(this, arguments));
  }

  _createClass(UITile, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          closeable = _this$props.closeable,
          compact = _this$props.compact,
          onClose = _this$props.onClose,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "closeable", "compact", "onClose"]);

      return /*#__PURE__*/_jsx(TileContextProvider, {
        value: compact ? compactTileContext : defaultTileContext,
        children: /*#__PURE__*/_jsxs(Tile, Object.assign({}, rest, {
          className: classNames('private-tile', className),
          children: [closeable ? /*#__PURE__*/_jsx(CloseButton, {
            color: FLINT,
            onClick: onClose,
            size: "sm"
          }) : null, children]
        }))
      });
    }
  }]);

  return UITile;
}(Component);

UITile.displayName = 'UITile';
UITile.propTypes = {
  children: PropTypes.node.isRequired,
  closeable: PropTypes.bool.isRequired,
  compact: PropTypes.bool.isRequired,
  distance: PropTypes.oneOfType([allSizes, PropTypes.oneOf(['flush'])]),
  onClose: PropTypes.func
};
UITile.defaultProps = {
  closeable: false,
  compact: false
};
export default UITile;