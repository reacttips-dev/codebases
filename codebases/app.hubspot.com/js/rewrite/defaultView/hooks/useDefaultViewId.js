'use es6';

import get from 'transmute/get';
import { usePinnedViewIds } from '../../pinnedViews/hooks/usePinnedViewIds';
export var useDefaultViewId = function useDefaultViewId() {
  return get(0, usePinnedViewIds());
};