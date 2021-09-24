'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, OrderedMap, Record, Set as ImmutableSet } from 'immutable';
import { clone } from 'underscore';
import { CHANNEL_TYPES, CHANNEL_PICKER_ACCOUNT_TYPES_SORTED, PUBLISHABLE_CHANNEL_TYPES, NETWORK_CHANNEL_TYPES, NETWORK_CHANNEL_TO_ACCOUNT_TYPES, FACEBOOK_PAGE_TASKS, getAccountColor as _getAccountColor, getAccountIcon, getAccountDisplayName as _getAccountDisplayName, getChannelDisplayName, ACCOUNT_LONG_EXPIRED_DAYS, TWITTER_PUBLISH_ANYWHERE_OPTIONS } from '../../lib/constants';
import { rpad } from '../../lib/utils';
import I18n from 'I18n';
var DEFAULTS = {
  key: null,
  channelKey: null,
  channelSlug: null,
  channelId: null,
  parentId: null,
  accountSlug: null,
  active: null,
  shared: null,
  hidden: null,
  name: null,
  username: null,
  avatarUrl: null,
  profileUrl: null,
  type: null,
  createdAt: null,
  accountGuids: null,
  settings: ImmutableMap(),
  pageLocation: ImmutableMap(),
  // these are not actual attributes but tacked on by the UI
  accountServiceId: null,
  accountName: null,
  accountExpired: null,
  accountExpiredAt: null,
  accountUserName: null,
  owned: null,
  autoPublishBlogIds: ImmutableSet(),
  // does not come from backend, attached by UI to simplify model
  userCanConfigure: null,
  userCanPublish: null,
  userCanDraft: null,
  userCanShare: null,
  hasReportingData: null,
  facebookPageTasks: ImmutableSet(),
  publishingErrors: ImmutableSet(),
  willExpireSoon: null,
  accountExpiresAt: null,
  requiresOneOffPermissionReconnect: null,
  missingScopes: ImmutableSet()
};

var Channel = /*#__PURE__*/function (_Record) {
  _inherits(Channel, _Record);

  function Channel() {
    _classCallCheck(this, Channel);

    return _possibleConstructorReturn(this, _getPrototypeOf(Channel).apply(this, arguments));
  }

  _createClass(Channel, [{
    key: "getLogicalKey",
    value: function getLogicalKey() {
      return this.channelKey;
    }
  }, {
    key: "getSortKey",
    value: function getSortKey() {
      var parts = [CHANNEL_PICKER_ACCOUNT_TYPES_SORTED.indexOf(this.accountSlug)];
      parts.push(rpad(this.name.substr(0, 10), ' ', 10));
      return parts.join('-');
    }
  }, {
    key: "canPublish",
    value: function canPublish() {
      return PUBLISHABLE_CHANNEL_TYPES.includes(this.channelSlug);
    }
  }, {
    key: "supportsAutoPublish",
    value: function supportsAutoPublish() {
      return ![CHANNEL_TYPES.instagram, CHANNEL_TYPES.youtube].includes(this.channelSlug);
    }
  }, {
    key: "matchesQuery",
    value: function matchesQuery(query) {
      return this.name.toLowerCase().includes(query.toLowerCase()) || this.accountUserName && this.accountUserName.toLowerCase().includes(query.toLowerCase());
    }
  }, {
    key: "getDisplayName",
    value: function getDisplayName() {
      var plural = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return getChannelDisplayName(this.channelSlug, plural);
    }
  }, {
    key: "getAccountDisplayName",
    value: function getAccountDisplayName() {
      return _getAccountDisplayName(this.accountSlug);
    }
  }, {
    key: "getActualAccountType",
    value: function getActualAccountType() {
      // undo the faked "network channel type" we do to make channels act as account types
      return NETWORK_CHANNEL_TO_ACCOUNT_TYPES[this.accountSlug] || this.accountSlug;
    }
  }, {
    key: "getIconName",
    value: function getIconName() {
      return getAccountIcon(this.accountSlug);
    }
  }, {
    key: "getAccountColor",
    value: function getAccountColor() {
      return _getAccountColor(this.accountSlug);
    }
  }, {
    key: "getAvatarUrl",
    value: function getAvatarUrl() {
      if (this.avatarUrl && this.channelSlug === CHANNEL_TYPES.linkedinstatus) {
        return this.avatarUrl.replace('%3F', '?');
      }

      return this.avatarUrl;
    }
  }, {
    key: "isPageTaskCompliant",
    value: function isPageTaskCompliant() {
      if (this.channelSlug === CHANNEL_TYPES.instagram || this.channelSlug === CHANNEL_TYPES.facebookpage) {
        if (this.facebookPageTasks.isEmpty()) {
          return true;
        }

        return this.facebookPageTasks.includes(FACEBOOK_PAGE_TASKS.CREATE_CONTENT);
      }

      return true;
    }
  }, {
    key: "getCanBeConnected",
    value: function getCanBeConnected() {
      return this.isPageTaskCompliant() && this.missingScopes.isEmpty();
    }
  }, {
    key: "getPublishAnywhereSetting",
    value: function getPublishAnywhereSetting() {
      return this.settings.get('publishAnywhere');
    }
  }, {
    key: "isPublishAnywhereDataSource",
    value: function isPublishAnywhereDataSource() {
      // linkedinstatus is never publishAnywhere
      if (this.channelSlug === CHANNEL_TYPES.linkedinstatus) {
        return false;
      } else if (this.channelSlug === CHANNEL_TYPES.twitter) {
        // twitter depends on the channel setting, consider it PA unless its been explicitly disabled though
        return this.settings.get('publishAnywhere') !== TWITTER_PUBLISH_ANYWHERE_OPTIONS.DISABLED;
      } // other channelTypes are always PA for time being


      return true;
    }
  }, {
    key: "getReportingDataSourceLabel",
    value: function getReportingDataSourceLabel() {
      if (this.isPublishAnywhereDataSource()) {
        return 'allSources';
      }

      return 'hubspotOnly';
    }
  }, {
    key: "isLongExpired",
    value: function isLongExpired() {
      var compareTo = I18n.moment().subtract(ACCOUNT_LONG_EXPIRED_DAYS, 'days').valueOf();
      return this.accountExpiresAt && this.accountExpiresAt < compareTo;
    }
  }, {
    key: "onlyShowBroadcastDataForReports",
    value: function onlyShowBroadcastDataForReports() {
      // channel is not "publish anywhere" and should only show reporting data for HS published broadcasts
      return this.channelSlug === CHANNEL_TYPES.linkedinstatus || this.settings.get('publishAnywhere') === 'DISABLED';
    }
  }], [{
    key: "createFromDto",
    value: function createFromDto(data) {
      data = Channel.fixChannel(clone(data)); // bending the rules to separate instagram channels into their own account, which works much more easily with how we present them

      if (NETWORK_CHANNEL_TYPES[data.channelSlug]) {
        data.accountSlug = NETWORK_CHANNEL_TYPES[data.channelSlug];
      }

      if (!data.accountSlug) {
        data.accountSlug = data.accountType.toLowerCase();
      } // lb todo - try to make sure backend always provides real settings from back LogicalChannel


      data.settings = ImmutableMap(data.settings || {}); // support v1 channel structure just in case

      if (data.accountGuid) {
        data.accountGuids = [data.accountGuid];
      }

      data.accountGuids = ImmutableSet(data.accountGuids || []);

      if (data.autoPublishBlogIds) {
        data.autoPublishBlogIds = ImmutableSet(data.autoPublishBlogIds);
      } // support v1 channel structure just in case


      if (!data.username && data.userName) {
        data.username = data.userName;
      }

      if (data.channelSlug === CHANNEL_TYPES.instagram || data.channelSlug === CHANNEL_TYPES.facebookpage) {
        data.facebookPageTasks = ImmutableSet(data.facebookPageTasks);
      }

      data.settings = data.settings || {};
      data.missingScopes = ImmutableSet(data.missingScopes);
      data.pageLocation = ImmutableMap(data.pageLocation);
      return new Channel(data);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(channels) {
      channels = List(channels.map(Channel.createFromDto)).sortBy(function (c) {
        return c.name + " - " + c.username;
      });
      return Channel.createFromRecords(channels);
    }
  }, {
    key: "createFromRecords",
    value: function createFromRecords(channels) {
      return OrderedMap(channels.map(function (c) {
        return [c.channelKey, c];
      }));
    }
  }, {
    key: "fixChannel",
    value: function fixChannel(channelData) {
      if (channelData.avatarUrl) {
        if (channelData.avatarUrl.startsWith('https:https:')) {
          channelData.avatarUrl = channelData.avatarUrl.replace('https:https:', 'https:');
        } else if (channelData.avatarUrl.startsWith('https::')) {
          channelData.avatarUrl = channelData.avatarUrl.replace('https::', 'https:');
        }
      }

      return channelData;
    }
  }, {
    key: "searchChannels",
    value: function searchChannels(channelList, query) {
      if (query) {
        return channelList.filter(function (c) {
          return c.matchesQuery(query);
        });
      }

      return channelList;
    }
  }]);

  return Channel;
}(Record(DEFAULTS));

export { Channel as default };