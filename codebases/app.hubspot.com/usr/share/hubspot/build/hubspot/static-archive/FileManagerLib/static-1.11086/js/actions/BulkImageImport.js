'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List, Map as ImmutableMap } from 'immutable';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { setPanel } from './Actions';
import { BULK_IMAGE_IMPORT_SUCCEEDED } from 'FileManagerCore/actions/ActionTypes';
import { START_CRAWL_URI_FOR_IMAGES_ATTEMPTED, START_CRAWL_URI_FOR_IMAGES_SUCCEEDED, START_CRAWL_URI_FOR_IMAGES_FAILED, POLL_CRAWL_URI_FOR_IMAGES_ATTEMPTED, POLL_CRAWL_URI_FOR_IMAGES_SUCCEEDED, POLL_CRAWL_URI_FOR_IMAGES_FAILED, BULK_IMAGE_IMPORT_PREVIEW_SELECTED, BULK_IMAGE_IMPORT_PREVIEW_UNSELECTED, BULK_IMAGE_IMPORT_PREVIEW_ALL_SELECTED, BULK_IMAGE_IMPORT_PREVIEW_ALL_UNSELECTED, START_IMAGE_IMPORT_ATTEMPTED, START_IMAGE_IMPORT_SUCCEEDED, START_IMAGE_IMPORT_FAILED, POLL_IMAGE_IMPORT_ATTEMPTED, POLL_IMAGE_IMPORT_SUCCEEDED, POLL_IMAGE_IMPORT_FAILED, BULK_IMAGE_IMPORT_TRY_AGAIN_CLICKED, CRAWL_IMAGES_VALIDATION_STARTED, CRAWL_IMAGES_VALIDATION_COMPLETED } from './ActionTypes';
import { Panels } from '../Constants';
import { postCrawlURIForImages, getCrawlURIResultsForImages, postImportImages, getImportImages } from 'FileManagerCore/api/BulkImageImport';
import { trackInteraction } from 'FileManagerCore/actions/tracking';
import { BulkImagePreview } from '../records/BulkImagePreview';
import { promiseTimeout } from '../utils/promiseTimeout';
var TRACKING_KEY = 'fileManagerBulkImport';
var I18nKey = 'FileManagerLib.notifications.bulkImageImport';

var getSuccessNotificaton = function getSuccessNotificaton() {
  return {
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: I18nKey + ".imageImport.success.all.message"
    }),
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: I18nKey + ".imageImport.success.all.title"
    }),
    type: 'success'
  };
};

var getSuccessNotificatonSome = function getSuccessNotificatonSome() {
  return {
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: I18nKey + ".imageImport.success.some.message"
    }),
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: I18nKey + ".imageImport.success.some.title"
    }),
    type: 'warning'
  };
};

var getSuccessNotificatonNone = function getSuccessNotificatonNone() {
  return {
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: I18nKey + ".imageImport.success.none.message"
    }),
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: I18nKey + ".imageImport.success.none.title"
    }),
    type: 'danger'
  };
};

var getCrawlErrorNotification = function getCrawlErrorNotification(status, errorType) {
  switch (status) {
    case 400:
      {
        if (errorType === 'SCAN_BAD_REQUEST') {
          return {
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error.message"
            }),
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error.title"
            }),
            type: 'danger'
          };
        } else if (errorType === 'SCAN_REQUEST_FAILURE') {
          return {
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error400ScanFailure.message"
            }),
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error400ScanFailure.title"
            }),
            type: 'danger'
          };
        } else if (errorType === 'SCAN_REQUEST_FAILURE_TOO_MANY_REDIRECTS') {
          return {
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error400ScanFailureTooManyRedirects.message"
            }),
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error400ScanFailureTooManyRedirects.title"
            }),
            type: 'danger'
          };
        } else if (errorType === 'SCAN_REQUEST_FAILURE_TOO_MANY_IMAGES') {
          return {
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error400ScanImageLimit.message"
            }),
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: I18nKey + ".crawl.error400ScanImageLimit.title"
            }),
            type: 'danger'
          };
        }

        return {
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: I18nKey + ".crawl.error.message"
          }),
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: I18nKey + ".crawl.error.title"
          }),
          type: 'danger'
        };
      }

    default:
      return {
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: I18nKey + ".crawl.error.message"
        }),
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: I18nKey + ".crawl.error.title"
        }),
        type: 'danger'
      };
  }
};

var getImportErrorNotification = function getImportErrorNotification(status) {
  switch (status) {
    case 400:
      {
        return {
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: I18nKey + ".imageImport.error.message"
          }),
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: I18nKey + ".imageImport.title"
          }),
          type: 'danger'
        };
      }

    case 500:
    default:
      return {
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: I18nKey + ".imageImport.error.message"
        }),
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: I18nKey + ".imageImport.error.title"
        }),
        type: 'danger'
      };
  }
};

export var startCrawlUriForImages = function startCrawlUriForImages(uri) {
  return function (dispatch) {
    dispatch({
      type: START_CRAWL_URI_FOR_IMAGES_ATTEMPTED,
      payload: {
        uri: uri
      }
    });
    dispatch(trackInteraction(TRACKING_KEY, 'submit url'));
    return postCrawlURIForImages({
      uri: uri
    }).then(function (_ref) {
      var id = _ref.id;
      dispatch({
        type: START_CRAWL_URI_FOR_IMAGES_SUCCEEDED,
        payload: {
          crawlId: id
        }
      });
    }).catch(function (response) {
      var status = response.status,
          responseJSON = response.responseJSON;
      dispatch({
        type: START_CRAWL_URI_FOR_IMAGES_FAILED,
        payload: {
          error: responseJSON
        }
      });
      FloatingAlertStore.addAlert(getCrawlErrorNotification(status, responseJSON.errorType));
    });
  };
};

var validateImage = function validateImage(_ref2) {
  var uri = _ref2.uri,
      filename = _ref2.filename;
  return new Promise(function (resolve, reject) {
    var img = new Image();

    img.onload = function () {
      resolve({
        filename: filename,
        uri: uri,
        width: img.width,
        height: img.height
      });
    };

    img.onerror = function (error) {
      return reject(error);
    };

    img.src = uri;
  });
};

var validateImages = function validateImages(images) {
  return function (dispatch) {
    dispatch({
      type: CRAWL_IMAGES_VALIDATION_STARTED
    });
    Promise.all(images.map(function (image) {
      return promiseTimeout(20000, validateImage(image)).then(function (meta) {
        return {
          status: 'fulfilled',
          value: meta
        };
      }, function (error) {
        return {
          status: 'rejected',
          reason: error
        };
      });
    })).then(function (results) {
      var validImages = results.filter(function (result) {
        return result.status === 'fulfilled';
      }).filter(function (item) {
        return item.value.height > 10 && item.value.width > 10;
      }).map(function (item) {
        return BulkImagePreview(item.value);
      });
      dispatch({
        type: CRAWL_IMAGES_VALIDATION_COMPLETED,
        payload: {
          previews: List(validImages)
        }
      });
      dispatch(trackInteraction(TRACKING_KEY, 'display previews', {
        imageCount: validImages.length
      }));
    });
  };
};

export var pollCrawlUriForImages = function pollCrawlUriForImages(id) {
  return function (dispatch) {
    dispatch({
      type: POLL_CRAWL_URI_FOR_IMAGES_ATTEMPTED,
      payload: {
        id: id
      }
    });
    return getCrawlURIResultsForImages({
      id: id
    }).then(function (_ref3) {
      var status = _ref3.status,
          responseJSON = _ref3.responseJSON;

      if (status === 200) {
        dispatch({
          type: POLL_CRAWL_URI_FOR_IMAGES_SUCCEEDED
        });
        dispatch(validateImages(responseJSON));
      }
    }).catch(function (response) {
      var status = response.status,
          responseJSON = response.responseJSON;
      dispatch({
        type: POLL_CRAWL_URI_FOR_IMAGES_FAILED,
        payload: {
          error: responseJSON
        }
      });
      FloatingAlertStore.addAlert(getCrawlErrorNotification(status, responseJSON.errorType));
    });
  };
};
export var selectPreviewImage = function selectPreviewImage(uri) {
  return function (dispatch) {
    dispatch({
      type: BULK_IMAGE_IMPORT_PREVIEW_SELECTED,
      payload: {
        uri: uri
      }
    });
  };
};
export var unselectPreviewImage = function unselectPreviewImage(uri) {
  return function (dispatch) {
    dispatch({
      type: BULK_IMAGE_IMPORT_PREVIEW_UNSELECTED,
      payload: {
        uri: uri
      }
    });
  };
};
export var selectAllPreviewImages = function selectAllPreviewImages() {
  return {
    type: BULK_IMAGE_IMPORT_PREVIEW_ALL_SELECTED
  };
};
export var unselectAllPreviewImages = function unselectAllPreviewImages() {
  return {
    type: BULK_IMAGE_IMPORT_PREVIEW_ALL_UNSELECTED
  };
};
export var tryAgain = function tryAgain() {
  return {
    type: BULK_IMAGE_IMPORT_TRY_AGAIN_CLICKED
  };
};
export var startImageImport = function startImageImport(selectedURIs) {
  return function (dispatch) {
    dispatch({
      type: START_IMAGE_IMPORT_ATTEMPTED,
      payload: {
        selectedURIs: selectedURIs
      }
    });
    dispatch(trackInteraction(TRACKING_KEY, 'click import images', {
      imageCount: selectedURIs.size
    }));
    return postImportImages(selectedURIs).then(function (_ref4) {
      var id = _ref4.id;
      dispatch({
        type: START_IMAGE_IMPORT_SUCCEEDED,
        payload: {
          importId: id
        }
      });
    }).catch(function (error) {
      dispatch({
        type: START_IMAGE_IMPORT_FAILED,
        payload: {
          error: error
        }
      });
      FloatingAlertStore.addAlert(getImportErrorNotification());
    });
  };
};
export var pollImageImport = function pollImageImport(id) {
  return function (dispatch) {
    dispatch({
      type: POLL_IMAGE_IMPORT_ATTEMPTED,
      payload: {
        id: id
      }
    });
    return getImportImages({
      id: id
    }).then(function (response) {
      if (response.status === 200) {
        var _response$responseJSO = response.responseJSON,
            withErrors = _response$responseJSO.withErrors,
            results = _response$responseJSO.results; // for continuity

        dispatch({
          type: POLL_IMAGE_IMPORT_SUCCEEDED
        }); // dispatch file action to add to file state.

        dispatch({
          type: BULK_IMAGE_IMPORT_SUCCEEDED,
          payload: {
            results: results.map(function (item) {
              return ImmutableMap(item);
            })
          }
        }); // change panels on success.

        dispatch(setPanel({
          activePanel: Panels.BROWSE
        }));

        if (withErrors && results.length > 0) {
          FloatingAlertStore.addAlert(getSuccessNotificatonSome());
        } else if (withErrors && results.length === 0) {
          FloatingAlertStore.addAlert(getSuccessNotificatonNone());
        } else {
          FloatingAlertStore.addAlert(getSuccessNotificaton());
        }
      }
    }).catch(function (error) {
      dispatch({
        type: POLL_IMAGE_IMPORT_FAILED,
        payload: {
          error: error
        }
      });
      FloatingAlertStore.addAlert(getImportErrorNotification());
    });
  };
};