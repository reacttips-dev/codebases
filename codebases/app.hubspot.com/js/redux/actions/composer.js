'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { createAction } from 'flux-actions';
import { identity } from 'underscore';
import { replace } from 'react-router-redux';
import { List } from 'immutable';
import { stringify } from 'hub-http/helpers/params';
import I18n from 'I18n';
import { showNotification } from './ui';
import { currentLocation, getPortalId } from '../selectors';
import { isComposerEmbed } from '../selectors/embed';
import actionTypes from './actionTypes';
import ActionMapper from '../../lib/legacyRequestActionMapper';
import { COMPOSER_QUERY_PARAMS, COMPOSER_MODES, COMPOSER_UPLOAD_FOLDER_PATH } from '../../lib/constants';
import { logDebug } from '../../lib/utils';
import { trackInteraction } from './usage';
import { getMessage } from '../selectors/composer';
import { getTwitterChannels, getNetworksFromChannels } from '../selectors/channels';
import ValidationError from '../../components/composer/ValidationError';
import BroadcastManager from '../../data/BroadcastManager';
import FileManager from '../../data/FileManager';
import PagePreview from '../../data/model/PagePreview';
import FMFile from '../../data/model/FMFile';
import ImageInfo from '../../data/model/ImageInfo';
import TwitterStatus from '../../data/model/TwitterStatus';
import { fetchContent } from './content';
import allSettled from 'hs-promise-utils/allSettled';
import { initApproveBroadcasts, initBroadcastGroup, openBroadcast } from './broadcastGroup';
var broadcastManager = BroadcastManager.getInstance();
var fileManager = FileManager.getInstance();
var fileUploadProgress = createAction(actionTypes.FILE_UPLOAD_PROGRESS, identity);
var fileUploadInitial = createAction(actionTypes.FILE_UPLOAD_INITIAL, identity); // const imageInfoBulkFetchAction = createAction(actionTypes.FILE_MANAGER_BULK_INFO_FETCH, identity);

export var openComposerByQueryParams = function openComposerByQueryParams() {
  return function (dispatch, getState) {
    var state = getState();
    var location = currentLocation(state);
    var composerMode = COMPOSER_MODES[location.query.composer];
    var broadcastGuids = location.query.broadcastGuids;

    if (composerMode === COMPOSER_MODES.edit && broadcastGuids) {
      dispatch(openBroadcast(broadcastGuids));
    } else if (composerMode === COMPOSER_MODES.approve && broadcastGuids) {
      dispatch(initApproveBroadcasts(List(broadcastGuids.split(','))));
    } else if (composerMode === COMPOSER_MODES.create) {
      dispatch(initBroadcastGroup());
    }
  };
};
export var onComposerOpened = function onComposerOpened(composerMode, broadcastGuids) {
  return function (dispatch, getState) {
    var state = getState();

    if (!isComposerEmbed(state)) {
      var location = currentLocation(state);
      var newQueryWithComposer = Object.assign({}, location.query, {
        composer: composerMode,
        broadcastGuids: broadcastGuids ? broadcastGuids.join(',') : null
      });
      dispatch(replace({
        pathname: location.pathname,
        query: newQueryWithComposer
      }));
    }
  };
};
export var onComposerClosed = function onComposerClosed() {
  return function (dispatch, getState) {
    var state = getState();

    if (!isComposerEmbed(state)) {
      var location = currentLocation(state);
      var queryWithoutComposer = Object.assign({}, location.query);
      COMPOSER_QUERY_PARAMS.forEach(function (param) {
        return delete queryWithoutComposer[param];
      });
      dispatch(replace({
        pathname: location.pathname,
        search: Object.keys(queryWithoutComposer).length ? "?" + stringify(queryWithoutComposer) : null
      }));
    }
  };
};
export var fetchImageInfo = function fetchImageInfo(imageUrl, url) {
  var isTwitterCard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch, getState) {
    var availableNetworks = getNetworksFromChannels(getState());
    return dispatch({
      type: actionTypes.FILE_MANAGER_INFO_FETCH,
      payload: {
        imageUrl: imageUrl,
        url: url,
        isTwitterCard: isTwitterCard,
        networks: availableNetworks
      },
      apiRequest: function apiRequest() {
        return fileManager.fetchImageInfo(imageUrl).then(function (data) {
          return ImageInfo.createFrom(Object.assign({}, data, {
            url: imageUrl,
            loaded: true
          }));
        }).catch(function () {
          return ImageInfo.createFrom({
            error: true,
            url: imageUrl
          });
        });
      }
    });
  };
};

var handleImagesAfterLoadingAttempt = function handleImagesAfterLoadingAttempt(previewsData, url, options) {
  return function (dispatch, getState) {
    var preview = PagePreview.createFrom(Object.assign({}, previewsData[0], {
      loading: false
    }));

    var _getState = getState(),
        campaigns = _getState.campaigns;

    var portalId = getPortalId(getState());
    preview.images.slice(0, 10).map(function (image) {
      return dispatch(fetchImageInfo(image.url, url));
    });

    if (preview.twitterCard && preview.twitterCard.getIn(['image', 'url'])) {
      dispatch(fetchImageInfo(preview.twitterCard.getIn(['image', 'url']), url, true));
    }

    if (options.fetchContent && preview.hubspotContentId) {
      if (preview.hubspotPortalId === portalId) {
        dispatch(fetchContent(preview.hubspotContentId, options.index));
      } else if (preview.hubspotPortalId) {
        logDebug("Url " + url + " sharing COS content from another portalId: " + preview.hubspotPortalId + ", not associated content");
      }
    }

    if (preview.hubspotCampaignId && campaigns) {
      // possible this content and its campaign belong to another portal
      if (!campaigns.get(preview.hubspotCampaignId)) {
        return preview.delete('hubspotCampaignId');
      }
    }

    return preview;
  };
};

export var fetchPagePreview = function fetchPagePreview(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    return dispatch({
      type: actionTypes.PAGE_PREVIEW_FETCH,
      payload: Object.assign({}, options, {
        url: url
      }),
      apiRequest: function apiRequest() {
        return broadcastManager.fetchPagePreview([url]).then(function (previewsData) {
          return dispatch(handleImagesAfterLoadingAttempt(previewsData, url, options));
        }).catch(function () {
          dispatch(trackInteraction('error fetching page preview', {
            url: url
          }));
          return PagePreview.createFrom({
            loading: false
          });
        });
      }
    });
  };
};

function showMediaUploadValidationError(dispatch, message, file, errors, opts) {
  var validationErrorContent = /*#__PURE__*/_jsx("ul", {
    children: errors.map(function (errorCode) {
      return /*#__PURE__*/_jsx("li", {
        className: "error",
        children: /*#__PURE__*/_jsx("span", {
          className: "content",
          children: /*#__PURE__*/_jsx(ValidationError, {
            allowedExtensions: message.getAllowedFileExtensions(opts),
            message: message,
            errorCode: errorCode,
            file: file
          })
        })
      }, errorCode);
    })
  });

  var notification = {
    id: actionTypes.SHOW_NOTIFICATION,
    type: 'danger',
    titleText: I18n.text("sui.upload.errorTitle"),
    message: validationErrorContent
  };
  dispatch(showNotification(notification));
}

export var uploadFile = function uploadFile(fileData, index) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (dispatch, getState) {
    var _opts$replaceWithPhot = opts.replaceWithPhoto,
        replaceWithPhoto = _opts$replaceWithPhot === void 0 ? false : _opts$replaceWithPhot,
        _opts$addToMultiImage = opts.addToMultiImage,
        addToMultiImage = _opts$addToMultiImage === void 0 ? false : _opts$addToMultiImage;
    var sourceId = "composer-" + index;
    dispatch(fileUploadInitial({
      name: fileData.name,
      type: fileData.type,
      sourceId: sourceId
    }));
    return dispatch({
      type: actionTypes.FILE_UPLOAD,
      payload: {
        index: index,
        sourceId: sourceId,
        replaceWithPhoto: replaceWithPhoto,
        // TODO where is this being used?
        addToMultiImage: addToMultiImage,
        name: fileData.name
      },
      apiRequest: function apiRequest() {
        return fileManager.uploadFile(fileData, {
          folderPath: COMPOSER_UPLOAD_FOLDER_PATH
        }, function (data) {
          data.name = fileData.name;
          dispatch(fileUploadProgress(data));
        }).then(function (data) {
          var file = FMFile.createFrom(data.objects[0]);
          var message = getMessage(getState(), index);

          var validateAndReturnFile = function validateAndReturnFile(finalFile) {
            var errors = finalFile.validateForMessage(message);

            if (!errors.isEmpty()) {
              showMediaUploadValidationError(dispatch, message, finalFile, errors);
              return null;
            }

            return finalFile;
          };

          if (file.isAnimated()) {
            return fileManager.fetchImageInfo(file.url).then(function (imageInfo) {
              return validateAndReturnFile(file.set('frameCount', imageInfo.frameCount));
            });
          } else {
            return validateAndReturnFile(file);
          }
        });
      }
    });
  };
}; // downloads into File Manager

export var downloadFromUrl = function downloadFromUrl(broadcast, index) {
  var replaceWithPhoto = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch) {
    return dispatch({
      type: actionTypes.FILE_MANAGER_DOWNLOAD_FROM_URL,
      payload: {
        index: index,
        replaceWithPhoto: replaceWithPhoto
      },
      apiRequest: function apiRequest() {
        return fileManager.downloadFromUrl(broadcast.getImage(), {
          folderPath: COMPOSER_UPLOAD_FOLDER_PATH
        }).then(FMFile.createFrom);
      }
    });
  };
};
export var downloadPhotos = function downloadPhotos(dispatch, broadcastGroup) {
  var messages = broadcastGroup.messages.filter(function (m) {
    return m.shouldDownloadFile();
  });
  var photoUrls = messages.map(function (m) {
    return m.broadcast.content.get('photoUrl');
  }).toOrderedSet();
  var promises = photoUrls.toArray().map(function (url) {
    return fileManager.downloadFromUrl(url, {
      folderPath: COMPOSER_UPLOAD_FOLDER_PATH
    }).then(function (data) {
      return {
        url: url,
        file: FMFile.createFrom(data)
      };
    });
  });
  return allSettled(promises).then(function (results) {
    results.forEach(function (result) {
      var url = result.status === 'fulfilled' ? result.value.url : result.reason.url;
      var messagesWithUrl = messages.filter(function (m) {
        return m.broadcast.content.get('photoUrl') === url;
      });
      messagesWithUrl.forEach(function (m) {
        if (result.status === 'fulfilled') {
          dispatch({
            type: ActionMapper.success(actionTypes.FILE_MANAGER_DOWNLOAD_FROM_URL),
            data: result.value.file,
            payload: {
              uid: m.uid,
              replaceWithPhoto: true
            }
          });
        } else {
          dispatch({
            type: ActionMapper.error(actionTypes.FILE_MANAGER_DOWNLOAD_FROM_URL),
            payload: {
              uid: m.uid
            }
          });
        }
      });
    });
  });
}; // downloads into File Manager

export var fetchTwitterStatus = function fetchTwitterStatus(channelKey, twitterStatusId, index) {
  return function (dispatch, getState) {
    if (!channelKey) {
      channelKey = getTwitterChannels(getState()).first().channelKey;
    }

    return dispatch({
      type: actionTypes.TWITTER_STATUS_FETCH,
      payload: {
        index: index
      },
      apiRequest: function apiRequest() {
        return broadcastManager.fetchTwitterStatus(channelKey, twitterStatusId).then(TwitterStatus.createFrom);
      }
    });
  };
};