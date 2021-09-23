'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import PropTypes from 'prop-types';
import invariant from 'react-utils/invariant';
import createChainablePropType from './createChainablePropType';
import getComponentName from 'react-utils/getComponentName';
export default (function (component) {
  var propTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : component.propTypes;

  if (process.env.NODE_ENV !== 'production') {
    invariant(!!propTypes, "passthroughProps: expected propTypes object as second argument, got " + propTypes);
  }

  var _ref = typeof component === 'string' ? [component, undefined] : [getComponentName(component.CoreComponent || component), component],
      _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      Component = _ref2[1];

  var validator = function validator() {
    return PropTypes.object.apply(PropTypes, arguments);
  };

  return createChainablePropType(validator, 'passthroughProps', {
    Component: Component,
    name: name,
    propTypes: propTypes
  });
});