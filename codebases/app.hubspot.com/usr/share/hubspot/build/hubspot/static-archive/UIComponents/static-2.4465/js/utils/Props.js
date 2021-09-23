'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
export var omitProps = function omitProps(Component, omitted) {
  return function (props) {
    var filteredProps = Object.assign({}, props);
    omitted.forEach(function (propName) {
      delete filteredProps[propName];
    });
    return /*#__PURE__*/_jsx(Component, Object.assign({}, filteredProps));
  };
};
/**
 * @param {Object} props
 * @return {Object} The subset of the given props whose names start with `aria-` or `data-`
 */

export var getAriaAndDataProps = function getAriaAndDataProps(props) {
  var propKeyRegex = /^((aria-)|(data-))/;
  return Object.keys(props).reduce(function (acc, key) {
    if (!key) return acc;

    if (key.match(propKeyRegex)) {
      acc[key] = props[key];
    }

    return acc;
  }, {});
};