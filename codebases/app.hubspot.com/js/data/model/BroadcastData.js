'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, OrderedMap, List, fromJS } from 'immutable';
import { logBreadcrumb, getExtensionFromString } from '../../lib/utils';
import { ALL_VIDEO_EXTENSIONS, ALLOWED_MULTI_PHOTO_EXTENSIONS, MAX_ALLOWED_IMAGES_COMPOSER } from '../../lib/constants';
import FMFile from './FMFile';
var DEFAULTS = {
  body: null,
  errorCode: null,
  errorSubcode: null,
  files: OrderedMap(),
  boostedPosts: List(),
  adCampaigns: List()
};

var BroadcastData = /*#__PURE__*/function (_Record) {
  _inherits(BroadcastData, _Record);

  function BroadcastData() {
    _classCallCheck(this, BroadcastData);

    return _possibleConstructorReturn(this, _getPrototypeOf(BroadcastData).apply(this, arguments));
  }

  _createClass(BroadcastData, [{
    key: "hasExtensions",
    value: function hasExtensions(extensions) {
      return this.getFiles().some(function (file) {
        return extensions.includes(file.extension || getExtensionFromString(file.url));
      });
    }
  }, {
    key: "hasPhotos",
    value: function hasPhotos() {
      return this.hasExtensions(ALLOWED_MULTI_PHOTO_EXTENSIONS);
    }
  }, {
    key: "hasVideo",
    value: function hasVideo() {
      return this.hasExtensions(ALL_VIDEO_EXTENSIONS);
    }
  }, {
    key: "hasGif",
    value: function hasGif() {
      return this.hasExtensions(['gif']);
    }
  }, {
    key: "filterFilesByExtension",
    value: function filterFilesByExtension(extensions) {
      return this.getFiles().filter(function (file) {
        return extensions.includes(file.extension || getExtensionFromString(file.url));
      });
    }
  }, {
    key: "getFiles",
    value: function getFiles() {
      return this.files.filter(function (file) {
        return Boolean(file.extension || file.url);
      });
    }
  }, {
    key: "getPhotos",
    value: function getPhotos() {
      return this.filterFilesByExtension([].concat(_toConsumableArray(ALLOWED_MULTI_PHOTO_EXTENSIONS), ['gif']));
    }
  }, {
    key: "getVideo",
    value: function getVideo() {
      return this.filterFilesByExtension(ALL_VIDEO_EXTENSIONS).get(0);
    }
  }, {
    key: "addPhoto",
    value: function addPhoto(fmFile) {
      var self = this;
      var oldFiles = self.getPhotos();
      var newFiles;

      if (!this.canAddFile(fmFile, {
        isReplace: false
      })) {
        newFiles = oldFiles;
      } else if (oldFiles.size === MAX_ALLOWED_IMAGES_COMPOSER) {
        newFiles = oldFiles.delete(oldFiles.last().id).set(fmFile.id, fmFile);
      } else if ( // Don't add duplicate images based on URL.
      oldFiles.some(function (photo) {
        return photo.url === fmFile.url;
      })) {
        newFiles = oldFiles;
      } else {
        newFiles = oldFiles.set(fmFile.id, fmFile);
      }

      return self.set('files', newFiles);
    }
  }, {
    key: "removePhoto",
    value: function removePhoto(photoUrl) {
      var self = this;
      var newPhotos = this.getPhotos().filter(function (photo) {
        return photo.url !== photoUrl;
      });
      return self.set('files', newPhotos);
    }
  }, {
    key: "replacePhoto",
    value: function replacePhoto(photoUrl, file) {
      var self = this;
      var idToReplace = self.getPhotos().findKey(function (photo) {
        return photo.url === photoUrl;
      }); // we want to keep the same order. If the image replaced is the first one, we need to add the new image to the same position.

      var photos = self.getPhotos();
      var newFiles = photos.reduce(function (acc, photo) {
        if (photo.id === idToReplace) {
          return acc.set(file.id, file);
        }

        return acc.set(photo.id, photo);
      }, new OrderedMap());
      return self.set('files', newFiles);
    }
  }, {
    key: "addDescription",
    value: function addDescription(photoUrl, desc) {
      var photos = this.getPhotos();
      var newFiles;
      var file = photos.find(function (photo) {
        return photo.url === photoUrl;
      });
      var index = photos.keySeq().findIndex(function (k) {
        return k === file.id;
      });

      if (index !== -1) {
        var newFile = file.set('description', desc);
        newFiles = photos.set(file.id, newFile);
      } else {
        newFiles = photos;
      }

      return this.set('files', newFiles);
    }
    /**
     * Based on the already added files, can we add this?
     * Reasons for false include mixing photos/gifs/videos,
     * or having more than one gif/video,
     */

  }, {
    key: "canAddFile",
    value: function canAddFile(fmFile) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (['gif'].concat(_toConsumableArray(ALL_VIDEO_EXTENSIONS)).includes(fmFile.extension)) {
        return this.files.size === 0 || options.isReplace && this.files.size === 1;
      }

      return options.isReplace && this.files.size === 1 || !this.hasGif() && !this.hasVideo();
    }
  }, {
    key: "isFull",
    value: function isFull() {
      return this.files.size === MAX_ALLOWED_IMAGES_COMPOSER || this.hasVideo() || this.hasGif();
    }
    /**
     * Gets a list of all extensions that can be added to the current list of files
     */

  }, {
    key: "getAddableExtensions",
    value: function getAddableExtensions() {
      if (this.hasVideo() || this.hasGif() || this.files.size === MAX_ALLOWED_IMAGES_COMPOSER) {
        return [];
      }

      if (this.hasPhotos()) {
        return ALLOWED_MULTI_PHOTO_EXTENSIONS;
      }

      return [].concat(_toConsumableArray(ALLOWED_MULTI_PHOTO_EXTENSIONS), _toConsumableArray(ALL_VIDEO_EXTENSIONS), ['gif']);
    }
    /**
     * For networks without multi-image support, reduce down to single file version
     */

  }, {
    key: "toSingleFile",
    value: function toSingleFile() {
      var self = this;
      var newFiles = OrderedMap();

      if (self.files.size) {
        var lastFile = self.files.last();
        newFiles = newFiles.set(lastFile.id, lastFile);
      }

      return self.set('files', newFiles);
    }
    /**
     * Necessary if we want to be consistent with the old content map when removing photos
     */

  }, {
    key: "toContentUpdateMap",
    value: function toContentUpdateMap() {
      if (this.files.size === 0) {
        return {
          photoUrl: null,
          imageUrl: null,
          fileId: null
        };
      }

      return {
        photoUrl: this.files.last().url,
        imageUrl: null,
        fileId: this.files.last().id
      };
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var data = this.toJS();
      data.files = this.files.toArray().map(function (file) {
        return file.serializeForBroadcastData();
      });
      logBreadcrumb("fmFiles (" + data.files.length + ") serialized for BroadcastData");
      return data;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs.files && Array.isArray(attrs.files)) {
        attrs.files = OrderedMap(FMFile.createFromArray(attrs.files).map(function (item) {
          return [item.id, item];
        }));
      }

      return new BroadcastData(fromJS(attrs));
    }
  }]);

  return BroadcastData;
}(Record(DEFAULTS));

export { BroadcastData as default };