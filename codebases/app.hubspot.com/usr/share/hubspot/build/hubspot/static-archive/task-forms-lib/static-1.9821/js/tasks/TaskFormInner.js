'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { getFilteredTaskTypes } from 'customer-data-objects/task/getFilteredTaskTypes';
import { DUE_DATE, REPEAT_INTERVAL, TYPE } from 'customer-data-objects/task/TaskPropertyNames';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import { getDueDatePresets, getUISelectFormattedOptions } from 'customer-data-properties/date/RelativeDatePresets';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import get from 'transmute/get';
import isEmpty from 'transmute/isEmpty';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIForm from 'UIComponents/form/UIForm';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import { CREATE_FORM_BUTTONS } from '../constants/DefaultButtonSets';
import { CANCEL, CREATE, CREATE_AND_ADD_ANOTHER, DELETE, SAVE } from '../constants/TaskFormButtonTypes';
import { TASK_SUBJECT_MAX_CHAR } from '../constants/TaskFormInputProperties';
import AddTaskQueueButton from '../input/AddTaskQueueButton';
import TaskCompleteIconButton from '../input/TaskCompleteIconButton';
import TaskRepeatingInput from '../input/TaskRepeatingInput';
import applyUpdatesToTask from '../utils/applyUpdatesToTask';
import mergeTwoLevelsDeep from '../utils/mergeTwoLevelsDeep';
import { getDefaultDueDate } from '../utils/TaskDefaults';
import transformTaskPropertiesForForms from '../utils/transformTaskPropertiesForForms';
import getFirstReminder from './getters/getFirstReminder';
import getJSFromImmutable from './getters/getJSFromImmutable';
import getPropertyValue from './getters/getPropertyValue';
import getTimestampAsNumber from './getters/getTimestampAsNumber';
import setImmutableFromJS from './setters/setImmutableFromJS';
import setPropertyValue from './setters/setPropertyValue';
import setSmartTaskType from './setters/setSmartTaskType';
import TaskFormButtons from './TaskFormButtons';
import TaskFormContextProvider from './TaskFormContextProvider';
import TaskFormFields from './TaskFormFields';
import TaskFormHeader from './TaskFormHeader';
import removePastReminders from './transforms/removePastReminders';
import { bodyMustBeUnderCharacterLimit } from './validators/bodyMustBeUnderCharacterLimit';
import reminderMustBeInFuture from './validators/reminderMustBeInFuture';
import subjectRequired from './validators/subjectRequired';
import validateTask from './validators/validateTask';

var getInitialUpdates = function getInitialUpdates(_ref) {
  var transforms = _ref.transforms,
      task = _ref.task,
      edit = _ref.edit;

  if (!task) {
    return ImmutableMap();
  }

  return transforms.reduce(function (updates, transformFn) {
    return transformFn({
      task: task,
      updates: updates,
      edit: edit
    });
  }, ImmutableMap());
}; // NOTE: this logic will not work and would need to be modified if the field
// containing hs_task_repeat_interval was an array (meaning more than one
// input rendered on the same horizontal line)


export var filterFormFieldsForRecurringTasks = function filterFormFieldsForRecurringTasks(fields, isUngatedForRecurringTasks) {
  return isUngatedForRecurringTasks ? fields : fields.filter(function (field) {
    return field !== 'hs_task_repeat_interval';
  });
};
var DEFAULT_CUSTOM_INPUTS = {
  hs_task_status: TaskCompleteIconButton,
  hs_task_repeat_interval: TaskRepeatingInput
};
var DEFAULT_GETTERS = {
  hs_task_reminders: getFirstReminder,
  hs_timestamp: getTimestampAsNumber,
  hs_task_repeat_interval: getJSFromImmutable
};
var DEFAULT_SETTERS = {
  hs_task_subject: setSmartTaskType,
  hs_task_repeat_interval: setImmutableFromJS
};
var DEFAULT_TRANSFORMS = [removePastReminders];

var TaskFormInner = /*#__PURE__*/function (_PureComponent) {
  _inherits(TaskFormInner, _PureComponent);

  function TaskFormInner(props) {
    var _this;

    _classCallCheck(this, TaskFormInner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TaskFormInner).call(this, props));

    _this.getValue = function (field, updates, task) {
      return (get(field, _this.getAllGetters()) || getPropertyValue)({
        updates: updates,
        task: task,
        field: field
      });
    };

    _this.handleChange = function (field, event) {
      var _this$props = _this.props,
          validators = _this$props.validators,
          onFormHasChanges = _this$props.onFormHasChanges,
          onReceiveLatestTaskUpdates = _this$props.onReceiveLatestTaskUpdates;

      var task = _this.getTask();

      var value = event.target.value;
      var setter = get(field, _this.getAllSetters()) || setPropertyValue;

      _this.setState(function (_ref2) {
        var prevValues = _ref2.updates;
        var nextValues = setter({
          task: task,
          updates: prevValues,
          event: event,
          field: field,
          value: value
        });
        onFormHasChanges(true);
        var updatedTask = applyUpdatesToTask(task, nextValues);
        onReceiveLatestTaskUpdates(updatedTask, nextValues);

        var _validateTask = validateTask({
          task: task,
          updates: nextValues,
          validators: validators
        }),
            errors = _validateTask.errors,
            messages = _validateTask.messages;

        return {
          updates: nextValues,
          errors: errors,
          messages: messages,
          saveError: false
        };
      });
    };

    _this.handleSave = function () {
      var task = _this.getTask();

      var updates = _this.state.updates;
      var onClose = _this.props.onClose;
      var updatedTask = applyUpdatesToTask(task, updates);

      _this.props.onFormHasChanges(false);

      _this.props.onSave(updatedTask, updates).then(function () {
        onClose();
      }, function (error) {
        _this.setState({
          saveError: true
        });

        rethrowError(error);
      }).done();
    };

    _this.handleSaveAndAddAnother = function () {
      var task = _this.getTask();

      var updates = _this.state.updates;
      var clearFormOnAddAnother = _this.props.clearFormOnAddAnother;
      var updatedTask = applyUpdatesToTask(task, updates);

      _this.props.onSave(updatedTask).then(function () {
        clearFormOnAddAnother();

        _this.setState(_this.initialState);
      }, function (error) {
        _this.setState({
          saveError: true
        });

        rethrowError(error);
      }).done();
    };

    _this.handleSubmit = function (event) {
      if (!_this.state.errors.isEmpty()) {
        return;
      }

      _this.handleSave();

      event.preventDefault();
    };

    _this.defaultFieldProps = {
      hs_queue_membership_ids: {
        dropdownFooter: props.ownerId && /*#__PURE__*/_jsx(AddTaskQueueButton, {
          onClick: props.onOpenAddQueueDialog,
          onTaskChange: _this.handleChange
        }),
        options: []
      },
      hs_task_subject: {
        isRequired: true,
        maxLength: TASK_SUBJECT_MAX_CHAR,
        autoFocus: true
      },
      hs_task_status: {
        animate: true,
        label: null,
        flexProps: {
          grow: null
        }
      },
      hs_task_type: {
        isRequired: true
      },
      hs_task_priority: {
        isRequired: true
      },
      hs_timestamp: {
        options: getUISelectFormattedOptions(getDueDatePresets()),
        defaultValue: getTimestampAsNumber({
          task: props.task
        }) || getDefaultDueDate(),
        dateSelectProps: {
          'data-selenium-test': 'tasks-relative-date-dropdown'
        }
      },
      hs_task_repeat_interval: {
        label: null,
        hasRecurringTasksScope: false
      }
    };
    var initialUpdates = getInitialUpdates({
      transforms: props.transforms,
      task: _this.getTask(),
      edit: props.edit
    });

    var _validateTask2 = validateTask({
      task: _this.getTask(),
      updates: initialUpdates,
      validators: props.validators
    }),
        _errors = _validateTask2.errors,
        _messages = _validateTask2.messages;

    _this.initialState = {
      hasCriticalError: false,
      updates: initialUpdates,
      errors: _errors,
      messages: _messages,
      saveError: false
    };
    _this.state = _this.initialState;
    return _this;
  }

  _createClass(TaskFormInner, [{
    key: "getTask",
    value: function getTask() {
      return this.props.task;
    }
  }, {
    key: "getDerivedFieldProps",
    value: function getDerivedFieldProps() {
      var updates = this.state.updates;
      var task = this.getTask();
      var dueDateValue = this.getValue(DUE_DATE, updates, task);
      var isRepeating = Boolean(this.getValue(REPEAT_INTERVAL, updates, task));
      return {
        hs_task_reminders: {
          isRepeating: isRepeating,
          relatesTo: dueDateValue
        }
      };
    }
  }, {
    key: "getAllFieldProps",
    value: function getAllFieldProps() {
      var fieldProps = this.props.fieldProps;
      var withDerivedProps = mergeTwoLevelsDeep(this.defaultFieldProps, this.getDerivedFieldProps());
      return mergeTwoLevelsDeep(withDerivedProps, fieldProps);
    }
  }, {
    key: "getAllCustomInputs",
    value: function getAllCustomInputs() {
      return Object.assign({}, DEFAULT_CUSTOM_INPUTS, {}, this.props.customInputComponents);
    }
  }, {
    key: "getAllGetters",
    value: function getAllGetters() {
      return Object.assign({}, DEFAULT_GETTERS, {}, this.props.getters);
    }
  }, {
    key: "getAllSetters",
    value: function getAllSetters() {
      return Object.assign({}, DEFAULT_SETTERS, {}, this.props.setters);
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this2 = this;

      var _this$props2 = this.props,
          isSaveTooltipDisabled = _this$props2.isSaveTooltipDisabled,
          isDeleteTooltipDisabled = _this$props2.isDeleteTooltipDisabled,
          saveButtonTooltipMessage = _this$props2.saveButtonTooltipMessage,
          deleteButtonTooltipMessage = _this$props2.deleteButtonTooltipMessage,
          buttonComponents = _this$props2.buttonComponents,
          disabled = _this$props2.disabled,
          onClose = _this$props2.onClose,
          onDelete = _this$props2.onDelete,
          buttonTypes = _this$props2.buttonTypes;

      if (buttonComponents) {
        var isDeleteDisabled = disabled;
        var isCreateDisabled = !isEmpty(this.state.errors) || disabled;
        var isSaveDisabled = this.state.updates.isEmpty() || isCreateDisabled;
        return buttonComponents.map(function (Button, index) {
          return /*#__PURE__*/_jsx(Button, {
            onSave: _this2.handleSave,
            onSaveAndAddAnother: _this2.handleSaveAndAddAnother,
            onClose: onClose,
            onDelete: onDelete,
            isDeleteDisabled: isDeleteDisabled,
            isCreateDisabled: isCreateDisabled,
            isSaveDisabled: isSaveDisabled,
            isSaveTooltipDisabled: isSaveTooltipDisabled,
            isDeleteTooltipDisabled: isDeleteTooltipDisabled,
            saveButtonTooltipMessage: saveButtonTooltipMessage,
            deleteButtonTooltipMessage: deleteButtonTooltipMessage
          }, "form-button-" + index);
        });
      }

      return /*#__PURE__*/_jsx(TaskFormButtons, {
        buttons: buttonTypes,
        onSave: this.handleSave,
        onSaveAndAddAnother: this.handleSaveAndAddAnother,
        onCancel: onClose,
        onDelete: onDelete,
        deleteDisabled: disabled,
        saveDisabled: !isEmpty(this.state.errors) || this.state.updates.isEmpty() || disabled,
        isSaveTooltipDisabled: isSaveTooltipDisabled,
        isDeleteTooltipDisabled: isDeleteTooltipDisabled,
        saveButtonTooltipMessage: saveButtonTooltipMessage,
        deleteButtonTooltipMessage: deleteButtonTooltipMessage
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this$props3 = this.props,
          fields = _this$props3.fields,
          TopAlertAreaContent = _this$props3.TopAlertAreaContent,
          transformProperties = _this$props3.transformProperties,
          hasLinkedInSalesNavigatorAccess = _this$props3.hasLinkedInSalesNavigatorAccess,
          isUngatedForRecurringTasks = _this$props3.isUngatedForRecurringTasks,
          renderRhumbSuccessMarker = _this$props3.renderRhumbSuccessMarker,
          children = _this$props3.children;
      var _this$state = this.state,
          updates = _this$state.updates,
          errors = _this$state.errors,
          messages = _this$state.messages;
      var task = this.getTask();
      var properties = transformProperties ? transformProperties(this.props.properties) : this.props.properties;
      var type = getProperty(task, TYPE);
      properties = properties.updateIn([TYPE, 'options'], function (options) {
        return getFilteredTaskTypes(type, options, !hasLinkedInSalesNavigatorAccess);
      });
      return /*#__PURE__*/_jsx(_Fragment, {
        children: fields ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [TopAlertAreaContent, /*#__PURE__*/_jsxs(UIForm, {
            onSubmit: this.handleSubmit,
            "data-selenium-test": "task-form",
            children: [/*#__PURE__*/_jsx(TaskFormFields, {
              properties: properties,
              formLines: filterFormFieldsForRecurringTasks(fields, isUngatedForRecurringTasks),
              getters: this.getAllGetters(),
              task: task,
              errors: errors,
              messages: messages,
              onChange: this.handleChange,
              customInputComponents: this.getAllCustomInputs(),
              fieldProps: this.getAllFieldProps(),
              updates: updates
            }), renderRhumbSuccessMarker && renderRhumbSuccessMarker()]
          })]
        }) : /*#__PURE__*/_jsx(UIForm, {
          onSubmit: this.handleSubmit,
          "data-selenium-test": "task-form",
          children: /*#__PURE__*/_jsx(TaskFormContextProvider, {
            properties: properties,
            getters: this.getAllGetters(),
            task: task,
            errors: errors,
            messages: messages,
            onChange: this.handleChange,
            customInputComponents: this.getAllCustomInputs(),
            fieldProps: this.getAllFieldProps(),
            updates: updates,
            children: children
          })
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          BodyComponent = _this$props4.BodyComponent,
          HeaderComponent = _this$props4.HeaderComponent,
          FooterComponent = _this$props4.FooterComponent,
          onClose = _this$props4.onClose,
          edit = _this$props4.edit;
      var task = this.getTask();
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsxs(HeaderComponent, {
          children: [/*#__PURE__*/_jsx(TaskFormHeader, {
            edit: edit,
            isRepeating: getPropertyValue({
              task: task,
              field: 'hs_task_repeat_interval'
            })
          }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          })]
        }), /*#__PURE__*/_jsx(BodyComponent, {
          children: this.renderBody()
        }), /*#__PURE__*/_jsx(FooterComponent, {
          children: this.renderFooter()
        })]
      });
    }
  }]);

  return TaskFormInner;
}(PureComponent);

TaskFormInner.propTypes = {
  // it would be nice to do some dynamic checking to make sure ownerId is
  // required if the hs_queue_membership_ids field is being edited
  task: PropTypes.instanceOf(TaskRecord).isRequired,
  // helps determine which header to show
  edit: PropTypes.bool,
  ownerId: PropTypes.number,
  fields: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node])),
  onOpenAddQueueDialog: PropTypes.func,
  setters: PropTypes.object,
  getters: PropTypes.object,
  transforms: PropTypes.arrayOf(PropTypes.func),
  validators: PropTypes.array,
  fieldProps: PropTypes.object,
  customInputComponents: PropTypes.object,

  /**
   * @deprecated - use buttonComponents instead
   * @todo - remove all references to buttonTypes
   */
  buttonTypes: PropTypes.arrayOf(PropTypes.oneOf([CREATE, CREATE_AND_ADD_ANOTHER, CANCEL, SAVE, DELETE])),
  buttonComponents: PropTypes.arrayOf(PropTypes.elementType),
  properties: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  clearFormOnAddAnother: PropTypes.func,
  BodyComponent: PropTypes.elementType,
  HeaderComponent: PropTypes.elementType,

  /**
   * @deprecated - pass in children instead
   */
  TopAlertAreaContent: PropTypes.element,
  FooterComponent: PropTypes.elementType,
  transformProperties: PropTypes.func,
  hasLinkedInSalesNavigatorAccess: PropTypes.bool,
  disabled: PropTypes.bool,

  /**
   * @deprecated - use onReceiveLatestTaskUpdates instead
   * @todo - remove all references
   */
  onFormHasChanges: PropTypes.func,
  onReceiveLatestTaskUpdates: PropTypes.func,
  isUngatedForRecurringTasks: PropTypes.bool,

  /**
   * @deprecated - pass in children instead
   */
  renderRhumbSuccessMarker: PropTypes.func,
  isSaveTooltipDisabled: PropTypes.bool,
  isDeleteTooltipDisabled: PropTypes.bool,
  saveButtonTooltipMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.string]),
  deleteButtonTooltipMessage: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.string]),
  children: PropTypes.node
};
TaskFormInner.defaultProps = {
  edit: false,
  disabled: false,
  BodyComponent: function BodyComponent(_ref3) {
    var children = _ref3.children;
    return /*#__PURE__*/_jsx(UIPanelBody, {
      children: /*#__PURE__*/_jsx(UIPanelSection, {
        children: children
      })
    });
  },
  HeaderComponent: UIPanelHeader,
  FooterComponent: UIPanelFooter,
  setters: {},
  getters: {},
  transforms: DEFAULT_TRANSFORMS,
  validators: [subjectRequired, reminderMustBeInFuture, bodyMustBeUnderCharacterLimit],
  customInputComponents: {},
  buttonComponents: CREATE_FORM_BUTTONS,
  transformProperties: transformTaskPropertiesForForms,
  hasLinkedInSalesNavigatorAccess: false,
  onFormHasChanges: function onFormHasChanges() {},
  onReceiveLatestTaskUpdates: function onReceiveLatestTaskUpdates() {},
  clearFormOnAddAnother: function clearFormOnAddAnother() {},
  isUngatedForRecurringTasks: false
};
export { TaskFormInner as default };