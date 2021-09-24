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
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

var getFieldLabel = function getFieldLabel(reference, value) {
  return reference ? FieldTranslator.getTranslatedFieldLabel({
    fieldLabel: reference.label
  }) : value;
};

var DisplayValueProperty = /*#__PURE__*/function (_PureComponent) {
  _inherits(DisplayValueProperty, _PureComponent);

  function DisplayValueProperty() {
    var _this;

    _classCallCheck(this, DisplayValueProperty);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayValueProperty).call(this));

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

  _createClass(DisplayValueProperty, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mountResolver();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var value = this.props.value;

      if (prevProps.value !== value) {
        this.mountResolver();
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
    key: "mountResolver",
    value: function mountResolver() {
      var _this$props = this.props,
          getFamilyValueResolver = _this$props.getFamilyValueResolver,
          operator = _this$props.operator,
          value = _this$props.value;
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
      var value = this.props.value;
      var reference = this.state.reference;
      var propertyLabel = getFieldLabel(reference, value);
      return /*#__PURE__*/_jsx("span", {
        children: propertyLabel
      });
    }
  }]);

  return DisplayValueProperty;
}(PureComponent);

export { DisplayValueProperty as default };
DisplayValueProperty.propTypes = {
  getFamilyValueResolver: PropTypes.func.isRequired,
  operator: FilterOperatorType,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};