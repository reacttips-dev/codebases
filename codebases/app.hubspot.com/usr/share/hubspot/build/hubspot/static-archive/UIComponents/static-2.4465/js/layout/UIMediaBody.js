'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
export default function UIMediaBody(props) {
  var className = props.className,
      rest = _objectWithoutProperties(props, ["className"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    className: classNames("media-body private-media__body", className)
  }));
}
UIMediaBody.displayName = 'UIMediaBody';
UIMediaBody.propTypes = {
  children: PropTypes.node
};