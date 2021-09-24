'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { NavMarker } from 'react-rhumb';
import partial from 'transmute/partial';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as IndexActions from 'SequencesUI/actions/IndexActions';
import { canWrite } from 'SequencesUI/lib/permissions';
import { getUserId, getTeamIds } from 'SequencesUI/util/userContainerUtils';
import { tracker } from 'SequencesUI/util/UsageTracker';
import createConnectedIndexTableContainer from 'SalesContentIndexUI/containers/createConnectedIndexTableContainer';
import createFolderNavPrompt from 'SalesContentIndexUI/components/folderNav/createFolderNavPrompt';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import RenameFolderTableActionButton from 'SalesContentIndexUI/components/tableActionButtons/RenameFolderTableActionButton';
import * as SearchApi from 'SequencesUI/api/SearchApi';
import SequenceTableRow from 'SequencesUI/components/index/SequenceTableRow';
import SequenceFolderRow from 'SequencesUI/components/index/SequenceFolderRow';
import IndexTableColumns from 'SequencesUI/lib/IndexTableColumns';
import UIList from 'UIComponents/list/UIList';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import SequencesIntroState from 'SequencesUI/components/index/SequencesIntroState';
import DeleteSequenceModal from 'SequencesUI/components/DeleteSequenceModal';

var SuccessMarker = function SuccessMarker() {
  return /*#__PURE__*/_jsx(NavMarker, {
    name: "INDEX_LOAD"
  });
};

var FailureMarker = function FailureMarker() {
  return /*#__PURE__*/_jsx(NavMarker, {
    name: "INDEX_FAIL"
  });
};

var SequencesIndexTableContainer = createConnectedIndexTableContainer({
  looseItemContentType: SearchContentTypes.SEQUENCE,
  folderContentType: SearchContentTypes.SEQUENCES_FOLDER,
  getUserId: getUserId,
  getTeamIds: getTeamIds,
  tableColumns: IndexTableColumns,
  searchFetch: IndexActions.searchSequences,
  TableRow: SequenceTableRow,
  FolderRow: SequenceFolderRow,
  EmptyState: SequencesIntroState,
  useOwnerViewFilters: true
});
var FolderNavPrompt = createFolderNavPrompt(SearchApi.search, SearchContentTypes.SEQUENCES_FOLDER);
export default createReactClass({
  displayName: "SequencesIndexTable",
  propTypes: {
    updateTableContentState: PropTypes.func.isRequired,
    location: PropTypes.object
  },
  getInitialState: function getInitialState() {
    return {
      showDeleteModal: false
    };
  },
  handleMoveSequences: function handleMoveSequences(searchResults) {
    FolderNavPrompt({
      searchResults: searchResults
    }).then(partial(IndexActions.moveSequences, searchResults)).catch(rethrowError);
  },
  handleRenameFolderConfirm: function handleRenameFolderConfirm(folder) {
    var folderId = folder.contentId;
    IndexActions.updateFolder(folderId, {
      id: folderId,
      name: folder.name
    });
  },
  handleCreateFolder: function handleCreateFolder(folder) {
    IndexActions.createFolder({
      name: folder.name
    });
    tracker.track('sequencesUsage', {
      action: 'Created a folder',
      subscreen: 'sequences-index'
    });
  },
  renderDeleteModal: function renderDeleteModal() {
    var _this = this;

    var selectedResults = this.state.selectedResults;

    if (!this.state.showDeleteModal) {
      return null;
    }

    var numberOfContactsInSequence = selectedResults.reduce(function (acc, result) {
      return acc + result.getIn(['metadata', 'analyticsData', 'executing']);
    }, 0);
    return /*#__PURE__*/_jsx(DeleteSequenceModal, {
      searchResults: selectedResults,
      numberOfContactsInSequence: numberOfContactsInSequence,
      onConfirm: function onConfirm() {
        _this.setState({
          showDeleteModal: false
        });

        IndexActions.deleteSequence({
          searchResults: selectedResults
        });
      },
      onReject: function onReject() {
        return _this.setState({
          showDeleteModal: false
        });
      }
    });
  },
  renderFolderTableActionButtons: function renderFolderTableActionButtons(selectedFolders) {
    if (!canWrite()) {
      return null;
    }

    return /*#__PURE__*/_jsxs(UIList, {
      childClassName: "m-left-3",
      inline: true,
      children: [/*#__PURE__*/_jsx(RenameFolderTableActionButton, {
        selectedFolder: selectedFolders.first(),
        disabled: selectedFolders.size > 1,
        onRenameSuccess: this.handleRenameFolderConfirm
      }), /*#__PURE__*/_jsxs(UIButton, {
        use: "link",
        onClick: partial(IndexActions.deleteFolders, selectedFolders),
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "delete",
          className: "m-right-2"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.sequenceTable.actionButtons.delete"
        })]
      })]
    });
  },
  renderSearchResultTableActionButtons: function renderSearchResultTableActionButtons(selectedResults) {
    var _this2 = this;

    if (!canWrite()) {
      return null;
    }

    return /*#__PURE__*/_jsxs(UIList, {
      childClassName: "m-left-3",
      inline: true,
      children: [/*#__PURE__*/_jsxs(UIButton, {
        use: "link",
        onClick: partial(this.handleMoveSequences, selectedResults),
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "folder",
          className: "m-right-2"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.sequenceTable.actionButtons.move"
        })]
      }), /*#__PURE__*/_jsxs(UIButton, {
        use: "link",
        onClick: function onClick() {
          _this2.setState({
            showDeleteModal: true,
            selectedResults: selectedResults
          });
        },
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "delete",
          className: "m-right-2"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.sequenceTable.actionButtons.delete"
        })]
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(SequencesIndexTableContainer, {
        onTableContentStateChanged: this.props.updateTableContentState,
        SuccessMarker: SuccessMarker,
        FailureMarker: FailureMarker,
        renderFolderTableActionButtons: this.renderFolderTableActionButtons,
        renderSearchResultTableActionButtons: this.renderSearchResultTableActionButtons,
        showNewFolderButton: true,
        location: this.props.location,
        saveFolder: this.handleCreateFolder
      }), this.renderDeleteModal()]
    });
  }
});