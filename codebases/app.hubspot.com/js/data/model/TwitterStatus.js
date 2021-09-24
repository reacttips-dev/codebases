'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record } from 'immutable';
import { pick } from 'underscore';
import Raven from 'Raven';
import { fixEntity } from './StreamItem';
import FeedUser from './FeedUser';
import Media from './Media';
import { ACCOUNT_TYPES, TWITTER_BASE_URL } from '../../lib/constants';
var DEFAULTS = {
  id: null,
  createdAt: null,
  text: null,
  url: null,
  userId: null,
  avatarUrl: null,
  photoUrl: null,
  media: null,
  name: null,
  screenName: null,
  feedUser: null,
  urlEntities: null,
  // note: not immutable
  mediaEntities: null // note: not immutable

}; // maps to a 'who' in the feed response or a socialItemAction, who share most of the core attrs above

var TwitterStatus = /*#__PURE__*/function (_Record) {
  _inherits(TwitterStatus, _Record);

  function TwitterStatus() {
    _classCallCheck(this, TwitterStatus);

    return _possibleConstructorReturn(this, _getPrototypeOf(TwitterStatus).apply(this, arguments));
  }

  _createClass(TwitterStatus, [{
    key: "getUser",
    value: function getUser() {
      return new FeedUser({
        network: ACCOUNT_TYPES.twitter,
        twitter_details: ImmutableMap({
          id: this.userId
        })
      });
    }
  }], [{
    key: "createFrom",
    value: function createFrom(data) {
      var attrs = pick(data, 'text', 'createdAt', 'mediaEntities');
      attrs = Object.assign({}, attrs, {}, pick(data.user, 'name', 'screenName'));
      attrs = Object.assign({}, attrs, {}, {
        id: data.idString || data.id,
        userId: data.user.idString || data.user.id,
        avatarUrl: data.user.profileImageURLHttps,
        urlEntities: data.urlentities.map(fixEntity).concat(data.mediaEntities.map(fixEntity))
      });
      attrs.url = TWITTER_BASE_URL + "/" + data.user.screenName + "/status/" + attrs.id;

      if (data.mediaEntities.length) {
        attrs.photoUrl = data.mediaEntities.length && data.mediaEntities[0].mediaURLHttps;
        attrs.text = attrs.text.replace(data.mediaEntities[0].text, '');
      }

      try {
        attrs.media = Media.createFromStreamItem(attrs);
      } catch (e) {
        Raven.captureMessage("failed to parse media for status id: " + attrs.id);
      }

      return new TwitterStatus(attrs);
    }
  }, {
    key: "createFromBroadcast",
    value: function createFromBroadcast(broadcast) {
      return new TwitterStatus({
        id: broadcast.content.get('quotedStatusId'),
        url: broadcast.content.get('quotedStatusUrl'),
        name: broadcast.content.get('quotedStatusName'),
        screenName: broadcast.content.get('quotedStatusScreenName'),
        text: broadcast.content.get('quotedStatusText')
      });
    }
  }]);

  return TwitterStatus;
}(Record(DEFAULTS));

export { TwitterStatus as default };