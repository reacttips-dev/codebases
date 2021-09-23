'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { toPx } from '../utils/Styles';
var ScrollWrapper = styled.div.withConfig({
  displayName: "UISection__ScrollWrapper",
  componentId: "sc-99dycm-0"
})(["height:", ";&&{", ";}& >:last-child{margin-bottom:0;}"], function (props) {
  return toPx(props.height);
}, function (props) {
  return props.flush && "margin-bottom: 0";
});
var UISection = /*#__PURE__*/forwardRef(function (props, ref) {
  var className = props.className,
      use = props.use,
      rest = _objectWithoutProperties(props, ["className", "use"]);

  return /*#__PURE__*/_jsx(ScrollWrapper, Object.assign({}, rest, {
    className: classNames("is--module namespaced-hack-section", className, use === 'island' && 'is--island'),
    ref: ref
  }));
});
UISection.propTypes = {
  children: PropTypes.node,
  flush: PropTypes.bool.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  use: PropTypes.oneOf(['default', 'island']).isRequired
};
UISection.defaultProps = {
  flush: false,
  overhang: false,
  overhangDirection: 'horizontal',
  use: 'default'
};
UISection.displayName = 'UISection';
export default UISection;