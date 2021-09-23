'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import omit from 'transmute/omit';
import PropertyInput from 'customer-data-properties/input/PropertyInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import { LINKED_IN, LINKED_IN_MESSAGE } from 'customer-data-objects/engagement/TaskTypes';
import { isEqual } from '../utils/isEqual'; // to support lengths of long task types

var TASK_TYPE_FORM_CONTROL_MIN_WIDTH = 250; // We prevent the propertyName prop from being passed through to the DOM
// to avoid a "React doesn't recognize the 'propertyName' DOM attribute" error.
// eslint-disable-next-line no-unused-vars

var StyledFormControl = styled(function (_ref) {
  var propertyName = _ref.propertyName,
      props = _objectWithoutProperties(_ref, ["propertyName"]);

  return /*#__PURE__*/_jsx(UIFormControl, Object.assign({}, props));
}).withConfig({
  displayName: "TaskPropertyFormControl__StyledFormControl",
  componentId: "sc-2mcuxh-0"
})(["min-width:", "px;"], function (_ref2) {
  var propertyName = _ref2.propertyName;
  return propertyName === 'hs_task_type' ? TASK_TYPE_FORM_CONTROL_MIN_WIDTH : 0;
});

var TaskPropertyFormControl = /*#__PURE__*/function (_Component) {
  _inherits(TaskPropertyFormControl, _Component);

  function TaskPropertyFormControl(props) {
    var _this;

    _classCallCheck(this, TaskPropertyFormControl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TaskPropertyFormControl).call(this, props));
    _this.getLabel = _this.getLabel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TaskPropertyFormControl, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.value !== nextProps.value || this.props.message !== nextProps.message || this.props.error !== nextProps.error || this.props.property !== nextProps.property || this.props.onChange !== nextProps.onChange || !isEqual(this.props.inputProps, nextProps.inputProps);
    }
  }, {
    key: "getLabel",
    value: function getLabel() {
      var _this$props = this.props,
          property = _this$props.property,
          inputProps = _this$props.inputProps;

      if ('label' in inputProps) {
        return inputProps.label;
      }

      if (property) {
        return property.label;
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          error = _this$props2.error,
          inputComponent = _this$props2.inputComponent,
          inputProps = _this$props2.inputProps,
          message = _this$props2.message,
          onChange = _this$props2.onChange,
          property = _this$props2.property,
          value = _this$props2.value,
          subject = _this$props2.subject;
      var Input = inputComponent || PropertyInput;
      var cleanedInputProps = omit(['tooltip', 'containerClasses', 'label'], inputProps);
      var propertyName = property && property.get('name');
      return /*#__PURE__*/_jsx(StyledFormControl, {
        propertyName: propertyName,
        required: inputProps.isRequired,
        label: this.getLabel(),
        error: error,
        validationMessage: message,
        tooltip: inputProps.tooltip,
        className: inputProps.containerClasses,
        children: /*#__PURE__*/_jsx(Input, Object.assign({
          subject: subject,
          objectType: TASK // TODO: Remove conditional and just use value once LINKED_IN is removed
          ,
          value: value === LINKED_IN ? LINKED_IN_MESSAGE : value,
          property: property,
          onChange: onChange,
          showError: error
        }, cleanedInputProps))
      });
    }
  }]);

  return TaskPropertyFormControl;
}(Component);

TaskPropertyFormControl.propTypes = {
  subject: PropTypes.instanceOf(TaskRecord).isRequired,
  property: PropTypes.instanceOf(PropertyRecord),
  error: PropTypes.bool,
  inputComponent: PropTypes.any,
  inputProps: PropTypes.object,
  message: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any
};
TaskPropertyFormControl.defaultProps = {
  inputProps: {}
};
export { TaskPropertyFormControl as default };