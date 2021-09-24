'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record, Set as ImmutableSet, List, fromJS } from 'immutable';
import keyMirror from 'react-utils/keyMirror';
import I18n from 'I18n';
import PortalIdParser from 'PortalIdParser';
import { pick } from 'underscore';
import { getFullUrl } from 'hubspot-url-utils';
import { getExtensionFromString, getDurationDisplay as _getDurationDisplay } from '../../lib/utils';
import { ACCOUNT_MAX_IMAGE_DIMENSIONS_DEFAULT, ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS, ACCOUNT_TYPE_TO_MAX_VIDEO_ASPECT_RATIO, ACCOUNT_TYPE_TO_MAX_VIDEO_DURATION_SECONDS, ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES, ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES, ACCOUNT_TYPE_TO_MAX_VIDEO_FRAME_RATE, ACCOUNT_TYPE_TO_MIN_VIDEO_FRAME_RATE, ACCOUNT_TYPE_TO_MIN_VIDEO_ASPECT_RATIO, ACCOUNT_TYPE_TO_MIN_VIDEO_DURATION_SECONDS, ACCOUNT_TYPE_TO_MAX_VIDEO_WIDTH, ACCOUNT_TYPE_TO_MAX_VIDEO_HEIGHT, ACCOUNT_TYPE_TO_MIN_VIDEO_WIDTH, ACCOUNT_TYPE_TO_MIN_VIDEO_HEIGHT, ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE, ACCOUNT_TYPES, ALLOWED_IMAGE_EXTENSIONS, BROADCAST_MEDIA_TYPE, BROADCAST_VALIDATION_ERRORS, CHANNEL_TYPES, DISALLOWED_IMAGE_MIME_TYPES, FM_FILE_TYPES, FM_FILE_TYPES_TO_BROADCAST_MEDIA_TYPE, FM_FILE_SERIALIZE_ALLOW_PROPS, MAX_IMAGE_BYTES_DEFAULT, MAX_IMAGE_BYTES_ANIMATED, MAX_IMAGE_BYTES, getChannelSlugFromChannelKey, IMAGE_PREVIEW_SIZE, MAX_IMAGE_PIXELS, MAX_GIF_FRAME_COUNT } from '../../lib/constants';
var DEFAULTS = {
  id: null,
  name: null,
  width: null,
  height: null,
  frameCount: null,
  created: null,
  url: null,
  folder_id: null,
  mediumUrl: null,
  thumbUrl: null,
  extension: null,
  encoding: null,
  type: null,
  byteSize: null,
  meta: ImmutableMap(),
  description: null
};
var CDN2_DOMAINS = ['cdn2.hubspotqa.com', 'cdn2.hubspotqa.net', 'cdn2.hubspot.net'];
var CDN2_PATH_FRAGMENTS = ['/hs-fs/hubfs'];
var CDN2_PATH_BLACKLIST_FRAGMENTS = ['content_shared_assets/static' // images bundled with COS themes, not actually in filemanager
];

function parseUrl(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    domain: a.host,
    path: a.pathname
  };
}

function sanitizeUrl(url) {
  url = url.split('#')[0];
  return url.split('?')[0];
}

function isCdn2(url) {
  var _parseUrl = parseUrl(url),
      domain = _parseUrl.domain,
      path = _parseUrl.path;

  if (CDN2_PATH_BLACKLIST_FRAGMENTS.some(function (fragment) {
    return path.includes(fragment);
  })) {
    return false;
  }

  if (CDN2_DOMAINS.includes(domain)) {
    return true;
  }

  return CDN2_PATH_FRAGMENTS.some(function (fragment) {
    return path.includes(fragment);
  });
}

function _getPreviewUrl(url) {
  // simply aims to remove #keepProtocol=true the renderer sometimes adds
  if (isCdn2(url)) {
    url = sanitizeUrl(url);
  }

  return url;
}

export { _getPreviewUrl as getPreviewUrl };
export function getThumbnailRedirectUrl(fileId, thumbSize) {
  var url = getFullUrl('api') + "/filemanager/api/v3/files/thumbnail-redirect/" + fileId + "?portalId=" + PortalIdParser.get();

  if (thumbSize && thumbSize !== IMAGE_PREVIEW_SIZE.original) {
    url = url + "&size=" + thumbSize;
  }

  return url;
}

var FMFile = /*#__PURE__*/function (_Record) {
  _inherits(FMFile, _Record);

  function FMFile() {
    _classCallCheck(this, FMFile);

    return _possibleConstructorReturn(this, _getPrototypeOf(FMFile).apply(this, arguments));
  }

  _createClass(FMFile, [{
    key: "getPreviewUrl",
    value: function getPreviewUrl() {
      // all this now does is return the 'medium' size via /thumbnail-redirect url generally appropriate for display in a larger view like details panel
      // appropriate for images of videos
      return _getPreviewUrl(this.mediumUrl || this.url);
    }
  }, {
    key: "getDurationSeconds",
    value: function getDurationSeconds() {
      return this.meta.get('duration') && this.meta.get('duration') / 1000;
    }
  }, {
    key: "getDurationDisplay",
    value: function getDurationDisplay() {
      return this.meta.get('duration') ? _getDurationDisplay(this.meta.get('duration')) : I18n.text('sui.broadcasts.na');
    }
  }, {
    key: "getAspectRatio",
    value: function getAspectRatio() {
      var width = this.getWidth();
      var height = this.getHeight();

      if (width && height) {
        return width / height;
      }

      return null;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      if (this.type === FM_FILE_TYPES.MOVIE) {
        var videoStream = this._getStreamWithAttrs(ImmutableMap({
          codec_type: 'VIDEO'
        }));

        if (videoStream) {
          return videoStream.get('height');
        }
      }

      return this.height;
    }
  }, {
    key: "getTotalPixels",
    value: function getTotalPixels() {
      var width = this.getWidth();
      var height = this.getHeight();

      if (width && height) {
        return width * height;
      }

      return null;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      if (this.type === FM_FILE_TYPES.MOVIE) {
        var videoStream = this._getStreamWithAttrs(ImmutableMap({
          codec_type: 'VIDEO'
        }));

        if (videoStream) {
          return videoStream.get('width');
        }
      }

      return this.width;
    }
  }, {
    key: "getVideoFrameRate",
    value: function getVideoFrameRate() {
      var videoStreamMaybe = this._getStreamWithAttrs(ImmutableMap({
        codec_type: 'VIDEO'
      }));

      if (videoStreamMaybe) {
        var frameRate = videoStreamMaybe.get('frame_rate');

        if (frameRate) {
          var frameRateList = frameRate.split(':');

          if (frameRateList.length === 2 && frameRateList[1] !== '0') {
            var frameRateMaybe = parseFloat(frameRateList[0]) / parseFloat(frameRateList[1]);
            return isNaN(frameRateMaybe) ? null : frameRateMaybe;
          }
        }
      }

      return null;
    }
  }, {
    key: "getBitrate",
    value: function getBitrate() {
      if (this.type === FM_FILE_TYPES.MOVIE) {
        var bitrate = this.meta.get('video_data') && this.meta.get('video_data').get('bitrate');
        return bitrate;
      }

      return null;
    }
  }, {
    key: "_getStreamWithAttrs",
    value: function _getStreamWithAttrs(streamAttrMap) {
      if (this.type === FM_FILE_TYPES.MOVIE) {
        var streamMaybe = this.meta.get('video_data') && this.meta.get('video_data').get('streams').find(function (s) {
          return Array.from(streamAttrMap.entries()).every(function (e) {
            return s.get(e[0]) === e[1];
          });
        });
        return streamMaybe;
      }

      return null;
    }
  }, {
    key: "serializeForBroadcastData",
    value: function serializeForBroadcastData() {
      var _this = this;

      return Object.assign({}, FM_FILE_SERIALIZE_ALLOW_PROPS.reduce(function () {
        var acc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var val = arguments.length > 1 ? arguments[1] : undefined;
        acc[val] = _this[val];
        return acc;
      }, {}), {
        mediaType: FM_FILE_TYPES_TO_BROADCAST_MEDIA_TYPE[this.type] || BROADCAST_MEDIA_TYPE.NONE
      });
    }
  }, {
    key: "serializeForEditing",
    value: function serializeForEditing() {
      return ImmutableMap(pick(this.toJS(), 'id', 'name', 'width', 'height', 'meta', 'url', 'folder_id', 'encoding'));
    }
  }, {
    key: "hasAacAudioCodecWithHighEfficiencyProfile",
    value: function hasAacAudioCodecWithHighEfficiencyProfile() {
      return Boolean(this._getStreamWithAttrs(ImmutableMap({
        profile: 'HE-AAC',
        codec_name: 'aac'
      }))) || Boolean(this._getStreamWithAttrs(ImmutableMap({
        profile: 'HE-AACv2',
        codec_name: 'aac'
      })));
    }
  }, {
    key: "hasMp3Codec",
    value: function hasMp3Codec() {
      return Boolean(this._getStreamWithAttrs(ImmutableMap({
        codec_name: 'mp3'
      })));
    }
  }, {
    key: "hasH264VideoCodec",
    value: function hasH264VideoCodec() {
      return Boolean(this._getStreamWithAttrs(ImmutableMap({
        codec_name: 'h264'
      })));
    }
  }, {
    key: "hasVideoCodec",
    value: function hasVideoCodec() {
      return Boolean(this._getStreamWithAttrs(ImmutableMap({
        codec_type: 'VIDEO'
      })));
    }
  }, {
    key: "isAnimated",
    value: function isAnimated() {
      // todo: this meta check only works right after upload, assume all are animated untile we figure out solution
      return this.meta.get('animated') || this.extension === 'gif';
    }
    /**
     * Validates an image, video, etc via FileManager attach
     * This is more elaborate than utils.validateLocalFile as FileManager file objects usually have metadata
     * However, don't rely on metadata existing as it's sometimes missing
     * We use slightly different logic for validating file types here
     * to allow more specific error messages to be shown to users
     *
     * @param {object} message        The message to validate
     * @param {Map}    [groupOptions] Options for this group of messages
     * @param {object} [options]      Options for this specific message
     *
     * @returns {Set} A set of any errors encountered when validating this message
     */

  }, {
    key: "validateForMessage",
    value: function validateForMessage(message) {
      var groupOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var broadcastMediaType = FMFile.toBroadcastMediaType(this.type);
      var errors = ImmutableSet();
      var allowedExtensions = ALLOWED_IMAGE_EXTENSIONS.concat(ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS[message.network]);
      var ext = getExtensionFromString(this.url);

      if (!allowedExtensions.includes(ext)) {
        return ImmutableSet.of(BROADCAST_VALIDATION_ERRORS.invalidExtension);
      }

      if (broadcastMediaType === BROADCAST_MEDIA_TYPE.PHOTO) {
        errors = errors.concat(this.validatePhotoForMessage(message));
      } else if (broadcastMediaType === BROADCAST_MEDIA_TYPE.VIDEO) {
        errors = errors.concat(this.validateVideoForMessage(message));
      }

      if (!groupOptions.get('postUpload') && !message.broadcast.extraData.canAddFile(this, options)) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.mixMultiImageFileTypes);
      }

      return errors;
    }
  }, {
    key: "validatePhotoForMessage",
    value: function validatePhotoForMessage(message) {
      var errors = ImmutableSet();
      var network = message.network;
      var isAnimated = this.isAnimated();

      if (isAnimated && MAX_IMAGE_BYTES_ANIMATED[network]) {
        if (this.byteSize > MAX_IMAGE_BYTES_ANIMATED[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageSizeTooLargeAnimated);
        }
      } else if (MAX_IMAGE_BYTES[network]) {
        if (this.byteSize > MAX_IMAGE_BYTES[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageSizeTooLarge);
        }
      } else if (this.byteSize > MAX_IMAGE_BYTES_DEFAULT) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageSizeTooLarge);
      }

      if (!this.width || !this.height) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageDimensionsUnreadable);
      }

      if (this.encoding && DISALLOWED_IMAGE_MIME_TYPES.includes(this.encoding)) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.badEncoding);
      }

      if (network === ACCOUNT_TYPES.instagram && this.width && this.height) {
        var aspectRatio = this.getAspectRatio();

        if (aspectRatio < 0.8 || aspectRatio > 1.91) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.instagramImageAspectRatio);
        }

        if (isAnimated) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageIsAnimatedGif);
        }
      } else if (this.width > ACCOUNT_MAX_IMAGE_DIMENSIONS_DEFAULT || this.height > ACCOUNT_MAX_IMAGE_DIMENSIONS_DEFAULT) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.imageDimensionsTooLarge);
      }

      if (network === ACCOUNT_TYPES.linkedin && this.width && this.height) {
        if (this.getTotalPixels() > MAX_IMAGE_PIXELS[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.linkedinImagePixelsTooMany);
        }

        if (this.isAnimated() && this.frameCount > MAX_GIF_FRAME_COUNT[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.linkedinGifFramesTooMany);
        }
      }

      return errors;
    }
    /**
     * FB: https://developers.facebook.com/docs/graph-api/video-uploads/
     * IG: https://developers.facebook.com/docs/instagram-api/reference/user/media#create-video-container
     * LI (already not fully accurate): https://www.linkedin.com/help/lms/answer/85306?query=video&hcppcid=search
     * TW: https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices.html
     *
     * https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastData/src/main/java/com/hubspot/broadcast/broadcast/FacebookVideoFileValidator.java
     * https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastData/src/main/java/com/hubspot/broadcast/broadcast/InstagramVideoFileValidator.java
     * https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastData/src/main/java/com/hubspot/broadcast/broadcast/LinkedInVideoFileValidator.java
     * https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastData/src/main/java/com/hubspot/broadcast/broadcast/TwitterVideoFileValidator.java
     */

  }, {
    key: "validateVideoForMessage",
    value: function validateVideoForMessage(message) {
      var errors = ImmutableSet();
      var network = message.network; // LinkedInStatus channels don't currently support video while companies do

      var isLinkedInStatusChannelSelected = message.channelKeys.map(getChannelSlugFromChannelKey).find(function (channelSlug) {
        return channelSlug === CHANNEL_TYPES.linkedinstatus;
      });

      if (isLinkedInStatusChannelSelected) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoInLinkedInStatusChannel);
      }

      if (!this.meta.get('video_data')) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoFormat);
      }

      if (this.getDurationSeconds()) {
        if (ACCOUNT_TYPE_TO_MIN_VIDEO_DURATION_SECONDS[network] && this.getDurationSeconds() < ACCOUNT_TYPE_TO_MIN_VIDEO_DURATION_SECONDS[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoTooShort);
        } else if (ACCOUNT_TYPE_TO_MAX_VIDEO_DURATION_SECONDS[network] && this.getDurationSeconds() > ACCOUNT_TYPE_TO_MAX_VIDEO_DURATION_SECONDS[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoTooLong);
        }
      }

      var width = this.getWidth();

      if (width) {
        if (ACCOUNT_TYPE_TO_MAX_VIDEO_WIDTH[network] && width > ACCOUNT_TYPE_TO_MAX_VIDEO_WIDTH[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoWidthTooLarge);
        } else if (ACCOUNT_TYPE_TO_MIN_VIDEO_WIDTH[network] && width < ACCOUNT_TYPE_TO_MIN_VIDEO_WIDTH[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoWidthTooSmall);
        }
      }

      var height = this.getHeight();

      if (height) {
        if (ACCOUNT_TYPE_TO_MAX_VIDEO_HEIGHT[network] && height > ACCOUNT_TYPE_TO_MAX_VIDEO_HEIGHT[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoHeightTooLarge);
        } else if (ACCOUNT_TYPE_TO_MIN_VIDEO_HEIGHT[network] && height < ACCOUNT_TYPE_TO_MIN_VIDEO_HEIGHT[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoHeightTooSmall);
        }
      }

      if (ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES[network] && this.byteSize > ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES[network]) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoSizeTooLarge);
      } else if (ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES[network] && this.byteSize < ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES[network]) {
        errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoSizeTooSmall);
      }

      var aspectRatio = this.getAspectRatio();

      if (aspectRatio) {
        if (ACCOUNT_TYPE_TO_MIN_VIDEO_ASPECT_RATIO[network] && aspectRatio < ACCOUNT_TYPE_TO_MIN_VIDEO_ASPECT_RATIO[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoAspectRatio);
        } else if (ACCOUNT_TYPE_TO_MAX_VIDEO_ASPECT_RATIO[network] && aspectRatio > ACCOUNT_TYPE_TO_MAX_VIDEO_ASPECT_RATIO[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoAspectRatio);
        }
      }

      if (network === ACCOUNT_TYPES.twitter) {
        if (this.hasVideoCodec() && !this.hasH264VideoCodec()) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoCodec);
        }

        if (this.hasAacAudioCodecWithHighEfficiencyProfile()) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoAudioProfile);
        }
      }

      if (network === ACCOUNT_TYPES.instagram) {
        if (this.hasMp3Codec()) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoAudioCodec);
        }
      }

      if (ACCOUNT_TYPE_TO_MAX_VIDEO_FRAME_RATE[network]) {
        var frameRate = this.getVideoFrameRate();

        if (frameRate && frameRate > ACCOUNT_TYPE_TO_MAX_VIDEO_FRAME_RATE[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoFrameRate);
        }
      }

      if (ACCOUNT_TYPE_TO_MIN_VIDEO_FRAME_RATE[network]) {
        var _frameRate = this.getVideoFrameRate();

        if (_frameRate && _frameRate < ACCOUNT_TYPE_TO_MIN_VIDEO_FRAME_RATE[network]) {
          errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoMinFrameRate);
        }
      }

      if (network === ACCOUNT_TYPES.instagram) {
        var bitRate = this.getBitrate();

        if (bitRate) {
          if (ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE[network] && bitRate >= ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE[network]) {
            errors = errors.add(BROADCAST_VALIDATION_ERRORS.videoBitrate);
          }
        }
      }

      return errors;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs.byteSize = attrs.size;
      delete attrs.size;
      attrs.thumbUrl = getThumbnailRedirectUrl(attrs.id, 'thumb');
      attrs.mediumUrl = getThumbnailRedirectUrl(attrs.id, 'medium');

      if (attrs.meta) {
        attrs.meta = fromJS(attrs.meta);
      }

      if (attrs.mediaType) {
        switch (attrs.mediaType) {
          case BROADCAST_MEDIA_TYPE.PHOTO:
            attrs.type = this.TYPES.IMG;
            break;

          case BROADCAST_MEDIA_TYPE.VIDEO:
            attrs.type = this.TYPES.MOVIE;
            break;

          default:
            attrs.type = null;
            break;
        }
      }

      return new FMFile(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(attrs) {
      return new List(attrs.map(function (file) {
        return FMFile.createFrom(file);
      }));
    }
  }, {
    key: "toBroadcastMediaType",
    value: function toBroadcastMediaType(type) {
      return type === FM_FILE_TYPES.IMG ? BROADCAST_MEDIA_TYPE.PHOTO : BROADCAST_MEDIA_TYPE.VIDEO;
    }
  }]);

  return FMFile;
}(Record(DEFAULTS));

FMFile.TYPES = keyMirror({
  IMG: null,
  MOVIE: null
});
export { FMFile as default };