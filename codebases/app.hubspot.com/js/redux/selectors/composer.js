'use es6';

import { createSelector } from 'reselect';
import { createTruthySelector } from 'truthy-selector';
import { OrderedMap } from 'immutable';
import { COMPOSER_MODES } from '../../lib/constants';
import Broadcast from '../../data/model/Broadcast';
import { getBroadcastGroup, getUi, getUploads } from '../selectors';
export var getMessageIndex = function getMessageIndex(state, index) {
  return index;
};
export var getMessage = createSelector([getBroadcastGroup, getMessageIndex], function (broadcastGroup, index) {
  return broadcastGroup.messages.get(index);
}); // show just the times of the other broadcasts in the group for minimal updates

export var broadcastTimes = createTruthySelector([getBroadcastGroup], function (bg) {
  return OrderedMap(bg.messages.filter(function (m) {
    return m.broadcast.triggerAt;
  }).map(function (m) {
    var broadcastBrief = Broadcast.createFrom({
      broadcastGuid: m.uid,
      triggerAt: m.broadcast.triggerAt,
      content: {
        body: m.broadcast.content.get('body')
      }
    });
    return [m.uid, broadcastBrief];
  }));
});
export var getIsBlogAutoPublish = createSelector([getBroadcastGroup], function (broadcastGroup) {
  return Boolean(broadcastGroup && broadcastGroup.blogPost);
});
export var getComposerMode = createSelector([getUi], function (ui) {
  return ui.get('composerMode') || COMPOSER_MODES.create;
});
export var getCanDeleteMessage = createSelector([getIsBlogAutoPublish, getComposerMode, getUploads], function (isBlogAutoPublish, composerMode, uploads) {
  return !isBlogAutoPublish && composerMode === COMPOSER_MODES.create && !(uploads && uploads.size);
});