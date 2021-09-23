'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { isLoading, isEmpty } from 'SequencesUI/util/LoadingStatus';
import { getTaskCardIcon } from 'SequencesUI/util/sequenceBuilderUtils';
import { stepHasEmailTemplateId } from 'SequencesUI/util/stepsWithEmailTemplates';
import UIBuilderCard from 'UIComponents/card/UIBuilderCard';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { TODO, EMAIL } from 'customer-data-objects/engagement/TaskTypes';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import TemplateErrorCard from './TemplateErrorCard';
import EmailTemplateCardSection from './EmailTemplateCardSection';
import AddCardButton from './AddCardButton';
import DelaySelector from './DelaySelector';
import TopRightCardEdit from './TopRightCardEdit';
import AddEmailTemplateCardSection from './AddEmailTemplateCardSection';
import ContinueWithoutCompletionToggle from './ContinueWithoutCompletionToggle';
import UIBox from 'UIComponents/layout/UIBox';
var TITLE_USE = 'oz';
var TaskCard = createReactClass({
  displayName: "TaskCard",
  propTypes: Object.assign({}, EmailTemplateCardSection.propTypes, {
    index: PropTypes.number.isRequired,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    payload: PropTypes.instanceOf(ImmutableMap).isRequired,
    delay: PropTypes.number.isRequired,
    readOnly: PropTypes.bool,
    onDelete: PropTypes.func,
    moveCardUp: PropTypes.func,
    moveCardDown: PropTypes.func,
    insertCard: PropTypes.func,
    openCardModal: PropTypes.func,
    closeCardModal: PropTypes.func,
    addCardIndex: PropTypes.number,
    isCardModalOpen: PropTypes.bool,
    fromCreatePage: PropTypes.bool,
    eligibleFollowUpDays: PropTypes.oneOf(Object.values(EligibleFollowUpDays)).isRequired,
    dependencies: PropTypes.instanceOf(ImmutableMap).isRequired,
    onToggleDependency: PropTypes.func.isRequired,
    deleteStep: PropTypes.func.isRequired,
    openEditTaskPanel: PropTypes.func,
    disableActionsDropdown: PropTypes.bool
  }),
  getInitialState: function getInitialState() {
    return {
      showEditTaskModal: false
    };
  },
  handleDelete: function handleDelete() {
    var _this$props = this.props,
        index = _this$props.index,
        onDelete = _this$props.onDelete,
        deleteStep = _this$props.deleteStep;
    deleteStep(index);
    tracker.track('createOrEditSequence', {
      action: 'Deleted task card'
    });

    if (onDelete) {
      onDelete();
    }
  },
  handleEdit: function handleEdit() {
    var _this$props2 = this.props,
        index = _this$props2.index,
        payload = _this$props2.payload,
        readOnly = _this$props2.readOnly,
        openEditTaskPanel = _this$props2.openEditTaskPanel;

    if (readOnly) {
      return;
    }

    openEditTaskPanel({
      index: index,
      payload: payload,
      showTaskForm: true
    });
  },
  shouldUseTaskSubject: function shouldUseTaskSubject() {
    var subject = this.props.payload.getIn(['actionMeta', 'taskMeta', 'subject']);
    return subject === '' || !!subject;
  },
  renderEmailSection: function renderEmailSection() {
    var _this$props3 = this.props,
        data = _this$props3.data,
        index = _this$props3.index,
        payload = _this$props3.payload,
        firstTemplateStepIndex = _this$props3.firstTemplateStepIndex,
        useThreadedFollowUps = _this$props3.useThreadedFollowUps,
        readOnly = _this$props3.readOnly,
        readOnlyEditorLoaded = _this$props3.readOnlyEditorLoaded,
        fromCreatePage = _this$props3.fromCreatePage,
        openEditTaskPanel = _this$props3.openEditTaskPanel;

    if (payload.getIn(['actionMeta', 'taskMeta', 'taskType']) !== EMAIL) {
      return null;
    } // In the sequence library previews, manual email steps do not need a template id


    if (!readOnly && !stepHasEmailTemplateId(payload)) {
      return /*#__PURE__*/_jsx(AddEmailTemplateCardSection, {
        index: index,
        payload: payload,
        openEditTaskPanel: openEditTaskPanel
      });
    }

    if (isLoading(data) || !readOnlyEditorLoaded) {
      return /*#__PURE__*/_jsx("div", {
        className: "editor-list-card-section",
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })
      });
    }

    return /*#__PURE__*/_jsx(EmailTemplateCardSection, {
      data: data,
      index: index,
      firstTemplateStepIndex: firstTemplateStepIndex,
      useThreadedFollowUps: useThreadedFollowUps,
      readOnly: readOnly,
      readOnlyEditorLoaded: readOnlyEditorLoaded,
      fromCreatePage: fromCreatePage,
      isTaskStep: true,
      payload: payload,
      openEditTaskPanel: openEditTaskPanel
    });
  },
  renderDelaySelector: function renderDelaySelector() {
    var _this$props4 = this.props,
        index = _this$props4.index,
        delay = _this$props4.delay,
        readOnly = _this$props4.readOnly,
        isFirst = _this$props4.isFirst,
        fromCreatePage = _this$props4.fromCreatePage,
        eligibleFollowUpDays = _this$props4.eligibleFollowUpDays;

    if (isFirst) {
      return null;
    }

    return /*#__PURE__*/_jsx(DelaySelector, {
      index: index,
      delay: delay,
      readOnly: readOnly,
      stepType: SequenceStepTypes.SCHEDULE_TASK,
      fromCreatePage: fromCreatePage,
      eligibleFollowUpDays: eligibleFollowUpDays
    });
  },
  renderTaskDetails: function renderTaskDetails() {
    var _this$props5 = this.props,
        dependencies = _this$props5.dependencies,
        fromCreatePage = _this$props5.fromCreatePage,
        isLast = _this$props5.isLast,
        onToggleDependency = _this$props5.onToggleDependency,
        payload = _this$props5.payload;
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      className: "editor-list-card-section",
      justify: "between",
      children: [/*#__PURE__*/_jsxs(UIBox, {
        className: "editor-list-card-task-title m-right-1",
        shrink: 1,
        children: [/*#__PURE__*/_jsx("strong", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.taskNode.taskTitleLabel",
            className: "m-right-1"
          })
        }), this.renderTaskContent()]
      }), /*#__PURE__*/_jsx(UIBox, {
        children: /*#__PURE__*/_jsx(ContinueWithoutCompletionToggle, {
          dependencies: dependencies,
          fromCreatePage: fromCreatePage,
          isLast: isLast,
          onToggleDependency: onToggleDependency,
          payload: payload
        })
      })]
    });
  },
  renderTaskContent: function renderTaskContent() {
    var payload = this.props.payload;

    if (this.shouldUseTaskSubject()) {
      var subject = payload.getIn(['actionMeta', 'taskMeta', 'subject']);
      return subject;
    }

    var body = payload.getIn(['actionMeta', 'taskMeta', 'subject']) || payload.getIn(['actionMeta', 'taskMeta', 'notes']);
    return /*#__PURE__*/_jsx("span", {
      dangerouslySetInnerHTML: {
        __html: body
      }
    });
  },
  renderCardActionButtons: function renderCardActionButtons() {
    var _this$props6 = this.props,
        isLast = _this$props6.isLast,
        isFirst = _this$props6.isFirst,
        moveCardDown = _this$props6.moveCardDown,
        moveCardUp = _this$props6.moveCardUp,
        fromCreatePage = _this$props6.fromCreatePage,
        disableActionsDropdown = _this$props6.disableActionsDropdown;

    if (fromCreatePage) {
      return null;
    }

    return /*#__PURE__*/_jsx(TopRightCardEdit, {
      titleUse: TITLE_USE,
      isLast: isLast,
      isFirst: isFirst,
      moveCardDown: moveCardDown,
      moveCardUp: moveCardUp,
      handleEdit: this.handleEdit,
      handleDelete: this.handleDelete,
      disabled: disableActionsDropdown
    });
  },
  renderAddCardButton: function renderAddCardButton() {
    var _this$props7 = this.props,
        index = _this$props7.index,
        insertCard = _this$props7.insertCard,
        openCardModal = _this$props7.openCardModal,
        closeCardModal = _this$props7.closeCardModal,
        addCardIndex = _this$props7.addCardIndex,
        isCardModalOpen = _this$props7.isCardModalOpen,
        fromCreatePage = _this$props7.fromCreatePage;

    if (fromCreatePage) {
      return null;
    }

    return /*#__PURE__*/_jsx(AddCardButton, {
      index: index,
      insertCard: insertCard,
      openCardModal: openCardModal,
      closeCardModal: closeCardModal,
      addCardIndex: addCardIndex,
      isCardModalOpen: isCardModalOpen
    });
  },
  renderTemplateErrorCard: function renderTemplateErrorCard() {
    var _this$props8 = this.props,
        index = _this$props8.index,
        onDelete = _this$props8.onDelete,
        openCardModal = _this$props8.openCardModal,
        closeCardModal = _this$props8.closeCardModal,
        addCardIndex = _this$props8.addCardIndex,
        isCardModalOpen = _this$props8.isCardModalOpen,
        deleteStep = _this$props8.deleteStep;
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
    var _this$props9 = this.props,
        data = _this$props9.data,
        index = _this$props9.index,
        fromCreatePage = _this$props9.fromCreatePage,
        payload = _this$props9.payload;

    if (stepHasEmailTemplateId(payload) && isEmpty(data)) {
      return this.renderTemplateErrorCard();
    }

    var taskType = payload.getIn(['actionMeta', 'taskMeta', 'taskType']) || TODO;
    var className = 'editor-list-card-task' + (fromCreatePage ? " from-create" : "");
    return /*#__PURE__*/_jsxs("div", {
      className: "editor-list-template-package",
      "data-selenium-test": "builder-card",
      children: [/*#__PURE__*/_jsx("div", {
        className: className,
        children: /*#__PURE__*/_jsxs(UIBuilderCard, {
          className: "m-bottom-2",
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.taskNode.cardTitle." + taskType,
            options: {
              index: index + 1
            }
          }),
          titleIcon: /*#__PURE__*/_jsx(UIIcon, {
            name: getTaskCardIcon(taskType),
            size: "xxs"
          }),
          clickable: false,
          hovered: false,
          titleUse: TITLE_USE,
          TitleAction: this.renderCardActionButtons,
          children: [this.renderDelaySelector(), this.renderTaskDetails(), this.renderEmailSection()]
        })
      }), this.renderAddCardButton()]
    });
  }
});
export default connect(null, {
  deleteStep: SequenceEditorActions.deleteStep
})(TaskCard);