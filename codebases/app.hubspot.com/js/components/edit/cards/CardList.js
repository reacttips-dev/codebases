'use es6';

import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["Added ", " step"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import { Map as ImmutableMap, List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import partial from 'transmute/partial';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import { isLoading, isEmpty } from 'SequencesUI/util/LoadingStatus';
import { getStepEmailTemplateId, stepHasEmailTemplateId } from 'SequencesUI/util/stepsWithEmailTemplates';
import * as InsertCardPanelViews from 'SequencesUI/constants/InsertCardPanelViews';
import InsertCardPanel from 'SequencesUI/components/edit/insertCard/InsertCardPanel';
import TemplateCard from './TemplateCard';
import TaskCard from './TaskCard';
import FirstCard from './FirstCard';
import LastCard from './LastCard';
import { tracker, buildCreateOrEditSequenceActionString as buildString, getTaskTrackingProperties } from 'SequencesUI/util/UsageTracker';
import EditTaskPanel from 'SequencesUI/components/edit/taskForm/EditTaskPanel';
import { getVisibleSequenceSteps } from 'SequencesUI/util/sequenceBuilderUtils';
var CardList = createReactClass({
  displayName: "CardList",
  propTypes: {
    onDelete: PropTypes.func,
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
    templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
    templateFolders: PropTypes.instanceOf(List).isRequired,
    readOnlyEditorLoaded: PropTypes.bool.isRequired,
    insertStep: PropTypes.func.isRequired,
    toggleDependency: PropTypes.func.isRequired,
    switchStep: PropTypes.func.isRequired,
    replaceTemplate: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      addCardIndex: -1,
      isCardModalOpen: false,
      showEditTaskPanel: false,
      showTaskForm: false,
      showReplaceTemplatePanel: false,
      replacementTemplateIndex: -1
    };
  },
  openCardModal: function openCardModal(index) {
    this.setState({
      addCardIndex: index,
      isCardModalOpen: true
    });
  },
  closeCardModal: function closeCardModal() {
    this.setState({
      addCardIndex: -1,
      isCardModalOpen: false
    });
  },
  openEditTaskPanel: function openEditTaskPanel(_ref) {
    var index = _ref.index,
        payload = _ref.payload,
        showTaskForm = _ref.showTaskForm;
    this.setState({
      showEditTaskPanel: true,
      index: index,
      payload: payload,
      showTaskForm: showTaskForm
    });
  },
  closeEditTaskPanel: function closeEditTaskPanel() {
    this.setState({
      showEditTaskPanel: false
    });
  },
  openReplaceTemplatePanel: function openReplaceTemplatePanel(_ref2) {
    var index = _ref2.index;
    this.setState({
      showReplaceTemplatePanel: true,
      replacementTemplateIndex: index
    });
  },
  closeReplaceTemplatePanel: function closeReplaceTemplatePanel() {
    this.setState({
      showReplaceTemplatePanel: false,
      replacementTemplateIndex: -1
    });
  },
  handleScrollToElement: function handleScrollToElement(index) {
    var el = document.getElementsByClassName('editor-list-template-package')[index];

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  },
  moveCard: function moveCard(_ref3) {
    var index = _ref3.index,
        newIndex = _ref3.newIndex;
    var _this$props = this.props,
        sequence = _this$props.sequence,
        switchStep = _this$props.switchStep;
    var currentAtIndex = sequence.getIn(['steps', index]);
    switchStep(sequence, newIndex, currentAtIndex);
    tracker.track('createOrEditSequence', {
      action: 'Changed step order'
    });
    this.handleScrollToElement(newIndex);
  },
  insertCard: function insertCard(_ref4) {
    var _this = this;

    var payload = _ref4.payload;
    var sequenceSize = getVisibleSequenceSteps(this.props.sequence).size;
    var index = sequenceSize !== 0 ? this.state.addCardIndex : -1;
    var isFirst = index === sequenceSize && sequenceSize === 0;
    var action = payload.get('action');
    tracker.track('createOrEditSequence', Object.assign({
      action: buildString(_templateObject(), action)
    }, getTaskTrackingProperties({
      payload: payload
    })));
    this.props.insertStep(index, payload);

    if (isFirst) {
      return;
    }

    setTimeout(function () {
      return _this.handleScrollToElement(index + 1);
    }, 100);
  },
  replaceTemplateInCard: function replaceTemplateInCard(_ref5) {
    var templateId = _ref5.templateId;
    var index = this.state.replacementTemplateIndex;
    this.props.replaceTemplate(index, templateId);
  },
  handleToggleDependency: function handleToggleDependency(_ref6) {
    var reliesOnUniqueId = _ref6.reliesOnUniqueId,
        dependencyType = _ref6.dependencyType;
    this.props.toggleDependency(reliesOnUniqueId, dependencyType);
  },
  buildFirstCard: function buildFirstCard() {
    return {
      type: SequenceStepTypes.FIRST_CARD,
      below: null,
      payload: null,
      data: null
    };
  },
  buildLastCard: function buildLastCard() {
    return {
      type: SequenceStepTypes.LAST_CARD,
      below: null,
      payload: null,
      data: null
    };
  },
  getNumAutoEmailSteps: function getNumAutoEmailSteps(cardList) {
    return cardList.filter(function (card) {
      return card.type === SequenceStepTypes.SEND_TEMPLATE;
    }).size;
  },
  getCardList: function getCardList() {
    var _this$props2 = this.props,
        sequence = _this$props2.sequence,
        templatesById = _this$props2.templatesById;
    var steps = getVisibleSequenceSteps(sequence);
    var delays = sequence.get('delays');
    var initialList = List.of(this.buildFirstCard());

    if (steps.size === 0) {
      return initialList;
    }

    var firstTemplateStepIndex = steps.findIndex(function (step) {
      if (stepHasEmailTemplateId(step)) {
        var template = templatesById.get(getStepEmailTemplateId(step));
        return !isLoading(template) && !isEmpty(template);
      }

      return false;
    });
    var cardList = steps.map(function (step, index) {
      var data = null;

      if (stepHasEmailTemplateId(step)) {
        data = templatesById.get(getStepEmailTemplateId(step));
      }

      var delay = delays.get(index);
      return {
        type: step.get('action'),
        payload: step,
        data: data,
        index: index,
        delay: delay,
        firstTemplateStepIndex: firstTemplateStepIndex
      };
    });
    return cardList.push(this.buildLastCard());
  },
  renderInsertCardPanel: function renderInsertCardPanel(numAutoEmailSteps) {
    var _this$props3 = this.props,
        templateFolders = _this$props3.templateFolders,
        templatesById = _this$props3.templatesById;
    var isCardModalOpen = this.state.isCardModalOpen;

    if (!isCardModalOpen) {
      return null;
    }

    return /*#__PURE__*/_jsx(InsertCardPanel, {
      insertCard: this.insertCard,
      closeModal: this.closeCardModal,
      templateFolders: templateFolders,
      numAutoEmailSteps: numAutoEmailSteps,
      templatesById: templatesById
    });
  },
  renderReplaceTemplatePanel: function renderReplaceTemplatePanel(numAutoEmailSteps) {
    var _this$props4 = this.props,
        templateFolders = _this$props4.templateFolders,
        templatesById = _this$props4.templatesById;
    var showReplaceTemplatePanel = this.state.showReplaceTemplatePanel;

    if (!showReplaceTemplatePanel) {
      return null;
    }

    return /*#__PURE__*/_jsx(InsertCardPanel, {
      insertCard: this.insertCard,
      closeModal: this.closeReplaceTemplatePanel,
      templateFolders: templateFolders,
      numAutoEmailSteps: numAutoEmailSteps,
      templatesById: templatesById,
      startAtStep: InsertCardPanelViews.TEMPLATES,
      isTemplateReplacementFlow: true,
      replaceTemplateInCard: this.replaceTemplateInCard,
      panelOrder: [InsertCardPanelViews.TEMPLATES]
    });
  },
  renderEditTaskPanel: function renderEditTaskPanel() {
    var _this$props5 = this.props,
        templatesById = _this$props5.templatesById,
        templateFolders = _this$props5.templateFolders;
    var _this$state = this.state,
        index = _this$state.index,
        payload = _this$state.payload,
        showEditTaskPanel = _this$state.showEditTaskPanel,
        showTaskForm = _this$state.showTaskForm;

    if (!showEditTaskPanel) {
      return null;
    }

    return /*#__PURE__*/_jsx(EditTaskPanel, {
      index: index,
      taskMeta: payload.getIn(['actionMeta', 'taskMeta']),
      closeModal: this.closeEditTaskPanel,
      templateFolders: templateFolders,
      templatesById: templatesById,
      showTaskForm: showTaskForm
    });
  },
  render: function render() {
    var _this2 = this;

    var _this$props6 = this.props,
        sequence = _this$props6.sequence,
        onDelete = _this$props6.onDelete,
        readOnlyEditorLoaded = _this$props6.readOnlyEditorLoaded;
    var _this$state2 = this.state,
        addCardIndex = _this$state2.addCardIndex,
        isCardModalOpen = _this$state2.isCardModalOpen,
        showEditTaskPanel = _this$state2.showEditTaskPanel,
        showReplaceTemplatePanel = _this$state2.showReplaceTemplatePanel;
    var cardList = this.getCardList();
    var numAutoEmailSteps = this.getNumAutoEmailSteps(cardList);
    var dependencies = sequence.get('dependencies');
    var sequenceSettings = sequence.get('sequenceSettings');
    var useThreadedFollowUps = sequenceSettings.get('useThreadedFollowUps');
    var eligibleFollowUpDays = sequenceSettings.get('eligibleFollowUpDays');
    return /*#__PURE__*/_jsxs("div", {
      className: "sequence-editor-card-list",
      children: [cardList.map(function (item, index) {
        var isFirst = index === 0;
        var isLast = index === cardList.size - 2;
        var type = item.type,
            data = item.data,
            delay = item.delay,
            payload = item.payload,
            readOnly = item.readOnly,
            firstTemplateStepIndex = item.firstTemplateStepIndex;
        var addStepProps = {
          openCardModal: _this2.openCardModal,
          closeCardModal: _this2.closeCardModal,
          addCardIndex: addCardIndex,
          isCardModalOpen: isCardModalOpen
        };
        var stepCardProps = {
          readOnly: readOnly,
          isFirst: isFirst,
          isLast: isLast,
          onDelete: onDelete,
          moveCardUp: partial(_this2.moveCard, {
            index: index,
            newIndex: index - 1
          }),
          moveCardDown: partial(_this2.moveCard, {
            index: index,
            newIndex: index + 1
          }),
          eligibleFollowUpDays: eligibleFollowUpDays,
          disableActionsDropdown: showEditTaskPanel || isCardModalOpen || showReplaceTemplatePanel
        };
        var emailTemplateProps = {
          data: data,
          firstTemplateStepIndex: firstTemplateStepIndex,
          useThreadedFollowUps: useThreadedFollowUps,
          readOnlyEditorLoaded: readOnlyEditorLoaded
        };

        switch (type) {
          case SequenceStepTypes.SEND_TEMPLATE:
            return /*#__PURE__*/_jsx(TemplateCard, Object.assign({
              index: index
            }, stepCardProps, {}, addStepProps, {}, emailTemplateProps, {
              delay: delay,
              openReplaceTemplatePanel: _this2.openReplaceTemplatePanel
            }), payload.get('uniqueId'));

          case SequenceStepTypes.SCHEDULE_TASK:
            return /*#__PURE__*/_jsx(TaskCard, Object.assign({
              index: index
            }, stepCardProps, {}, addStepProps, {}, emailTemplateProps, {
              payload: payload,
              delay: delay,
              dependencies: dependencies,
              onToggleDependency: _this2.handleToggleDependency,
              openEditTaskPanel: _this2.openEditTaskPanel
            }), payload.get('uniqueId'));

          case SequenceStepTypes.FIRST_CARD:
            return /*#__PURE__*/_jsx(FirstCard, Object.assign({
              index: index
            }, addStepProps), "first-card");

          case SequenceStepTypes.LAST_CARD:
            if (index < 1) {
              return null;
            }

            return /*#__PURE__*/_jsx(LastCard, {
              index: index
            }, "last-card");

          default:
            return null;
        }
      }), this.renderInsertCardPanel(numAutoEmailSteps), this.renderReplaceTemplatePanel(numAutoEmailSteps), this.renderEditTaskPanel()]
    });
  }
});
export default CardList;