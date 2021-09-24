'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap, List } from 'immutable';
import { indexBy } from '../utils/immutableHelpers';
import { PREVIEWS, LOADING, INPUT, IMPORTING } from '../enums/BulkImageImportSteps';
import { SET_PANEL, START_CRAWL_URI_FOR_IMAGES_SUCCEEDED, START_CRAWL_URI_FOR_IMAGES_FAILED, CRAWL_IMAGES_VALIDATION_STARTED, BULK_IMAGE_IMPORT_PREVIEW_SELECTED, BULK_IMAGE_IMPORT_PREVIEW_UNSELECTED, BULK_IMAGE_IMPORT_PREVIEW_ALL_SELECTED, BULK_IMAGE_IMPORT_PREVIEW_ALL_UNSELECTED, START_IMAGE_IMPORT_SUCCEEDED, BULK_IMAGE_IMPORT_TRY_AGAIN_CLICKED, CRAWL_IMAGES_VALIDATION_COMPLETED, POLL_CRAWL_URI_FOR_IMAGES_FAILED, POLL_IMAGE_IMPORT_FAILED } from '../actions/ActionTypes';
var PREVIEWS_STATE_KEY = 'previews';
var IMPORT_STATE_KEY = 'imports';
var defaultState = ImmutableMap((_ImmutableMap = {
  crawlId: null,
  importId: null,
  selectedStep: INPUT
}, _defineProperty(_ImmutableMap, PREVIEWS_STATE_KEY, ImmutableMap()), _defineProperty(_ImmutableMap, IMPORT_STATE_KEY, ImmutableMap({
  results: List(),
  hasErrors: false
})), _defineProperty(_ImmutableMap, "isValidatingImages", false), _ImmutableMap));

var BulkImageImport = function BulkImageImport() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case SET_PANEL:
      {
        return defaultState;
      }

    case START_CRAWL_URI_FOR_IMAGES_SUCCEEDED:
      {
        var crawlId = payload.crawlId;
        return state.merge({
          crawlId: crawlId,
          selectedStep: LOADING
        });
      }

    case POLL_CRAWL_URI_FOR_IMAGES_FAILED:
    case START_CRAWL_URI_FOR_IMAGES_FAILED:
      {
        return state.merge({
          selectedStep: INPUT
        });
      }

    case CRAWL_IMAGES_VALIDATION_STARTED:
      {
        return state.merge({
          isValidatingImages: true
        });
      }

    case POLL_IMAGE_IMPORT_FAILED:
      {
        return state.merge({
          selectedStep: PREVIEWS
        });
      }

    case CRAWL_IMAGES_VALIDATION_COMPLETED:
      {
        var _state$merge;

        var previews = payload.previews;
        return state.merge((_state$merge = {}, _defineProperty(_state$merge, PREVIEWS_STATE_KEY, indexBy(function (preview) {
          return preview.uri;
        }, previews)), _defineProperty(_state$merge, "selectedStep", PREVIEWS), _defineProperty(_state$merge, "isValidatingImages", false), _state$merge));
      }

    case BULK_IMAGE_IMPORT_PREVIEW_SELECTED:
      {
        var uri = payload.uri;
        return state.updateIn([PREVIEWS_STATE_KEY, uri], function (preview) {
          return preview.merge({
            selected: true
          });
        });
      }

    case BULK_IMAGE_IMPORT_PREVIEW_UNSELECTED:
      {
        var _uri = payload.uri;
        return state.updateIn([PREVIEWS_STATE_KEY, _uri], function (preview) {
          return preview.merge({
            selected: false
          });
        });
      }

    case BULK_IMAGE_IMPORT_PREVIEW_ALL_SELECTED:
      {
        return state.update(PREVIEWS_STATE_KEY, function (previews) {
          return previews.map(function (preview) {
            return preview.merge({
              selected: true
            });
          });
        });
      }

    case BULK_IMAGE_IMPORT_PREVIEW_ALL_UNSELECTED:
      {
        return state.update(PREVIEWS_STATE_KEY, function (previews) {
          return previews.map(function (preview) {
            return preview.merge({
              selected: false
            });
          });
        });
      }

    case START_IMAGE_IMPORT_SUCCEEDED:
      {
        var importId = payload.importId;
        return state.merge({
          importId: importId,
          selectedStep: IMPORTING
        });
      }

    case BULK_IMAGE_IMPORT_TRY_AGAIN_CLICKED:
      {
        return state.merge({
          selectedStep: INPUT
        });
      }

    default:
      {
        return state;
      }
  }
};

export default BulkImageImport;