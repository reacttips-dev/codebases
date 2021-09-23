'use es6';

import { Children } from 'react';
export var isChildActive = function isChildActive(child, value) {
  var childProps = child && child.props ? child.props : {};

  if (childProps.active === true) {
    return true;
  }

  if (value != null && childProps.value != null) {
    return value === childProps.value;
  }

  return false;
};
export var containsActiveChild = function containsActiveChild(parent, value) {
  var children = parent && parent.props && parent.props.children;
  if (children == null) return false;
  var result = false;
  Children.forEach(children, function (child) {
    if (isChildActive(child, value)) {
      result = true;
    } else if (containsActiveChild(child, value)) {
      result = true;
    }
  });
  return result;
};