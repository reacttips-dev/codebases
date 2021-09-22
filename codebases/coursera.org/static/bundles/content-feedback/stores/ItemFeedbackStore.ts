/**
 * Store for managing item-level feedback.
 * @type {FluxibleStore}
 */
import FlagFeedback from 'bundles/content-feedback/models/FlagFeedback';

import LikeFeedback from 'bundles/content-feedback/models/LikeFeedback';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';

const ItemFeedbackStore = createStore({
  storeName: 'ItemFeedbackStore',

  initialize() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    this.likeFeedback = new LikeFeedback(0, false);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    this.dislikeFeedback = new LikeFeedback(0, false);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 7 arguments, but got 1.
    this.flagFeedback = new FlagFeedback(false);
    this.itemId = undefined;
  },

  getLikeFeedback() {
    return this.likeFeedback;
  },

  getDislikeFeedback() {
    return this.dislikeFeedback;
  },

  getFlagFeedback() {
    return this.flagFeedback;
  },

  getItemId() {
    return this.itemId;
  },
});

ItemFeedbackStore.handlers = {
  RECEIVE_FEEDBACK(action: $TSFixMe, actionName: $TSFixMe) {
    const { likeFeedback, flagFeedback } = action;

    if (likeFeedback) {
      if (likeFeedback.isDislike) {
        this.dislikeFeedback = likeFeedback;
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        this.likeFeedback = new LikeFeedback(0, false);
      } else {
        this.likeFeedback = likeFeedback;
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        this.dislikeFeedback = new LikeFeedback(0, false);
      }
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      this.likeFeedback = new LikeFeedback(0, false);
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      this.dislikeFeedback = new LikeFeedback(0, false);
    }

    if (flagFeedback) {
      this.flagFeedback = flagFeedback;
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 7 arguments, but got 1.
      this.flagFeedback = new FlagFeedback(false);
    }

    this.itemId = action.itemId;

    this.emitChange();
  },

  RECEIVE_LIKE({ likeFeedback }: $TSFixMe, actionName: $TSFixMe) {
    this.likeFeedback = likeFeedback;
    this.emitChange();
  },

  RECEIVE_DISLIKE({ dislikeFeedback }: $TSFixMe, actionName: $TSFixMe) {
    this.dislikeFeedback = dislikeFeedback;
    this.emitChange();
  },

  RECEIVE_FLAG({ flagFeedback }: $TSFixMe, actionName: $TSFixMe) {
    this.flagFeedback = flagFeedback;
    this.emitChange();
  },
};

export default ItemFeedbackStore;
