'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
import { identity, sortBy } from 'underscore';
import getVideoId from '../../vendor/get-video-id';
import { ACCOUNT_TYPES, MEDIA_PROVIDER, MEDIA_TYPE } from '../../lib/constants';
var DEFAULTS = {
  network: null,
  provider: null,
  providerId: null,
  name: null,
  thumbUrl: null,
  fullUrl: null,
  type: null,
  contentType: null,
  duration: null
};

var Media = /*#__PURE__*/function (_Record) {
  _inherits(Media, _Record);

  function Media() {
    _classCallCheck(this, Media);

    return _possibleConstructorReturn(this, _getPrototypeOf(Media).apply(this, arguments));
  }

  _createClass(Media, [{
    key: "isVideo",
    value: function isVideo() {
      return [MEDIA_TYPE.video, MEDIA_TYPE.animated_gif].includes(this.type);
    }
  }], [{
    key: "createFromStreamItem",
    value: function createFromStreamItem(attrs) {
      // can work with StreamItem or TwitterStatus
      attrs.mediaEntities = attrs.mediaEntities || [];
      var urlEntities = attrs.urlEntities || attrs.urlentities || [];
      var username = attrs.displayName ? attrs.displayName.replace('@', '') : attrs.name;
      var mediaList = attrs.mediaEntities.map(Media.createFromMediaEntity).concat(urlEntities.map(Media.createFromUrlEntity).filter(identity)).map(function (m) {
        return m.set('name', username + " " + m.type.replace('_', ' '));
      });
      return List(mediaList);
    }
  }, {
    key: "createFromMediaEntity",
    value: function createFromMediaEntity(entity) {
      var attrs = {
        network: ACCOUNT_TYPES.twitter,
        type: entity.type,
        thumbUrl: entity.mediaURLHttps + ":small",
        fullUrl: entity.mediaURLHttps
      };

      if (entity.type === MEDIA_TYPE.video || entity.type === MEDIA_TYPE.animated_gif) {
        attrs.duration = entity.videoDurationMillis;
        var variants = sortBy(entity.videoVariants, function (v) {
          return v.bitrate;
        });
        var variant = variants[variants.length - 1];
        attrs.fullUrl = variant.url;
        attrs.contentType = variant.contentType;
      }

      return new Media(attrs);
    }
  }, {
    key: "createFromUrlEntity",
    value: function createFromUrlEntity(entity) {
      if ([MEDIA_TYPE.video, MEDIA_TYPE.photo].includes(entity.type)) {
        // social feed ends up putting media items in urlEntities
        return Media.createFromMediaEntity(entity);
      }

      var attrs = {
        network: ACCOUNT_TYPES.twitter
      };

      if (entity.expandedURL.match(/instagram.com\/p/)) {
        return new Media(Object.assign({}, attrs, {}, {
          type: MEDIA_TYPE.photo,
          provider: MEDIA_PROVIDER.instagram,
          thumbUrl: entity.expandedURL + "media?size=m",
          fullUrl: entity.expandedURL + "media?size=l"
        }));
      }

      var videoInfo = getVideoId(entity.expandedURL);

      if (videoInfo && [MEDIA_PROVIDER.youtube, MEDIA_PROVIDER.vimeo].includes(videoInfo.service)) {
        var thumbUrl;

        if (videoInfo.service === 'youtube') {
          thumbUrl = "https://i1.ytimg.com/vi/" + videoInfo.id + "/hqdefault.jpg";
        }

        return new Media(Object.assign({}, attrs, {}, {
          type: MEDIA_TYPE.video,
          provider: videoInfo.service,
          providerId: videoInfo.id,
          thumbUrl: thumbUrl
        }));
      }

      return null;
    }
  }, {
    key: "createFromFMFile",
    value: function createFromFMFile(fmFile) {
      var type = fmFile.type === 'MOVIE' ? 'video' : 'photo';
      return new Media({
        type: type,
        name: fmFile.name,
        fullUrl: fmFile.url,
        thumbUrl: fmFile.thumbUrl,
        duration: fmFile.meta.get('duration')
      });
    }
  }]);

  return Media;
}(Record(DEFAULTS));

export { Media as default };