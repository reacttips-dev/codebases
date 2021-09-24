'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, OrderedSet, Record, fromJS } from 'immutable';
import { identity } from 'underscore';
import { ACCOUNT_TYPES, FEED_INTERACTION_TYPES, NETWORK_IDS } from '../../lib/constants';
import { fixEntity } from './StreamItem';
import Media from './Media';
import FeedUser from './FeedUser';
import { formatTweet, logError, processMessageContent } from '../../lib/utils';
var DEFAULTS = {
  type: null,
  network: null,
  // foreign user id who action was performed on (or on an entity they own)
  remoteUserId: null,
  // similar to above but can be prefixed with a type for FB pages, etc
  remoteUserIdOfActor: null,
  remoteUserName: null,
  // foreign user id of who the action was done on behalf of
  remoteUserIdOfActedUpon: null,
  // foreign id of the message
  childForeignId: null,
  // for retweets, the id of the original message; only use this when that distinction matters (otherwise it equals childForeignId)
  parentId: null,
  timestamp: null,
  // text only applies to replies and comments
  text: null,
  userMentions: List(),
  // only applies to twitter replies
  urlEntities: null,
  photoUrl: null,
  media: null,
  likeCount: null,
  isChild: false,
  isLast: false,
  isSocialItemAction: null,
  user: null,
  children: List()
}; // maps to a 'who' in the feed response or a socialItemAction, who share most of the core attrs above

var FeedEvent = /*#__PURE__*/function (_Record) {
  _inherits(FeedEvent, _Record);

  function FeedEvent() {
    _classCallCheck(this, FeedEvent);

    return _possibleConstructorReturn(this, _getPrototypeOf(FeedEvent).apply(this, arguments));
  }

  _createClass(FeedEvent, [{
    key: "getMessageText",
    value: function getMessageText() {
      if (this.network === ACCOUNT_TYPES.twitter) {
        return formatTweet(this.text, {
          urlEntities: this.urlEntities
        });
      }

      return processMessageContent(this.text, undefined, undefined, this.network);
    }
  }], [{
    key: "parseFrom",
    value: function parseFrom(itemData, _ref) {
      var parentId = _ref.parentId,
          interactionType = _ref.interactionType;
      var attrs = Object.assign({}, itemData);
      attrs.network = NETWORK_IDS[attrs.networkId];
      attrs.userMentions = OrderedSet.of(attrs.remoteUserName);

      if (itemData.json) {
        var jsonData = JSON.parse(itemData.json);

        if (jsonData) {
          if (jsonData.tweet) {
            attrs.parentId = jsonData.tweet.inReplyToStatusId !== -1 ? jsonData.tweet.inReplyToStatusIdString : parentId;
            attrs.isChild = parentId !== attrs.parentId && parentId !== attrs.childForeignId;
            attrs.userMentions = attrs.userMentions.concat(jsonData.tweet.userMentionEntities.map(function (e) {
              return e.text;
            }));
            attrs.urlEntities = [];
            attrs.text = jsonData.tweet.text;

            if (jsonData.tweet.urlentities && jsonData.tweet.urlentities.length) {
              attrs.urlEntities = jsonData.tweet.urlentities.map(fixEntity);
            }

            if (jsonData.tweet.mediaEntities && jsonData.tweet.mediaEntities.length) {
              attrs.photoUrl = jsonData.tweet.mediaEntities[0].mediaURLHttps;
              attrs.urlEntities = attrs.urlEntities.concat(jsonData.tweet.mediaEntities.map(fixEntity));
            }

            attrs.likeCount = jsonData.tweet.favoriteCount;

            try {
              attrs.media = Media.createFromStreamItem(jsonData.tweet);
            } catch (e) {
              logError(e);
            }

            attrs.user = new FeedUser(fromJS({
              network: attrs.network,
              twitter_details: {
                id: jsonData.tweet.user.idString || jsonData.tweet.user.id,
                name: jsonData.tweet.user.name,
                username: jsonData.tweet.user.screenName,
                profile_image_url_https: jsonData.tweet.user.profileImageURLHttps
              }
            }));
          } else if (jsonData.message) {
            attrs.text = jsonData.message;
          }
        }

        if (jsonData.likes) {
          attrs.likeCount = jsonData.likes;
        }
      } else if (attrs.network === ACCOUNT_TYPES.twitter && interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS) {
        // eslint-disable-next-line no-console
        console.warn('Missing JSON for twitter conversation FeedEvent, skipping', itemData);
        return null;
      }

      if (attrs.createdAt && !attrs.timestamp) {
        attrs.timestamp = attrs.createdAt;
      }

      return new FeedEvent(attrs);
    }
  }, {
    key: "parseFromArray",
    value: function parseFromArray(data) {
      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return List(data.map(function (e) {
        return FeedEvent.parseFrom(e, attrs);
      }).filter(identity).map(function (e) {
        if (!e.parentId && attrs.parentId) {
          e = e.set('parentId', attrs.parentId);
        }

        return e;
      })).sortBy(function (e) {
        return e.timestamp;
      });
    }
  }]);

  return FeedEvent;
}(Record(DEFAULTS));

export { FeedEvent as default };