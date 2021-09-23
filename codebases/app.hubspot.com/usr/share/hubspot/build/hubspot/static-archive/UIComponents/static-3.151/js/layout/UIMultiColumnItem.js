'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AbstractElement from '../elements/AbstractElement';
var HORIZONTAL_ALIGNMENT_TYPES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};
var VERTICAL_ALIGNMENT_TYPES = {
  top: 'private-multicolumn--align-top',
  middle: 'private-multicolumn--align-middle',
  bottom: 'private-multicolumn--align-bottom'
};

var getTitleText = function getTitleText(titleText) {
  return /*#__PURE__*/_jsx(AbstractElement, {
    className: "private-multicolumn__item__title",
    children: titleText
  });
};

export default function UIMultiColumnItem(props) {
  var children = props.children,
      className = props.className,
      horizontalAlign = props.horizontalAlign,
      titleText = props.titleText,
      verticalAlign = props.verticalAlign,
      width = props.width,
      other = _objectWithoutProperties(props, ["children", "className", "horizontalAlign", "titleText", "verticalAlign", "width"]);

  var renderedTitle = titleText ? getTitleText(titleText) : null;
  return /*#__PURE__*/_jsxs("div", Object.assign({}, other, {
    className: classNames("private-multicolumn__item has--vertical-spacing", HORIZONTAL_ALIGNMENT_TYPES[horizontalAlign], VERTICAL_ALIGNMENT_TYPES[verticalAlign], className),
    style: {
      width: width
    },
    children: [renderedTitle, children]
  }));
}
UIMultiColumnItem.displayName = 'UIMultiColumnItem';
UIMultiColumnItem.propTypes = {
  children: PropTypes.node,
  horizontalAlign: PropTypes.oneOf(Object.keys(HORIZONTAL_ALIGNMENT_TYPES)),
  titleText: PropTypes.node,
  verticalAlign: PropTypes.oneOf(Object.keys(VERTICAL_ALIGNMENT_TYPES)),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
UIMultiColumnItem.defaultProps = {
  verticalAlign: 'middle'
};