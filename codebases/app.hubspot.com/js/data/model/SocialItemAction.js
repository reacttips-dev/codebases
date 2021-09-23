'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, OrderedSet, Record, Set as ImmutableSet } from 'immutable';
import FeedEvent from './FeedEvent';
import Interaction from './Interaction';
import { FEED_ACTION_TYPES, NETWORK_IDS } from '../../lib/constants';
var DEFAULTS = {
  socialItemId: null,
  network: null,
  streamItemActionsGuid: null,
  type: null,
  // foreign user id who action was performed on (or on an entity they own)
  remoteUserId: null,
  // similar to above but can be prefixed with a type for FB pages, etc
  remoteUserIdOfActor: null,
  // foreign user id of who the action was done on behalf of
  remoteUserIdOfActedUpon: null,
  // foreign id of the message
  childForeignId: null,
  // for retweets, the id of the original message; only use this when that distinction matters (otherwise it equals childForeignId)
  objectId: null,
  parentId: null,
  createdAt: null,
  updatedAt: null,
  isChild: null,
  // text only applies to replies and comments
  text: null,
  user: null,
  channel: null,
  userMentions: ImmutableSet()
}; // maps to a 'who' in the feed response or a socialItemAction, who share most of the core attrs above

var SocialItemAction = /*#__PURE__*/function (_Record) {
  _inherits(SocialItemAction, _Record);

  function SocialItemAction() {
    _classCallCheck(this, SocialItemAction);

    return _possibleConstructorReturn(this, _getPrototypeOf(SocialItemAction).apply(this, arguments));
  }

  _createClass(SocialItemAction, [{
    key: "toFeedEvent",
    value: function toFeedEvent() {
      var userMentions = ImmutableSet();

      if (!this.userMentions.isEmpty()) {
        userMentions = this.userMentions;
      } else if (this.user) {
        userMentions = OrderedSet.of(this.user.getUsername());
      }

      return new FeedEvent(Object.assign({}, this.toJS(), {
        user: this.user,
        timestamp: this.createdAt,
        isSocialItemAction: true,
        userMentions: userMentions
      }));
    }
  }, {
    key: "toInteraction",
    value: function toInteraction() {
      var interactionType;

      if (this.type === FEED_ACTION_TYPES.REPLY) {
        interactionType = this.network.toUpperCase() + "_COMMENT";
      }

      var interaction = new Interaction({
        interactionType: interactionType,
        user: ImmutableMap(),
        foreignId: this.objectId,
        socialNetwork: this.network,
        interactionDate: this.createdAt,
        content: this.text,
        parentInteractionForeignId: this.parentId,
        isSocialItemAction: true
      });

      if (this.channel) {
        return interaction.set('user', ImmutableMap({
          username: this.channel.username,
          displayName: this.channel.name,
          networkUserId: this.channel.channelId,
          socialNetwork: this.network.toUpperCase(),
          profileImage: this.channel.avatarUrl,
          profileUrl: this.channel.profileUrl
        }));
      }

      if (this.user) {
        return interaction.set('user', ImmutableMap({
          username: this.user.getUsername(),
          displayName: this.user.getName(),
          networkUserId: this.user.getUserId(),
          socialNetwork: this.network.toUpperCase(),
          profileImage: this.user.getProfileImage(),
          profileUrl: this.user.getProfileLink()
        }));
      }

      return interaction;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(data) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          parentId = _ref.parentId,
          network = _ref.network,
          userMentions = _ref.userMentions;

      data.network = network || NETWORK_IDS[data.networkId];
      data.isChild = parentId && data.parentId !== parentId;
      data.userMentions = userMentions;
      return new SocialItemAction(data);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var items = List(data.map(function (a) {
        return SocialItemAction.createFrom(a, opts);
      })).groupBy(function (a) {
        return a.streamItemActionsGuid;
      }).map(function (as) {
        return as.first();
      });
      return items.sortBy(function (a) {
        return a.get('createdAt');
      });
    }
  }, {
    key: "createFromArrayForStream",
    value: function createFromArrayForStream(data) {
      return List(data.map(function (a) {
        return SocialItemAction.createFrom(a);
      })).sortBy(function (a) {
        return a.createdAt;
      });
    }
  }]);

  return SocialItemAction;
}(Record(DEFAULTS));

export { SocialItemAction as default };