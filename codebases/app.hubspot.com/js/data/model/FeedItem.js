'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record, fromJS } from 'immutable';
import { clone, identity } from 'underscore';
import { ACCOUNT_TYPES, CHANNEL_TYPES, FEED_ACTION_TYPES, FEED_INTERACTION_TYPES, FEED_ITEM_SUBJECT_TYPES, INTERACTION_TYPES, DEFERRED_CHANNEL_NETWORKS, getNetworkFromChannelKey } from '../../lib/constants';
import FeedSubject from './FeedSubject';
import FeedEvent from './FeedEvent';
import SocialItemAction from './SocialItemAction';
import LogicalChannel from './Channel';
import UserLookup from './UserLookup';
import FeedUser from './FeedUser';
var DEFAULTS = {
  network: null,
  accountGuid: null,
  channelKeyList: List(),
  createdAt: null,
  updatedAt: null,
  feedKey: null,
  id: null,
  interactionType: null,
  socialItemActions: List(),
  readAt: null,
  // comes from item.whos/whats
  subject: null,
  file: null,
  events: List(),
  users: List(),
  interactions: null,
  interactionTotals: null,
  whoCount: null,
  isLoading: false,
  hasTruncatedWhos: null,
  socialReportingPost: List() // needs to be added as a default since it returns an error when added on the fly

};

function getIntelForUserId(networkIntel, remoteUserId) {
  return networkIntel.get(remoteUserId) || networkIntel.get("Page:" + remoteUserId);
}

var FeedItem = /*#__PURE__*/function (_Record) {
  _inherits(FeedItem, _Record);

  function FeedItem() {
    _classCallCheck(this, FeedItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(FeedItem).apply(this, arguments));
  }

  _createClass(FeedItem, [{
    key: "getType",
    value: function getType() {
      return this.feedKey.split('-')[0];
    }
  }, {
    key: "isFavorited",
    value: function isFavorited(childForeignId) {
      var lastAction = this.socialItemActions.filter(function (action) {
        return [FEED_ACTION_TYPES.FAVORITE, FEED_ACTION_TYPES.UNFAVORITE].includes(action.type) && action.childForeignId === childForeignId;
      }).last();
      return lastAction && lastAction.type === FEED_ACTION_TYPES.FAVORITE;
    }
  }, {
    key: "isRetweeted",
    value: function isRetweeted(childForeignId) {
      var lastAction = this.socialItemActions.filter(function (action) {
        return [FEED_ACTION_TYPES.RETWEET, FEED_ACTION_TYPES.UNRETWEET].includes(action.type) && action.parentId === childForeignId;
      }).last();
      return lastAction && lastAction.type === FEED_ACTION_TYPES.RETWEET;
    }
  }, {
    key: "getComments",
    value: function getComments() {
      var _this = this;

      if (!this.events || !this.events.size) {
        return List();
      }

      var comments = this._getEventsForParentId(this.subject.foreignId);

      comments = comments.map(function (e) {
        return e.set('children', _this._getEventsForParentId(e.childForeignId));
      });
      return comments.isEmpty() ? comments : comments.setIn([comments.size - 1, 'isLast'], true);
    }
  }, {
    key: "_getEventsForParentId",
    value: function _getEventsForParentId(parentId) {
      var _this2 = this;

      // the broadcast itself ends up in whos, for twitter,
      var comments = this.events.filter(function (e) {
        return e.childForeignId !== _this2.subject.foreignId && e.parentId === parentId;
      });
      var actionComments = this.socialItemActions.filter(function (a) {
        return a.type === FEED_ACTION_TYPES.REPLY && !comments.find(function (e) {
          return e.childForeignId === a.childForeignId;
        }) && a.parentId === parentId;
      }).map(function (a) {
        return a.toFeedEvent();
      });
      return comments.concat(actionComments).sortBy(function (e) {
        return e.timestamp;
      });
    }
  }, {
    key: "_getInteractionsForParentId",
    value: function _getInteractionsForParentId(parentId) {
      var _this3 = this;

      // the broadcast itself ends up in whos, for twitter,
      var comments = this.interactions.filter(function (i) {
        return i.parentInteractionForeignId === parentId;
      });
      var actionComments = this.socialItemActions.filter(function (a) {
        // matches the passed parentId, or if none passed belongs to this feedItem's subject
        var actionIsForParent = a.parentId === parentId || !parentId && (!a.parentId || a.parentId === _this3.subject.foreignId);
        return a.type === FEED_ACTION_TYPES.REPLY && actionIsForParent && !comments.find(function (i) {
          return i.foreignId === a.childForeignId;
        });
      }).map(function (a) {
        return a.toInteraction();
      });
      return comments.concat(actionComments).sortBy(function (e) {
        return e.interactionDate;
      });
    }
  }, {
    key: "getCommentInteractions",
    value: function getCommentInteractions() {
      var _this4 = this;

      if (!this.interactions) {
        return null;
      }

      var comments = this._getInteractionsForParentId(null);

      if (this.network === ACCOUNT_TYPES.instagram) {
        comments = comments.map(function (i) {
          return i.set('children', _this4._getInteractionsForParentId(i.foreignId));
        });
      }

      return comments.sortBy(function (e) {
        return e.interactionDate;
      });
    }
  }, {
    key: "getUsers",
    value: function getUsers() {
      var _this5 = this;

      // for interactions, trust the ES store if we have loaded them
      if (this.useEsInteractions()) {
        if (!this.interactions) {
          return null;
        }

        return this.getUsersForInteractions(this.interactions);
      }

      var events = this.events;

      if (this.network === ACCOUNT_TYPES.twitter && this.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS) {
        events = this.events.filter(function (e) {
          return e.remoteUserId !== _this5.subject.remoteUserId;
        });
      }

      return events.map(function (e) {
        return e.user;
      }).filter(identity).toOrderedSet().sortBy(function (e) {
        return e.getName();
      });
    }
  }, {
    key: "getUsersForInteractions",
    value: function getUsersForInteractions(interactions) {
      return interactions.filter(function (i) {
        return !i.user.isEmpty();
      }) // remove "out of network" LI users
      .map(function (i) {
        return FeedUser.fromInteraction(i);
      }).toOrderedSet().sortBy(function (i) {
        return i.getName();
      });
    }
  }, {
    key: "getUserLookups",
    value: function getUserLookups() {
      var _this6 = this;

      return this.events.map(function (e) {
        return new UserLookup({
          network: _this6.network,
          id: e.remoteUserId,
          username: e.remoteUserName,
          name: e.user && e.user.getName()
        });
      }).toOrderedSet();
    }
  }, {
    key: "getCount",
    value: function getCount() {
      if (!this.useEsInteractions()) {
        // twitter includes the original tweet author as a who
        if (this.network === ACCOUNT_TYPES.twitter && this.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS) {
          return Math.max(this.whoCount - 1, 1);
        }

        return this.whoCount;
      }

      if (this.interactions) {
        if (this.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS) {
          return this.getCommentInteractions().size;
        }

        return this.interactions.size;
      }

      if (this.subject.broadcast) {
        if (this.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS && this.subject.broadcast.replies) {
          return this.subject.broadcast.replies;
        }

        if (this.interactionType === FEED_INTERACTION_TYPES.INTERACTIONS && this.subject.broadcast.likes) {
          return this.subject.broadcast.likes;
        }
      }

      return null;
    }
  }, {
    key: "getChannelForMention",
    value: function getChannelForMention() {
      var event = this.events.first();
      return LogicalChannel.createFromDto({
        accountType: ACCOUNT_TYPES.twitter,
        channelSlug: CHANNEL_TYPES.twitter,
        name: event.user.getName(),
        userName: event.user.getUsername(),
        avatarUrl: event.user.getProfileImage(),
        profileUrl: event.user.getProfileLink()
      });
    }
  }, {
    key: "getSubjectType",
    value: function getSubjectType() {
      switch (this.subject.type) {
        case INTERACTION_TYPES.FACEBOOK_LIKE:
          return 'reaction';

        case INTERACTION_TYPES.LINKEDIN_LIKE:
          return 'like';

        case INTERACTION_TYPES.FACEBOOK_COMMENT:
        case INTERACTION_TYPES.INSTAGRAM_COMMENT:
        case INTERACTION_TYPES.LINKEDIN_COMMENT:
          return 'comment';

        case INTERACTION_TYPES.TWITTER_RETWEET:
          return 'retweet';

        case INTERACTION_TYPES.TWITTER_REPLY:
          return 'reply';

        case INTERACTION_TYPES.TWITTER_MENTION:
          return 'mention';

        case INTERACTION_TYPES.TWITTER_FOLLOWER:
          return 'follower';

        default:
          return this.subject.type;
      }
    }
  }, {
    key: "useEsInteractions",
    value: function useEsInteractions() {
      // wait for ES interactions to load and defer to those for everything but twitter conversations
      if (this.network === ACCOUNT_TYPES.twitter) {
        if (this.subject.type === INTERACTION_TYPES.TWITTER_RETWEET) {
          return Boolean(this.subject.broadcastGuid);
        }

        return false;
      }

      return true;
    }
  }, {
    key: "supportsProfilePanel",
    value: function supportsProfilePanel() {
      return [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin].includes(this.network);
    }
  }, {
    key: "isDeferredFetch",
    value: function isDeferredFetch() {
      var subjectTypesComments = List([FEED_ITEM_SUBJECT_TYPES.LINKEDIN_COMMENT, FEED_ITEM_SUBJECT_TYPES.FACEBOOK_COMMENT, FEED_ITEM_SUBJECT_TYPES.INSTAGRAM_COMMENT]);
      var subjectTypesLikes = List([FEED_ITEM_SUBJECT_TYPES.LINKEDIN_LIKE, FEED_ITEM_SUBJECT_TYPES.FACEBOOK_LIKE, FEED_ITEM_SUBJECT_TYPES.INSTAGRAM_LIKE]);
      return subjectTypesComments.includes(this.subject.type) || subjectTypesLikes.includes(this.subject.type) && !this.interactions;
    }
  }, {
    key: "isConversationDeferred",
    value: function isConversationDeferred() {
      return this.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS && DEFERRED_CHANNEL_NETWORKS.includes(this.network);
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs, intelMap, channels) {
      attrs = clone(attrs);
      attrs.channelKeyList = fromJS(attrs.channelKeyList || []);

      if (attrs.channelKeyList.size) {
        attrs.network = getNetworkFromChannelKey(attrs.channelKeyList.first());
      } else if (!attrs.network) {
        attrs.network = attrs.feedKey.split('_')[0].toLowerCase();
      }

      if (attrs.item) {
        attrs.events = FeedEvent.parseFromArray(attrs.item.whos, {
          parentId: attrs.item.what.foreignId,
          interactionType: attrs.interactionType
        });

        if (attrs.network === ACCOUNT_TYPES.twitter && attrs.interactionType === FEED_INTERACTION_TYPES.CONVERSATIONS) {
          if (attrs.events.get(0).remoteUserId !== attrs.item.what.remoteUserId) {
            // the only way there can be a 1 event feedItem is a self-mention
            attrs.item.what.type = FEED_ITEM_SUBJECT_TYPES.TWITTER_MENTION;
          } else if (attrs.events.size === 1) {
            attrs.item.what.type = FEED_ITEM_SUBJECT_TYPES.TWITTER_SELF_MENTION;
          }
        }

        attrs.subject = FeedSubject.createFrom(attrs.item.what);

        if (attrs.socialItemActions) {
          attrs.socialItemActions = SocialItemAction.createFromArray(attrs.socialItemActions, {
            parentId: attrs.item.what.foreignId,
            network: attrs.network,
            userMentions: attrs.subject.userMentions
          });
        }

        var networkIntel = intelMap.getIn(['networks', attrs.network]);

        if (networkIntel) {
          attrs.events = attrs.events.map(function (e) {
            var feedUser = getIntelForUserId(networkIntel, e.remoteUserId);

            if (feedUser) {
              e = e.set('user', feedUser);
            }

            return e;
          });
          attrs.socialItemActions = attrs.socialItemActions.map(function (e) {
            return e.set('user', getIntelForUserId(networkIntel, e.remoteUserId));
          });
        } else if (channels && !attrs.channelKeyList.isEmpty()) {
          var channelType = attrs.channelKeyList.first().split(':')[0];
          attrs.socialItemActions = attrs.socialItemActions.map(function (e) {
            var channel = channels.get(channelType + ":" + e.remoteUserId);

            if (channel) {
              e = e.set('user', FeedUser.fromChannel(channel));
            }

            return e;
          });
        }
      }

      return new FeedItem(attrs);
    }
  }]);

  return FeedItem;
}(Record(DEFAULTS));

export { FeedItem as default };