'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef } from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import partial from 'transmute/partial';
import { tracker } from 'SequencesUI/util/UsageTracker';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import isConnectedAccountValid from 'SequencesUI/util/isConnectedAccountValid';
import { canWrite, canUseEnrollments } from 'SequencesUI/lib/permissions';
import * as links from 'SequencesUI/lib/links';
import * as IndexActions from 'SequencesUI/actions/IndexActions';
import { getOwnerName } from 'SequencesUI/util/owner';
import * as SearchApi from 'SequencesUI/api/SearchApi';
import { convertSequenceToSearchResult } from 'SequencesUI/util/convertToSearchResult';
import shouldDisableEnrollments from 'SequencesUI/util/shouldDisableEnrollments';
import * as SequenceSummaryTabNames from 'SequencesUI/constants/SequenceSummaryTabNames';
import UIAutosizedTextInput from 'UIComponents/input/UIAutosizedTextInput';
import UIBreadcrumbs from 'UIComponents/nav/UIBreadcrumbs';
import UIButton from 'UIComponents/button/UIButton';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIForm from 'UIComponents/form/UIForm';
import UIHeader from 'UIComponents/layout/UIHeader';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import UIRouterTab from 'ui-addon-react-router/UIRouterTab';
import UITabs from 'UIComponents/nav/UITabs';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import DeleteSequenceModal from 'SequencesUI/components/DeleteSequenceModal';
import PauseSequenceModal from 'SequencesUI/components/PauseSequenceModal';
import ResumeSequenceModal from 'SequencesUI/components/ResumeSequenceModal';
import UIRouterLink from 'ui-addon-react-router/UIRouterLink';
import createMoveHoverButton from 'SalesContentIndexUI/components/hoverButtons/createMoveHoverButton';
import { SEQUENCES_FOLDER } from 'SalesContentIndexUI/data/constants/FolderContentTypes';
import * as SequenceActions from '../../actions/SequenceActions';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import SequenceCloneOptions from '../cloneOptions/SequenceCloneOptions';
import CloneHoverButton from 'SalesContentIndexUI/components/hoverButtons/CloneHoverButton';
import PauseHoverButton from 'SequencesUI/components/index/PauseHoverButton';
import ResumeHoverButton from 'SequencesUI/components/index/ResumeHoverButton';
import ShareHoverButton from 'SequencesUI/components/index/ShareHoverButton';
import { isUngatedForSettingsTab } from 'SequencesUI/lib/permissions';
var MoveHoverButton = createMoveHoverButton(SearchApi.search, SearchContentTypes.SEQUENCES_FOLDER);
export var SequenceSummaryHeader = createReactClass({
  displayName: "SequenceSummaryHeader",
  propTypes: {
    connectedAccounts: PropTypes.object,
    counts: PropTypes.instanceOf(ImmutableMap),
    disableEnrollments: PropTypes.bool.isRequired,
    fetchSummaryCount: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    selectedTab: PropTypes.string,
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
    usage: PropTypes.shape({
      count: PropTypes.number,
      limit: PropTypes.number
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    this.titleRef = /*#__PURE__*/createRef();
    return {
      showDeleteModal: false,
      showPauseModal: false,
      showResumeModal: false
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    var _this$props = this.props,
        sequence = _this$props.sequence,
        counts = _this$props.counts,
        fetchSummaryCount = _this$props.fetchSummaryCount;

    if (!counts && sequence) {
      fetchSummaryCount(sequence.get('id'));
    }
  },
  onClone: function onClone(searchResult, cloneOptions) {
    var _this = this;

    IndexActions.cloneSequence(searchResult, cloneOptions).then(function (clonedSequence) {
      _this.context.router.push(links.index());

      _this.context.router.push(links.summary(clonedSequence.get('id')));
    }).done();
  },
  trackInteractionEvent: function trackInteractionEvent(action) {
    tracker.track('sequencesInteraction', {
      action: action,
      subscreen: 'sequence-summary'
    });
  },
  handleDeleteClick: function handleDeleteClick(searchResults) {
    var _this2 = this;

    this.setState({
      showDeleteModal: false
    });
    IndexActions.deleteSequence({
      searchResults: searchResults
    }).then(function () {
      _this2.context.router.push(links.index());
    }).catch(rethrowError).done();
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
  handleSummaryTitleSubmitted: function handleSummaryTitleSubmitted(ev) {
    ev.preventDefault();
    document.activeElement.blur();
  },
  handleTitleBlur: function handleTitleBlur() {
    if (!canWrite()) {
      return;
    }

    var newName = this.titleRef.current.value.trim();
    var oldName = this.props.sequence.get('name').trim();

    if (oldName === newName) {
      return;
    }

    this.props.onUpdateName(newName);
  },
  goToSequenceBuilder: function goToSequenceBuilder() {
    var sequence = this.props.sequence;
    var sequenceId = sequence.get('id');
    this.context.router.push({
      pathname: links.edit(sequenceId),
      query: getQueryParams()
    });
    tracker.track('sequencesUsage', {
      action: 'Clicked edit button',
      subscreen: 'sequence-summary'
    });
  },
  enrollContact: function enrollContact(contactSelection) {
    var _this$props2 = this.props,
        sequence = _this$props2.sequence,
        selectedTab = _this$props2.selectedTab;
    this.context.router.push({
      pathname: links.enroll({
        contactSelection: contactSelection,
        id: sequence.get('id'),
        originTab: selectedTab
      }),
      query: getQueryParams()
    });
  },
  renderOwner: function renderOwner() {
    var sequence = this.props.sequence;
    var userView = sequence.get('userView');
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "summary.header.owner",
      options: {
        owner: getOwnerName(userView)
      }
    });
  },
  renderDeleteButton: function renderDeleteButton() {
    var _this3 = this;

    return /*#__PURE__*/_jsx(UIButton, {
      onClick: function onClick() {
        return _this3.setState({
          showDeleteModal: true
        });
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.header.delete"
      })
    });
  },
  renderActions: function renderActions() {
    var _this4 = this;

    var searchResult = convertSequenceToSearchResult(this.props.sequence);
    var onMoveSuccess = partial(IndexActions.moveSequence, searchResult);
    var usage = this.props.usage;
    return /*#__PURE__*/_jsx(EditSequenceTooltip, {
      placement: "bottom",
      subscreen: "sequence-summary",
      children: /*#__PURE__*/_jsx(UIDropdown, {
        buttonSize: "small",
        buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.header.actions"
        }),
        buttonUse: "secondary",
        disabled: !canWrite(),
        onClick: function onClick() {
          return _this4.trackInteractionEvent('Clicked Action for all sequences');
        },
        children: /*#__PURE__*/_jsxs(UIList, {
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
            searchResult: searchResult,
            usage: usage
          }), /*#__PURE__*/_jsx(MoveHoverButton, {
            onMoveToFolder: onMoveSuccess,
            onRemoveFromFolder: onMoveSuccess,
            searchResult: searchResult
          }), this.renderDeleteButton()]
        })
      })
    });
  },
  renderEnrollButton: function renderEnrollButton() {
    var _this$props3 = this.props,
        disableEnrollments = _this$props3.disableEnrollments,
        connectedAccounts = _this$props3.connectedAccounts;

    if (!connectedAccounts || !canUseEnrollments()) {
      return null;
    }

    var inboxConnected = isConnectedAccountValid({
      connectedAccounts: connectedAccounts
    });
    var disableEnrollButton = disableEnrollments || !inboxConnected;
    var tooltipTitle = null;

    if (disableEnrollments) {
      tooltipTitle = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "summary.tooltip.enrollDisabled.disableEnrollments_jsx",
        options: {
          external: true,
          href: links.statusPage()
        },
        elements: {
          Link: UILink
        }
      });
    }

    if (!inboxConnected) {
      tooltipTitle = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "summary.tooltip.enrollDisabled.inboxDisconnected_jsx",
        options: {
          external: true,
          href: links.connectInbox()
        },
        elements: {
          Link: UILink
        }
      });
    }

    return /*#__PURE__*/_jsx(UITooltip, {
      title: tooltipTitle,
      placement: "bottom left",
      disabled: !disableEnrollButton,
      children: /*#__PURE__*/_jsx(UIButton, {
        disabled: disableEnrollButton,
        "data-selenium-test": "sequence-summary-enroll-primary-button",
        onClick: partial(this.enrollContact, null),
        size: "small",
        use: "primary",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.header.enrollContacts"
        })
      })
    });
  },
  renderEditOrViewButton: function renderEditOrViewButton() {
    var message = canWrite() ? 'summary.header.edit' : 'summary.header.view';
    return /*#__PURE__*/_jsx(UIButton, {
      size: "small",
      use: "secondary",
      onClick: this.goToSequenceBuilder,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: message
      })
    });
  },
  renderBackBreadcrumb: function renderBackBreadcrumb() {
    return /*#__PURE__*/_jsx(UIBreadcrumbs, {
      children: /*#__PURE__*/_jsx(UIRouterLink, {
        to: {
          pathname: links.index(),
          query: getQueryParams()
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.breadcrumbs.backToAllSequences"
        })
      })
    });
  },
  renderModals: function renderModals() {
    var _this5 = this;

    var _this$props4 = this.props,
        sequence = _this$props4.sequence,
        counts = _this$props4.counts;

    if (!this.state.showPauseModal && !this.state.showDeleteModal && !this.state.showResumeModal) {
      return null;
    }

    var searchResults = fromJS([convertSequenceToSearchResult(sequence)]);
    var numberOfContactsInSequence = counts && counts.get('executing') || 0;

    if (this.state.showDeleteModal) {
      return /*#__PURE__*/_jsx(DeleteSequenceModal, {
        searchResults: searchResults,
        numberOfContactsInSequence: numberOfContactsInSequence,
        onConfirm: function onConfirm() {
          return _this5.handleDeleteClick(searchResults);
        },
        onReject: function onReject() {
          return _this5.setState({
            showDeleteModal: false
          });
        }
      });
    } else if (this.state.showPauseModal) {
      return /*#__PURE__*/_jsx(PauseSequenceModal, {
        searchResults: searchResults,
        setShowModal: this.handleSetPauseModal,
        subscreen: "sequence-summary"
      });
    } else if (this.state.showResumeModal) {
      return /*#__PURE__*/_jsx(ResumeSequenceModal, {
        searchResults: searchResults,
        setShowModal: this.handleSetResumeModal,
        subscreen: "sequence-summary"
      });
    } else {
      return null;
    }
  },
  renderTabs: function renderTabs() {
    var _this$props5 = this.props,
        location = _this$props5.location,
        sequence = _this$props5.sequence,
        selectedTab = _this$props5.selectedTab;
    return /*#__PURE__*/_jsxs(UITabs, {
      selected: selectedTab,
      children: [/*#__PURE__*/_jsx(UIRouterTab, {
        to: {
          pathname: links.summary(sequence.get('id')),
          search: location.search
        },
        tabId: SequenceSummaryTabNames.PERFORMANCE,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummaryTabs.performance"
        })
      }), /*#__PURE__*/_jsx(UIRouterTab, {
        to: {
          pathname: links.enrollments(sequence.get('id')),
          search: location.search
        },
        tabId: SequenceSummaryTabNames.ENROLLMENTS,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.sequenceSummaryTabs.enrollments"
        })
      }), isUngatedForSettingsTab() && /*#__PURE__*/_jsx(UIRouterTab, {
        to: {
          pathname: links.settings(sequence.get('id')),
          search: location.search
        },
        tabId: SequenceSummaryTabNames.SETTINGS,
        title: "Settings"
      })]
    });
  },
  render: function render() {
    var sequence = this.props.sequence;
    return /*#__PURE__*/_jsxs(UIHeader, {
      title: /*#__PURE__*/_jsx(UIForm, {
        onSubmit: this.handleSummaryTitleSubmitted,
        "data-test-id": "sequence-summary-title-form",
        children: /*#__PURE__*/_jsx(UIAutosizedTextInput, {
          id: "title-input",
          affordance: canWrite(),
          defaultValue: sequence.get('name'),
          onBlur: this.handleTitleBlur,
          readOnly: !canWrite(),
          inputRef: this.titleRef,
          "data-test-id": "sequence-summary-editable-title"
        })
      }),
      breadcrumbs: this.renderBackBreadcrumb(),
      tabs: this.renderTabs(),
      use: "condensed",
      children: [/*#__PURE__*/_jsxs(UIButtonWrapper, {
        children: [this.renderOwner(), this.renderActions(), this.renderEditOrViewButton()]
      }), this.renderEnrollButton(), this.renderModals()]
    });
  }
});
export default connect(function (state, _ref) {
  var sequence = _ref.sequence;
  return {
    connectedAccounts: state.connectedAccounts,
    counts: state.summaryCount.get(sequence.get('id').toString()),
    disableEnrollments: shouldDisableEnrollments(state.enrollHealthStatus),
    usage: state.sequencesUsage
  };
}, {
  fetchSummaryCount: SequenceActions.fetchSummaryCount
})(SequenceSummaryHeader);