'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MEDIA_ALIGNMENT_TYPES, MEDIA_SPACING } from './MediaConstants';
export default function UIMedia(props) {
  var align = props.align,
      className = props.className,
      spacing = props.spacing,
      rest = _objectWithoutProperties(props, ["align", "className", "spacing"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    className: classNames("media private-media", MEDIA_ALIGNMENT_TYPES[align], MEDIA_SPACING[spacing], className)
  }));
}
UIMedia.displayName = 'UIMedia';
UIMedia.propTypes = {
  align: PropTypes.oneOf(Object.keys(MEDIA_ALIGNMENT_TYPES)),
  children: PropTypes.node.isRequired,
  spacing: PropTypes.oneOf(Object.keys(MEDIA_SPACING)).isRequired
};
UIMedia.defaultProps = {
  spacing: 'small'
};