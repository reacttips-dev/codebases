'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record, OrderedSet, fromJS } from 'immutable';
import Raven from 'Raven';
import { formatTweet, processMessageContent } from '../../lib/utils';
import { ACCOUNT_TYPES, MEDIA_TYPE, NETWORK_IDS } from '../../lib/constants';
import { fixEntity } from './StreamItem';
import Media from './Media';
import TwitterStatus from './TwitterStatus';
import Broadcast from './Broadcast';
var DEFAULTS = {
  foreignId: null,
  broadcastGuid: null,
  broadcast: null,
  userDetails: null,
  remoteUserId: null,
  feedkey: null,
  url: null,
  timestamp: null,
  type: null,
  network: null,
  body: null,
  photoUrl: null,
  channelName: null,
  broadcastMediaType: null,
  fileId: null,
  name: null,
  screenName: null,
  urlEntities: null,
  // note: not immutable
  media: null,
  quotedStatus: null,
  userMentions: null
}; // maps to a 'who' in the feed response or a socialItemAction, who share most of the core attrs above

var FeedSubject = /*#__PURE__*/function (_Record) {
  _inherits(FeedSubject, _Record);

  function FeedSubject() {
    _classCallCheck(this, FeedSubject);

    return _possibleConstructorReturn(this, _getPrototypeOf(FeedSubject).apply(this, arguments));
  }

  _createClass(FeedSubject, [{
    key: "getMessageUrl",
    value: function getMessageUrl() {
      if (this.broadcastGuid) {
        return "/publishing/published/view/" + this.broadcastGuid;
      }

      return this.url;
    }
  }, {
    key: "getMessageText",
    value: function getMessageText() {
      if (this.network === ACCOUNT_TYPES.twitter) {
        return formatTweet(this.body, {
          urlEntities: this.urlEntities
        });
      }

      return processMessageContent(this.body, undefined, undefined, this.network);
    }
  }, {
    key: "toTwitterStatus",
    value: function toTwitterStatus() {
      return new TwitterStatus({
        id: this.foreignId,
        createdAt: this.timestamp,
        text: this.body,
        userId: this.remoteUserId,
        name: this.name,
        screenName: this.screenName,
        url: this.url,
        // avatarUrl: this.getAvatarUrl(),
        photoUrl: this.photoUrl
      });
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs.network = NETWORK_IDS[attrs.networkId];

      if (attrs.json) {
        var data = JSON.parse(attrs.json); // does this look like a serialized broadcast

        if (data.broadcastGuid && data.content) {
          attrs.body = data.content.originalBody;
          attrs.broadcastMediaType = data.broadcastMediaType;
          attrs.fileId = data.content.fileId;
          attrs.broadcast = Broadcast.createFrom(data);

          if (data.content.photoUrl) {
            attrs.media = List.of(new Media({
              network: attrs.network,
              type: MEDIA_TYPE.photo,
              thumbUrl: data.content.photoUrl,
              fullUrl: data.content.photoUrl
            }));
          }
        } else if (data.tweet) {
          // if not, a serialized tweet status ?
          if (attrs.broadcastGuid) {
            // lb todo - safely handle possibility of having a serialized tweet broadcastGuid, which is now possible due to a fix in TCPS
            // right now this possibility confuses the feed actions/components
            // eslint-disable-next-line no-console
            console.warn('Deleting broadcastGuid from a FeedSubject json which ahs a tweet, as to not expect an entire serialized broadcast', data);
            delete attrs.broadcastGuid;
          }

          attrs.name = data.tweet.user.name;
          attrs.screenName = data.tweet.user.screenName;
          attrs.urlEntities = [];

          if (data.tweet.urlentities && data.tweet.urlentities.length) {
            // go from camelCase to snake_case so twitter-text can autoLinkEntities
            attrs.urlEntities = data.tweet.urlentities.map(fixEntity);
          }

          if (data.tweet.mediaEntities && data.tweet.mediaEntities.length) {
            attrs.photoUrl = data.tweet.mediaEntities[0].mediaURLHttps;
            attrs.body = attrs.body.replace(data.tweet.mediaEntities[0].text, '');
            attrs.urlEntities = attrs.urlEntities || [];
            attrs.urlEntities = attrs.urlEntities.concat(data.tweet.mediaEntities.map(fixEntity));
          }

          if (data.tweet.userMentionEntities) {
            attrs.userMentions = OrderedSet(data.tweet.userMentionEntities.map(function (e) {
              return e.text;
            }));
          }

          try {
            attrs.media = Media.createFromStreamItem(attrs);
          } catch (e) {
            Raven.captureMessage("failed to parse media for stream item: " + this.id);
          }

          if (data.tweet.quotedStatus) {
            attrs.quotedStatus = TwitterStatus.createFrom(data.tweet.quotedStatus);
            var entity = attrs.urlEntities.find(function (e) {
              return e.expandedURL === attrs.quotedStatus.url;
            });

            if (entity) {
              // TODO: starting in June 2018, Twitter is no longer including the URL in text (can probably remove this replace soon): https://twittercommunity.com/t/updating-how-urls-are-rendered-in-the-quote-tweet-payload/105473
              attrs.body = attrs.body.replace(entity.text, '');
            }
          }
        }

        if (data.sourceUser) {
          attrs.userDetails = fromJS(data.sourceUser);
        }
      }

      return new FeedSubject(attrs);
    }
  }]);

  return FeedSubject;
}(Record(DEFAULTS));

export { FeedSubject as default };