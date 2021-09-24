'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { CONTACT, DEAL, TASK, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PropertyInputComponent from 'customer-data-properties/input/PropertyInput';
import PropertyInputPipeline from './input/PropertyInputPipeline';
import PropertyInputMultipleEmailWrapper from './input/PropertyInputMultipleEmailWrapper';
import PropertyTaskInputDate from './input/custom/PropertyTaskInputDate';
import { AnyCrmObjectTypePropType, AnyCrmObjectPropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { mapOf } from 'react-immutable-proptypes';
import emptyFunction from 'react-utils/emptyFunction';

var isContactEmail = function isContactEmail(property, objectType) {
  return objectType === CONTACT && property.name === 'email';
};

var isDealPipeline = function isDealPipeline(property, objectType) {
  return objectType === DEAL && property.name === 'pipeline';
};

var isTicketPipeline = function isTicketPipeline(property, objectType) {
  return objectType === TICKET && property.name === 'hs_pipeline';
};

var isTaskInputDate = function isTaskInputDate(property, objectType) {
  return objectType === TASK && property.name === 'engagement.timestamp';
};

var propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isInline: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onInvalidProperty: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyUp: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  readOnly: PropTypes.bool,
  resolver: PropTypes.oneOfType([ReferenceResolverType, mapOf(ReferenceResolverType)]),
  showPlaceholder: PropTypes.bool,
  useSecondaryEmail: PropTypes.bool,
  // temporary, will replace gates logic in the new PropertyInput
  value: PropTypes.node,
  showError: PropTypes.bool,
  propertyIndex: PropTypes.number,
  autoFocus: PropTypes.bool,
  subjectId: PropTypes.string,
  subject: PropTypes.oneOfType([ImmutablePropTypes.map, AnyCrmObjectPropType]),
  openPipelineUpgradeModal: PropTypes.func,
  onPipelineOpenChange: PropTypes.func
};
var defaultProps = {
  isInline: false,
  onPipelineOpenChange: emptyFunction
};

var PropertyInput = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInput, _Component);

  function PropertyInput() {
    _classCallCheck(this, PropertyInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInput).apply(this, arguments));
  }

  _createClass(PropertyInput, [{
    key: "focus",
    value: function focus() {
      if (this.refs.input && typeof this.refs.input.focus === 'function') {
        this.refs.input.focus();
      }
    }
  }, {
    key: "getComponent",
    value: function getComponent() {
      var _this$props = this.props,
          objectType = _this$props.objectType,
          property = _this$props.property,
          subjectId = _this$props.subjectId;

      if (isDealPipeline(property, objectType) || isTicketPipeline(property, objectType)) {
        return PropertyInputPipeline;
      }

      if (subjectId && isContactEmail(property, objectType)) {
        return PropertyInputMultipleEmailWrapper;
      }

      if (isTaskInputDate(property, objectType)) {
        return PropertyTaskInputDate;
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(PropertyInputComponent, Object.assign({}, this.props, {
        componentResolver: this.getComponent,
        ref: "input"
      }));
    }
  }]);

  return PropertyInput;
}(Component);

export { PropertyInput as default };
PropertyInput.propTypes = propTypes;
PropertyInput.defaultProps = defaultProps;