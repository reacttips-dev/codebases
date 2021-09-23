'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import * as React from 'react';
import { List } from 'immutable';
import partial from 'transmute/partial';
import * as SearchApi from 'SequencesUI/api/SearchApi';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import { canWrite } from 'SequencesUI/lib/permissions';
import * as links from 'SequencesUI/lib/links';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import { edit } from 'SequencesUI/lib/links';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { connect } from 'react-redux';
import UIRouterLink from 'ui-addon-react-router/UIRouterLink';
import { tracker } from 'SequencesUI/util/UsageTracker';
import * as IndexActions from 'SequencesUI/actions/IndexActions';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import IndexTableRowHoverButtonsSlot from 'SalesContentIndexUI/slots/IndexTableRowHoverButtonsSlot';
import IndexTableRowHoverCell from 'SalesContentIndexUI/components/IndexTableRowHoverCell';
import IndexTableRowHoverDropdown from 'SalesContentIndexUI/components/IndexTableRowHoverDropdown';
import { SEQUENCES_FOLDER } from 'SalesContentIndexUI/data/constants/FolderContentTypes';
import createMoveHoverButton from 'SalesContentIndexUI/components/hoverButtons/createMoveHoverButton';
import CloneHoverButton from 'SalesContentIndexUI/components/hoverButtons/CloneHoverButton';
import DeleteHoverButton from 'SalesContentIndexUI/components/hoverButtons/DeleteHoverButton';
import EditHoverButton from 'SequencesUI/components/index/EditHoverButton';
import PauseHoverButton from 'SequencesUI/components/index/PauseHoverButton';
import ResumeHoverButton from 'SequencesUI/components/index/ResumeHoverButton';
import ShareHoverButton from 'SequencesUI/components/index/ShareHoverButton';
import DeleteSequenceModal from 'SequencesUI/components/DeleteSequenceModal';
import PauseSequenceModal from 'SequencesUI/components/PauseSequenceModal';
import ResumeSequenceModal from 'SequencesUI/components/ResumeSequenceModal';
import SequenceCloneOptions from '../cloneOptions/SequenceCloneOptions';
var MoveHoverButton = createMoveHoverButton(SearchApi.search, SearchContentTypes.SEQUENCES_FOLDER);
var SequenceRowNameCell = createReactClass({
  displayName: "SequenceRowNameCell",
  propTypes: {
    searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
    usage: PropTypes.shape({
      count: PropTypes.number,
      limit: PropTypes.number
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      showDeleteModal: false,
      showPauseModal: false,
      showResumeModal: false
    };
  },
  trackSequenceRowAction: function trackSequenceRowAction() {
    tracker.track('sequencesInteraction', {
      action: 'Clicked Action on a specific sequence row',
      subscreen: 'sequences-index'
    });
  },
  handleDeleteSequence: function handleDeleteSequence(searchResults) {
    this.setState({
      showDeleteModal: false
    });
    IndexActions.deleteSequence({
      searchResults: searchResults
    }).catch(rethrowError);
  },
  handleSetPauseModal: function handleSetPauseModal(res) {
    this.setState({
      showPauseModal: res
    });
  },
  handleSetResumeModal: function handleSetResumeModal(res) {
    this.setState({
      showResumeModal: res
    });
  },
  editSequence: function editSequence() {
    var searchResult = this.props.searchResult;
    var router = this.context.router;
    router.push({
      pathname: edit(searchResult.contentId),
      query: getQueryParams()
    });
  },
  renderDeleteModal: function renderDeleteModal() {
    var _this = this;

    var searchResult = this.props.searchResult;

    if (!this.state.showDeleteModal) {
      return null;
    }

    var searchResults = List([searchResult]);
    var numberOfContactsInSequence = searchResult.getIn(['metadata', 'analyticsData', 'executing']);
    return /*#__PURE__*/_jsx(DeleteSequenceModal, {
      searchResults: searchResults,
      numberOfContactsInSequence: numberOfContactsInSequence,
      onConfirm: function onConfirm() {
        return _this.handleDeleteSequence(searchResults);
      },
      onReject: function onReject() {
        return _this.setState({
          showDeleteModal: false
        });
      }
    });
  },
  renderPauseModal: function renderPauseModal() {
    var searchResult = this.props.searchResult;

    if (!this.state.showPauseModal) {
      return null;
    }

    var searchResults = List([searchResult]);
    return /*#__PURE__*/_jsx(PauseSequenceModal, {
      searchResults: searchResults,
      setShowModal: this.handleSetPauseModal,
      subscreen: "sequences-index"
    });
  },
  renderResumeModal: function renderResumeModal() {
    var searchResult = this.props.searchResult;

    if (!this.state.showResumeModal) {
      return null;
    }

    var searchResults = List([searchResult]);
    return /*#__PURE__*/_jsx(ResumeSequenceModal, {
      searchResults: searchResults,
      setShowModal: this.handleSetResumeModal,
      subscreen: "sequences-index"
    });
  },
  renderButtons: function renderButtons() {
    var _this2 = this;

    var _this$props = this.props,
        searchResult = _this$props.searchResult,
        usage = _this$props.usage;

    if (!canWrite()) {
      return /*#__PURE__*/_jsx(React.Fragment, {});
    }

    var onMoveSuccess = partial(IndexActions.moveSequence, searchResult);
    return /*#__PURE__*/_jsxs(IndexTableRowHoverButtonsSlot, {
      children: [/*#__PURE__*/_jsx(EditHoverButton, {
        searchResult: searchResult,
        onEdit: this.editSequence
      }), /*#__PURE__*/_jsxs(IndexTableRowHoverDropdown, {
        onClick: this.trackSequenceRowAction,
        children: [/*#__PURE__*/_jsx(ShareHoverButton, {
          searchResult: searchResult
        }), /*#__PURE__*/_jsx(PauseHoverButton, {
          searchResult: searchResult,
          setShowModal: this.handleSetPauseModal
        }), /*#__PURE__*/_jsx(ResumeHoverButton, {
          searchResult: searchResult,
          setShowModal: this.handleSetResumeModal
        }), /*#__PURE__*/_jsx(CloneHoverButton, {
          CloneOptionsComponent: SequenceCloneOptions,
          folderContentType: SEQUENCES_FOLDER,
          onClone: function onClone(cloneOptions) {
            return IndexActions.cloneSequence(searchResult, cloneOptions);
          },
          searchResult: this.props.searchResult,
          usage: usage
        }), /*#__PURE__*/_jsx(MoveHoverButton, {
          onMoveToFolder: onMoveSuccess,
          onRemoveFromFolder: onMoveSuccess,
          searchResult: searchResult
        }), /*#__PURE__*/_jsx(DeleteHoverButton, {
          searchResult: searchResult,
          onDeleteItem: function onDeleteItem() {
            return _this2.setState({
              showDeleteModal: true
            });
          }
        })]
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(IndexTableRowHoverCell, {
        content: /*#__PURE__*/_jsx(UIRouterLink, {
          to: {
            pathname: links.summary(this.props.searchResult.contentId),
            query: getQueryParams()
          },
          children: this.props.searchResult.name
        }),
        buttons: this.renderButtons()
      }), this.renderDeleteModal(), this.renderPauseModal(), this.renderResumeModal()]
    });
  }
});
export default connect(function (_ref) {
  var sequencesUsage = _ref.sequencesUsage;
  return {
    usage: sequencesUsage
  };
})(SequenceRowNameCell);