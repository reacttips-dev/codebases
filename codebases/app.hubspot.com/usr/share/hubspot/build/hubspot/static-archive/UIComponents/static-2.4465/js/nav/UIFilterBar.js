'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AbstractToolbar from './AbstractToolbar';
import { LAYOUT_EDITOR_PADDING } from 'HubStyleTokens/sizes';
var FilterBar = styled(AbstractToolbar).withConfig({
  displayName: "UIFilterBar__FilterBar",
  componentId: "sc-1tmbxd7-0"
})(["margin:", " 0;"], function (props) {
  return !props.flush && LAYOUT_EDITOR_PADDING;
});

var UIFilterBar = function UIFilterBar(props) {
  var endSlot = props.endSlot,
      flush = props.flush,
      middleSlot = props.middleSlot,
      responsive = props.responsive,
      startSlot = props.startSlot,
      rest = _objectWithoutProperties(props, ["endSlot", "flush", "middleSlot", "responsive", "startSlot"]);

  return /*#__PURE__*/_jsx(FilterBar, Object.assign({}, rest, {
    endSlot: endSlot,
    flush: flush,
    middleSlot: middleSlot,
    responsive: responsive,
    startSlot: startSlot
  }));
};

UIFilterBar.propTypes = {
  endSlot: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  flush: PropTypes.bool.isRequired,
  middleSlot: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  responsive: PropTypes.bool.isRequired,
  startSlot: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
};
UIFilterBar.defaultProps = {
  flush: false,
  responsive: true
};
UIFilterBar.displayName = 'UIFilterBar';
export default UIFilterBar;