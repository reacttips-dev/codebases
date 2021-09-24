'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, Record } from 'immutable';
import I18n from 'I18n';
import { ACCOUNT_TYPES, INTERACTION_TYPES, INTERACTION_TYPE_TO_CATEGORY, TWITTER_BASE_URL, NETWORK_IDS, FEED_ACTION_TYPES, getAppRoot, FACEBOOK_BASE_URL } from '../../lib/constants';
var DEFAULTS = {
  key: null,
  portalId: null,
  socialNetwork: null,
  interactionType: null,
  reactionType: null,
  interactionDate: null,
  user: ImmutableMap(),
  content: null,
  // for when we translate SM interactions to these interactions
  foreignId: null,
  parentInteractionForeignId: null,
  likeCount: null,
  actorUser: null,
  feedUser: null,
  body: null,
  streamName: null,
  renderContext: ImmutableMap(),
  children: null,
  metadata: ImmutableMap()
};
var FACEBOOK_REACTION_PREFIX = 'FACEBOOK_REACT_'; // these can be done from within HS

var ACTION_TYPES = ['FAVORITE', 'UNFAVORITE', 'RETWEET', 'UNRETWEET', 'FOLLOW', 'UNFOLLOW', 'REPLY'];
var METADATA_DEFAULTS = {
  mediaEntities: [],
  urlEntities: []
}; // go from camelCase to snake_case so twitter-text can autoLinkEntities

export function fixEntity(entity) {
  entity.display_url = entity.displayURL;
  entity.expanded_url = entity.expandedURL;
  entity.indices = [entity.start, entity.end];
  return entity;
}

function tryParseJson(json) {
  var orElse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  try {
    return JSON.parse(json);
  } catch (e) {
    return orElse;
  }
}

function parseTwitterMetadata(attrsMetadata) {
  var metadata = ImmutableMap(METADATA_DEFAULTS);

  if (attrsMetadata.urlentities) {
    metadata = metadata.set('urlEntities', tryParseJson(attrsMetadata.urlentities).map(fixEntity));
  }

  if (attrsMetadata.mediaEntities) {
    var mediaEntities = tryParseJson(attrsMetadata.mediaEntities).map(fixEntity);
    metadata = metadata.set('urlEntities', metadata.get('urlEntities').concat(mediaEntities)).set('mediaEntities', mediaEntities);
  }

  return metadata;
}

var Interaction = /*#__PURE__*/function (_Record) {
  _inherits(Interaction, _Record);

  function Interaction() {
    _classCallCheck(this, Interaction);

    return _possibleConstructorReturn(this, _getPrototypeOf(Interaction).apply(this, arguments));
  }

  _createClass(Interaction, [{
    key: "getUsername",
    value: function getUsername() {
      return this.user.get('screenName') || this.user.get('username');
    }
  }, {
    key: "getFullName",
    value: function getFullName() {
      // present for normalized interactions
      if (!this.user || this.user.isEmpty() || this.user.get('name') === 'private private') {
        return I18n.text('sui.interactions.linkedinUnkown');
      }

      if (this.feedUser) {
        return this.feedUser.getName();
      }

      return this.user.get('displayName') || this.user.get('name');
    }
  }, {
    key: "getUserId",
    value: function getUserId() {
      return this.user && (this.user.get('id') || this.user.get('networkUserId') || this.user.get('socialUserId'));
    }
  }, {
    key: "getInteractionCategory",
    value: function getInteractionCategory() {
      return INTERACTION_TYPE_TO_CATEGORY[this.interactionType];
    }
  }, {
    key: "getInteractionCategoryOverride",
    value: function getInteractionCategoryOverride() {
      if (this.isTwitterReply()) {
        return 'reply';
      }

      return INTERACTION_TYPE_TO_CATEGORY[this.interactionType];
    }
  }, {
    key: "getInteractionCategoryDisplayName",
    value: function getInteractionCategoryDisplayName() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return I18n.text("sui.interactions.types." + this.getInteractionCategoryOverride() + ".label", {
        count: count
      });
    }
  }, {
    key: "getInteractionTypeDisplayName",
    value: function getInteractionTypeDisplayName() {
      if (this.interactionType === 'FACEBOOK_REACT_OTHER') {
        return this.reactionType;
      }

      if ([INTERACTION_TYPES.FACEBOOK_LIKE, INTERACTION_TYPES.FACEBOOK_REACT_LIKE].includes(this.interactionType)) {
        return I18n.text('sui.interactions.reactions.like.label', {
          count: 1
        });
      }

      var simpleType = this.interactionType.replace(FACEBOOK_REACTION_PREFIX, '').toLowerCase();
      return I18n.text("sui.interactions.reactions." + simpleType + ".label");
    }
  }, {
    key: "isFacebookReaction",
    value: function isFacebookReaction() {
      return this.interactionType.startsWith(FACEBOOK_REACTION_PREFIX);
    }
  }, {
    key: "isFacebookLike",
    value: function isFacebookLike() {
      return [INTERACTION_TYPES.FACEBOOK_LIKE, INTERACTION_TYPES.FACEBOOK_REACT_LIKE].includes(this.interactionType);
    }
  }, {
    key: "isTwitterReply",
    value: function isTwitterReply() {
      return [INTERACTION_TYPES.TWITTER_REPLY, 'TWITTER_COMMENT'].includes(this.interactionType);
    }
  }, {
    key: "getProfileImage",
    value: function getProfileImage() {
      var _this = this;

      if (!this.user) {
        return null;
      } // normalized: `profileImage`, fallbacks can be removed when prod deploy is stable


      var possibleImageAttrs = ['profileImage', 'picture', 'profileImageURLHttps', 'image', 'profilePictureUrl'];
      var foundAttr = possibleImageAttrs.find(function (attr) {
        return _this.user.get(attr);
      });
      return this.user.get(foundAttr);
    }
  }, {
    key: "getProfileLink",
    value: function getProfileLink() {
      if (!this.user) {
        return null;
      }

      if (this.socialNetwork === ACCOUNT_TYPES.facebook && this.getUserId()) {
        if (this.isPage()) {
          return FACEBOOK_BASE_URL + "/" + this.getUserId();
        } else {
          // no longer possible to link to users profiles with app scoped ids
          return null;
        }
      } // cannot figure out how to link to linkedin profile, this base url + user id almost works http://www.linkedin.com/profile/view?id=
      // some discussion at http://stackoverflow.com/questions/11296262/derive-linkedin-profile-url-from-user-id


      return this.user.get('url') || this.user.get('profileUrl');
    }
  }, {
    key: "getMessageUrl",
    value: function getMessageUrl() {
      if (this.socialNetwork === ACCOUNT_TYPES.twitter && this.foreignId) {
        if ([FEED_ACTION_TYPES.NEW_BROADCAST, FEED_ACTION_TYPES.SHARED].includes(this.interactionType)) {
          return "/" + getAppRoot() + "/" + this.portalId + "/publishing/view/" + this.foreignId;
        }

        var userName = this.user.get('username') || this.user.get('networkUserId');
        return TWITTER_BASE_URL + "/" + userName + "/status/" + this.foreignId;
      }

      return null;
    }
  }, {
    key: "getPhotoUrl",
    value: function getPhotoUrl() {
      return this.hasPhoto() ? this.metadata.get('mediaEntities')[0].mediaURLHttps : '';
    }
  }, {
    key: "hasPhoto",
    value: function hasPhoto() {
      return Boolean(this.socialNetwork === ACCOUNT_TYPES.twitter && this.metadata.get('mediaEntities') && this.metadata.get('mediaEntities').length && this.metadata.get('mediaEntities')[0].mediaURLHttps);
    }
  }, {
    key: "isPage",
    value: function isPage() {
      // use this until type is exposed on normalized interactions
      return this.user.get('type') === 'page';
    }
  }, {
    key: "supportsClickableProfile",
    value: function supportsClickableProfile() {
      return this.getUserId() && (this.socialNetwork === ACCOUNT_TYPES.twitter || this.socialNetwork === ACCOUNT_TYPES.facebook && this.isPage());
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs instanceof Interaction) {
        return attrs;
      }

      if (attrs.socialNetwork) {
        attrs.socialNetwork = attrs.socialNetwork.toLowerCase();
      }

      attrs.user = ImmutableMap(attrs.user || {});

      if (attrs.actorUser) {
        attrs.actorUser = ImmutableMap(attrs.actorUser);
      }

      if (attrs.body) {
        attrs.body = ImmutableMap(attrs.body);
      }

      if (attrs.metadata) {
        attrs.metadata = parseTwitterMetadata(attrs.metadata);
      }

      return new Interaction(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      // seem to always be in newest-first order, so reversing for chronological display
      return new List(data.map(Interaction.createFrom)).sortBy(function (i) {
        return -i.interactionDate;
      }).reverse();
    } // these can be either a stream_item_action row if action was from within HS, or a SocialHistory hbase entry,
    // see https://git.hubteam.com/HubSpot/SocialMonitoring/blob/master/SocialMonitoringData/src/main/java/com/hubspot/socialmonitoring/services/SocialInteractionsService.java#L39

  }, {
    key: "createFromMonitoringInteraction",
    value: function createFromMonitoringInteraction(data, network, networkIntel, channels) {
      var user = networkIntel.get(data.remoteUserId); // attempt to extract the id of the message is available.  some legacy interactions do not have childForeignId

      data.foreignId = data.childForeignId;

      if (!data.foreignId && data.socialItemId && data.type !== 'FOLLOW') {
        data.foreignId = data.socialItemId.split('_')[0];
      }

      if (data.body && data.body.id) {
        data.foreignId = data.body.id.split('_')[0];
      }

      data.interactionDate = data.timestamp || data.createdAt;
      data.socialNetwork = NETWORK_IDS[data.networkId];

      if (!data.socialNetwork) {
        data.socialNetwork = network;
      }

      data.interactionType = data.type;
      data.content = data.text;

      if (data.message && data.message.startsWith('mentioned @')) {
        data.accountName = data.message.replace('mentioned @', '');
      }

      var channel = channels.find(function (c) {
        return c.username === data.accountName || data.remoteUserId && c.channelId === data.remoteUserId.replace('Page:', '');
      });

      if (channel) {
        data.actorUser = {
          username: channel.username,
          id: channel.channelId
        };
      }

      if (data.accountName) {
        data.user = {
          username: data.accountName
        };
      } else if (ACTION_TYPES.includes(data.interactionType)) {
        data.interactionType = "YOU_" + data.interactionType;
        user = networkIntel.get(data.remoteUserIdOfActedUpon);
      }

      if (user) {
        data.user = {
          username: user.getUsername()
        };
      }

      if (data.body) {
        data.foreignId = data.body.resourceId;

        if (data.body.retweeter) {
          data.user = Object.assign({}, data.user, {}, {
            avatarUrl: data.body.retweeter.avatarUrl,
            networkUserId: data.body.retweeter.userId,
            username: data.body.retweeter.displayName,
            displayName: data.body.retweeter.name
          });
        } else if (data.interactionType !== 'MATCH_STREAM_MENTION') {
          data.user = Object.assign({}, data.user, {}, {
            networkUserId: data.body.userIdString,
            username: data.body.userName,
            displayName: data.body.name
          });
        }
      }

      return Interaction.createFrom(data);
    }
  }]);

  return Interaction;
}(Record(DEFAULTS));

export { Interaction as default };