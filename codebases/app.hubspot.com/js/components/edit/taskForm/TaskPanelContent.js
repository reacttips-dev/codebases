'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import { connect } from 'react-redux';
import { hasConnectedLSNIntegration as hasConnectedLSNIntegrationSelector } from 'SequencesUI/selectors/LSNIntegrationSelectors';
import * as TaskQueuesActions from 'SequencesUI/actions/TaskQueuesActions';
import * as TaskPropertyActions from 'SequencesUI/actions/TaskPropertyActions';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import { convertToSequenceTaskMeta, convertToSequenceTaskPayload, WILL_NAVIGATE_AWAY } from 'SequencesUI/util/taskDataObjects';
import { getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';
import AddButton from './AddButton';
import SaveButton from './SaveButton';
import NotesInput from 'SequencesUI/components/async/AsyncNotesInput';
import EmailTemplateField from './EmailTemplateField';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import CloseButton from 'task-forms-lib/buttons/CloseButton';
import TaskForm from 'task-forms-lib/tasks/TaskForm';
import withTaskQueueDialog from 'task-forms-lib/hoc/withTaskQueueDialog';
var TaskFormWithQueueDialog = withTaskQueueDialog(TaskForm);

var DoNotRenderHeader = function DoNotRenderHeader() {
  return null;
};

var GETTERS = {
  hs_task_body: function hs_task_body(_ref) {
    var task = _ref.task;
    // Notes is an uncontrolled field, so don't apply updates
    return task.getIn(['properties', 'hs_task_body', 'value']) || '';
  }
};
var SETTERS = {
  hs_task_body: function hs_task_body(_ref2) {
    var updates = _ref2.updates,
        value = _ref2.value;

    if (value && value.editorState) {
      // `hs_task_body` was updated by the `NotesInput` component
      var notes = value.toHTML(value.editorState.getCurrentContent());
      return updates.set('hs_task_body', notes);
    }

    return updates;
  }
};
var CUSTOM_INPUTS = {
  hs_task_body: NotesInput,
  sequences_email_template: EmailTemplateField
};
var FIELD_PROPS = {
  hs_task_subject: {
    isRequired: true,
    autoFocus: true
  },
  hs_task_body: {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.taskPanel.notes"
    })
  }
};
var FIELDS = ['hs_task_subject', 'hs_task_type', ['hs_task_priority', 'hs_queue_membership_ids'], 'hs_task_body'];
var FIELDS_WITH_EMAIL_TEMPLATE = [].concat(FIELDS, ['sequences_email_template']);

var TaskPanelContent = /*#__PURE__*/function (_Component) {
  _inherits(TaskPanelContent, _Component);

  function TaskPanelContent(props) {
    var _this;

    _classCallCheck(this, TaskPanelContent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TaskPanelContent).call(this, props));
    _this.state = {
      isEmailTask: getProperty(props.taskContext.task, 'hs_task_type') === TaskTypes.EMAIL
    };
    _this.removeNavigationFlag = _this.removeNavigationFlag.bind(_assertThisInitialized(_this));
    _this.checkForNavigationFlag = _this.checkForNavigationFlag.bind(_assertThisInitialized(_this));
    _this.handleSave = _this.handleSave.bind(_assertThisInitialized(_this));
    _this.handleReceiveLatestTaskUpdates = _this.handleReceiveLatestTaskUpdates.bind(_assertThisInitialized(_this));
    _this.isReady = _this.isReady.bind(_assertThisInitialized(_this));
    _this.getFieldProps = _this.getFieldProps.bind(_assertThisInitialized(_this));
    _this.getButtonComponents = _this.getButtonComponents.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TaskPanelContent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          taskProperties = _this$props.taskProperties,
          ownerId = _this$props.ownerId,
          fetchTaskProperties = _this$props.fetchTaskProperties,
          fetchTaskQueuesOwnerId = _this$props.fetchTaskQueuesOwnerId;
      this.removeNavigationFlag();

      if (!(taskProperties && taskProperties.size)) {
        // taskProperties.size === 0 when a previous taskProperties fetch failed,
        // so try to fetch task properties again
        fetchTaskProperties();
      }

      if (!ownerId) {
        fetchTaskQueuesOwnerId();
      }
    }
  }, {
    key: "removeNavigationFlag",
    value: function removeNavigationFlag() {
      var _this$props$taskConte = this.props.taskContext,
          task = _this$props$taskConte.task,
          updateTaskContext = _this$props$taskConte.updateTaskContext;
      var manualEmailMeta = getProperty(task, 'sequences_email_template');

      if (manualEmailMeta && manualEmailMeta.has(WILL_NAVIGATE_AWAY)) {
        var updatedTask = setProperty(task, 'sequences_email_template', manualEmailMeta.delete(WILL_NAVIGATE_AWAY));
        updateTaskContext({
          task: updatedTask
        });
      }
    }
  }, {
    key: "checkForNavigationFlag",
    value: function checkForNavigationFlag(updatedTask) {
      /* To add a template attachment, we navigate users to the template panel,
       * which unmounts the TaskForm. TaskForm stores the working state of the
       * task record (i.e. unsaved changes) in its component state. So, we would
       * lose that when it unmounts. Thus, we need to save the working state of
       * the task record in context, to restore it after users have chosen a
       * template.
       */
      var emailTemplate = getProperty(updatedTask, 'sequences_email_template');

      if (emailTemplate && emailTemplate.get(WILL_NAVIGATE_AWAY)) {
        this.props.taskContext.updateTaskContext({
          task: updatedTask
        });
      }
    }
  }, {
    key: "handleSave",
    value: function handleSave(updatedTaskRecord) {
      var _this$props2 = this.props,
          edit = _this$props2.edit,
          insertCard = _this$props2.insertCard,
          onEditSave = _this$props2.onEditSave;

      if (edit) {
        var updatedTaskMeta = convertToSequenceTaskMeta(updatedTaskRecord);
        onEditSave(updatedTaskMeta);
      } else {
        insertCard({
          payload: convertToSequenceTaskPayload(updatedTaskRecord)
        });
      }

      return Promise.resolve();
    }
  }, {
    key: "handleReceiveLatestTaskUpdates",
    value: function handleReceiveLatestTaskUpdates(updatedTask) {
      var taskType = getProperty(updatedTask, 'hs_task_type');
      var isEmailTask = taskType === TaskTypes.EMAIL;

      if (isEmailTask !== this.state.isEmailTask) {
        this.setState({
          isEmailTask: isEmailTask
        });
      }

      this.checkForNavigationFlag(updatedTask);
    }
  }, {
    key: "isReady",
    value: function isReady() {
      var _this$props3 = this.props,
          taskProperties = _this$props3.taskProperties,
          ownerId = _this$props3.ownerId,
          ownerIdFetchFailed = _this$props3.ownerIdFetchFailed;
      return (ownerId || ownerIdFetchFailed) && taskProperties;
    }
  }, {
    key: "getFieldProps",
    value: function getFieldProps() {
      var _this$props4 = this.props,
          handleAddTemplateClick = _this$props4.handleAddTemplateClick,
          templatesById = _this$props4.templatesById,
          templateData = _this$props4.taskContext.templateData,
          updateTaskWithNewTemplate = _this$props4.updateTaskWithNewTemplate,
          updateTemplateMap = _this$props4.updateTemplateMap;
      return Object.assign({}, FIELD_PROPS, {
        sequences_email_template: {
          label: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.taskPanel.emailTemplate.label"
          }),
          tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.taskPanel.emailTemplate.tooltip"
          }),
          handleAddTemplateClick: handleAddTemplateClick,
          templatesById: templatesById,
          templateData: templateData,
          updateTaskWithNewTemplate: updateTaskWithNewTemplate,
          updateTemplateMap: updateTemplateMap
        }
      });
    }
  }, {
    key: "getButtonComponents",
    value: function getButtonComponents() {
      var edit = this.props.edit;
      return edit ? [SaveButton, CloseButton] : [AddButton, CloseButton];
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          taskProperties = _this$props5.taskProperties,
          closeModal = _this$props5.closeModal,
          hasConnectedLSNIntegration = _this$props5.hasConnectedLSNIntegration,
          edit = _this$props5.edit,
          ownerId = _this$props5.ownerId,
          task = _this$props5.taskContext.task;
      var isEmailTask = this.state.isEmailTask;

      if (!this.isReady()) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          layout: "centered",
          size: "medium",
          minHeight: 300
        });
      }

      return /*#__PURE__*/_jsx(TaskFormWithQueueDialog, {
        task: task,
        edit: edit,
        onClose: closeModal,
        onSave: this.handleSave,
        onReceiveLatestTaskUpdates: this.handleReceiveLatestTaskUpdates,
        buttonComponents: this.getButtonComponents(),
        fields: isEmailTask ? FIELDS_WITH_EMAIL_TEMPLATE : FIELDS,
        customInputComponents: CUSTOM_INPUTS,
        fieldProps: this.getFieldProps(),
        getters: GETTERS,
        setters: SETTERS,
        hasLinkedInSalesNavigatorAccess: hasConnectedLSNIntegration // By default, TaskForm tries to render a UIPanelHeader
        // However our app is already handling that via EditTaskPanel and AddTaskPanel
        ,
        HeaderComponent: DoNotRenderHeader,
        properties: taskProperties,
        ownerId: ownerId
      });
    }
  }]);

  return TaskPanelContent;
}(Component);

var PropTypeValidatorBasedOnEdit = function PropTypeValidatorBasedOnEdit(_ref3) {
  var requiredWhenEdit = _ref3.requiredWhenEdit,
      expectedType = _ref3.expectedType;
  return function (props, propName, componentName) {
    var prop = props[propName];

    if (prop === undefined || prop === null) {
      var isRequiredProp = requiredWhenEdit ? props.edit : !props.edit;

      if (isRequiredProp) {
        return new Error("The prop  `" + propName + "` is marked as required when prop `edit` is `" + requiredWhenEdit + "`" + (" in `" + componentName + "`, but its value is `" + prop + "`."));
      } else {
        return null;
      }
    }

    var isExpectedType = typeof prop === expectedType;

    if (!isExpectedType) {
      return new Error("Invalid prop `" + propName + "` of type `" + typeof prop + "`" + (" supplied to `" + componentName + "`, expected type `" + expectedType + "`."));
    }

    return null;
  };
};

TaskPanelContent.propTypes = {
  taskContext: PropTypes.shape({
    task: PropTypes.instanceOf(TaskRecord).isRequired,
    templateData: PropTypes.instanceOf(ImmutableMap),
    updateTaskContext: PropTypes.func.isRequired
  }).isRequired,
  handleAddTemplateClick: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  templatesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  edit: PropTypes.bool.isRequired,
  insertCard: PropTypeValidatorBasedOnEdit({
    requiredWhenEdit: false,
    expectedType: 'function'
  }),
  onEditSave: PropTypeValidatorBasedOnEdit({
    requiredWhenEdit: true,
    expectedType: 'function'
  }),
  taskProperties: PropTypes.instanceOf(ImmutableMap),
  ownerId: PropTypes.number,
  ownerIdFetchFailed: PropTypes.bool.isRequired,
  hasConnectedLSNIntegration: PropTypes.bool.isRequired,
  fetchTaskProperties: PropTypes.func.isRequired,
  fetchTaskQueuesOwnerId: PropTypes.func.isRequired,
  updateTaskWithNewTemplate: PropTypes.func.isRequired,
  updateTemplateMap: PropTypes.func.isRequired
};
export default connect(function (state) {
  return {
    taskProperties: state.taskProperties,
    ownerId: state.ownerId.get('ownerId'),
    ownerIdFetchFailed: state.ownerId.get('fetchFailed'),
    hasConnectedLSNIntegration: hasConnectedLSNIntegrationSelector(state)
  };
}, {
  fetchTaskProperties: TaskPropertyActions.fetchTaskProperties,
  fetchTaskQueuesOwnerId: TaskQueuesActions.fetchTaskQueuesOwnerId,
  updateTemplateMap: SequenceEditorActions.updateTemplateMap
})(TaskPanelContent);