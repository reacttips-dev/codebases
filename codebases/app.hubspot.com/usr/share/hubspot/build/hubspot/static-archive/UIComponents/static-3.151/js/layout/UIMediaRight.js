'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UIMediaRight(props) {
  var className = props.className,
      rest = _objectWithoutProperties(props, ["className"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    className: classNames("private-media__item private-media__item--right", className)
  }));
}
UIMediaRight.displayName = 'UIMediaRight';
UIMediaRight.propTypes = {
  children: PropTypes.node
};