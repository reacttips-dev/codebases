'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import identity from 'transmute/identity';
import classNames from 'classnames';
import { List, Set as ImmutableSet } from 'immutable';
import omit from 'transmute/omit';
import { getDisplayedValue } from 'customer-data-property-utils/PropertyValueDisplay';
import { parseMultiEnumValue } from 'customer-data-property-utils/parseMultiEnumValue';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import * as ReferenceTypes from 'reference-resolvers/schema/ReferenceTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { DATA_1, DATA_2 } from 'customer-data-objects/record/AnalyticsSourceIdentifier';
import FormattedMessage from 'I18n/components/FormattedHTMLMessage';
import { isResolved } from 'reference-resolvers/utils';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon'; // properties that don't need to be filtered by their internal value but should display the internal value tooltip

var DISPLAY_VALUE_FILTERABLE = ImmutableSet(['salesforcecampaignids']); // properties that don't need to be filtered by their internal value but should NOT display the internal value tooltip

var DISPLAY_VALUE_NO_TOOLTIP = ImmutableSet(['hubspot_team_id']);
var propTypes = {
  InputComponent: PropTypes.func,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  readOnlySourceData: PropTypes.shape({
    isKnownGuid: PropTypes.func.isRequired,
    getGuidLabel: PropTypes.func.isRequired
  }).isRequired,
  resolver: ReferenceResolverType.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.node,
  className: PropTypes.string,
  references: PropTypes.arrayOf(ReferenceTypes.byId).isRequired,
  multi: PropTypes.bool
};
var defaultProps = {
  options: List()
};

var getValueDependentDisplayValue = function getValueDependentDisplayValue(name, value, _ref) {
  var isKnownGuid = _ref.isKnownGuid,
      getGuidLabel = _ref.getGuidLabel;
  var displayValue = null;

  switch (name) {
    case DATA_1:
    case DATA_2:
      if (isKnownGuid(value)) {
        displayValue = getGuidLabel(value);
      }

      break;

    default:
      // If this is not a known property name whose label can be derived from its
      // current value (e.g., it's not a GUID that we have a hardcoded label for),
      // fall through to resolving via reference-resolvers
      break;
  }

  return displayValue;
};

var getReferencedObjectDependendentDisplayValue = function getReferencedObjectDependendentDisplayValue(referencedValue) {
  // If this is not a known property name that we have custom handling for,
  // default to showing the label returned by the resolver (similar to
  // `ReferenceName`). This is the string that will be used to refer to the
  // object in reference-resolver-powered selects.
  return referencedValue.label;
};

function getDataAttributes(props) {
  var results = {};
  Object.keys(props).forEach(function (key) {
    return key.indexOf('data') === 0 ? results[key] = props[key] : undefined;
  });
  return results;
}

var ReferenceDisplayValue = /*#__PURE__*/function (_Component) {
  _inherits(ReferenceDisplayValue, _Component);

  function ReferenceDisplayValue() {
    _classCallCheck(this, ReferenceDisplayValue);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReferenceDisplayValue).apply(this, arguments));
  }

  _createClass(ReferenceDisplayValue, [{
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "shouldRenderTooltip",
    value: function shouldRenderTooltip(referencedDisplayValue) {
      var _this$props = this.props,
          property = _this$props.property,
          value = _this$props.value,
          InputComponent = _this$props.InputComponent;

      if (DISPLAY_VALUE_NO_TOOLTIP.has(property.name) || !InputComponent) {
        return false;
      }

      var displayValue = getDisplayedValue(property, value);
      return displayValue && referencedDisplayValue && displayValue !== referencedDisplayValue;
    }
  }, {
    key: "getTooltipMessage",
    value: function getTooltipMessage() {
      return DISPLAY_VALUE_FILTERABLE.has(this.props.property.name) ? 'customerDataReferenceUiComponents.referenceDisplayValue.internalValueTooltip' : 'customerDataReferenceUiComponents.referenceDisplayValue.internalValueRequiredForFiltersTooltip';
    }
  }, {
    key: "getReferencedDisplayValue",
    value: function getReferencedDisplayValue() {
      var _this$props2 = this.props,
          property = _this$props2.property,
          value = _this$props2.value,
          multi = _this$props2.multi,
          readOnlySourceData = _this$props2.readOnlySourceData,
          references = _this$props2.references;

      if (!value) {
        return null;
      }

      var propertyName = property.name;
      var displayValue = getValueDependentDisplayValue(propertyName, value, readOnlySourceData);

      if (displayValue != null) {
        return displayValue;
      }

      var ids = multi ? parseMultiEnumValue(value) : value != null ? [value] : [];
      return references.map(function (reference, index) {
        if (!isResolved(reference)) {
          // Fall back to showing the raw id as a placeholder
          return ids[index];
        }

        var referencedObject = reference.referencedObject;

        if (!referencedObject) {
          return null;
        }

        return getReferencedObjectDependendentDisplayValue(reference);
      }).filter(identity).join(', ');
    }
  }, {
    key: "renderWithTooltip",
    value: function renderWithTooltip(displayValue, transferableProps) {
      var _this$props3 = this.props,
          property = _this$props3.property,
          value = _this$props3.value,
          InputComponent = _this$props3.InputComponent,
          className = _this$props3.className;
      var inputClassNames = classNames(className, 'p-left-2');
      var originalValue = getDisplayedValue(property, value);

      var title = /*#__PURE__*/_jsx(FormattedMessage, {
        message: this.getTooltipMessage(),
        options: {
          originalValue: originalValue
        }
      });

      return /*#__PURE__*/_jsxs("div", {
        className: "flex-row",
        children: [/*#__PURE__*/_jsx(UIHelpIcon, {
          className: "m-top-2",
          tooltipPlacement: "top right",
          title: title
        }), /*#__PURE__*/_jsx(InputComponent, Object.assign({}, transferableProps, {
          value: displayValue,
          className: inputClassNames
        }))]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          property = _this$props4.property,
          value = _this$props4.value,
          InputComponent = _this$props4.InputComponent,
          placeholder = _this$props4.placeholder,
          className = _this$props4.className;
      var referencedDisplayValue = this.getReferencedDisplayValue();
      var displayValue = referencedDisplayValue || getDisplayedValue(property, value);
      var transferableProps = omit(['actions', 'baseUrl', 'isInline', 'InputComponent', 'multi', 'multiCurrencyCurrencyCode', 'objectType', 'onCancel', 'onInvalidProperty', 'options', 'onSecondaryChange', 'propertyIndex', 'readOnlySourceData', 'resize', 'resolver', 'secondaryChanges', 'showError', 'showPlaceholder', 'subjectId', 'propertyInputComponentConfig'], this.props);

      if (this.shouldRenderTooltip(referencedDisplayValue)) {
        return this.renderWithTooltip(displayValue, transferableProps);
      }

      return InputComponent ? /*#__PURE__*/_jsx(InputComponent, Object.assign({}, transferableProps, {
        value: displayValue,
        ref: "input"
      })) : /*#__PURE__*/_jsx("span", Object.assign({}, getDataAttributes(this.props), {
        className: className,
        children: displayValue || placeholder
      }));
    }
  }]);

  return ReferenceDisplayValue;
}(Component);

ReferenceDisplayValue.propTypes = propTypes;
ReferenceDisplayValue.defaultProps = defaultProps;

var mapResolversToProps = function mapResolversToProps(__resolvers, _ref2) {
  var resolver = _ref2.resolver,
      value = _ref2.value,
      multi = _ref2.multi;
  var ids = multi ? parseMultiEnumValue(value) : value != null ? [value] : [];
  return {
    references: ids.map(function (id) {
      return resolver.byId(id);
    })
  };
};

export { ReferenceDisplayValue as WrappedComponent };
export default ResolveReferences(mapResolversToProps)(ReferenceDisplayValue);