'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import TaskFormLine from './TaskFormLine';

var TaskFormFields = function TaskFormFields(props) {
  var formLines = props.formLines,
      rest = _objectWithoutProperties(props, ["formLines"]);

  return formLines.map(function (formLine, index) {
    return /*#__PURE__*/_jsx(TaskFormLine, Object.assign({
      formLine: formLine
    }, rest), index);
  });
};

TaskFormFields.propTypes = {
  properties: PropTypes.object.isRequired,
  task: PropTypes.instanceOf(TaskRecord).isRequired,
  formLines: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node])).isRequired,
  errors: PropTypes.object,
  messages: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  customInputComponents: PropTypes.object,
  fieldProps: PropTypes.object,
  getters: PropTypes.object,
  updates: PropTypes.object
};
TaskFormFields.defaultProps = {
  customInputComponents: {},
  getters: {},
  fieldProps: {},
  errors: {},
  messages: {}
};
export default TaskFormFields;