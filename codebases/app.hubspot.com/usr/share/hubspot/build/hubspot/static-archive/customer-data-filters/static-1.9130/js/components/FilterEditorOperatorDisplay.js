'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { ENUMERATION } from 'customer-data-objects/property/PropertyTypes';
import { List, is } from 'immutable';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import Any from 'customer-data-filters/filterQueryFormat/operator/Any';
import FilterEditorOperator from './editor/FilterEditorOperator';
import FilterOperatorDisplay from './operator/FilterOperatorDisplay';
import FilterOperatorType from './propTypes/FilterOperatorType';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedList from 'I18n/components/FormattedList';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import MissingField from 'customer-data-filters/filterQueryFormat/MissingField';
import PropTypes from 'prop-types';
import { Component } from 'react';
import Small from 'UIComponents/elements/Small';
import UIFlex from 'UIComponents/layout/UIFlex';
import classNames from 'classnames';
import get from 'transmute/get';
import memoize from 'transmute/memoize';
import partial from 'transmute/partial';

var FilterEditorOperatorDisplay = /*#__PURE__*/function (_Component) {
  _inherits(FilterEditorOperatorDisplay, _Component);

  function FilterEditorOperatorDisplay() {
    var _this;

    _classCallCheck(this, FilterEditorOperatorDisplay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOperatorDisplay).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.getInvalidOptions = function (field, operator, getFamilyValueResolver) {
      var fieldResolver = getFamilyValueResolver(operator);

      if (field.type === ENUMERATION && field.options && field.options.size > 0 && !fieldResolver && operator.constructor.isIterableField('value')) {
        return operator.value.filter(function (value) {
          return field.options.findIndex(function (option) {
            return get('value', option) === value;
          }) === -1;
        });
      }

      return List();
    };

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(FilterEditorOperatorDisplay, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(prevProps) {
      var _this2 = this;

      return Object.keys(this.props).some(function (key) {
        if (key === 'path' || key === 'operator') {
          if (!is(_this2.props[key], prevProps[key])) {
            return true;
          }
        } else {
          if (_this2.props[key] !== prevProps[key]) {
            return true;
          }
        }

        return false;
      });
    }
  }, {
    key: "getErrorMessage",
    value: function getErrorMessage(operator, operatorLabel, validOperators, getFamilyValueResolver, showInvalidOptionErrors, validateOperator) {
      var field = operator.get('field');
      var isValidOperator = MissingField.isMissingField(field) || operator && validOperators.has(operator.constructor);
      var isMissingFieldWithError = MissingField.isMissingField(field) && field.errorMessage;
      var invalidOptions = this.getInvalidOptions(field, operator, getFamilyValueResolver);
      var operatorValidationError = validateOperator(operator);

      if (operatorValidationError.error && operatorValidationError.message) {
        return operatorValidationError.message;
      }

      if (isMissingFieldWithError) {
        return field.errorMessage;
      } else if (!isValidOperator) {
        return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataFilters.FilterEditorOperatorDisplayList.invalidOperator",
          options: {
            operatorType: operatorLabel
          }
        });
      } else if (showInvalidOptionErrors && invalidOptions.size > 0) {
        return /*#__PURE__*/_jsxs(UIFlex, {
          direction: "column",
          children: [/*#__PURE__*/_jsx(FormattedReactMessage, {
            message: "customerDataFilters.FilterEditorOperatorDisplayList.invalidOption.error",
            options: {
              count: invalidOptions.size,
              fieldName: propertyLabelTranslator(field.label),
              invalidOptions: this.renderInvalidOptions(invalidOptions)
            }
          }), /*#__PURE__*/_jsx(KnowledgeBaseButton, {
            url: "https://knowledge.hubspot.com/crm-setup/resolve-invalid-filter-errors",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterEditorOperatorDisplayList.invalidOption.help"
            })
          })]
        });
      }

      return null;
    }
  }, {
    key: "renderInvalidOptions",
    value: function renderInvalidOptions(invalidOptions) {
      return /*#__PURE__*/_jsx(FormattedList, {
        exclusive: false,
        children: invalidOptions.map(function (value) {
          return /*#__PURE__*/_jsx("b", {
            children: value
          }, value);
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currencyCode = _this$props.currencyCode,
          filterFamily = _this$props.filterFamily,
          getFieldDefinitions = _this$props.getFieldDefinitions,
          getLabelString = _this$props.getLabelString,
          getOperators = _this$props.getOperators,
          getOperatorLabel = _this$props.getOperatorLabel,
          getFilterFamilyObjectName = _this$props.getFilterFamilyObjectName,
          getReferencedObjectType = _this$props.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props.getSpecialOptionsForReferenceType,
          getValueResolver = _this$props.getValueResolver,
          handleOpenEdit = _this$props.handleOpenEdit,
          handleOperatorRemove = _this$props.handleOperatorRemove,
          isReadOnly = _this$props.isReadOnly,
          isXoEnabled = _this$props.isXoEnabled,
          isZeroLevel = _this$props.isZeroLevel,
          operator = _this$props.operator,
          path = _this$props.path,
          showInvalidOptionErrors = _this$props.showInvalidOptionErrors,
          validateOperator = _this$props.validateOperator,
          includeObjectsWithNoAssociatedObjects = _this$props.includeObjectsWithNoAssociatedObjects;
      var isTopLevel = path.size <= 2;
      var isRefinementPresent = operator && operator.constructor.isRefinable && operator.refinement && operator.refinement.constructor !== Any;
      var getFamilyValueResolver = this.partial(getValueResolver, filterFamily);
      var sharedProps = {
        currencyCode: currencyCode,
        fieldDefinitions: getFieldDefinitions(filterFamily),
        getFamilyValueResolver: getFamilyValueResolver,
        getLabelString: getLabelString,
        getReferencedObjectType: this.partial(getReferencedObjectType, filterFamily),
        getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
        isReadOnly: isReadOnly,
        isXoEnabled: isXoEnabled,
        includeObjectsWithNoAssociatedObjects: includeObjectsWithNoAssociatedObjects,
        getFilterFamilyObjectName: getFilterFamilyObjectName,
        filterFamily: filterFamily
      };
      var validOperators = getOperators(operator.get('field'), filterFamily);
      var operatorLabel = getOperatorLabel(operator.constructor);
      var errorMessage = this.getErrorMessage(operator, operatorLabel, validOperators, getFamilyValueResolver, showInvalidOptionErrors, validateOperator);
      return /*#__PURE__*/_jsxs(FilterEditorOperator, {
        className: classNames(isXoEnabled && !isZeroLevel && ['p-left-4 p-right-2 ', isTopLevel && 'p-y-3', !isTopLevel && 'p-y-1']),
        hoverContentClassName: isXoEnabled && isTopLevel ? 'p-top-2' : "",
        isReadOnly: isReadOnly,
        isXoEnabled: isXoEnabled,
        onEdit: this.partial(handleOpenEdit, path, filterFamily),
        onRemove: this.partial(handleOperatorRemove, path),
        operator: operator,
        children: [!isRefinementPresent && /*#__PURE__*/_jsx(FilterOperatorDisplay, Object.assign({}, sharedProps, {
          operator: operator
        })), isRefinementPresent && /*#__PURE__*/_jsxs("span", {
          children: [/*#__PURE__*/_jsx(FilterOperatorDisplay, Object.assign({}, sharedProps, {
            operator: operator
          })), /*#__PURE__*/_jsx(FilterOperatorDisplay, Object.assign({}, sharedProps, {
            operator: operator.refinement
          }))]
        }), errorMessage && /*#__PURE__*/_jsx(Small, {
          className: "display-block",
          use: "error",
          children: errorMessage
        })]
      });
    }
  }]);

  return FilterEditorOperatorDisplay;
}(Component);

FilterEditorOperatorDisplay.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  filterFamily: PropTypes.string.isRequired,
  getFieldDefinitions: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func,
  getLabelString: PropTypes.func.isRequired,
  getOperatorLabel: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  getValueResolver: PropTypes.func.isRequired,
  handleOpenEdit: PropTypes.func.isRequired,
  handleOperatorRemove: PropTypes.func.isRequired,
  includeObjectsWithNoAssociatedObjects: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isXoEnabled: PropTypes.bool.isRequired,
  isZeroLevel: PropTypes.bool,
  operator: FilterOperatorType.isRequired,
  path: PropTypes.instanceOf(List),
  showInvalidOptionErrors: PropTypes.bool.isRequired,
  validateOperator: PropTypes.func.isRequired
};
export default FilterEditorOperatorDisplay;