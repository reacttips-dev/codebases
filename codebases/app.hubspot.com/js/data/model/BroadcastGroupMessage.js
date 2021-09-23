'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Set as ImmutableSet, OrderedSet, OrderedMap, List, Map as ImmutableMap } from 'immutable';
import { extractPreviewLinkFromBroadcast, logBreadcrumb, generateUID, getValidUrlsInText } from '../../lib/utils';
import I18n from 'I18n';
import PortalIdParser from 'PortalIdParser';
import { ACCOUNT_TYPES, ACCOUNT_MAX_LENGTHS, ACCOUNT_MAX_LENGTHS_FOR_REPLY, ACCOUNT_MAX_IMAGE_DIMENSIONS_DEFAULT, MAX_IMAGE_BYTES_DEFAULT, MAX_IMAGE_BYTES, BROADCAST_PUBLISH_TYPE, BROADCAST_STATUS, BROADCAST_VALIDATION_ERRORS, BAP_CUSTOMIZATION_APPENDED_CHAR_LENGTH, BROADCAST_MEDIA_TYPE, LINK_IMAGE_URL, PHOTO_URL, COMPOSER_EDITABLE_LINK_PREVIEW_NETWORKS, TWITTER_STATUS_PATTERN, FILE_FROM_URL_ID, SKIP_VIA_USERNAMES, ALLOWED_IMAGE_EXTENSIONS, INSTAGRAM_MAX_HASHTAGS, MAX_SCHEDULE_AHEAD_MONTHS, ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS, COMPOSER_MODES, NETWORKS_ALLOWING_EMPTY_BODY_WITH_VIDEO_FILE } from '../../lib/constants';
import Broadcast from '../../data/model/Broadcast';
import FMFile from './FMFile';
var DEFAULTS = {
  uid: null,
  network: null,
  publishType: null,
  channelKeys: ImmutableSet(),
  // because each message can have multiple channels of the same network while composing
  broadcastGuids: ImmutableSet(),
  // because for a just-persisted group, we need a way to track the created guids
  file: null,
  cosContent: null,
  twitterStatus: null,
  slot: null,
  imageIndex: 0,
  minTriggerAt: 0,
  autoPickSlot: true,
  broadcast: null,
  originalContent: null,
  originalStatus: null,
  originalTriggerAt: null,
  apiErrors: ImmutableSet(),
  isBlogPostAutoPublish: false
};
export var API_ERROR_MAP = {
  imageDownloadFailed: BROADCAST_VALIDATION_ERRORS.imageDownloadFailed,
  INVALID_BODY_LENGTH: BROADCAST_VALIDATION_ERRORS.overCharLimit,
  INVALID_BODY_LENGTH_NETWORK: BROADCAST_VALIDATION_ERRORS.overCharLimitNetwork,
  INVALID_VIDEO_AUDIO_CODEC: BROADCAST_VALIDATION_ERRORS.videoAudioCodec,
  INVALID_VIDEO_CODEC_AUDIO_AAC_EFFICIENCY: BROADCAST_VALIDATION_ERRORS.videoAudioProfile,
  INVALID_VIDEO_CODEC: BROADCAST_VALIDATION_ERRORS.videoCodec,
  INVALID_VIDEO_DIMENSION: BROADCAST_VALIDATION_ERRORS.videoWidthTooLarge,
  INVALID_VIDEO_DURATION: BROADCAST_VALIDATION_ERRORS.videoTooLong,
  INVALID_VIDEO_FRAME_RATE: BROADCAST_VALIDATION_ERRORS.videoFrameRate,
  INVALID_VIDEO_MIN_FRAME_RATE: BROADCAST_VALIDATION_ERRORS.videoMinFrameRate,
  INVALID_VIDEO_SIZE: BROADCAST_VALIDATION_ERRORS.videoSizeTooLarge,
  MISSING_CHANNEL: BROADCAST_VALIDATION_ERRORS.MISSING_CHANNEL,
  UNKNOWN_API_ERROR: BROADCAST_VALIDATION_ERRORS.UNKNOWN_API_ERROR,
  UNSUPPORTED_FILE_FORMAT: BROADCAST_VALIDATION_ERRORS.videoFormat,
  UNSUPPORTED_VIDEO_ASPECT_RATIO: BROADCAST_VALIDATION_ERRORS.videoAspectRatio
};

var BroadcastGroupMessage = /*#__PURE__*/function (_Record) {
  _inherits(BroadcastGroupMessage, _Record);

  function BroadcastGroupMessage() {
    _classCallCheck(this, BroadcastGroupMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastGroupMessage).apply(this, arguments));
  }

  _createClass(BroadcastGroupMessage, [{
    key: "getSummaryText",
    value: function getSummaryText() {
      var timeDisplay = this.broadcast.triggerAt && I18n.moment(this.broadcast.triggerAt).portalTz().format('LLL');
      return I18n.text("sui.composer.success.summary." + this.publishType, {
        timeDisplay: timeDisplay,
        count: this.channelKeys.size
      });
    }
  }, {
    key: "getMaxLength",
    value: function getMaxLength() {
      if (this.publishType === 'comment') {
        return ACCOUNT_MAX_LENGTHS_FOR_REPLY[this.network];
      }

      var limit = ACCOUNT_MAX_LENGTHS[this.network];

      if (this.isBlogPostAutoPublish && this.network === ACCOUNT_TYPES.twitter) {
        return limit - BAP_CUSTOMIZATION_APPENDED_CHAR_LENGTH;
      }

      return limit;
    }
  }, {
    key: "getMaxImageSize",
    value: function getMaxImageSize() {
      return MAX_IMAGE_BYTES[this.network] || MAX_IMAGE_BYTES_DEFAULT;
    }
  }, {
    key: "getMaxImageDimensions",
    value: function getMaxImageDimensions() {
      return ACCOUNT_MAX_IMAGE_DIMENSIONS_DEFAULT;
    }
    /**
     * Gets all allowed file extensions (image and video), given a specific network
     *
     * @returns {Set<string>} A set of all allowed file extensions
     */

  }, {
    key: "getAllowedFileExtensions",
    value: function getAllowedFileExtensions() {
      var allowedVideoExtensions = this.network ? ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS[this.network] : [];
      var allAllowedExtensions = ImmutableSet([].concat(_toConsumableArray(ALLOWED_IMAGE_EXTENSIONS), _toConsumableArray(allowedVideoExtensions))); // Instagram does not support GIFs; if this is Instagram, strip the "gif" type
      // from the list of allowed file extensions

      return this.network === ACCOUNT_TYPES.instagram ? allAllowedExtensions.delete('gif') : allAllowedExtensions;
    }
  }, {
    key: "getPrimaryImage",
    value: function getPrimaryImage() {
      if (this.broadcast && this.broadcast.extraData) {
        return this.broadcast.extraData.getPhotos().first();
      }

      return null;
    }
  }, {
    key: "hasChanges",
    value: function hasChanges() {
      var originalBody = this.originalContent ? this.originalContent.get('originalBody') || this.originalContent.get('body') : null;
      return originalBody ? originalBody !== this.broadcast.content.get('body') : this.broadcast.hasContent();
    }
  }, {
    key: "hasContent",
    value: function hasContent() {
      return this.broadcast.hasContent() || this.isAllowedEmptyBody();
    }
  }, {
    key: "hasLink",
    value: function hasLink() {
      return Boolean(extractPreviewLinkFromBroadcast(this.broadcast));
    }
  }, {
    key: "hasMultipleNewlines",
    value: function hasMultipleNewlines() {
      return this.broadcast.content.get('body').includes('\n\n\n');
    }
  }, {
    key: "hasLinkPreview",
    value: function hasLinkPreview() {
      return Boolean(extractPreviewLinkFromBroadcast(this.broadcast) && !this.broadcast.content.get('linkPreviewSuppressed'));
    }
  }, {
    key: "isAllowedEmptyBody",
    value: function isAllowedEmptyBody() {
      return this.broadcast.broadcastMediaType === BROADCAST_MEDIA_TYPE.PHOTO || this.broadcast.broadcastMediaType === BROADCAST_MEDIA_TYPE.VIDEO && NETWORKS_ALLOWING_EMPTY_BODY_WITH_VIDEO_FILE.includes(this.network);
    }
  }, {
    key: "supportsLinkPreviewEditing",
    value: function supportsLinkPreviewEditing() {
      return COMPOSER_EDITABLE_LINK_PREVIEW_NETWORKS.includes(this.network);
    }
  }, {
    key: "supportsLinkPreviewDescription",
    value: function supportsLinkPreviewDescription() {
      return this.network !== ACCOUNT_TYPES.linkedin;
    }
  }, {
    key: "supportsLinkPreviewSuppression",
    value: function supportsLinkPreviewSuppression() {
      // whether linkPreviewSuppressed works, remnants in code for gplus but seems to only affect FB now
      return this.network === ACCOUNT_TYPES.facebook;
    }
  }, {
    key: "supportsArbitraryLinkImage",
    value: function supportsArbitraryLinkImage() {
      return this.network === ACCOUNT_TYPES.linkedin && this.publishType !== BROADCAST_PUBLISH_TYPE.bap;
    }
  }, {
    key: "isPhoto",
    value: function isPhoto() {
      return Boolean(this.broadcast.content.get('photoUrl'));
    }
  }, {
    key: "isVideo",
    value: function isVideo() {
      return this.broadcast.isVideo();
    }
  }, {
    key: "supportsAttachContent",
    value: function supportsAttachContent() {
      return this.network !== ACCOUNT_TYPES.instagram;
    }
  }, {
    key: "shouldDownloadFile",
    value: function shouldDownloadFile() {
      // we attempt to download photos to FM scraped from page previews, or inserted via URL.
      // the later case show up as a file with id: -1
      return this.isPhoto() && (!this.file || this.file.id === FILE_FROM_URL_ID || this.file.id !== this.broadcast.content.get('fileId'));
    }
  }, {
    key: "primaryUrlInBody",
    value: function primaryUrlInBody() {
      return this.broadcast.content.get('originalLink') && this.broadcast.content.get('body').includes(this.broadcast.content.get('originalLink')) || this.broadcast.content.get('body').includes(this.broadcast.content.get('link'));
    }
  }, {
    key: "supportsLinkPreviewWithoutUrlInBody",
    value: function supportsLinkPreviewWithoutUrlInBody() {
      return [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.linkedin].includes(this.network);
    }
  }, {
    key: "isContentScheduled",
    value: function isContentScheduled() {
      return this.cosContent && this.cosContent.get('state') === 'SCHEDULED';
    }
  }, {
    key: "mergeBroadcastUpdate",
    value: function mergeBroadcastUpdate(attrs) {
      var self = this;

      if (attrs.content) {
        self = self.mergeIn(['broadcast', 'content'], attrs.content);
        delete attrs.content;
      }

      if (attrs.extraData) {
        self = self.mergeIn(['broadcast', 'extraData'], attrs.extraData);
        delete attrs.extraData;
      }

      return self.mergeIn(['broadcast'], attrs);
    }
  }, {
    key: "getExtraData",
    value: function getExtraData(fmFile, opts) {
      var _opts$imageToReplace = opts.imageToReplace,
          imageToReplace = _opts$imageToReplace === void 0 ? null : _opts$imageToReplace,
          _opts$addToMultiImage = opts.addToMultiImage,
          addToMultiImage = _opts$addToMultiImage === void 0 ? false : _opts$addToMultiImage;
      var extraData;

      if (addToMultiImage) {
        if (imageToReplace) {
          extraData = this.broadcast.extraData.replacePhoto(imageToReplace, fmFile);
        } else {
          extraData = this.broadcast.extraData.addPhoto(fmFile);
        }
      }

      if (!addToMultiImage) {
        // Keep extraData limited to 1 file, for consistency
        extraData = this.broadcast.extraData.merge({
          files: OrderedMap(_defineProperty({}, fmFile.id, fmFile))
        });
      }

      return extraData;
    }
  }, {
    key: "getBroadcastUpdate",
    value: function getBroadcastUpdate(fmFile, opts) {
      var broadcast = {};
      var _opts$convertToMediaP = opts.convertToMediaPost,
          convertToMediaPost = _opts$convertToMediaP === void 0 ? true : _opts$convertToMediaP;

      if (fmFile.type === FMFile.TYPES.MOVIE) {
        broadcast.broadcastMediaType = BROADCAST_MEDIA_TYPE.VIDEO;
      }

      if (fmFile.type === FMFile.TYPES.IMG) {
        broadcast.broadcastMediaType = BROADCAST_MEDIA_TYPE.PHOTO;

        if (!convertToMediaPost && this.hasLinkPreview() && this.network !== ACCOUNT_TYPES.instagram) {
          broadcast.broadcastMediaType = BROADCAST_MEDIA_TYPE.NONE;
        }
      }

      if (broadcast.broadcastMediaType !== BROADCAST_MEDIA_TYPE.NONE) {
        broadcast.extraData = this.getExtraData(fmFile, opts);
      }

      return broadcast;
    }
  }, {
    key: "getContentUpdate",
    value: function getContentUpdate(fmFile, opts, broadcast) {
      var content = {
        fileId: fmFile.id
      };
      var _opts$convertToMediaP2 = opts.convertToMediaPost,
          convertToMediaPost = _opts$convertToMediaP2 === void 0 ? true : _opts$convertToMediaP2;

      if (fmFile.type === FMFile.TYPES.MOVIE) {
        content.thumbUrl = fmFile.thumbUrl;

        if (this.network === ACCOUNT_TYPES.instagram) {
          content[PHOTO_URL] = fmFile.url;
        }
      }

      if (fmFile.type === FMFile.TYPES.IMG) {
        if (convertToMediaPost) {
          content[PHOTO_URL] = fmFile.url;
          content[LINK_IMAGE_URL] = null;
        } else {
          content[LINK_IMAGE_URL] = fmFile.url;
        }
      }

      if (broadcast.broadcastMediaType !== BROADCAST_MEDIA_TYPE.NONE) {
        if (!getValidUrlsInText(this.broadcast.content.get('body')).length) {
          content.originalLink = null;
          content.uncompressedLinks = List();
        }

        content[LINK_IMAGE_URL] = null;
      }

      return content;
    }
  }, {
    key: "getMessageUpdate",
    value: function getMessageUpdate(fmFile) {
      var message = {
        file: fmFile,
        apiErrors: ImmutableSet()
      };

      if (fmFile.type === FMFile.TYPES.IMG) {
        message.imageIndex = 0;
      }

      return message;
    }
  }, {
    key: "updateWithFile",
    value: function updateWithFile(fmFile, opts) {
      logBreadcrumb("updateWithFile: " + fmFile.id);
      var broadcastUpdate = this.getBroadcastUpdate(fmFile, opts);
      var messageUpdate = this.getMessageUpdate(fmFile);
      broadcastUpdate.content = this.getContentUpdate(fmFile, opts, broadcastUpdate);
      return this.merge(messageUpdate).mergeBroadcastUpdate(broadcastUpdate);
    }
  }, {
    key: "updateWithPagePreview",
    value: function updateWithPagePreview(page, twitterChannels) {
      var updateAttrs = {
        content: {
          title: page.getTitle(this.network),
          description: page.getDescription(this.network),
          linkPreviewSuppressed: false
        }
      };
      var validImages = page.getValidImages(this.network, false); // if we have already attached this page from the content/blog API, use it as the source of truth instead
      // (for example blog doesn't include hubspotCampaignId)

      if (page.hubspotPortalId === PortalIdParser.get()) {
        if (!this.cosContent || !(this.cosContent.id === page.hubspotContentId)) {
          if (page.hubspotContentId) {
            updateAttrs.remoteContentId = page.hubspotContentId;
          }

          if (page.hubspotCampaignId) {
            updateAttrs.campaignGuid = page.hubspotCampaignId;
          }
        }
      }

      if (!this.isPhoto() && !this.isVideo()) {
        // set image preview to first photo
        if (!validImages.isEmpty() && page.isNetworkValidForPreview(this.network)) {
          updateAttrs.content[LINK_IMAGE_URL] = validImages.first().url;
          updateAttrs.content[PHOTO_URL] = null;
          updateAttrs.content.fileId = null;
        }
      } // if a plain url is entered in a twitter post (or the page title followed by url, as extension or picking a blog post would populate)
      // add the twitter author if there is one


      var title = page.twitterCard && page.twitterCard.get('title') || page.title;

      if (title && this.broadcast.content.get('body').trim() === page.url || this.broadcast.content.get('body').trim() === title + " " + page.url) {
        if (!TWITTER_STATUS_PATTERN.test(page.url)) {
          updateAttrs.content.autoUpdatedBody = title + " " + page.url;

          if (this.network === ACCOUNT_TYPES.twitter && !page.twitterHandles.isEmpty()) {
            updateAttrs.content.autoUpdatedBody = "" + updateAttrs.content.autoUpdatedBody + this.getTwitterAuthorAttribution(page.twitterHandles.first(), twitterChannels);
          }
        }
      }

      return this.mergeBroadcastUpdate(updateAttrs);
    }
  }, {
    key: "clearRemoteContent",
    value: function clearRemoteContent() {
      return this.set('broadcast', this.broadcast.delete('remoteContentId').delete('remoteContentType')).delete('cosContent');
    }
  }, {
    key: "isPublisherTheAuthor",
    value: function isPublisherTheAuthor(twitterHandle, twitterChannels) {
      var _this = this;

      var selectedTwitterChannels = twitterChannels.filter(function (c) {
        return _this.channelKeys.has(c.channelKey);
      });
      return selectedTwitterChannels.map(function (c) {
        return c.username.toLowerCase();
      }).toSet().has(twitterHandle.toLowerCase());
    }
  }, {
    key: "getTwitterAuthorAttribution",
    value: function getTwitterAuthorAttribution(twitterHandle, twitterChannels) {
      if (SKIP_VIA_USERNAMES.includes(twitterHandle.toLowerCase()) || this.isPublisherTheAuthor(twitterHandle, twitterChannels)) {
        return '';
      }

      return " " + I18n.text('sui.composer.body.twitterBy') + " @" + twitterHandle;
    }
  }, {
    key: "updateWithQuotedStatus",
    value: function updateWithQuotedStatus(twitterStatus) {
      return this.set('twitterStatus', twitterStatus).mergeIn(['broadcast', 'content'], {
        // url and id are intentionally omitted since they are wrong due to number overflow
        quotedStatusScreenName: twitterStatus.screenName,
        quotedStatusName: twitterStatus.name,
        quotedStatusAvatarUrl: twitterStatus.avatarUrl,
        quotedStatusPhotoUrl: twitterStatus.photoUrl,
        quotedStatusText: twitterStatus.text,
        quotedStatusCreatedAt: twitterStatus.createdAt
      });
    }
  }, {
    key: "removeQuotedStatus",
    value: function removeQuotedStatus() {
      return this.set('broadcast', this.broadcast.removeQuotedStatus());
    } // in the case that visible accounts/channels change while editing, we need to filter the channels referenced in the message to only this

  }, {
    key: "filterChannels",
    value: function filterChannels(channels) {
      return this.set('channelKeys', this.channelKeys.filter(function (ck) {
        return channels.get(ck);
      }));
    }
  }, {
    key: "validate",
    value: function validate() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
      var errors = ImmutableSet();

      if (this.apiErrors) {
        errors = errors.concat(this.apiErrors.map(function (err) {
          return API_ERROR_MAP[err] || API_ERROR_MAP.UNKNOWN_API_ERROR;
        }));
      }

      if (this.channelKeys.isEmpty()) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.noChannels);
      }

      if (this.broadcast.content.get('charCount') > this.getMaxLength()) {
        if (this.isBlogPostAutoPublish && this.network === ACCOUNT_TYPES.twitter) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.overCharLimitBapTwitter);
        } else {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.overCharLimit);
        }
      }

      if (this.publishType === BROADCAST_PUBLISH_TYPE.schedule) {
        var triggerAtMoment = I18n.moment(this.broadcast.triggerAt).portalTz();

        if (!this.broadcast.triggerAt) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.noTriggerAt);
        } else if (triggerAtMoment.isBefore(I18n.moment().portalTz())) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.inPast);
        } else if (triggerAtMoment.isAfter(I18n.moment().add(MAX_SCHEDULE_AHEAD_MONTHS, 'months'))) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.maxScheduledTimeExceeded);
        }
      }

      if (this.network === ACCOUNT_TYPES.instagram) {
        if (!opts.get('isComment')) {
          if (!this.file || ![BROADCAST_MEDIA_TYPE.PHOTO, BROADCAST_MEDIA_TYPE.VIDEO].includes(this.broadcast.broadcastMediaType)) {
            errors = errors.add(BROADCAST_VALIDATION_ERRORS.photoRequired);
          }
        }

        if (this.broadcast.content.get('hashtagCount') > INSTAGRAM_MAX_HASHTAGS) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.overHashtagLimit);
        }
      }

      if (this.file) {
        errors = errors.concat(this.file.validateForMessage(this, opts.set('postUpload', true) // Do not re-perform extra data validity check
        ));
      }

      if (this.isBlogPostAutoPublish && !this.broadcast.hasContent()) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.emptyContent);
      }

      errors = errors.concat(this.broadcast.validate());

      if (errors.contains(BROADCAST_VALIDATION_ERRORS.emptyContent) && this.isAllowedEmptyBody()) {
        errors = errors.delete(BROADCAST_VALIDATION_ERRORS.emptyContent);
      }

      return errors;
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var _this2 = this;

      return this.channelKeys.toList().map(function (channelKey, i) {
        var broadcastData = _this2.broadcast.serialize();

        broadcastData.channelKey = channelKey;

        if (_this2.isBlogPostAutoPublish && _this2.broadcastGuids) {
          broadcastData.broadcastGuid = _this2.broadcastGuids.toList().get(i);
        }

        if (broadcastData.status !== BROADCAST_STATUS.CREATED_BAP) {
          broadcastData.status = BROADCAST_STATUS.WAITING;

          if (_this2.publishType === BROADCAST_PUBLISH_TYPE.uploaded) {
            broadcastData.status = BROADCAST_STATUS.UPLOADED;
          }

          if (_this2.publishType === BROADCAST_PUBLISH_TYPE.draft) {
            broadcastData.status = BROADCAST_STATUS.DRAFT;
          } else if (_this2.publishType === BROADCAST_PUBLISH_TYPE.now) {
            broadcastData.triggerAt = new Date().getTime();

            if (_this2.originalStatus === BROADCAST_STATUS.DRAFT) {
              broadcastData.status = BROADCAST_STATUS.CREATED;
            }
          }
        }

        if (broadcastData.broadcastMediaType === BROADCAST_MEDIA_TYPE.PHOTO) {
          if (!broadcastData.content.photoUrl && !_this2.broadcast.extraData.hasPhotos()) {
            broadcastData.broadcastMediaType = BROADCAST_MEDIA_TYPE.NONE;
          }
        }

        if (broadcastData.broadcastMediaType === BROADCAST_MEDIA_TYPE.VIDEO) {
          broadcastData.content.title = broadcastData.content.body;
        }

        if (_this2.cosContent) {
          broadcastData.remoteContentType = _this2.cosContent.getRemoteContentType();
        }

        return broadcastData;
      }).toArray();
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs.uid = attrs.uid || generateUID();
      attrs.publishType = attrs.publishType || BROADCAST_PUBLISH_TYPE.schedule;
      var data = new BroadcastGroupMessage(attrs);
      data = data.merge({
        channelKeys: OrderedSet(attrs.channelKeys),
        broadcast: attrs.broadcast && Broadcast.createFrom(attrs.broadcast),
        originalContent: attrs.broadcast && attrs.broadcast.content
      });
      return data;
    }
  }, {
    key: "createFromBroadcast",
    value: function createFromBroadcast(attrs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var publishType = BROADCAST_PUBLISH_TYPE.schedule;

      if (attrs.broadcast.isUploaded()) {
        publishType = BROADCAST_PUBLISH_TYPE.uploaded;
      } else if (attrs.broadcast.isDraft() && options.composerMode !== COMPOSER_MODES.approve) {
        // when editing drafts, treat them as scheduled posts if a future time is set; or "publish now" otherwise
        if (!attrs.broadcast.triggerAt || attrs.broadcast.triggerAt < I18n.moment().portalTz().valueOf()) {
          publishType = BROADCAST_PUBLISH_TYPE.now;
        }
      }

      var channelKeys = OrderedSet(attrs.broadcast.channelKey ? [attrs.broadcast.channelKey] : []);
      return new BroadcastGroupMessage(Object.assign({}, attrs, {
        uid: attrs.uid || generateUID(),
        originalContent: attrs.broadcast.content,
        originalStatus: attrs.broadcast.status,
        originalTriggerAt: attrs.broadcast.triggerAt,
        channelKeys: channelKeys,
        publishType: publishType
      }));
    }
  }]);

  return BroadcastGroupMessage;
}(Record(DEFAULTS));

export { BroadcastGroupMessage as default };