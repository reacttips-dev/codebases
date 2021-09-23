'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import allSettled from 'hs-promise-utils/allSettled';
import IndexUIActions from 'SalesContentIndexUI/data/actions/IndexUIActions';
import { convertFolderToSearchResult, convertSequenceToSearchResult } from 'SequencesUI/util/convertToSearchResult';
import * as SequenceApi from '../api/SequenceApi';
import * as FolderApi from 'SequencesUI/api/FolderApi';
import * as SearchApi from 'SequencesUI/api/SearchApi';
import { tracker, getSequenceCreateOrEditEventProperties } from 'SequencesUI/util/UsageTracker';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
export function createFolder(folder) {
  FolderApi.createFolder(folder).then(function (res) {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderCreated"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderCreatedMessage"
      }),
      type: 'success'
    });
    IndexUIActions.addResult(convertFolderToSearchResult(res));
    return res;
  }, function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderCreatedError"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderCreatedErrorMessage"
      }),
      type: 'danger'
    });
  });
}
export function updateFolder(id, folder) {
  FolderApi.updateFolder(id, folder).then(function (res) {
    IndexUIActions.updateResult(convertFolderToSearchResult(res));
    return res;
  });
}
export function deleteFolders(folderSearchResults) {
  var folderSearchResultsList = folderSearchResults.toList();
  var promises = folderSearchResultsList.map(function (_ref) {
    var contentId = _ref.contentId;
    return FolderApi.deleteFolder(contentId);
  }).toArray();
  return allSettled(promises).then(function (results) {
    results.forEach(function (_ref2, index) {
      var status = _ref2.status;

      var _folderSearchResultsL = folderSearchResultsList.get(index),
          id = _folderSearchResultsL.id,
          name = _folderSearchResultsL.name;

      if (status === 'fulfilled') {
        return IndexUIActions.removeResult(id);
      }

      return FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.deleteFolderErrorTitle",
          options: {
            name: name
          }
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.deleteFolderErrorMessage"
        }),
        type: 'warning'
      });
    });
  });
}
export function searchSequences(searchQueryRecord) {
  if (searchQueryRecord.get('query')) {
    tracker.track('sequencesInteraction', {
      action: 'Searched sequences',
      subscreen: 'sequences-index'
    });
  }

  return SearchApi.search(searchQueryRecord);
}
export function deleteSequence(_ref3) {
  var searchResults = _ref3.searchResults;
  var count = searchResults.size;
  return SequenceApi.deleteBatch(searchResults.toArray().map(function (result) {
    return result.contentId;
  })).then(function () {
    IndexUIActions.removeResults(searchResults.map(function (result) {
      return result.id;
    }));
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.sequenceDeleteSuccess",
        options: {
          count: count
        }
      }),
      type: 'success'
    });
    tracker.track('createOrEditSequence', {
      action: 'Deleted a sequence'
    });
  }, function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.sequenceDeleteErrorTitle"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.sequenceDeleteErrorMessage",
        options: {
          count: count
        }
      }),
      type: 'danger'
    });
  });
}
export function cloneSequence(searchResult, cloneOptions) {
  return SequenceApi.clone({
    cloneSequenceToFolderId: cloneOptions.folderId,
    cloneTemplateToFolderId: cloneOptions.cloneTemplateToFolderId,
    sequenceIdToClone: searchResult.contentId,
    sequenceName: cloneOptions.name,
    shouldCloneTemplates: Boolean(cloneOptions.shouldCloneTemplates)
  }).then(function (sequence) {
    tracker.track('createOrEditSequence', Object.assign({
      action: 'Created sequence',
      type: 'cloned'
    }, getSequenceCreateOrEditEventProperties(sequence)));
    IndexUIActions.addResult(convertSequenceToSearchResult(sequence));
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.cloneSequence.title"
      }),
      message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "alerts.cloneSequence.message",
        options: {
          name: sequence.get('name')
        }
      }),
      type: 'success'
    });
    return sequence;
  }).catch(function (err) {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "alerts.sequenceNotAdded"
      }),
      message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "alerts.sequenceNotAddedMessage",
        options: {
          name: cloneOptions.name
        }
      }),
      type: 'danger'
    });
    throw err;
  });
}
export function moveSequence(searchResult, folderSearchResult) {
  var newFolderId = folderSearchResult.contentId === 0 ? null : folderSearchResult.contentId;
  var folderWillNotChange = searchResult.folderId === newFolderId || searchResult.has('folderId') === false && !newFolderId;

  if (folderWillNotChange) {
    return;
  }

  SequenceApi.fetch(searchResult.contentId).then(function (sequence) {
    return SequenceApi.update(sequence.get('id'), sequence.set('folderId', newFolderId).toJS());
  }).then(function (res) {
    IndexUIActions.removeResult(searchResult.id);
    return res;
  });
}
export function moveSequences(searchResults, folderSearchResult) {
  var name = folderSearchResult.name;
  var contentIds = searchResults.map(function (searchResult) {
    return searchResult.contentId;
  });
  var ids = searchResults.map(function (searchResult) {
    return searchResult.id;
  });
  var newFolderId = folderSearchResult.contentId === 0 ? null : folderSearchResult.contentId;
  var folderWillNotChange = searchResults.every(function (searchResult) {
    return searchResult.folderId === newFolderId || searchResult.has('folderId') === false && !newFolderId;
  });

  if (folderWillNotChange) {
    return;
  }

  SequenceApi.moveSequences(contentIds, newFolderId).then(function () {
    IndexUIActions.removeResults(ids);
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderUpdated"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderUpdatedMessage",
        options: {
          name: name
        }
      }),
      type: 'success'
    });
  }, function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderUpdatedError"
      }),
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.folderUpdatedErrorMessage",
        options: {
          name: name
        }
      }),
      type: 'danger'
    });
  });
}