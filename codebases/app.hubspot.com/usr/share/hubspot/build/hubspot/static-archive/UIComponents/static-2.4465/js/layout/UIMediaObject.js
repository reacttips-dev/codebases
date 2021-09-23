'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import UIMedia from './UIMedia';
import UIMediaBody from './UIMediaBody';
import UIMediaLeft from './UIMediaLeft';
import UIMediaRight from './UIMediaRight';
export default function UIMediaObject(props) {
  var children = props.children,
      itemLeft = props.itemLeft,
      itemRight = props.itemRight,
      MediaBody = props.MediaBody,
      MediaLeft = props.MediaLeft,
      MediaRight = props.MediaRight,
      rest = _objectWithoutProperties(props, ["children", "itemLeft", "itemRight", "MediaBody", "MediaLeft", "MediaRight"]);

  return /*#__PURE__*/_jsxs(UIMedia, Object.assign({}, rest, {
    children: [itemLeft ? /*#__PURE__*/_jsx(MediaLeft, {
      children: itemLeft
    }) : null, /*#__PURE__*/_jsx(MediaBody, {
      children: children
    }), itemRight ? /*#__PURE__*/_jsx(MediaRight, {
      children: itemRight
    }) : null]
  }));
}
UIMediaObject.propTypes = Object.assign({}, UIMedia.propTypes, {
  itemLeft: PropTypes.node,
  itemRight: PropTypes.node,
  MediaBody: getComponentPropType(UIMediaBody),
  MediaLeft: getComponentPropType(UIMediaLeft),
  MediaRight: getComponentPropType(UIMediaRight)
});
UIMediaObject.defaultProps = Object.assign({}, UIMedia.defaultProps, {
  MediaBody: UIMediaBody,
  MediaLeft: UIMediaLeft,
  MediaRight: UIMediaRight
});
UIMediaObject.displayName = 'UIMediaObject';