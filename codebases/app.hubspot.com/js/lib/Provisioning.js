'use es6';

import { List } from 'immutable';
import once from 'transmute/once';
import memoize from 'transmute/memoize';
import * as ViewIdMapping from '../crm_ui/views/ViewIdMapping';
import * as PinnedViewsActions from '../pinnedViews/actions/PinnedViewsActions';
/**
 * Reset default pinned views only once per object type
 */

var updatePinned = memoize(function (__objectType) {
  return once(PinnedViewsActions.update);
});
/**
 * Adapted from crm_ui/views/FilterViewsListing
 */

export var saveDefaultPinnedViews = function saveDefaultPinnedViews(defaultView, objectType) {
  if (defaultView) {
    var defaultPinned = List([ViewIdMapping.get(defaultView.id), ViewIdMapping.get('my'), ViewIdMapping.get('unassigned')]);
    updatePinned(objectType)(objectType, defaultPinned);
  }
};