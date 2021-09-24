'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, Record, fromJS } from 'immutable';
import { ACCOUNT_TYPES, BROADCAST_MEDIA_TYPE, CHANNEL_TYPE_TO_ACCOUNT_TYPES, CHANNEL_TYPES } from '../../lib/constants';
import ReportingPostMetadata from './ReportingPostMetadata';
var DEFAULTS = {
  id: null,
  keyString: null,
  createdAt: null,
  updatedAt: null,
  createdBy: null,
  publishedAt: null,
  portalId: null,
  foreignId: null,
  interactionsTotal: null,
  channelType: null,
  channelSlug: null,
  accountSlug: null,
  channelId: null,
  mediaType: null,
  url: null,
  broadcastGuid: null,
  campaignGuid: null,
  body: null,
  lastFetchedAt: null,
  stats: ImmutableMap(),
  metadata: ImmutableMap(),
  // merged in selectors
  channel: null,
  campaignName: null,
  campaignHexColor: null,
  links: List(),
  media: List(),
  cloneFailed: null
};

var ReportingPost = /*#__PURE__*/function (_Record) {
  _inherits(ReportingPost, _Record);

  function ReportingPost() {
    _classCallCheck(this, ReportingPost);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReportingPost).apply(this, arguments));
  }

  _createClass(ReportingPost, [{
    key: "getChannelKey",
    value: function getChannelKey() {
      return this.channelType + ":" + this.channelId;
    }
  }, {
    key: "getBody",
    value: function getBody() {
      var body = this.body || '';

      if (this.channelSlug === CHANNEL_TYPES.youtube) {
        body = this.metadata.get('mediaTitle');
      }

      return body;
    }
  }, {
    key: "getFirstUploadedImageUrl",
    value: function getFirstUploadedImageUrl() {
      if (!this.isPhoto()) return null;

      var _this$metadata$get = this.metadata.get('media', []),
          _this$metadata$get2 = _slicedToArray(_this$metadata$get, 1),
          uploadedMedia = _this$metadata$get2[0];

      return uploadedMedia ? uploadedMedia.url : null;
    }
  }, {
    key: "getThumbnailUrl",
    value: function getThumbnailUrl() {
      if (this.isPhoto()) {
        return this.getFirstUploadedImageUrl() || this.metadata.thumbnailUrl || this.metadata.mediaUrl;
      }

      var thumbnailUrl = this.metadata.thumbnailUrl;

      if (thumbnailUrl && this.accountSlug === ACCOUNT_TYPES.youtube) {
        thumbnailUrl = thumbnailUrl.replace('maxresdefault', 'hqdefault');
      }

      return thumbnailUrl;
    } // get an image url appropriate for larger singular display, eg Details panel

  }, {
    key: "getFullMediaUrl",
    value: function getFullMediaUrl() {
      if (this.channelSlug === CHANNEL_TYPES.instagram && this.mediaType === BROADCAST_MEDIA_TYPE.VIDEO) {
        // instagram videos mediaUrl is the video file itself, we expect an image url here
        return this.getThumbnailUrl();
      } // working on putting smaller sizes in `thumbnailUrl` and larger sizes appropriate details panel view in `mediaUrl` - but fallback in the meantime


      return this.getFirstUploadedImageUrl() || this.metadata.get('mediaUrl') || this.getThumbnailUrl();
    }
  }, {
    key: "hasLinkPreview",
    value: function hasLinkPreview() {
      return this.mediaType === BROADCAST_MEDIA_TYPE.NONE && this.metadata.link;
    }
  }, {
    key: "isAnimatedGif",
    value: function isAnimatedGif() {
      return this.mediaType === BROADCAST_MEDIA_TYPE.ANIMATED_GIF;
    }
  }, {
    key: "isCarousel",
    value: function isCarousel() {
      return this.mediaType === BROADCAST_MEDIA_TYPE.CAROUSEL;
    }
  }, {
    key: "isMultiMedia",
    value: function isMultiMedia() {
      return !this.metadata.media.isEmpty() && this.metadata.media.size > 1;
    }
  }, {
    key: "isPhoto",
    value: function isPhoto() {
      return this.mediaType === BROADCAST_MEDIA_TYPE.PHOTO;
    }
  }, {
    key: "isVideo",
    value: function isVideo() {
      return this.mediaType === BROADCAST_MEDIA_TYPE.VIDEO;
    }
  }, {
    key: "isTextOnly",
    value: function isTextOnly() {
      return !this.isAnimatedGif() && !this.isCarousel() && !this.isPhoto() && !this.isVideo() || this.mediaType === BROADCAST_MEDIA_TYPE.NONE && !this.hasLinkPreview();
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs.stats) {
        attrs.stats = fromJS(attrs.stats);
      }

      attrs.id = attrs.id.toString();
      attrs.metadata = ReportingPostMetadata.createFrom(attrs.metadata || {});
      attrs.channelSlug = attrs.channelType.toLowerCase();
      attrs.accountSlug = CHANNEL_TYPE_TO_ACCOUNT_TYPES[attrs.channelSlug];
      return new ReportingPost(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return List(data).map(ReportingPost.createFrom);
    }
  }]);

  return ReportingPost;
}(Record(DEFAULTS));

export { ReportingPost as default };