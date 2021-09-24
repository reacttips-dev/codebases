'use es6';

import invariant from 'react-utils/invariant';
import isNumber from 'transmute/isNumber';
import isObject from 'transmute/isObject';
import isString from 'transmute/isString';
import isFunction from 'transmute/isFunction';
import ResolverError from 'reference-resolvers/schema/ResolverError';
import ResolverLoading from 'reference-resolvers/schema/ResolverLoading';
import { Iterable } from 'immutable';
import { isValidElementType } from 'react-is';
export function enforceBoolean(name, value) {
  invariant(typeof value === 'boolean', 'expected `%s` to be a Boolean but got `%s`', name, value);
}
export function enforceIterable(name, value) {
  invariant(Iterable.isIterable(value) || isObject(value), 'expected `%s` to be an Immtuable Iterable or an Object but got `%s`', name, value);
}
export function enforcePositiveInt(name, value) {
  invariant(isNumber(value) && value >= 0, 'expected `%s` to be a positive integer but got `%s`', name, value);
}
export function enforceString(name, value) {
  invariant(isString(value), 'expected `%s` to be a string but got `%s`', name, value);
}
export function enforceFunction(name, value) {
  invariant(isFunction(value), 'expected `%s` to be a function but got `%s`', name, value);
}
export function enforceReactComponent(name, value) {
  invariant(isValidElementType(value), 'expected `%s` to be a react component but got `%s`', name, value);
}
export function createEnforceResolverValue(name, checkValue) {
  return function (value) {
    invariant(value == null || value instanceof ResolverError || value instanceof ResolverLoading || checkValue(value), 'expected value to be a %s, null, ResolverError or ResolverLoading, but got `%s`', name, value);
    return value;
  };
}