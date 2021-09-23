'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { clone } from 'underscore';
import { FEED_ACTION_TYPES } from '../../lib/constants';
import SocialItemAction from '../../data/model/SocialItemAction';

var BroadcastFeedSubject = /*#__PURE__*/function (_Record) {
  _inherits(BroadcastFeedSubject, _Record);

  function BroadcastFeedSubject() {
    _classCallCheck(this, BroadcastFeedSubject);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastFeedSubject).apply(this, arguments));
  }

  _createClass(BroadcastFeedSubject, null, [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs = clone(attrs);
      return new BroadcastFeedSubject(attrs);
    }
  }]);

  return BroadcastFeedSubject;
}(Record({
  foreignId: null,
  remoteUserId: null
}));

var DEFAULTS = {
  feedKey: null,
  interactions: null,
  network: null,
  socialItemActions: null,
  subject: null
}; // This is a temp model to simulate the FeedItem so we can pass this around
// instead.  The goal is to eventually remove FeedItem and use Interactions
// and SocialActionItems exclusively.

var BroadcastFeedItem = /*#__PURE__*/function (_Record2) {
  _inherits(BroadcastFeedItem, _Record2);

  function BroadcastFeedItem() {
    _classCallCheck(this, BroadcastFeedItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastFeedItem).apply(this, arguments));
  }

  _createClass(BroadcastFeedItem, [{
    key: "isFavorited",
    value: function isFavorited(childForeignId) {
      if (!this.socialItemActions) {
        return false;
      }

      var lastAction = this.socialItemActions.filter(function (action) {
        return [FEED_ACTION_TYPES.FAVORITE, FEED_ACTION_TYPES.UNFAVORITE].includes(action.type) && action.childForeignId === childForeignId;
      }).last();
      return lastAction && lastAction.type === FEED_ACTION_TYPES.FAVORITE;
    }
  }, {
    key: "isRetweeted",
    value: function isRetweeted(childForeignId) {
      if (!this.socialItemActions) {
        return false;
      }

      var lastAction = this.socialItemActions.filter(function (action) {
        return [FEED_ACTION_TYPES.RETWEET, FEED_ACTION_TYPES.UNRETWEET].includes(action.type) && action.parentId === childForeignId;
      }).last();
      return lastAction && lastAction.type === FEED_ACTION_TYPES.RETWEET;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs = clone(attrs);
      attrs.subject = BroadcastFeedSubject.createFrom(attrs.subject);

      if (attrs.socialItemActions) {
        attrs.socialItemActions = SocialItemAction.createFromArray(attrs.socialItemActions, {
          parentId: attrs.subject.foreignId,
          network: attrs.network
        });
      }

      return new BroadcastFeedItem(attrs);
    }
  }]);

  return BroadcastFeedItem;
}(Record(DEFAULTS));

export { BroadcastFeedItem as default };