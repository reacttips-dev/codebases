/**
 * AssetManager
 * Methods to perform read/write operations on assets.
 */
import _ from 'underscore';

import Q from 'q';
import API from 'js/lib/api';

import EventEmitter from 'js/vendor/EventEmitter';
import AssetManagerUploader from 'js/lib/assetManagerUploader';

const api = API('', { type: 'rest' });

const UPLOAD_STATES = {
  Uninitialized: 'uninitialized',
  Initialized: 'initialized',
  Uploading: 'uploading',
  Completed: 'completed',
  Failed: 'failed',
};

const SUPPORTED_EVENTS = ['start', 'select', 'progress', 'upload', 'upload-complete', 'result', 'cancel'];

const TRANSLOADIT_IMAGE_TEMPLATE_ID = 'a988ef80ec2c11e89449e9e021d39241';

const ASSET_TYPES = {
  Image: {
    name: 'image',
    // maintain a strict set of image types since some image types
    // like svg are not supported on mobile
    types: ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'],
  },

  Video: {
    name: 'video',
    types: ['video/mp4', 'video/x-m4v', 'video/x-flv', 'video/*'],
    extensions: ['mp4', 'mov', 'mkv', 'flv'],
  },

  Subtitle: {
    name: 'subtitle',
    // adding explicit .srt and .vtt extensions for browser operating system combos that don't recoginize the text/srt mime type. See https://phabricator.dkandu.me/D99068
    types: ['text/srt', 'text/vtt', '.srt', '.vtt'],
  },

  Audio: {
    name: 'audio',
    types: ['audio/*'],
  },

  Pdf: {
    name: 'pdf',
    types: ['application/pdf'],
  },

  Generic: {
    name: 'generic',
    types: [],
  },
};

/**
 * Get asset type by file type
 * Setting assetType to generic for subtitle file
 * because in bulk upload the language code is unknown
 * @param {Object} file
 * @return {Object}
 */
const getAssetType = (file) => {
  const lastDotIndex = file.name.lastIndexOf('.');
  const extension = lastDotIndex > -1 ? file.name.substring(lastDotIndex + 1) : '';

  const findType = (fileType, types) => {
    return _(types).find((type) => fileType.match(type));
  };

  if (findType(file.type, ASSET_TYPES.Image.types)) {
    return ASSET_TYPES.Image;
  } else if (findType(file.type, ASSET_TYPES.Video.types) || _(ASSET_TYPES.Video.extensions).contains(extension)) {
    return ASSET_TYPES.Video;
  } else if (findType(file.type, ASSET_TYPES.Audio.types)) {
    return ASSET_TYPES.Audio;
  } else if (findType(file.type, ASSET_TYPES.Pdf.types)) {
    return ASSET_TYPES.Pdf;
  } else {
    return ASSET_TYPES.Generic;
  }
};

/**
 * Create an upload attempt with the given options
 */
const createUploadAttempt = (creationAttemptOptions, file) => {
  const deferred = Q.defer();
  creationAttemptOptions = creationAttemptOptions || {};

  const defaultCreationAttemptOptions = {
    typeName: 'pending',
    assetType: 'generic',
  };

  Q(
    api.post(creationAttemptOptions.assetCreationUrl, {
      data: _.defaults(creationAttemptOptions, defaultCreationAttemptOptions),
    })
  ).then((json) => {
    const attempt = json.elements[0];

    if (file) {
      deferred.resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        assetType: getAssetType(file).name,
        attemptId: attempt.id,
      });
    } else {
      deferred.resolve(attempt);
    }
  });

  return deferred.promise;
};

/**
 * Get an instance of AssetManager.
 * @param {String} courseId Course Id associated with this instance.
 * @constructor
 */
const AssetManager = function () {
  EventEmitter.call(this);

  // State variables needed for upload support
  this.uploadState = UPLOAD_STATES.Uninitialized;
  this.uploader = null;
  this.uploaderDOM = null;
  this.assetOptions = {};
};

_.extend(AssetManager.prototype, EventEmitter.prototype);

// static properties and methods

// Static cache of asset ids mapping to asset data.
AssetManager.ASSET_CACHE = {};

// Fail count for GET requests for assets.
AssetManager.GET_FAIL_COUNT = 0;

AssetManager.getAsset = (assetId) => AssetManager.ASSET_CACHE[assetId];

AssetManager.apiCaller = (url, params) => api.get(url, { data: params });

AssetManager.compareCacheData = (assetIds) => {
  const assetMap = {};
  const cachedIds = [];

  let uncachedAssetIds = _(assetIds).uniq();

  _(assetIds).each((assetId) => {
    const asset = AssetManager.getAsset(assetId);

    if (asset) {
      assetMap[assetId] = asset;
      cachedIds.push(assetId);
    }
  });

  uncachedAssetIds = _(uncachedAssetIds).difference(cachedIds);

  return { uncachedAssetIds, assetMap };
};

// instance methods

// upload support methods - use these for creating and uploading new assets to the assetService

/**
 * Sets up the upload form and uploader with the appropriate configurations.
 *
 * The AssetManager will emit the following events (same as assetManagerUploader):
 * ['start', 'select', 'progress', 'upload', 'upload-complete', 'result', 'cancel']
 *
 * This method appends a div to the <body> element, which will contain all needed DOM elements
 * to handle the asset upload.
 *
 * @param {object} assetType File MIME type that the uploader should allow (e.g. video/mp4, image/*)
 * @param {object} assetOptions Any additional options that should be passed into the asset creation attempt
 * @param {object} [container] DOM element to append the upload to
 * @param {boolean} [allowMultiple] allows multiple files for bulk upload
 */
AssetManager.prototype.initializeUploader = function (assetType, assetOptions, container, allowMultiple) {
  // Initialization is only allowed if we're in the Uninitialized state
  if (this.uploadState !== UPLOAD_STATES.Uninitialized) {
    console.error('An uploader is already initialized. Destroy it first before calling initialize.');
    return;
  }

  assetOptions = assetOptions || {};

  this.isBulkUpload = allowMultiple;

  const uploaderWrapper = document.createElement('div');
  uploaderWrapper.className = 'c-assetmanager-uploader';
  uploaderWrapper.style.display = 'none';

  const uploaderForm = document.createElement('form');
  uploaderForm.encType = 'multipart/form-data';
  uploaderForm.method = 'POST';

  const uploaderInput = document.createElement('input');
  uploaderInput.type = 'file';
  uploaderInput.name = 'file';
  uploaderInput.multiple = allowMultiple;

  if (assetType) {
    uploaderInput.accept = assetType.types.join();
  }

  const uploaderSubmit = document.createElement('input');
  uploaderSubmit.type = 'submit';

  uploaderForm.appendChild(uploaderInput);
  uploaderForm.appendChild(uploaderSubmit);

  uploaderWrapper.appendChild(uploaderForm);
  if (container) {
    container.appendChild(uploaderWrapper);
  } else {
    document.body.appendChild(uploaderWrapper);
  }

  this.uploaderDOM = {
    wrapper: uploaderWrapper,
    input: uploaderInput,
    form: uploaderForm,
  };

  this.uploader = new AssetManagerUploader(uploaderForm);
  this.assetOptions = assetOptions;

  _(SUPPORTED_EVENTS).each((eventName) => {
    this.uploader.on(eventName, (eventData) => {
      this.emit(eventName, eventData);
    });
  });

  this.uploadState = UPLOAD_STATES.Initialized;
};

/**
 * Helper method to initialize a video asset uploader.
 * See http://stackoverflow.com/questions/19107685/safari-input-type-file-accept-video-ignores-mp4-files
 */
AssetManager.prototype.initializeVideoUploader = function (assetOpts) {
  this.initializeUploader(ASSET_TYPES.Video, assetOpts);
};

/**
 * Helper method to initialize an image asset uploader.
 */
AssetManager.prototype.initializeImageUploader = function (assetOpts) {
  const options = { ...assetOpts, transloaditTemplateId: TRANSLOADIT_IMAGE_TEMPLATE_ID };
  this.initializeUploader(ASSET_TYPES.Image, options);
};

AssetManager.prototype.initializeSubtitleUploader = function (assetOpts) {
  this.initializeUploader(ASSET_TYPES.Subtitle, assetOpts);
};

AssetManager.prototype.initializeAudioUploader = function (assetOpts) {
  this.initializeUploader(ASSET_TYPES.Audio, assetOpts);
};

AssetManager.prototype.initializePdfUploader = function (assetOpts) {
  this.initializeUploader(ASSET_TYPES.Pdf, assetOpts);
};

/**
 * Helper method to initialize a bulk asset uploader.
 */
AssetManager.prototype.initializeBulkUploader = function (container, assetType, assetOpts) {
  const uploaderAssetType = _(ASSET_TYPES).findWhere({ name: assetType });
  this.initializeUploader(uploaderAssetType, assetOpts, container, true);

  this.uploader.on('select', () => {
    this.emit('change', this.uploaderDOM.input.files);
  });

  this.uploader.on('all-complete', (data) => {
    this.emit('all-complete', data);
  });
};

/**
 * Destroys the uploader created by the initializeUploader() method.
 */
AssetManager.prototype.destroyUploader = function () {
  if (this.uploadState === UPLOAD_STATES.Uninitialized) {
    console.error('An uploader cannot be destroyed if it does not exist.');
    return;
  }

  document.body.removeChild(this.uploaderDOM.wrapper);
  this.uploader = null;
  this.uploaderDOM = null;
  this.assetOptions = null;

  this.uploadState = UPLOAD_STATES.Uninitialized;
};

/**
 * Opens the file picker associated with the current uploader instance.
 */
AssetManager.prototype.selectFile = function () {
  if (this.uploadState !== UPLOAD_STATES.Initialized && this.uploadState !== UPLOAD_STATES.Failed) {
    console.error(
      'Files can only be selected for upload just after the uploader is initialized or if the upload failed.'
    );
    return;
  }

  this.uploaderDOM.form.reset();
  this.uploaderDOM.input.click();
};

AssetManager.prototype.isInitialized = function () {
  return this.uploadState !== UPLOAD_STATES.Uninitialized;
};

/**
 * Uploads the file in the form encapsulated by the stored AssetManagerUploader instance.
 *
 * This includes creating an upload attempt, and then performing the actual upload.
 *
 * This function returns a promise that is resolved with the attempt object
 * if the upload succeeds.
 *
 * @param {object} assetCreationAttemptOptions Additional options to include
 * in the asset creation request (e.g. languageCode).
 */

AssetManager.prototype.upload = function (options) {
  if (this.uploadState !== UPLOAD_STATES.Initialized && this.uploadState !== UPLOAD_STATES.Failed) {
    console.error('Upload can only be called if the last upload failed or if the uploader was just initialized.');
    return;
  }

  this.uploadState = UPLOAD_STATES.Uploading;
  options = options || {};

  const uploadWithAttemptId = (attempts) => {
    const deferred = Q.defer();

    const onFailOrError = (error) => {
      deferred.reject(error);
      detachEvents();
    };

    const onComplete = (attempt) => {
      deferred.resolve(attempt);
      detachEvents();
    };

    var detachEvents = () => {
      this.uploader.off('failed', onFailOrError);
      this.uploader.off('error', onFailOrError);
      this.uploader.off('complete', onComplete);
    };

    this.uploader.on('failed', onFailOrError);
    this.uploader.on('error', onFailOrError);
    this.uploader.on('complete', onComplete);

    if (this.isBulkUpload) {
      this.uploader.bulkAttempt(attempts);
    } else {
      this.uploader.attempt(attempts[0], {}, this.assetOptions.transloaditTemplateId);
    }

    return deferred.promise;
  };

  if (this.isBulkUpload) {
    const attemptPromises = [];

    _(this.uploaderDOM.input.files).forEach((file) => {
      const assetType = getAssetType(file).name;
      const opts = _(options).defaults(this.assetOptions);
      opts.assetType = assetType;
      if (opts.pendingAssetCreation) {
        opts.pendingAssetCreation.assetType = assetType;

        // Adding video specific asset options
        if (assetType === ASSET_TYPES.Video.name) {
          opts.pendingAssetCreation.videoTemplate = 'fullVideo';
          opts.pendingAssetCreation.tags = [
            {
              name: 'scope',
              value: 'video',
            },
          ];
        }
      }

      attemptPromises.push(createUploadAttempt(opts, file));
    });

    return Q.all(attemptPromises)
      .then((attempts) => uploadWithAttemptId(attempts))
      .then((attempt) => {
        this.uploadState = UPLOAD_STATES.Completed;
        return attempt;
      })
      .catch((error) => {
        this.uploadState = UPLOAD_STATES.Failed;
        return Q.reject(error);
      });
  }

  return createUploadAttempt(_(options).defaults(this.assetOptions))
    .then((attemptId) => uploadWithAttemptId([attemptId]))
    .then((attempt) => {
      this.uploadState = UPLOAD_STATES.Completed;
      return attempt;
    })
    .catch((error) => {
      this.uploadState = UPLOAD_STATES.Failed;
      return Q.reject(error);
    });
};

/**
 * Gets the description for an asset, given an assetId
 * @param {String} assetId asset id
 */
AssetManager.prototype.getAssetDescription = (assetId) => {
  let description = '';
  const asset = AssetManager.getAsset(assetId);

  if (asset && asset.tags.length > 0) {
    const descriptionTag = _(asset.tags).find((tag) => tag.name === 'description');

    description = descriptionTag ? descriptionTag.value : description;
  }

  return description;
};

/**
 * Gets the longDescription for an asset, given an assetId
 * @param {String} assetId asset id
 */
AssetManager.prototype.getAssetLongDescription = (assetId) => {
  let longDescription = '';
  const asset = AssetManager.getAsset(assetId);

  if (asset && asset.tags.length > 0) {
    const descriptionTag = _(asset.tags).find((tag) => tag.name === 'longDescription');

    longDescription = descriptionTag ? descriptionTag.value : longDescription;
  }

  return longDescription;
};

/**
 * Get map of given assetIds to assets
 * @param {Array} assetIds Array of asset ids
 */
AssetManager.prototype.getAssetMap = (assetIds) => {
  const { assetMap, uncachedAssetIds } = AssetManager.compareCacheData(assetIds);

  if (uncachedAssetIds.length === 0) {
    return Q.resolve(assetMap);
  }

  const data = {
    ids: assetIds.join(','),
    fields: 'audioSourceUrls, videoSourceUrls, videoThumbnailUrls, fileExtension, tags',
  };

  // If the request is continuously failing,
  // don't make infinite API calls.
  if (AssetManager.GET_FAIL_COUNT >= 1) {
    return Q.reject();
  }

  return Q(AssetManager.apiCaller('/api/assets.v1', data))
    .then((json) => {
      _(json.elements).each((asset) => {
        const { id } = asset;

        // currently, we default to the highest bit rate for audio clips.
        const audioBitRateHigh = '192000';

        if (asset.audioSourceUrls && asset.audioSourceUrls[audioBitRateHigh]) {
          asset.url = asset.audioSourceUrls[audioBitRateHigh]['audio/mp3'];
        }

        assetMap[id] = asset;
        AssetManager.ASSET_CACHE[id] = asset;
      });

      return assetMap;
    })
    .fail((error) => (AssetManager.GET_FAIL_COUNT += 1));
};

export default AssetManager;
