'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

function AbstractElement(_ref) {
  var children = _ref.children,
      tagName = _ref.tagName,
      rest = _objectWithoutProperties(_ref, ["children", "tagName"]);

  var Tag = tagName;
  return /*#__PURE__*/_jsx(Tag, Object.assign({}, rest, {
    children: children
  }));
}

AbstractElement.propTypes = {
  children: PropTypes.node,
  tagName: PropTypes.string.isRequired
};
AbstractElement.defaultProps = {
  tagName: 'span'
};
AbstractElement.displayName = 'AbstractElement';
export default AbstractElement;