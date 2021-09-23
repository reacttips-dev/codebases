'use es6';

import get from 'transmute/get';
import { useViews } from './useViews';
export var useDoesViewExist = function useDoesViewExist(viewId) {
  var views = useViews(); // HACK: We key all views by their ids as strings. Once we transition away
  // from immutable, this will no longer be necessary.

  var view = get(String(viewId), views);
  return Boolean(view);
};