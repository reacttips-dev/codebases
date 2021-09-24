'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import { setProperty } from 'customer-data-objects/model/ImmutableModel';
import TaskPanelContentContainer from './TaskPanelContentContainer';
import TemplateStep from '../insertCard/panels/TemplateStep';
import TaskContext from './TaskContext';
import { convertToTaskRecord } from 'SequencesUI/util/taskDataObjects';
import * as InsertCardPanelViews from 'SequencesUI/constants/InsertCardPanelViews';
import { tracker, getTaskTrackingProperties } from 'SequencesUI/util/UsageTracker';
import UIPanelNavigator from 'UIComponents/panel/UIPanelNavigator';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import H2 from 'UIComponents/elements/headings/H2';
var MODAL_WIDTH = 480;

var EditTaskPanel = /*#__PURE__*/function (_Component) {
  _inherits(EditTaskPanel, _Component);

  function EditTaskPanel(props) {
    var _this;

    _classCallCheck(this, EditTaskPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditTaskPanel).call(this, props));

    _this.getPanelOrder = function () {
      return _this.props.showTaskForm ? [InsertCardPanelViews.TASK_FORM, InsertCardPanelViews.TEMPLATES] : [InsertCardPanelViews.TEMPLATES];
    };

    _this.goToTaskForm = function () {
      _this.setState({
        currentPanel: InsertCardPanelViews.TASK_FORM
      });
    };

    _this.goToTemplateStep = function () {
      _this.setState({
        currentPanel: InsertCardPanelViews.TEMPLATES
      });
    };

    _this.updateTaskContext = function (_ref) {
      var task = _ref.task,
          templateData = _ref.templateData;

      _this.setState(function (state) {
        return Object.assign({}, _this.state, {
          taskContext: Object.assign({}, state.taskContext, {
            task: task,
            templateData: templateData
          })
        });
      });
    };

    _this.saveTaskAndClosePanel = function (updatedTaskMeta) {
      var _this$props = _this.props,
          index = _this$props.index,
          updateTask = _this$props.updateTask,
          closeModal = _this$props.closeModal;
      updateTask(index, updatedTaskMeta.toObject());
      tracker.track('createOrEditSequence', Object.assign({
        action: 'Edited task step'
      }, getTaskTrackingProperties({
        taskMeta: updatedTaskMeta
      })));
      closeModal();
    };

    _this.addTemplateToTask = function (_ref2) {
      var template = _ref2.template,
          templateId = _ref2.templateId;
      var taskWithSelectedTemplate = setProperty(_this.state.taskContext.task, 'sequences_email_template', ImmutableMap({
        templateId: templateId
      }));

      _this.updateTaskContext({
        task: taskWithSelectedTemplate,
        templateData: template
      });

      _this.goToTaskForm();
    };

    _this.handleSelectTemplate = function (_ref3) {
      var template = _ref3.template,
          templateId = _ref3.templateId;
      var _this$props2 = _this.props,
          showTaskForm = _this$props2.showTaskForm,
          taskMeta = _this$props2.taskMeta;

      if (showTaskForm) {
        _this.addTemplateToTask({
          template: template,
          templateId: templateId
        });
      } else {
        var updatedTaskMeta = taskMeta.set('manualEmailMeta', ImmutableMap({
          templateId: templateId
        }));

        _this.saveTaskAndClosePanel(updatedTaskMeta);
      }
    };

    var taskContext = {
      task: convertToTaskRecord(props.taskMeta),
      templateData: null,
      updateTaskContext: _this.updateTaskContext
    };
    _this.state = {
      taskContext: taskContext,
      currentPanel: props.showTaskForm ? InsertCardPanelViews.TASK_FORM : InsertCardPanelViews.TEMPLATES
    };
    return _this;
  }

  _createClass(EditTaskPanel, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          showTaskForm = _this$props3.showTaskForm,
          closeModal = _this$props3.closeModal,
          templatesById = _this$props3.templatesById,
          templateFolders = _this$props3.templateFolders;
      var _this$state = this.state,
          currentPanel = _this$state.currentPanel,
          taskContext = _this$state.taskContext;
      return /*#__PURE__*/_jsx(TaskContext.Provider, {
        value: taskContext,
        children: /*#__PURE__*/_jsxs(UIPanelNavigator, {
          currentPanel: currentPanel,
          panelOrder: this.getPanelOrder(),
          onPreviousClick: this.goToTaskForm,
          children: [/*#__PURE__*/_jsxs(UIPanel, {
            width: MODAL_WIDTH,
            panelKey: InsertCardPanelViews.TASK_FORM,
            children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
              onClick: closeModal
            }), /*#__PURE__*/_jsx(UIPanelHeader, {
              children: /*#__PURE__*/_jsx(H2, {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "edit.taskPanel.panelHeader.edit"
                })
              })
            }), /*#__PURE__*/_jsx(TaskPanelContentContainer, {
              onEditSave: this.saveTaskAndClosePanel,
              closeModal: closeModal,
              handleAddTemplateClick: this.goToTemplateStep,
              templatesById: templatesById,
              edit: true,
              updateTaskWithNewTemplate: this.addTemplateToTask
            })]
          }), /*#__PURE__*/_jsx(TemplateStep, {
            panelKey: InsertCardPanelViews.TEMPLATES,
            closeModal: closeModal,
            templateFolders: templateFolders,
            onCancel: showTaskForm ? this.goToTaskForm : closeModal,
            selectTemplate: this.handleSelectTemplate,
            width: MODAL_WIDTH,
            _dontMakeNewLayer: true
          })]
        })
      });
    }
  }]);

  return EditTaskPanel;
}(Component);

EditTaskPanel.propTypes = Object.assign({}, TaskPanelContentContainer.propTypes, {
  index: PropTypes.number.isRequired,
  taskMeta: PropTypes.instanceOf(ImmutableMap).isRequired,
  closeModal: PropTypes.func.isRequired,
  templateFolders: PropTypes.instanceOf(List).isRequired,
  templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  showTaskForm: PropTypes.bool.isRequired,
  updateTask: PropTypes.func.isRequired
});
export default connect(null, {
  updateTask: SequenceEditorActions.updateTask
})(EditTaskPanel);