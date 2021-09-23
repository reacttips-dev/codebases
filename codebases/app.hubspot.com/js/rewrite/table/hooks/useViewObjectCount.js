'use es6';

import get from 'transmute/get';
import { useTableQueryCache } from '../../table/hooks/useTableQueryCache';
/**
 * Gets the current filtered view object count, or undefined if the query cache hasn't been populated yet.
 * @returns {number} view object count
 */

export var useViewObjectCount = function useViewObjectCount() {
  var _useTableQueryCache = useTableQueryCache(),
      data = _useTableQueryCache.data;

  return get('total', data);
};