'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import FormattedMessage from 'I18n/components/FormattedMessage';
import TaskFormError from './TaskFormError';
import TaskFormInner from './TaskFormInner';

var TaskForm = /*#__PURE__*/function (_Component) {
  _inherits(TaskForm, _Component);

  _createClass(TaskForm, null, [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        error: error
      };
    }
  }]);

  function TaskForm(props) {
    var _this;

    _classCallCheck(this, TaskForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TaskForm).call(this, props));
    _this.state = {
      error: null
    };
    return _this;
  }

  _createClass(TaskForm, [{
    key: "render",
    value: function render() {
      var renderRhumbErrorMarker = this.props.renderRhumbErrorMarker;
      var error = this.state.error;

      if (error) {
        return /*#__PURE__*/_jsxs(TaskFormError, Object.assign({
          edit: !!this.props.task
        }, this.props, {
          children: [/*#__PURE__*/_jsx(FormattedMessage, {
            message: "taskFormsLib.errors.unknownTaskError"
          }), renderRhumbErrorMarker && renderRhumbErrorMarker()]
        }));
      }

      return /*#__PURE__*/_jsx(TaskFormInner, Object.assign({}, this.props));
    }
  }]);

  return TaskForm;
}(Component);

TaskForm.propTypes = {
  task: PropTypes.instanceOf(TaskRecord),
  renderRhumbErrorMarker: PropTypes.func
};
export { TaskForm as default };