'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ComponentWithBodyClass from '../utils/ComponentWithBodyClass';
/**
 * Standard page container, setting classes, context, etc.
 */

export default function UIPage(props) {
  var bodyClassName = props.bodyClassName,
      bodyElement = props.bodyElement,
      className = props.className,
      TagName = props.tagName,
      rest = _objectWithoutProperties(props, ["bodyClassName", "bodyElement", "className", "tagName"]);

  var renderedChildren = /*#__PURE__*/_jsx(TagName, Object.assign({}, rest, {
    className: classNames(className, 'private-page')
  }));

  if (bodyClassName) {
    return /*#__PURE__*/_jsx(ComponentWithBodyClass, {
      bodyClassName: bodyClassName,
      bodyElement: bodyElement,
      children: renderedChildren
    });
  }

  return renderedChildren;
}
UIPage.propTypes = Object.assign({}, ComponentWithBodyClass.propTypes, {
  bodyClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  tagName: PropTypes.string.isRequired
});
UIPage.defaultProps = Object.assign({}, ComponentWithBodyClass.defaultProps, {
  tagName: 'div'
});
UIPage.displayName = 'UIPage';