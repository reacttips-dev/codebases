'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as DisplayTypes from 'customer-data-filters/filterQueryFormat/DisplayTypes';
import { Map as ImmutableMap } from 'immutable';
import { getOperatorTranslationKey } from './FilterOperatorTranslations';
import { isOperatorIncludesObjectsWithNoValueSet } from '../../utilities/defaultNullValue';
import DisplayValueBoolean from '../display/DisplayValueBoolean';
import DisplayValueCta from 'customer-data-filters/components/display/DisplayValueCta';
import DisplayValueDate from '../display/DisplayValueDate';
import DisplayValueDuration from '../display/DisplayValueDuration';
import DisplayValueEmailLink from '../display/DisplayValueEmailLink';
import DisplayValueEnumeration from '../display/DisplayValueEnumeration';
import DisplayValueExternalOption from '../display/DisplayValueExternalOption';
import DisplayValueNumber from '../display/DisplayValueNumber';
import DisplayValuePercentage from '../display/DisplayValuePercentage';
import DisplayValueProperty from '../display/DisplayValueProperty';
import DisplayValueRollingDate from '../display/DisplayValueRollingDate';
import DisplayValueRollingInequality from '../display/DisplayValueRollingInequality';
import DisplayValueRollingInequalityWithUnit from '../display/DisplayValueRollingInequalityWithUnit';
import DisplayValueRollingPropertyUpdated from '../display/DisplayValueRollingPropertyUpdated';
import DisplayValueText from '../display/DisplayValueText';
import DisplayValueRegex from '../display/DisplayValueRegex';
import FieldDefinitionType from '../propTypes/FieldDefinitionType';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedList from 'I18n/components/FormattedList';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { Fragment, PureComponent } from 'react';
import UILink from 'UIComponents/link/UILink';
import emptyFunction from 'react-utils/emptyFunction';
import getIn from 'transmute/getIn';
import { isExternalOptionsField } from '../../utilities/isExternalOptionsField';
var HIGH_VALUE_FIELD = 'highValue';
var VALUE_FIELD = 'value';
var styles = {
  bold: {
    fontWeight: '600'
  }
};

var getValueComponent = function getValueComponent(fieldDefinitions, operator, filterFamily) {
  var field = operator.field;
  var CustomValueComponent = getIn([field.name, 'ValueComponent'], fieldDefinitions);

  if (CustomValueComponent) {
    return CustomValueComponent;
  }

  if (field.type === 'number' && field.numberDisplayHint === 'duration' && operator.constructor.displayType === DisplayTypes.DefaultDisplayType) {
    return DisplayValueDuration;
  }

  var fieldType = getIn([field.name, 'inputType'], fieldDefinitions) || getIn([field.type, 'inputType'], fieldDefinitions) || field.displayType || field.type;
  var displayType = operator.constructor.displayType === DisplayTypes.DefaultDisplayType ? fieldType : operator.constructor.displayType;

  switch (displayType) {
    case DisplayTypes.BooleanDisplayType:
      return DisplayValueBoolean;

    case DisplayTypes.CtaDisplayType:
      return DisplayValueCta;

    case DisplayTypes.DateDisplayType:
    case DisplayTypes.DatetimeDisplayType:
      return DisplayValueDate;

    case DisplayTypes.EmailLinkDisplayType:
      return DisplayValueEmailLink;

    case DisplayTypes.EmailSubscriptionDisplayType:
    case DisplayTypes.EnumerationDisplayType:
      return isExternalOptionsField(field, filterFamily) ? DisplayValueExternalOption : DisplayValueEnumeration;

    case DisplayTypes.NumberDisplayType:
      return DisplayValueNumber;

    case DisplayTypes.PercentageDisplayType:
      return DisplayValuePercentage;

    case DisplayTypes.PropertyDisplayType:
      return DisplayValueProperty;

    case DisplayTypes.RollingPropertyUpdatedDisplayType:
      return DisplayValueRollingPropertyUpdated;

    case DisplayTypes.RollingDateDisplayType:
      return DisplayValueRollingDate;

    case DisplayTypes.RollingInequalityDisplayType:
      return DisplayValueRollingInequality;

    case DisplayTypes.RollingWithUnitDisplayType:
      return DisplayValueRollingInequalityWithUnit;

    case DisplayTypes.RegexString:
      return DisplayValueRegex;

    case DisplayTypes.NoDisplayType:
      return undefined;

    default:
      return DisplayValueText;
  }
};

var FilterOperatorDisplay = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterOperatorDisplay, _PureComponent);

  function FilterOperatorDisplay() {
    _classCallCheck(this, FilterOperatorDisplay);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorDisplay).apply(this, arguments));
  }

  _createClass(FilterOperatorDisplay, [{
    key: "getAssociatedObjectName",
    value: function getAssociatedObjectName() {
      var _this$props = this.props,
          filterFamily = _this$props.filterFamily,
          getFilterFamilyObjectName = _this$props.getFilterFamilyObjectName;
      var associatedObjectName = typeof getFilterFamilyObjectName === 'function' ? getFilterFamilyObjectName(filterFamily, true) : filterFamily;
      return associatedObjectName.toLowerCase();
    }
  }, {
    key: "renderLabel",
    value: function renderLabel() {
      var _this$props2 = this.props,
          getLabelString = _this$props2.getLabelString,
          isReadOnly = _this$props2.isReadOnly,
          isXoEnabled = _this$props2.isXoEnabled,
          field = _this$props2.operator.field;
      var Component = isReadOnly ? 'strong' : UILink;

      if (!isXoEnabled) {
        return /*#__PURE__*/_jsx("span", {
          "data-selenium-test": "FilterOperatorDisplay-filters2",
          children: getLabelString(field)
        });
      }

      return /*#__PURE__*/_jsx(Component, {
        children: getLabelString(field)
      });
    }
  }, {
    key: "renderValue",
    value: function renderValue(fieldName) {
      var _operatorDisplayValue;

      var _this$props3 = this.props,
          currencyCode = _this$props3.currencyCode,
          fieldDefinitions = _this$props3.fieldDefinitions,
          filterFamily = _this$props3.filterFamily,
          getFamilyValueResolver = _this$props3.getFamilyValueResolver,
          getReferencedObjectType = _this$props3.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props3.getSpecialOptionsForReferenceType,
          isReadOnly = _this$props3.isReadOnly,
          isXoEnabled = _this$props3.isXoEnabled,
          operator = _this$props3.operator,
          operatorValueDisplayCutoffCount = _this$props3.operatorValueDisplayCutoffCount;
      var ValueComponent = getValueComponent(fieldDefinitions, operator, filterFamily);
      var isInexclusive = operator.constructor.isInexclusive(fieldName);
      var isIterable = operator.constructor.isIterableField(fieldName);
      var specialOptions = getSpecialOptionsForReferenceType(getReferencedObjectType(operator));
      var value = operator.get(fieldName);
      var hasValueFieldAndItsEmpty = operator.has(fieldName) && (value === null || value === undefined);

      if (!ValueComponent || hasValueFieldAndItsEmpty) {
        return '';
      }

      if (!isIterable) {
        return /*#__PURE__*/_jsx("b", {
          style: styles.bold,
          children: /*#__PURE__*/_jsx(ValueComponent, {
            currencyCode: currencyCode,
            fieldDefinitions: fieldDefinitions,
            fieldName: [fieldName],
            getFamilyValueResolver: getFamilyValueResolver,
            getReferencedObjectType: getReferencedObjectType,
            operator: operator,
            specialOptions: specialOptions,
            value: value
          })
        });
      }

      var operatorValueDisplayOverflowCount = isIterable && isXoEnabled && !isReadOnly ? operator.get(fieldName).size - operatorValueDisplayCutoffCount : 0;
      var operatorValues = operator.get(fieldName).valueSeq();
      var operatorDisplayValues = operatorValueDisplayOverflowCount > 1 ? operatorValues.take(operatorValueDisplayCutoffCount) : operatorValues;
      return /*#__PURE__*/_jsx(FormattedList, {
        exclusive: !isInexclusive,
        children: (_operatorDisplayValue = operatorDisplayValues.map(function (valueItem, i) {
          return /*#__PURE__*/_jsx("b", {
            style: styles.bold,
            children: /*#__PURE__*/_jsx(ValueComponent, {
              currencyCode: currencyCode,
              fieldDefinitions: fieldDefinitions,
              fieldName: [fieldName, i],
              getFamilyValueResolver: getFamilyValueResolver,
              getReferencedObjectType: getReferencedObjectType,
              operator: operator,
              specialOptions: specialOptions,
              value: valueItem
            })
          }, i);
        })).concat.apply(_operatorDisplayValue, _toConsumableArray(operatorValueDisplayOverflowCount > 1 ? [/*#__PURE__*/_jsx("b", {
          style: styles.bold,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterEditorOperatorDisplay.valueOverflowCount",
            options: {
              count: operatorValueDisplayOverflowCount
            }
          })
        }, "overflow")] : []))
      });
    }
  }, {
    key: "renderEmptyInBold",
    value: function renderEmptyInBold() {
      return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "customerDataFilters.FilterOperatorTranslations.WITH_UNKNOWN.EmptyInBold"
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          operator = _this$props4.operator,
          _this$props4$operator = _this$props4.operator,
          ctor = _this$props4$operator.constructor,
          field = _this$props4$operator.field,
          includeObjectsWithNoAssociatedObjects = _this$props4.includeObjectsWithNoAssociatedObjects;
      var labelOptions = {
        // count is used to determine which translation to use, it shouldn't ever be displayed
        count: field.displayType === DisplayTypes.CountDisplayType ? parseInt(operator.get(VALUE_FIELD), 10) : undefined,
        highValue: operator.has(HIGH_VALUE_FIELD) ? this.renderValue(HIGH_VALUE_FIELD) : undefined,
        rollingOffset: operator.has('rollingOffset') ? parseInt(operator.get('rollingOffset') || 0, 10) : undefined,
        label: this.renderLabel(),
        value: this.renderValue(VALUE_FIELD),
        empty: this.renderEmptyInBold()
      };

      if (ctor && ctor.getOperatorDisplay) {
        return ctor.getOperatorDisplay(labelOptions);
      }

      var addOrUnknown = isOperatorIncludesObjectsWithNoValueSet(operator);
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(FormattedReactMessage, {
          message: getOperatorTranslationKey(ctor, field, addOrUnknown),
          options: labelOptions
        }), "\xA0", includeObjectsWithNoAssociatedObjects && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataFilters.FilterOperatorInput.includingObjectsWithNoAssociatedObjects",
          options: {
            associatedObjectName: this.getAssociatedObjectName()
          }
        })]
      });
    }
  }]);

  return FilterOperatorDisplay;
}(PureComponent);

export { FilterOperatorDisplay as default };
FilterOperatorDisplay.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  fieldDefinitions: ImmutablePropTypes.mapOf(FieldDefinitionType),
  filterFamily: PropTypes.string.isRequired,
  getFamilyValueResolver: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func,
  getLabelString: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  includeObjectsWithNoAssociatedObjects: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isXoEnabled: PropTypes.bool,
  operator: FilterOperatorType.isRequired,
  operatorValueDisplayCutoffCount: PropTypes.number.isRequired
};
FilterOperatorDisplay.defaultProps = {
  fieldDefinitions: ImmutableMap(),
  getFamilyValueResolver: getIn(['field', 'referencedObjectType']),
  getLabelString: function getLabelString(any) {
    return any.toString();
  },
  getReferencedObjectType: emptyFunction,
  operatorValueDisplayCutoffCount: 10
};