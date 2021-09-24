'use es6';

import { is } from 'immutable';
import { useMemo } from 'react';
import get from 'transmute/get';
import { useCachedViews } from './useCachedViews';
import { useCurrentView } from './useCurrentView';
export var useIsCurrentViewModified = function useIsCurrentViewModified() {
  var view = useCurrentView();
  var cachedViews = useCachedViews();
  var cachedView = get(get('id', view), cachedViews);
  return useMemo(function () {
    return !view || !cachedView || !is(view, cachedView);
  }, [cachedView, view]);
};