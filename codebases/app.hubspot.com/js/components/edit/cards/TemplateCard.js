'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { connect } from 'react-redux';
import UIBuilderCard from 'UIComponents/card/UIBuilderCard';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { isLoading, isEmpty } from 'SequencesUI/util/LoadingStatus';
import UIIcon from 'UIComponents/icon/UIIcon';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import TemplateErrorCard from './TemplateErrorCard';
import EmailTemplateCardSection from './EmailTemplateCardSection';
import DelaySelector from './DelaySelector';
import AddCardButton from './AddCardButton';
import TopRightCardEdit from './TopRightCardEdit';
var TITLE_USE = 'heffalump';
var TemplateCard = createReactClass({
  displayName: "TemplateCard",
  propTypes: Object.assign({}, EmailTemplateCardSection.propTypes, {
    data: PropTypes.instanceOf(ImmutableMap),
    index: PropTypes.number.isRequired,
    readOnly: PropTypes.bool,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    onDelete: PropTypes.func,
    delay: PropTypes.number,
    moveCardUp: PropTypes.func,
    moveCardDown: PropTypes.func,
    openCardModal: PropTypes.func,
    closeCardModal: PropTypes.func,
    addCardIndex: PropTypes.number,
    isCardModalOpen: PropTypes.bool,
    readOnlyEditorLoaded: PropTypes.bool.isRequired,
    eligibleFollowUpDays: PropTypes.oneOf(Object.values(EligibleFollowUpDays)).isRequired,
    fromCreatePage: PropTypes.bool,
    deleteStep: PropTypes.func.isRequired,
    openReplaceTemplatePanel: PropTypes.func.isRequired,
    disableActionsDropdown: PropTypes.bool
  }),
  handleDelete: function handleDelete() {
    var _this$props = this.props,
        index = _this$props.index,
        onDelete = _this$props.onDelete;
    tracker.track('createOrEditSequence', {
      action: 'Deleted email card'
    });
    this.props.deleteStep(index);

    if (onDelete) {
      onDelete();
    }
  },
  renderDelaySelector: function renderDelaySelector() {
    var _this$props2 = this.props,
        index = _this$props2.index,
        delay = _this$props2.delay,
        readOnly = _this$props2.readOnly,
        isFirst = _this$props2.isFirst,
        fromCreatePage = _this$props2.fromCreatePage,
        eligibleFollowUpDays = _this$props2.eligibleFollowUpDays;

    if (isFirst) {
      return null;
    }

    return /*#__PURE__*/_jsx(DelaySelector, {
      index: index,
      delay: delay,
      readOnly: readOnly,
      stepType: SequenceStepTypes.SEND_TEMPLATE,
      fromCreatePage: fromCreatePage,
      eligibleFollowUpDays: eligibleFollowUpDays
    });
  },
  renderTemplateContent: function renderTemplateContent() {
    var _this$props3 = this.props,
        data = _this$props3.data,
        index = _this$props3.index,
        firstTemplateStepIndex = _this$props3.firstTemplateStepIndex,
        useThreadedFollowUps = _this$props3.useThreadedFollowUps,
        readOnly = _this$props3.readOnly,
        readOnlyEditorLoaded = _this$props3.readOnlyEditorLoaded,
        fromCreatePage = _this$props3.fromCreatePage,
        openReplaceTemplatePanel = _this$props3.openReplaceTemplatePanel;

    if (isLoading(data) || !readOnlyEditorLoaded) {
      return /*#__PURE__*/_jsx("div", {
        "data-shepherd": "template-node",
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })
      });
    }

    return /*#__PURE__*/_jsxs("div", {
      children: [this.renderDelaySelector(), /*#__PURE__*/_jsx(EmailTemplateCardSection, {
        data: data,
        index: index,
        firstTemplateStepIndex: firstTemplateStepIndex,
        useThreadedFollowUps: useThreadedFollowUps,
        readOnly: readOnly,
        readOnlyEditorLoaded: readOnlyEditorLoaded,
        fromCreatePage: fromCreatePage,
        openReplaceTemplatePanel: openReplaceTemplatePanel
      })]
    });
  },
  renderCardActionButtons: function renderCardActionButtons() {
    var _this$props4 = this.props,
        isLast = _this$props4.isLast,
        isFirst = _this$props4.isFirst,
        fromCreatePage = _this$props4.fromCreatePage,
        disableActionsDropdown = _this$props4.disableActionsDropdown;

    if (fromCreatePage) {
      return null;
    }

    return /*#__PURE__*/_jsx(TopRightCardEdit, {
      titleUse: TITLE_USE,
      isLast: isLast,
      isFirst: isFirst,
      moveCardDown: this.props.moveCardDown,
      moveCardUp: this.props.moveCardUp,
      handleDelete: this.handleDelete,
      disabled: disableActionsDropdown
    });
  },
  renderAddCardButton: function renderAddCardButton() {
    var fromCreatePage = this.props.fromCreatePage;

    if (fromCreatePage) {
      return null;
    }

    return /*#__PURE__*/_jsx(AddCardButton, {
      index: this.props.index,
      openCardModal: this.props.openCardModal,
      closeCardModal: this.props.closeCardModal,
      addCardIndex: this.props.addCardIndex,
      isCardModalOpen: this.props.isCardModalOpen
    });
  },
  renderBuilderCard: function renderBuilderCard() {
    var index = this.props.index;
    return /*#__PURE__*/_jsx(UIBuilderCard, {
      className: "m-bottom-2 p-all-0",
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.templateNode.cardTitle",
        options: {
          index: index + 1
        }
      }),
      titleIcon: /*#__PURE__*/_jsx(UIIcon, {
        name: "send",
        size: "xxs"
      }),
      titleUse: TITLE_USE,
      clickable: false,
      hovered: false,
      TitleAction: this.renderCardActionButtons,
      children: this.renderTemplateContent()
    });
  },
  renderTemplateErrorCard: function renderTemplateErrorCard() {
    var _this$props5 = this.props,
        index = _this$props5.index,
        onDelete = _this$props5.onDelete,
        openCardModal = _this$props5.openCardModal,
        closeCardModal = _this$props5.closeCardModal,
        addCardIndex = _this$props5.addCardIndex,
        isCardModalOpen = _this$props5.isCardModalOpen,
        deleteStep = _this$props5.deleteStep;
    return /*#__PURE__*/_jsx(TemplateErrorCard, {
      index: index,
      onDelete: onDelete,
      openCardModal: openCardModal,
      closeCardModal: closeCardModal,
      addCardIndex: addCardIndex,
      isCardModalOpen: isCardModalOpen,
      deleteStep: deleteStep
    });
  },
  render: function render() {
    var _this$props6 = this.props,
        data = _this$props6.data,
        fromCreatePage = _this$props6.fromCreatePage;

    if (isEmpty(data)) {
      return this.renderTemplateErrorCard();
    }

    var className = 'editor-list-card-template' + (fromCreatePage ? " from-create" : "");
    return /*#__PURE__*/_jsxs("div", {
      className: "editor-list-template-package",
      "data-selenium-test": "builder-card",
      children: [/*#__PURE__*/_jsx("div", {
        className: className,
        children: this.renderBuilderCard()
      }), this.renderAddCardButton()]
    });
  }
});
export default connect(null, {
  deleteStep: SequenceEditorActions.deleteStep
})(TemplateCard);