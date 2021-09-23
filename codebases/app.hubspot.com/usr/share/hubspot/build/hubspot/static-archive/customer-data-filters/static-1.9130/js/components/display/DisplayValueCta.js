'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { __ANY_CTA } from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import { deref, unwatch, watch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import get from 'transmute/get';
import indexBy from 'transmute/indexBy';

var DisplayValueCta = /*#__PURE__*/function (_PureComponent) {
  _inherits(DisplayValueCta, _PureComponent);

  function DisplayValueCta() {
    var _this;

    _classCallCheck(this, DisplayValueCta);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayValueCta).call(this));

    _this.handleReferenceChange = function (reference) {
      var value = _this.props.value;

      if (isResolved(reference)) {
        var ctas = indexBy(get('guid'), reference.referencedObject.get('ctaInfo'));
        var label = I18n.text('customerDataFilters.FilterEditor.specialOptionValues.variationCta.display', {
          variantLabel: ctas.getIn([value, 'variantLabel'])
        });
        var isDefault = ctas.getIn([value, 'isDefault']);

        _this.setState({
          reference: isDefault ? I18n.text('customerDataFilters.FilterEditor.specialOptionValues.defaultCta.display') : label
        });
      }
    };

    _this.state = {
      reference: null
    };
    _this.referenceAtom = null;
    return _this;
  }

  _createClass(DisplayValueCta, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getReference();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var operator = this.props.operator;
      var prevOperator = prevProps.operator;

      if (operator.field.name !== prevOperator.field.name || operator.value !== prevOperator.value) {
        this.getReference();
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
    key: "getReference",
    value: function getReference() {
      var _this$props = this.props,
          getFamilyValueResolver = _this$props.getFamilyValueResolver,
          operator = _this$props.operator,
          value = _this$props.value;
      var resolver = getFamilyValueResolver(operator);

      if (value === __ANY_CTA) {
        this.setState({
          reference: value
        });
      } else if (resolver && resolver.byId && operator.field.name !== 'undefined') {
        if (this.referenceAtom) {
          unwatch(this.referenceAtom, this.handleReferenceChange);
        }

        this.referenceAtom = resolver.byId(operator.field.name);
        watch(this.referenceAtom, this.handleReferenceChange);
        this.handleReferenceChange(deref(this.referenceAtom));
      }
    }
  }, {
    key: "getValueName",
    value: function getValueName() {
      var reference = this.state.reference;

      if (reference === __ANY_CTA) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataFilters.FilterEditor.specialOptionValues.anyCta.display"
        });
      }

      return reference;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("span", {
        children: this.getValueName()
      });
    }
  }]);

  return DisplayValueCta;
}(PureComponent);

export { DisplayValueCta as default };
DisplayValueCta.propTypes = {
  getFamilyValueResolver: PropTypes.func.isRequired,
  operator: FilterOperatorType.isRequired,
  value: PropTypes.string.isRequired
};