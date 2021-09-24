'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { getDomain } from '../../lib/utils';
import { ACCOUNT_TYPES, COMPOSER_IMAGE_INVALID_REASON, MAX_IMAGE_BYTES_DEFAULT, MAX_PREVIEW_IMAGE_BYTES, MAX_PREVIEW_IMAGE_BYTES_TWITTER } from '../../lib/constants';
var DEFAULTS = {
  url: null,
  is_animated: null,
  frameCount: null,
  byteSize: null,
  error: null,
  loaded: null,
  loading: null,
  invalidReason: null,
  mime: null,
  type: null,
  width: null,
  height: null
};
var MIN_IMAGE_SIZE = 170;
var TWITTER_MAX_IMAGE_SIZE = 8192;
var FACEBOOK_MIN_IMAGE_SIZE = 200;

var ImageInfo = /*#__PURE__*/function (_Record) {
  _inherits(ImageInfo, _Record);

  function ImageInfo() {
    _classCallCheck(this, ImageInfo);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageInfo).apply(this, arguments));
  }

  _createClass(ImageInfo, [{
    key: "isValid",
    value: function isValid(network, isPhoto) {
      return !this.validate(network, isPhoto).invalidReason;
    }
  }, {
    key: "validate",
    value: function validate(network, isPhoto) {
      if (this.error) {
        return this.set('invalidReason', COMPOSER_IMAGE_INVALID_REASON.failedDownload);
      }

      if (network === ACCOUNT_TYPES.linkedin && getDomain(this.url).includes('_')) {
        return this.set('invalidReason', COMPOSER_IMAGE_INVALID_REASON.linkedinUnderscoreInHostname);
      }

      if (!this.loaded) {
        return this.set('invalidReason', null);
      }

      if (this.width && this.height) {
        var minSize = network === ACCOUNT_TYPES.facebook ? FACEBOOK_MIN_IMAGE_SIZE : MIN_IMAGE_SIZE;

        if (this.width < minSize || this.height < minSize) {
          return this.set('invalidReason', COMPOSER_IMAGE_INVALID_REASON.tooSmallDimensions);
        }

        if (network === ACCOUNT_TYPES.twitter && (this.width > TWITTER_MAX_IMAGE_SIZE || this.height > TWITTER_MAX_IMAGE_SIZE)) {
          return this.set('invalidReason', COMPOSER_IMAGE_INVALID_REASON.tooLargeDimensions);
        }
      }

      if (isPhoto) {
        if (this.byteSize > MAX_IMAGE_BYTES_DEFAULT) {
          return this.set('invalidReason', COMPOSER_IMAGE_INVALID_REASON.tooLargeByteSize);
        }
      } else {
        // otherwise a link preview image
        var maxByteSize = network === ACCOUNT_TYPES.twitter ? MAX_PREVIEW_IMAGE_BYTES_TWITTER : MAX_PREVIEW_IMAGE_BYTES;

        if (this.byteSize > maxByteSize) {
          return this.set('invalidReason', COMPOSER_IMAGE_INVALID_REASON.tooLargeByteSize);
        }
      }

      return this;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      attrs.byteSize = attrs.size;
      delete attrs.size;
      return new ImageInfo(attrs);
    }
  }, {
    key: "createFromFMFile",
    value: function createFromFMFile(fmFile) {
      return ImageInfo.createFrom({
        url: fmFile.url,
        width: fmFile.width,
        height: fmFile.height,
        loaded: true,
        byteSize: fmFile.byteSize
      });
    }
  }]);

  return ImageInfo;
}(Record(DEFAULTS));

export { ImageInfo as default };