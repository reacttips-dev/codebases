'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { OrderedSet } from 'immutable';
import { parse } from 'hub-http/helpers/params';
import { ACCOUNT_TYPES, BROADCAST_ACTION_TYPES, BROADCAST_STATUS, BROADCAST_STATUS_TYPE, CONTENT_TYPE, BROADCAST_MEDIA_TYPE, FACEBOOK_BASE_URL, getNetworkFromChannelKey, CLICK_TRACKING_CHANNEL_TYPES, CHANNEL_TYPE_TO_SOURCES_TYPE, getChannelSlugFromKey, LINKEDIN_MESSAGE_BASE_URL, getClientTagDisplayName, getChannelSlugFromChannelKey } from '../../lib/constants';
import { extractPreviewLinkFromBroadcast } from '../../lib/utils';
import { getThumbnailRedirectUrl } from './FMFile';
export var ERROR_CATEGORY_STATUSES = [BROADCAST_STATUS.BAD_CHANNEL, BROADCAST_STATUS.DUPLICATE, BROADCAST_STATUS.BAD_CREDENTIALS];
export var PROCESSING_CATEGORY_STATUSES = [BROADCAST_STATUS.RUNNING, BROADCAST_STATUS.ERROR_RETRY];

var BroadcastBase = function BroadcastBase(Base) {
  return /*#__PURE__*/function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "getClientLabel",
      value: function getClientLabel() {
        return getClientTagDisplayName(this.clientTag);
      }
    }, {
      key: "getErrorData",
      value: function getErrorData() {
        if (!(this.extraData.errorCode || this.extraData.errorSubcode)) {
          return null;
        }

        return {
          apiErrorCode: this.extraData.errorCode,
          apiErrorSubcode: this.extraData.errorSubcode
        };
      }
    }, {
      key: "getImage",
      value: function getImage(thumbSize) {
        var imageUrls = this.getImageUrls(thumbSize);
        return imageUrls.isEmpty() ? null : imageUrls.first();
      }
    }, {
      key: "getThumbnailUrl",
      value: function getThumbnailUrl() {
        return this.getImage('thumb');
      }
    }, {
      key: "getImageUrls",
      value: function getImageUrls(thumbSize) {
        if (this.extraData && this.extraData.hasPhotos() && !this.isUploaded()) {
          return this.extraData.getPhotos().map(function (file) {
            return getThumbnailRedirectUrl(file.get('id'), thumbSize);
          }).valueSeq().toOrderedSet();
        } // fileId should generally be stored for single photo and video posts and if so prefer it via the /thumbnail-redirect endpoint
        // UPLOADED broadcasts have file id -1 in the content blob and extraData.files as the urls are not yet uploaded to file manager, so the redirect url will not work


        if (this.content.get('fileId') && !this.isUploaded()) {
          return OrderedSet.of(getThumbnailRedirectUrl(this.content.get('fileId'), thumbSize));
        } else {
          // ideally this fallback is only covering link preview posts and we have moved to the extraData.files
          return OrderedSet.of(this.content.get('photoUrl') || this.content.get('imageUrl'));
        }
      }
    }, {
      key: "getStatusType",
      value: function getStatusType() {
        if (PROCESSING_CATEGORY_STATUSES.includes(this.status)) {
          return BROADCAST_STATUS_TYPE.pending;
        } else if (this.status.toLowerCase().includes('error') || ERROR_CATEGORY_STATUSES.includes(this.status)) {
          return BROADCAST_STATUS_TYPE.failed;
        } else if (this.status === BROADCAST_STATUS.DRAFT) {
          return BROADCAST_STATUS_TYPE.draft;
        } else if ([BROADCAST_STATUS.WAITING, BROADCAST_STATUS.NEEDSLINKSHRUNK].includes(this.status)) {
          return BROADCAST_STATUS_TYPE.scheduled;
        } else if (this.status === BROADCAST_STATUS.UPLOADED) {
          return BROADCAST_STATUS_TYPE.uploaded;
        } else if (this.status === BROADCAST_STATUS.CANCELED) {
          return BROADCAST_STATUS_TYPE.canceled;
        }

        return BROADCAST_STATUS_TYPE.published;
      }
    }, {
      key: "getMessageUrl",
      value: function getMessageUrl() {
        if (!this.channelKey && this.messageUrl) {
          return this.messageUrl;
        }

        var network = getNetworkFromChannelKey(this.channelKey);

        if (network === ACCOUNT_TYPES.facebook && !this.messageUrl) {
          var channelId = this.channelKey.split(':')[1];
          return FACEBOOK_BASE_URL + "/" + channelId + "/posts/" + this.foreignId;
        } else if (network === ACCOUNT_TYPES.linkedin && this.messageUrl) {
          var params = parse(this.messageUrl.split('?')[1]);

          if (params.topic) {
            return "" + LINKEDIN_MESSAGE_BASE_URL + params.topic + "/";
          }
        }

        return this.messageUrl;
      }
    }, {
      key: "getBodyForEditing",
      value: function getBodyForEditing() {
        if (this.extraData && this.extraData.body) {
          return this.extraData.body;
        } // TODO remove once we get rid of content


        return this.content.get('originalBody') || this.content.get('body') || '';
      }
    }, {
      key: "getNetwork",
      value: function getNetwork() {
        return getNetworkFromChannelKey(this.channelKey);
      }
    }, {
      key: "getChannelId",
      value: function getChannelId() {
        return this.channelKey.split(':')[1];
      }
    }, {
      key: "getChannelSlug",
      value: function getChannelSlug() {
        return getChannelSlugFromChannelKey(this.channelKey);
      }
    }, {
      key: "getPublishTime",
      value: function getPublishTime() {
        if (this.isPublished() || this.isFailed()) {
          return this.finishedAt || this.triggerAt;
        }

        return this.triggerAt;
      }
    }, {
      key: "getSourcesChannelId",
      value: function getSourcesChannelId() {
        // corresponds with Channel.Type.analyticsChannelType, used for the ?hss_channel tracking param
        if (!CHANNEL_TYPE_TO_SOURCES_TYPE[this.getChannelSlug()]) {
          return null;
        }

        return CHANNEL_TYPE_TO_SOURCES_TYPE[this.getChannelSlug()] + "-" + this.getChannelId();
      }
    }, {
      key: "getValidActions",
      value: function getValidActions() {
        var options = [];
        var broadcastStatusType = this.getStatusType();

        if (broadcastStatusType !== BROADCAST_STATUS_TYPE.uploaded) {
          options.push(BROADCAST_ACTION_TYPES.CLONE);
        }

        if (this.canBeEdited()) {
          options.push(BROADCAST_ACTION_TYPES.EDIT);
        }

        if (this.canDelete()) {
          options.push(BROADCAST_ACTION_TYPES.DELETE);
        }

        if (this.getMessageUrl() && this.isPublished()) {
          options.push(BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK);
        }

        if (broadcastStatusType === BROADCAST_STATUS_TYPE.scheduled) {
          options.push(BROADCAST_ACTION_TYPES.MAKE_DRAFT);
        }

        if (this.getNetwork() === ACCOUNT_TYPES.facebook && this.isPublished()) {
          options.push(BROADCAST_ACTION_TYPES.BOOST);
        }

        return options;
      }
    }, {
      key: "getChannelKey",
      value: function getChannelKey() {
        return this.channelKey;
      }
    }, {
      key: "hasTargetOptions",
      value: function hasTargetOptions() {
        return !this.targetLocations.isEmpty() || !this.targetLanguages.isEmpty();
      }
    }, {
      key: "hasImage",
      value: function hasImage() {
        return Boolean(this.getImageUrls());
      }
    }, {
      key: "hasLinkPreview",
      value: function hasLinkPreview() {
        return extractPreviewLinkFromBroadcast(this) && !this.content.get('linkPreviewSuppressed');
      }
    }, {
      key: "hasContent",
      value: function hasContent() {
        return Boolean(this.extraData && this.extraData.body || this.content.get('body'));
      }
    }, {
      key: "hasOriginalLink",
      value: function hasOriginalLink() {
        return Boolean(this.content.get('uncompressedLinks') && !this.content.get('uncompressedLinks').isEmpty() && this.content.get('originalLink'));
      }
    }, {
      key: "hasCustomizedLinkPreview",
      value: function hasCustomizedLinkPreview() {
        return Boolean(this.hasOriginalLink() && this.content.get('fileId') !== null);
      }
    }, {
      key: "hasScraperError",
      value: function hasScraperError() {
        return this.content.get('scraperResult') === 'NOT_FOUND';
      }
    }, {
      key: "isQuoteTweet",
      value: function isQuoteTweet() {
        return Boolean(this.content.get('quotedStatusUrl'));
      }
    }, {
      key: "isCosContent",
      value: function isCosContent() {
        return [CONTENT_TYPE.cosblog, CONTENT_TYPE.coslp].includes(this.remoteContentType);
      }
    }, {
      key: "isDraft",
      value: function isDraft() {
        return this.status === BROADCAST_STATUS.DRAFT;
      }
    }, {
      key: "isEndState",
      value: function isEndState() {
        return [BROADCAST_STATUS_TYPE.published, BROADCAST_STATUS_TYPE.failed].includes(this.getStatusType());
      }
    }, {
      key: "isUploaded",
      value: function isUploaded() {
        return this.getStatusType() === BROADCAST_STATUS_TYPE.uploaded;
      }
    }, {
      key: "isFetched",
      value: function isFetched() {
        // this exists because we need to be able to represent a broadcast who's associated entities (interactions, feed users) have fetched
        // before that broadcast details.  in general only the DetailsContainer and children should see a broadcast like this
        return this.status !== BROADCAST_STATUS.UNKNOWN;
      }
    }, {
      key: "isVideo",
      value: function isVideo() {
        return this.broadcastMediaType === BROADCAST_MEDIA_TYPE.VIDEO;
      }
    }, {
      key: "isCarousel",
      value: function isCarousel() {
        return this.broadcastMediaType === BROADCAST_MEDIA_TYPE.CAROUSEL;
      }
    }, {
      key: "isPhoto",
      value: function isPhoto() {
        return this.broadcastMediaType === BROADCAST_MEDIA_TYPE.PHOTO;
      }
    }, {
      key: "isMultiPhoto",
      value: function isMultiPhoto() {
        return this.isPhoto() && this.extraData.files.size > 1;
      }
    }, {
      key: "isLinkPreview",
      value: function isLinkPreview() {
        return this.broadcastMediaType === BROADCAST_MEDIA_TYPE.NONE && this.hasLinkPreview();
      }
    }, {
      key: "isMultiMedia",
      value: function isMultiMedia() {
        return this.isMultiPhoto();
      }
    }, {
      key: "isAnimatedGif",
      value: function isAnimatedGif() {
        return this.broadcastMediaType === BROADCAST_MEDIA_TYPE.ANIMATED_GIF;
      }
    }, {
      key: "canBeEdited",
      value: function canBeEdited() {
        var postTypeCanBeEdited = [BROADCAST_STATUS_TYPE.scheduled, BROADCAST_STATUS_TYPE.draft, BROADCAST_STATUS_TYPE.uploaded].includes(this.getStatusType());

        if (this.channel) {
          return postTypeCanBeEdited && (this.channel.userCanPublish || this.channel.userCanDraft && this.isDraft());
        }

        return postTypeCanBeEdited;
      }
    }, {
      key: "isScheduled",
      value: function isScheduled() {
        // currently we have a fair amount of broadcasts left running
        return [BROADCAST_STATUS.WAITING, BROADCAST_STATUS.NEEDSLINKSHRUNK].includes(this.status);
      }
    }, {
      key: "isRunning",
      value: function isRunning() {
        // currently we have a fair amount of broadcasts left running
        return [BROADCAST_STATUS.RUNNING].includes(this.status);
      }
    }, {
      key: "isRetrying",
      value: function isRetrying() {
        return this.status === BROADCAST_STATUS.ERROR_RETRY;
      }
    }, {
      key: "isFailed",
      value: function isFailed() {
        return this.getStatusType() === BROADCAST_STATUS_TYPE.failed;
      }
    }, {
      key: "isPublished",
      value: function isPublished() {
        return this.getStatusType() === BROADCAST_STATUS_TYPE.published;
      }
    }, {
      key: "supportsAssists",
      value: function supportsAssists() {
        return this.isPublished();
      }
    }, {
      key: "supportsClicks",
      value: function supportsClicks() {
        return this.isPublished() && CLICK_TRACKING_CHANNEL_TYPES.includes(getChannelSlugFromKey(this.channelKey));
      }
    }, {
      key: "supportsInteractions",
      value: function supportsInteractions() {
        return this.isPublished();
      }
    }, {
      key: "supportsVideoInsights",
      value: function supportsVideoInsights() {
        return this.isVideo() && this.isPublished() && this.getNetwork() === ACCOUNT_TYPES.facebook;
      }
    }, {
      key: "supportsLinkPreviewDescription",
      value: function supportsLinkPreviewDescription() {
        return getNetworkFromChannelKey(this.channelKey) !== ACCOUNT_TYPES.linkedin;
      }
    }, {
      key: "canDelete",
      value: function canDelete() {
        return this.getNetwork() !== ACCOUNT_TYPES.instagram || this.isDraft() || this.isScheduled() || this.isFailed();
      }
    }]);

    return _class;
  }(Base);
};

export default BroadcastBase;