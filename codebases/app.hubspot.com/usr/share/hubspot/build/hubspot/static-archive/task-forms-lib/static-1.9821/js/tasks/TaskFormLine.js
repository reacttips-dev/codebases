'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import get from 'transmute/get';
import partial from 'transmute/partial';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import getPropertyValue from './getters/getPropertyValue';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import TaskPropertyFormControl from './TaskPropertyFormControl';
import { isValidElement } from 'react';

var TaskFormLine = function TaskFormLine(_ref) {
  var task = _ref.task,
      updates = _ref.updates,
      properties = _ref.properties,
      formLine = _ref.formLine,
      errors = _ref.errors,
      messages = _ref.messages,
      onChange = _ref.onChange,
      customInputComponents = _ref.customInputComponents,
      fieldProps = _ref.fieldProps,
      getters = _ref.getters;

  if ( /*#__PURE__*/isValidElement(formLine)) {
    return formLine;
  }

  if (!Array.isArray(formLine)) {
    var field = formLine;
    var getValue = get(field, getters) || getPropertyValue;
    return /*#__PURE__*/_jsx(TaskPropertyFormControl, {
      property: get(field, properties),
      value: getValue({
        task: task,
        updates: updates,
        field: field
      }),
      error: errors.has(field) && updates.has(field),
      message: get(field, messages),
      onChange: partial(onChange, field),
      inputComponent: get(field, customInputComponents),
      inputProps: get(field, fieldProps),
      subject: task
    }, field);
  }

  return /*#__PURE__*/_jsx(UIFlex, {
    direction: "row",
    align: "end",
    justify: "start",
    children: formLine.map(function (field, index) {
      var inputProps = get(field, fieldProps);
      var flexProps = inputProps.flexProps;
      var getValue = get(field, getters) || getPropertyValue;
      var className = index > 0 ? 'm-left-4' : "";
      return /*#__PURE__*/_jsx(UIBox, Object.assign({
        className: className,
        grow: 1
      }, flexProps, {
        children: /*#__PURE__*/_jsx(TaskPropertyFormControl, {
          property: get(field, properties),
          value: getValue({
            task: task,
            updates: updates,
            field: field
          }),
          error: errors.has(field) && updates.has(field),
          message: get(field, messages),
          onChange: partial(onChange, field),
          inputComponent: get(field, customInputComponents),
          inputProps: get(field, fieldProps),
          subject: task
        })
      }), field);
    })
  });
};

TaskFormLine.propTypes = {
  customInputComponents: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  fieldProps: PropTypes.object.isRequired,
  formLine: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]).isRequired,
  getters: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  task: PropTypes.instanceOf(TaskRecord).isRequired,
  updates: PropTypes.object.isRequired
};
export default TaskFormLine;