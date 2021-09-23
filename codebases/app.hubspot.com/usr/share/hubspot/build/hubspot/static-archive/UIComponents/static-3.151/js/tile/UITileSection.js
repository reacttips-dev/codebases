'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { TileContext } from '../context/TileContext';
var flushMixin = css(["padding-left:0;padding-right:0;"]);
var TileSection = styled.div.withConfig({
  displayName: "UITileSection__TileSection",
  componentId: "o8n5au-0"
})(["padding:", ";", " .private-tile__section + &{padding-top:0;}"], function (_ref) {
  var compact = _ref.compact;
  return compact ? '20px' : '32px';
}, function (_ref2) {
  var flush = _ref2.flush;
  return flush && flushMixin;
});
export default function UITileSection(_ref3) {
  var className = _ref3.className,
      rest = _objectWithoutProperties(_ref3, ["className"]);

  var _useContext = useContext(TileContext),
      compact = _useContext.compact;

  return /*#__PURE__*/_jsx(TileSection, Object.assign({}, rest, {
    className: classNames("private-tile__section has--vertical-spacing", className),
    compact: compact
  }));
}
UITileSection.defaultProps = {
  flush: false
};
UITileSection.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool
};
UITileSection.displayName = 'UITileSection';