'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { List, Map as ImmutableMap } from 'immutable';
import * as InsertCardPanelViews from 'SequencesUI/constants/InsertCardPanelViews';
import { connect } from 'react-redux';
import { fetchLSNIntegration } from 'SequencesUI/actions/LSNIntegrationActions';
import { convertToTaskRecord } from 'SequencesUI/util/taskDataObjects';
import { setProperty } from 'customer-data-objects/model/ImmutableModel';
import UIPanelNavigator from 'UIComponents/panel/UIPanelNavigator';
import TaskContext from 'SequencesUI/components/edit/taskForm/TaskContext';
import ConnectLinkedIn from './panels/ConnectLinkedIn';
import StepTypeSelection from './panels/StepTypeSelection';
import TemplateStep from './panels/TemplateStep';
import AddTaskPanel from './panels/AddTaskPanel';
var MODAL_WIDTH = 480;

var InsertCardPanel = /*#__PURE__*/function (_Component) {
  _inherits(InsertCardPanel, _Component);

  function InsertCardPanel(props) {
    var _this;

    _classCallCheck(this, InsertCardPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InsertCardPanel).call(this, props));

    _this.changePanel = function (panel) {
      _this.setState({
        currentPanel: panel
      });
    };

    _this.goToStepTypeSelection = function () {
      _this.changePanel(InsertCardPanelViews.STEP_TYPE_SELECTION);
    };

    _this.enterAddTemplateToTaskFlow = function () {
      _this.setState({
        addTemplateToTask: true,
        currentPanel: InsertCardPanelViews.TEMPLATES
      });
    };

    _this.exitAddTemplateToTaskFlow = function () {
      _this.setState({
        addTemplateToTask: false,
        currentPanel: InsertCardPanelViews.TASK_FORM
      });
    };

    _this.updateTaskContext = function (_ref) {
      var task = _ref.task,
          templateData = _ref.templateData;

      _this.setState(function (state) {
        return Object.assign({}, state, {
          taskContext: Object.assign({}, state.taskContext, {
            task: task,
            templateData: templateData
          })
        });
      });
    };

    _this.updateTaskWithNewTemplate = function (_ref2) {
      var template = _ref2.template,
          templateId = _ref2.templateId;
      // for updating task with edited template
      var taskWithSelectedTemplate = setProperty(_this.state.taskContext.task, 'sequences_email_template', ImmutableMap({
        templateId: templateId
      }));

      _this.updateTaskContext({
        task: taskWithSelectedTemplate,
        templateData: template
      });
    };

    _this.replaceTemplateAndClose = function (_ref3) {
      var templateId = _ref3.templateId;
      var _this$props = _this.props,
          replaceTemplateInCard = _this$props.replaceTemplateInCard,
          closeModal = _this$props.closeModal;
      replaceTemplateInCard({
        templateId: templateId
      });
      closeModal();
    };

    _this.handleSelectTemplate = function (_ref4) {
      var template = _ref4.template,
          templateId = _ref4.templateId,
          payload = _ref4.payload;
      var isTemplateReplacementFlow = _this.props.isTemplateReplacementFlow;
      var addTemplateToTask = _this.state.addTemplateToTask;

      if (addTemplateToTask) {
        // for adding or replacing a template on a task step
        var taskWithSelectedTemplate = setProperty(_this.state.taskContext.task, 'sequences_email_template', ImmutableMap({
          templateId: templateId
        }));

        _this.updateTaskContext({
          task: taskWithSelectedTemplate,
          templateData: template
        });

        _this.exitAddTemplateToTaskFlow();
      } else if (isTemplateReplacementFlow) {
        // for replacing templates on automated email steps only
        _this.replaceTemplateAndClose({
          templateId: templateId
        });
      } else {
        _this.insertCardAndClose({
          payload: payload
        });
      }
    };

    _this.handleStepTypeSelection = function (_ref5) {
      var taskMeta = _ref5.taskMeta,
          panel = _ref5.panel;

      _this.updateTaskContext({
        task: taskMeta ? convertToTaskRecord(taskMeta) : null,
        templateData: null
      });

      _this.setState({
        currentPanel: panel
      });
    };

    _this.insertCardAndClose = function (_ref6) {
      var payload = _ref6.payload;
      var _this$props2 = _this.props,
          insertCard = _this$props2.insertCard,
          closeModal = _this$props2.closeModal;
      insertCard({
        payload: payload
      });
      closeModal();
    };

    var taskContext = {
      task: null,
      templateData: null,
      updateTaskContext: _this.updateTaskContext
    };
    _this.state = {
      taskContext: taskContext,
      currentPanel: _this.props.startAtStep || InsertCardPanelViews.STEP_TYPE_SELECTION,
      addTemplateToTask: false
    };
    return _this;
  }

  _createClass(InsertCardPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.fetchLSNIntegration();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          closeModal = _this$props3.closeModal,
          templateFolders = _this$props3.templateFolders,
          numAutoEmailSteps = _this$props3.numAutoEmailSteps,
          templatesById = _this$props3.templatesById,
          panelOrder = _this$props3.panelOrder;
      var _this$state = this.state,
          currentPanel = _this$state.currentPanel,
          taskContext = _this$state.taskContext,
          addTemplateToTask = _this$state.addTemplateToTask;
      return /*#__PURE__*/_jsx(TaskContext.Provider, {
        value: taskContext,
        children: /*#__PURE__*/_jsxs(UIPanelNavigator, {
          currentPanel: currentPanel,
          onPreviousClick: addTemplateToTask ? this.exitAddTemplateToTaskFlow : this.goToStepTypeSelection,
          panelOrder: panelOrder,
          children: [/*#__PURE__*/_jsx(StepTypeSelection, {
            panelKey: InsertCardPanelViews.STEP_TYPE_SELECTION,
            closeModal: closeModal,
            changePanel: this.changePanel,
            handleSelection: this.handleStepTypeSelection,
            width: MODAL_WIDTH,
            _dontMakeNewLayer: true
          }), /*#__PURE__*/_jsx(AddTaskPanel, {
            panelKey: InsertCardPanelViews.TASK_FORM,
            closeModal: closeModal,
            handleAddTemplateClick: this.enterAddTemplateToTaskFlow,
            insertCard: this.insertCardAndClose,
            templatesById: templatesById,
            width: MODAL_WIDTH,
            _dontMakeNewLayer: true,
            updateTaskWithNewTemplate: this.updateTaskWithNewTemplate
          }), /*#__PURE__*/_jsx(TemplateStep, {
            panelKey: InsertCardPanelViews.TEMPLATES,
            closeModal: closeModal,
            templateFolders: templateFolders,
            onCancel: addTemplateToTask ? this.exitAddTemplateToTaskFlow : closeModal,
            selectTemplate: this.handleSelectTemplate,
            numAutoEmailSteps: addTemplateToTask ? null : numAutoEmailSteps,
            width: MODAL_WIDTH,
            _dontMakeNewLayer: true,
            isTemplateReplacementFlow: this.props.isTemplateReplacementFlow
          }), /*#__PURE__*/_jsx(ConnectLinkedIn, {
            panelKey: InsertCardPanelViews.CONNECT_LINKEDIN,
            closeModal: closeModal,
            goBack: this.goToStepTypeSelection,
            width: MODAL_WIDTH,
            _dontMakeNewLayer: true
          })]
        })
      });
    }
  }]);

  return InsertCardPanel;
}(Component);

InsertCardPanel.propTypes = {
  insertCard: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  templateFolders: PropTypes.instanceOf(List).isRequired,
  numAutoEmailSteps: PropTypes.number.isRequired,
  templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  fetchLSNIntegration: PropTypes.func.isRequired,
  startAtStep: PropTypes.string,
  isTemplateReplacementFlow: PropTypes.bool,
  replaceTemplateInCard: PropTypes.func,
  panelOrder: PropTypes.array
};
export default connect(null, {
  fetchLSNIntegration: fetchLSNIntegration
})(InsertCardPanel);