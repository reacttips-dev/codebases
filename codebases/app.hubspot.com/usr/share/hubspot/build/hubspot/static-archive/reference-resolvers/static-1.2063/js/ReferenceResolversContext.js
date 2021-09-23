'use es6';

import PropTypes from 'prop-types';
import { createContext } from 'react';
import ReferenceResolverType from './schema/ReferenceResolverType';
var defaultValue = undefined;
export var referenceResolverContextPropTypes = {
  referenceResolverContext: PropTypes.objectOf(PropTypes.oneOfType([ReferenceResolverType.isRequired, PropTypes.func.isRequired]))
};
export default /*#__PURE__*/createContext(defaultValue);