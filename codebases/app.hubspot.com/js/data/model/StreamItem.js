'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, OrderedMap, OrderedSet, Set as ImmutableSet, Record } from 'immutable';
import TwitterText from 'twitter-text';
import Raven from 'Raven';
import FeedUser from './FeedUser';
import SocialItemAction from './SocialItemAction';
import TwitterStatus from './TwitterStatus';
import Media from './Media';
import UserLookup from './UserLookup';
import { formatTweet } from '../../lib/utils';
import { ACCOUNT_TYPES, FEED_ACTION_TYPES, TWITTER_BASE_URL } from '../../lib/constants';
import { fixEntity } from './Interaction';
var DEFAULTS = {
  id: null,
  resourceId: null,
  streamGuid: null,
  avatarUrl: null,
  photoUrl: null,
  originalText: null,
  createdAt: null,
  userIdString: null,
  name: null,
  displayName: null,
  userName: null,
  retweet: null,
  retweeter: null,
  isReply: null,
  actions: List(),
  ancestors: List(),
  ancestorsLoaded: false,
  urlEntities: null,
  // note: not immutable
  media: null,
  quotedStatus: null
};
export { fixEntity } from './Interaction';

var StreamItem = /*#__PURE__*/function (_Record) {
  _inherits(StreamItem, _Record);

  function StreamItem() {
    _classCallCheck(this, StreamItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(StreamItem).apply(this, arguments));
  }

  _createClass(StreamItem, [{
    key: "isFavorited",
    value: function isFavorited(channelId) {
      var _this = this;

      var lastAction = this.actions.filter(function (action) {
        return [FEED_ACTION_TYPES.FAVORITE, FEED_ACTION_TYPES.UNFAVORITE].includes(action.type) && action.childForeignId === _this.resourceId && action.remoteUserIdOfActor === channelId;
      }).last();
      return lastAction ? lastAction.type === FEED_ACTION_TYPES.FAVORITE : false;
    }
  }, {
    key: "isRetweeted",
    value: function isRetweeted(channelId) {
      var _this2 = this;

      var lastAction = this.actions.filter(function (action) {
        return [FEED_ACTION_TYPES.RETWEET, FEED_ACTION_TYPES.UNRETWEET].includes(action.type) && action.parentId === _this2.resourceId && action.remoteUserIdOfActor === channelId;
      }).last();
      return lastAction ? lastAction.type === FEED_ACTION_TYPES.RETWEET : false;
    }
  }, {
    key: "hasReplied",
    value: function hasReplied() {
      return this.actions.some(function (action) {
        return action.type === FEED_ACTION_TYPES.REPLY;
      });
    }
  }, {
    key: "getUserMentionEntities",
    value: function getUserMentionEntities() {
      return ImmutableSet([this.userName]).concat(TwitterText.extractMentions(this.originalText));
    }
  }, {
    key: "getNetworkUrl",
    value: function getNetworkUrl() {
      return TWITTER_BASE_URL + "/" + this.userName + "/status/" + this.resourceId;
    }
  }, {
    key: "getAvatarUrl",
    value: function getAvatarUrl() {
      // this seems to 404 less than avatarUrl field, which gets stale
      // return `${TWITTER_BASE_URL}/${this.userName}/profile_image?size=normal`;
      return this.avatarUrl;
    }
  }, {
    key: "getMessageText",
    value: function getMessageText() {
      var messageTextOptions = {
        urlEntities: this.urlEntities
      };
      return formatTweet(this.originalText, messageTextOptions);
    }
  }, {
    key: "getUserLookups",
    value: function getUserLookups() {
      var lookups = OrderedSet.of(new UserLookup({
        network: ACCOUNT_TYPES.twitter,
        id: this.userIdString,
        name: this.name,
        username: this.userName
      }));

      if (this.retweeter) {
        lookups = lookups.add(new UserLookup({
          network: ACCOUNT_TYPES.twitter,
          id: this.retweeter.get('userId'),
          username: this.retweeter.get('displayName'),
          name: this.retweeter.get('name')
        }));
      }

      if (this.quotedStatus) {
        lookups = lookups.add(new UserLookup({
          network: ACCOUNT_TYPES.twitter,
          id: this.quotedStatus.userId,
          username: this.quotedStatus.screenName,
          name: this.quotedStatus.name
        }));
      }

      return lookups;
    }
  }, {
    key: "toFeedUser",
    value: function toFeedUser() {
      // in Monitoring we have to open the ProfilePanel with info from Streams, as it may not exist in Intel
      return new FeedUser({
        network: ACCOUNT_TYPES.twitter,
        twitter_details: ImmutableMap({
          id: this.userIdString,
          name: this.name,
          displayName: this.displayName,
          profile_image_url_https: this.avatarUrl
        })
      });
    }
  }, {
    key: "toRetweetedItem",
    value: function toRetweetedItem() {
      return new StreamItem(Object.assign({}, this.retweeter.toJS(), {}, {
        userIdString: this.retweeter.get('userId')
      }));
    }
  }, {
    key: "toTwitterStatus",
    value: function toTwitterStatus() {
      return new TwitterStatus({
        id: this.resourceId,
        createdAt: this.createdAt,
        text: this.originalText,
        userId: this.userIdString,
        name: this.displayName,
        screenName: this.userName,
        url: this.getNetworkUrl(),
        avatarUrl: this.getAvatarUrl(),
        photoUrl: this.photoUrl
      });
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs, streamGuid) {
      attrs.streamGuid = streamGuid;

      if (attrs.actions) {
        attrs.actions = SocialItemAction.createFromArrayForStream(attrs.actions);
      }

      attrs.urlEntities = attrs.urlEntities || [];

      try {
        attrs.media = Media.createFromStreamItem(attrs);
      } catch (e) {
        Raven.captureMessage("failed to parse media for stream item: " + this.id);
      }

      if (attrs.urlEntities.length) {
        // go from camelCase to snake_case so twitter-text can autoLinkEntities
        attrs.urlEntities = attrs.urlEntities.map(fixEntity);

        if (attrs.urlEntities[0].expandedURL.match(/instagram.com\/p/)) {
          attrs.photoUrl = attrs.urlEntities[0].expandedURL + "media?size=l";
        } else if (attrs.urlEntities[0].expandedURL.match(/http:\/\/youtu.be\//)) {
          var videoId = attrs.urlEntities[0].expandedURL.replace('http://youtu.be/', '').split('?')[0];
          attrs.photoUrl = "https://i1.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
        }
      }

      if (attrs.mediaEntities && attrs.mediaEntities.length) {
        attrs.urlEntities = attrs.urlEntities.concat(attrs.mediaEntities.map(fixEntity));
        attrs.photoUrl = attrs.mediaEntities[0].mediaURLHttps;
        attrs.originalText = attrs.originalText.replace(attrs.mediaEntities[0].text, '');
      }

      if (attrs.retweeter) {
        attrs.retweeter = ImmutableMap(attrs.retweeter);
      }

      if (attrs.quotedStatus) {
        attrs.quotedStatus = TwitterStatus.createFrom(attrs.quotedStatus);
        var entity = attrs.urlEntities.find(function (e) {
          return e.expandedURL === attrs.quotedStatus.url;
        });

        if (entity) {
          // TODO: starting in June 2018, Twitter is no longer including the URL in text (can probably remove this replace soon): https://twittercommunity.com/t/updating-how-urls-are-rendered-in-the-quote-tweet-payload/105473
          attrs.originalText = attrs.originalText.replace(entity.text, '');
        }
      }

      return new StreamItem(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data, streamGuid) {
      return OrderedMap(data.map(function (attrs) {
        return StreamItem.createFrom(attrs, streamGuid);
      }).map(function (i) {
        return [i.id, i];
      }));
    }
  }]);

  return StreamItem;
}(Record(DEFAULTS));

export { StreamItem as default };