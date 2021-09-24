'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as FieldTranslator from 'customer-data-filters/components/FieldTranslator';
import { deref, unwatch, watch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import { listOf } from 'react-immutable-proptypes';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import PropTypes from 'prop-types';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import { PureComponent } from 'react';

function getReferenceLabel(reference, value) {
  if (!reference) {
    return value;
  }

  return reference.label || reference.id || reference.value;
}

function findOptionLabel(options, value) {
  var option = options && options.find(function (o) {
    return o.value === value;
  });
  return option ? option.hubspotDefined ? FieldTranslator.getTranslatedFieldLabel({
    fieldLabel: option.label
  }) : option.label : value;
}

var DisplayValueEnumeration = /*#__PURE__*/function (_PureComponent) {
  _inherits(DisplayValueEnumeration, _PureComponent);

  function DisplayValueEnumeration() {
    var _this;

    _classCallCheck(this, DisplayValueEnumeration);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayValueEnumeration).call(this));

    _this.handleReferenceChange = function (reference) {
      if (isResolved(reference)) {
        _this.setState({
          reference: reference
        });
      }
    };

    _this.state = {
      reference: null
    };
    _this.referenceAtom = null;
    return _this;
  }

  _createClass(DisplayValueEnumeration, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleValueReference();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var value = this.props.value;

      if (prevProps.value !== value) {
        this.handleValueReference();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleReferenceChange);
      }
    }
  }, {
    key: "handleValueReference",
    value: function handleValueReference() {
      if (this.handleSpecialOptions()) {
        return;
      }

      this.mountResolver();
    }
  }, {
    key: "handleSpecialOptions",
    value: function handleSpecialOptions() {
      var _this$props = this.props,
          specialOptions = _this$props.specialOptions,
          value = _this$props.value;

      if (specialOptions) {
        var valueReference = specialOptions.findLast(function (reference) {
          return reference.value === value;
        });

        if (valueReference) {
          this.setState({
            reference: valueReference
          });
          return true;
        }
      }

      return false;
    }
  }, {
    key: "mountResolver",
    value: function mountResolver() {
      var _this$props2 = this.props,
          getFamilyValueResolver = _this$props2.getFamilyValueResolver,
          operator = _this$props2.operator,
          value = _this$props2.value;
      var resolver = getFamilyValueResolver(operator);

      if (resolver && resolver.byId) {
        if (this.referenceAtom) {
          unwatch(this.referenceAtom, this.handleReferenceChange);
        }

        this.referenceAtom = resolver.byId(value);
        watch(this.referenceAtom, this.handleReferenceChange);
        this.handleReferenceChange(deref(this.referenceAtom));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          operator = _this$props3.operator,
          value = _this$props3.value;
      var reference = this.state.reference;
      var valueName = reference ? getReferenceLabel(reference, value) : findOptionLabel(operator.field.options, value);
      return /*#__PURE__*/_jsx("span", {
        children: valueName
      });
    }
  }]);

  return DisplayValueEnumeration;
}(PureComponent);

export { DisplayValueEnumeration as default };
DisplayValueEnumeration.propTypes = {
  getFamilyValueResolver: PropTypes.func.isRequired,
  operator: FilterOperatorType,
  specialOptions: listOf(PropTypes.instanceOf(PropertyOptionRecord).isRequired),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};