'use es6';

import PropTypes from 'prop-types';
import createChainablePropType from './createChainablePropType';
export var getComponentPropType = function getComponentPropType(_ref) {
  var propTypes = _ref.propTypes,
      defaultProps = _ref.defaultProps;
  return createChainablePropType(PropTypes.elementType, 'componentProp', {
    propTypes: propTypes,
    defaultProps: defaultProps
  });
};
export var isRenderable = function isRenderable(children) {
  return children != null && children !== false;
};