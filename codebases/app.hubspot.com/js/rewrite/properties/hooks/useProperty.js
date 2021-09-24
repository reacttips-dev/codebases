'use es6';

import get from 'transmute/get';
import { useProperties } from './useProperties';
export var useProperty = function useProperty(propertyName) {
  return get(propertyName, useProperties());
};