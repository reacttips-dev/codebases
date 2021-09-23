'use es6';

import PropTypes from 'prop-types';
var usesIntrospection = PropTypes.any.__INTROSPECTION__;
/**
 * @return {boolean}
 */

export var isIntrospectionEnabled = function isIntrospectionEnabled() {
  return usesIntrospection;
};
/**
 * Override for testing logic dependent on isIntrospectionEnabled()
 * @param {boolean} newUsesIntrospection
 */

export var setIntrospectionEnabled = function setIntrospectionEnabled(newUsesIntrospection) {
  usesIntrospection = newUsesIntrospection;
};