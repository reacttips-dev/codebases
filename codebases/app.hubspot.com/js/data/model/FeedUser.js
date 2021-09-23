'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _NETWORK_TO_DETAILS_A;

import { List, Map as ImmutableMap, Record, fromJS } from 'immutable';
import I18n from 'I18n';
import { getNetworkProfileLink } from '../../lib/utils';
import { ACCOUNT_TYPES } from '../../lib/constants';
import Contact from './Contact';
var DEFAULTS = {
  network: null,
  // possible the user represents more than one network, not always right to depend on
  contact: null,
  // optional property Map
  possibleContacts: List(),
  twitter_details: null,
  // network specific Maps, usually from SocialIntel
  facebook_details: null,
  linkedin_details: null,
  fullcontact_details: null,
  twitterProfile: null,
  // twitter4J Status map
  facebookProfile: null,
  tweets: null,
  interactions: null,
  // ES interactions, usually transformed from SocialItemActions of stream matches
  interactionCount: null,
  interactionDetails: null
};
export var NETWORK_TO_DETAILS_ATTR = (_NETWORK_TO_DETAILS_A = {}, _defineProperty(_NETWORK_TO_DETAILS_A, ACCOUNT_TYPES.twitter, 'twitter_details'), _defineProperty(_NETWORK_TO_DETAILS_A, ACCOUNT_TYPES.facebook, 'facebook_details'), _defineProperty(_NETWORK_TO_DETAILS_A, ACCOUNT_TYPES.linkedin, 'linkedin_details'), _NETWORK_TO_DETAILS_A); // maps most closely to socialIntel profile, meaning it can represent the same person across networks.
// but also can contain a contact or details from ES interaction userMap, or munging of the 3

var FeedUser = /*#__PURE__*/function (_Record) {
  _inherits(FeedUser, _Record);

  function FeedUser() {
    _classCallCheck(this, FeedUser);

    return _possibleConstructorReturn(this, _getPrototypeOf(FeedUser).apply(this, arguments));
  }

  _createClass(FeedUser, [{
    key: "getDetails",
    value: function getDetails() {
      var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.network;
      return this[NETWORK_TO_DETAILS_ATTR[network]];
    }
  }, {
    key: "getUserId",
    value: function getUserId() {
      if (this.interactionDetails) {
        return this.interactionDetails.get('networkUserId');
      }

      if (this.twitterProfile) {
        // todo make sure we get this when we lookup by username
        return this.twitterProfile.get('idString') || this.twitterProfile.get('id').toString();
      }

      if (this.network === 'email' && this.contact) {
        return this.contact.email;
      }

      var id = (this.getDetails() || ImmutableMap()).get('id');

      if (id) {
        return id;
      }

      if (this.fullcontact_details) {
        var twitterProfile = this.fullcontact_details.get('socialProfiles').find(function (p) {
          return p.get('typeId') === ACCOUNT_TYPES.twitter;
        });

        if (twitterProfile) {
          return twitterProfile.get('id');
        }
      }

      return null;
    }
  }, {
    key: "getUsername",
    value: function getUsername() {
      var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.network;

      if (this.interactionDetails) {
        return this.interactionDetails.get('username');
      }

      var details = this.getDetails(network) || ImmutableMap();
      var username = details.get('username') || details.get('screenname');

      if (username) {
        return username;
      }

      if (this.contact) {
        return this.contact.properties.get('twitterhandle');
      }

      if (this.fullcontact_details) {
        var twitterProfile = this.fullcontact_details.get('socialProfiles').find(function (p) {
          return p.get('typeId') === ACCOUNT_TYPES.twitter;
        });

        if (twitterProfile) {
          return twitterProfile.get('username');
        }
      }

      return null;
    }
  }, {
    key: "getName",
    value: function getName() {
      var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.network;

      if ((!network || network === 'email') && this.contact) {
        return this.contact.getName();
      }

      if (this.interactionDetails) {
        return this.interactionDetails.get('displayName');
      } else if (this.twitterProfile) {
        return this.twitterProfile.get('name');
      }

      var details = this.getDetails(network) || ImmutableMap();

      if (details.get('first_name') && details.get('last_name')) {
        if (details.get('first_name') === 'private' && details.get('last_name') === 'private') {
          return I18n.text('sui.interactions.linkedinUnkown');
        }

        return details.get('first_name') + " " + details.get('last_name');
      }

      return details.get('name') || I18n.text('sui.interactions.unknown');
    }
  }, {
    key: "getProfileImage",
    value: function getProfileImage() {
      var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.network;

      if (this.twitterProfile) {
        return this.twitterProfile.get('profileImageURLHttps').replace('_normal.jpg', '.jpg');
      }

      if (this.interactionDetails) {
        var profileImage = this.interactionDetails.get('profileImage'); // these are tiny by default

        if (profileImage && profileImage.startsWith('https://graph.facebook.com/')) {
          return profileImage + "?width=320&height=320";
        }

        return profileImage;
      }

      var details = this.getDetails(network) || ImmutableMap();
      var url = details.get('profile_image_url_https') || details.get('profile_image_url');
      return url && url.replace('_normal.jpg', '.jpg').replace('_normal.jpeg', '.jpeg');
    }
  }, {
    key: "getProfileLink",
    value: function getProfileLink() {
      var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.network;

      if (network === ACCOUNT_TYPES.twitter && this.twitterProfile) {
        return getNetworkProfileLink(ACCOUNT_TYPES.twitter, this.twitterProfile.get('id'), this.twitterProfile.get('screenName'));
      }

      if (network === ACCOUNT_TYPES.facebook && this.facebookProfile) {
        if (this.facebookProfile.get('data').get('link')) {
          return this.facebookProfile.get('data').get('link');
        }

        return getNetworkProfileLink(ACCOUNT_TYPES.facebook, this.facebookProfile.get('data').get('id'), this.facebookProfile.get('data').get('username'));
      }

      if (this.interactionDetails && this.interactionDetails.get('socialNetwork') && this.interactionDetails.get('socialNetwork').toLowerCase() === network) {
        if (this.interactionDetails.get('profileUrl')) {
          return this.interactionDetails.get('profileUrl');
        }

        return getNetworkProfileLink(network, this.getUserId());
      }

      var details = this.getDetails(network);

      if (!details) {
        return null;
      }

      return getNetworkProfileLink(network, this.getUserId(), this.getUsername(network)) || details.get('url') || details.get('profile_url');
    }
  }, {
    key: "getUrlKey",
    value: function getUrlKey() {
      var userId = this.getUserId();
      var network = this.network;

      if (!userId && this.contact) {
        network = ACCOUNT_TYPES.twitter;
        userId = this.contact.properties.get('hs_twitterid') || this.contact.properties.get('twitterhandle');
      }

      return network + ":" + userId;
    }
  }, {
    key: "hasIntel",
    value: function hasIntel() {
      return Boolean(this.get(this.network + "_details")) || this.contact && (this.contact.properties.get('twitterhandle') || this.contact.properties.get('hs_twitterid'));
    }
  }, {
    key: "isPage",
    value: function isPage() {
      // use this until type is exposed on normalized interactions
      return Boolean(this.interactionDetails && this.interactionDetails.get('username'));
    }
  }], [{
    key: "parseFromIntelBatch",
    // the top-level of fullIntelligenceResponse or social feeds intelMap
    value: function parseFromIntelBatch(data, network) {
      var attrs = Object.assign({}, data.social.profile, {
        contact: data.contact && Contact.createFrom(data.contact),
        interactionCount: data.socialInteractionTotals && data.socialInteractionTotals.interactions
      });

      if (network) {
        attrs.network = network;
      }

      return new FeedUser(fromJS(attrs));
    } // the social profile within these batches above, beware of some strange casing differences

  }, {
    key: "parseFromProfile",
    value: function parseFromProfile(attrs) {
      if (attrs.twitterDetails) {
        attrs.network = ACCOUNT_TYPES.twitter;
        attrs.twitter_details = attrs.twitterDetails;
      }

      return new FeedUser(fromJS(attrs));
    }
  }, {
    key: "fromChannel",
    value: function fromChannel(channel) {
      return new FeedUser({
        network: channel.accountSlug,
        interactionDetails: ImmutableMap({
          username: channel.username,
          displayName: channel.name,
          avatarUrl: channel.avatarUrl,
          profileImage: channel.avatarUrl,
          // todo try to consolidate with avatarUrl
          networkUserId: channel.channelId,
          profileUrl: channel.profileUrl
        })
      });
    }
  }, {
    key: "fromInteraction",
    value: function fromInteraction(interaction) {
      return new FeedUser({
        network: interaction.socialNetwork,
        interactionDetails: interaction.user
      });
    }
  }]);

  return FeedUser;
}(Record(DEFAULTS));

export { FeedUser as default };