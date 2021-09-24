'use es6';

import { Map as ImmutableMap } from 'immutable';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import debounce from 'transmute/debounce';
import { EMPTY } from 'SequencesUI/util/LoadingStatus';
import { fetchFolders } from '../api/TemplateApi';
import * as SearchApi from '../api/SearchApi';
import * as TemplateApi from '../api/TemplateApi';
import * as TemplateActionTypes from '../constants/TemplateActionTypes';
import { TEMPLATE_BATCH_FETCH_SUCCEEDED } from '../constants/SequenceActionTypes';
export var fetchTemplateFoldersSucceeded = createAction(TemplateActionTypes.FOLDERS_FETCH_SUCCESS, identity);
export var fetchTemplateFoldersFailed = createAction(TemplateActionTypes.FOLDERS_FETCH_FAILED, identity);
export var templateQueryUpdated = createAction(TemplateActionTypes.TEMPLATE_SEARCH_UPDATE_QUERY, identity);
export var templateSearchFetchSucceeded = createAction(TemplateActionTypes.TEMPLATE_SEARCH_FETCH_SUCCEEDED, identity);
export var templateSearchFetchSucceededV2 = createAction(TemplateActionTypes.V2_TEMPLATE_SEARCH_FETCH_SUCCEEDED, identity);
export var templateSearchFetchFailed = createAction(TemplateActionTypes.TEMPLATE_SEARCH_FETCH_FAILED, identity);
export var newTemplateCreateSucceeded = createAction(TemplateActionTypes.CREATE_SUCCESS, identity);
export var batchTemplateDeleteSucceeded = createAction(TemplateActionTypes.BATCH_TEMPLATE_DELETE_SUCCEEDED, identity);
export var batchTemplateFetchSucceeded = createAction(TEMPLATE_BATCH_FETCH_SUCCEEDED, identity);
export var templateUsageFetchSuccess = createAction(TemplateActionTypes.FETCH_TEMPLATE_USAGE_SUCCESS, identity);
export var templateUsageFetchFailure = createAction(TemplateActionTypes.FETCH_TEMPLATE_USAGE_FAILURE, identity);
export var fetchTemplateFolders = function fetchTemplateFolders() {
  return function (dispatch) {
    fetchFolders().then(function (response) {
      return dispatch(fetchTemplateFoldersSucceeded(response));
    }, function (err) {
      dispatch(fetchTemplateFoldersFailed(err));
    });
  };
};
var _isLoading = false;
export var _search = function _search(_ref) {
  var query = _ref.query,
      _ref$addResults = _ref.addResults,
      addResults = _ref$addResults === void 0 ? false : _ref$addResults;
  return function (dispatch) {
    if (_isLoading) {
      return;
    }

    _isLoading = true;
    SearchApi.search(query).then(function (results) {
      return addResults ? dispatch(templateSearchFetchSucceededV2(results)) : dispatch(templateSearchFetchSucceeded(results));
    }, function (error) {
      dispatch(templateSearchFetchFailed(error));
    }).finally(function () {
      _isLoading = false;
    });
  };
};
export var search = _search;
var debouncedSearch = debounce(100, function (_ref2, dispatch) {
  var query = _ref2.query,
      addResults = _ref2.addResults;
  return _search({
    query: query,
    addResults: addResults
  })(dispatch);
});

var updateQuery = function updateQuery(query) {
  return function (dispatch) {
    dispatch(templateQueryUpdated(query));
  };
};

export var updateQueryAndSearch = function updateQueryAndSearch(_ref3) {
  var query = _ref3.query,
      addResults = _ref3.addResults;
  return function (dispatch) {
    dispatch(updateQuery(query));
    debouncedSearch({
      query: query,
      addResults: addResults
    }, dispatch);
  };
};
export var createNewTemplate = function createNewTemplate(template) {
  return function (dispatch) {
    dispatch(newTemplateCreateSucceeded(template));
  };
};
export var batchFetchTemplates = function batchFetchTemplates(templateIds) {
  return function (dispatch) {
    Promise.all(templateIds.map(function (templateId) {
      return TemplateApi.fetchTemplate(templateId).then(null, function () {
        return EMPTY;
      }).then(function (result) {
        return ImmutableMap().set(templateId, result);
      });
    }).toArray()).then(function (templateResults) {
      var templates = templateResults.reduce(function (acc, result) {
        return acc.merge(result);
      }, ImmutableMap());
      dispatch(batchTemplateFetchSucceeded(templates));
    });
  };
};
export var fetchTemplateUsage = function fetchTemplateUsage() {
  return function (dispatch) {
    return TemplateApi.fetchTemplateUsage().then(function (usage) {
      dispatch(templateUsageFetchSuccess(usage));
    }).catch(function () {
      dispatch(templateUsageFetchFailure());
    });
  };
};