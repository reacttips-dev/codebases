'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { TaskFormContext } from './TaskFormContext';
export default function TaskFormContextProvider(_ref) {
  var properties = _ref.properties,
      task = _ref.task,
      errors = _ref.errors,
      messages = _ref.messages,
      onChange = _ref.onChange,
      customInputComponents = _ref.customInputComponents,
      fieldProps = _ref.fieldProps,
      getters = _ref.getters,
      updates = _ref.updates,
      children = _ref.children;
  var contextValue = useMemo(function () {
    return {
      properties: properties,
      task: task,
      errors: errors,
      messages: messages,
      onChange: onChange,
      customInputComponents: customInputComponents,
      fieldProps: fieldProps,
      getters: getters,
      updates: updates
    };
  }, [customInputComponents, errors, fieldProps, getters, messages, onChange, properties, task, updates]);
  return /*#__PURE__*/_jsx(TaskFormContext.Provider, {
    value: contextValue,
    children: children
  });
}
TaskFormContextProvider.propTypes = {
  properties: PropTypes.object.isRequired,
  task: PropTypes.instanceOf(TaskRecord).isRequired,
  errors: PropTypes.object,
  messages: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  customInputComponents: PropTypes.object,
  fieldProps: PropTypes.object,
  getters: PropTypes.object,
  updates: PropTypes.object,
  children: PropTypes.node
};