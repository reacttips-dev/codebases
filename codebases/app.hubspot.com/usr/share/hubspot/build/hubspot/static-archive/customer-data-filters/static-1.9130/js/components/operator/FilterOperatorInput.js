'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as InputTypes from 'customer-data-filters/filterQueryFormat/InputTypes';
import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { CALCULATION, EQUATION, ROLLUP } from 'customer-data-objects/property/PropertyFieldTypes';
import { DATE } from 'customer-data-objects/property/PropertyTypes';
import { OrderedSet } from 'immutable';
import { isOperatorIncludesObjectsWithNoValueSet, shouldOperatorAllwaysShowNoValueCheckbox } from '../../utilities/defaultNullValue';
import { mayIncludeObjectsWithNoAssociatedObjects } from '../../utilities/nullAssociations';
import { swapOperator } from 'customer-data-filters/filterQueryFormat/operator/Operator';
import DefaultNullValueRecord from '../../filterQueryFormat/DefaultNullValueRecord';
import FilterOperatorCtaInput from 'customer-data-filters/components/operator/FilterOperatorCtaInput';
import FilterOperatorEmailLinkInput from './FilterOperatorEmailLinkInput';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import FilterOperatorHighValueInput from './FilterOperatorHighValueInput';
import FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput from './FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput';
import FilterOperatorIncludeObjectsWithNoValueSetInput from './FilterOperatorIncludeObjectsWithNoValueSetInput';
import FilterOperatorPropertyInput from './FilterOperatorPropertyInput';
import FilterOperatorRollingDateInput from './FilterOperatorRollingDateInput';
import FilterOperatorRollingInequalityInput from './FilterOperatorRollingInequalityInput';
import FilterOperatorRollingPropertyUpdated from './FilterOperatorRollingPropertyUpdated';
import FilterOperatorRollingWithUnitInput from './FilterOperatorRollingWithUnitInput';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FilterOperatorUrlInput from './FilterOperatorUrlInput';
import FilterOperatorValueInput from './FilterOperatorValueInput';
import FilterType from '../propTypes/FilterType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import NullRelatedState from '../propTypes/NullRelatedState';
import PropTypes from 'prop-types';
import { Fragment, PureComponent } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIList from 'UIComponents/list/UIList';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import getIn from 'transmute/getIn';
import getPropertyType from 'customer-data-objects/property/getPropertyType';
import memoize from 'transmute/memoize';
import partial from 'transmute/partial';
import uniqueId from 'transmute/uniqueId';

var getInputWrapper = function getInputWrapper(inputType) {
  switch (inputType) {
    case InputTypes.NoInputType:
      return null;

    case InputTypes.PropertyInputType:
      return FilterOperatorPropertyInput;

    case InputTypes.CtaInputType:
      return FilterOperatorCtaInput;

    case InputTypes.EmailLinkInputType:
      return FilterOperatorEmailLinkInput;

    case InputTypes.RangeInputType:
      return FilterOperatorHighValueInput;

    case InputTypes.RollingDateInputType:
      return FilterOperatorRollingDateInput;

    case InputTypes.RollingInequalityInputType:
      return FilterOperatorRollingInequalityInput;

    case InputTypes.RollingWithUnitInputType:
      return FilterOperatorRollingWithUnitInput;

    case InputTypes.RollingPropertyUpdatedInputType:
      return FilterOperatorRollingPropertyUpdated;

    case InputTypes.UrlInputType:
      return FilterOperatorUrlInput;

    default:
      return FilterOperatorValueInput;
  }
};

var shouldShowNullValueCheckbox = function shouldShowNullValueCheckbox(operator) {
  return typeof operator.value !== 'undefined' && isOperatorIncludesObjectsWithNoValueSet(operator) || shouldOperatorAllwaysShowNoValueCheckbox(operator);
};

var FilterOperatorInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterOperatorInput, _PureComponent);

  function FilterOperatorInput() {
    var _this;

    _classCallCheck(this, FilterOperatorInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorInput).call(this));

    _this.handleOperatorChange = function (Operator) {
      var _this$props = _this.props,
          initialValue = _this$props.initialValue,
          onChange = _this$props.onChange,
          showIncludeUnknownValues = _this$props.showIncludeUnknownValues,
          value = _this$props.value,
          _this$props$value = _this$props.value;
      _this$props$value = _this$props$value === void 0 ? {} : _this$props$value;
      var field = _this$props$value.field,
          nullIssueRelatedState = _this$props.nullIssueRelatedState,
          updateNullIssueRelatedState = _this$props.updateNullIssueRelatedState;
      var nextValue = value ? swapOperator(Operator, value, initialValue) : Operator.of(field);

      if (showIncludeUnknownValues && _this.state.canUpdateNullIssueRelatedState) {
        var defaultNullValue = nullIssueRelatedState.defaultNullValueByOperator[_this.getOperatorHashKey(nextValue)] || DefaultNullValueRecord();
        nextValue = nextValue.set('defaultNullValue', defaultNullValue);
        updateNullIssueRelatedState(_this.getNullIssueRelatedStateUpdate(nextValue));
      }

      onChange(SyntheticEvent(nextValue));
    };

    _this.handleChangeDefaultNullValue = function (defaultNullValue) {
      var _this$props2 = _this.props,
          onChange = _this$props2.onChange,
          value = _this$props2.value,
          showIncludeUnknownValues = _this$props2.showIncludeUnknownValues,
          updateNullIssueRelatedState = _this$props2.updateNullIssueRelatedState,
          nullIssueRelatedState = _this$props2.nullIssueRelatedState;

      if (showIncludeUnknownValues && _this.state.canUpdateNullIssueRelatedState) {
        updateNullIssueRelatedState(Object.assign({}, nullIssueRelatedState, {
          defaultNullValueByOperator: Object.assign({}, nullIssueRelatedState.defaultNullValueByOperator, _defineProperty({}, _this.getOperatorHashKey(value), defaultNullValue))
        }));
      }

      var nextValue = value.set('defaultNullValue', defaultNullValue);
      onChange(SyntheticEvent(nextValue));
    };

    _this.getIncludeObjectsWithNoAssociatedObjects = function () {
      var filterBranch = _this.props.filterBranch;
      return getIn(['includeObjectsWithNoAssociatedObjects'], filterBranch);
    };

    _this.getShowIncludeObjectsWithNoAssociatedObjects = function () {
      var _this$props3 = _this.props,
          nullIssueRelatedState = _this$props3.nullIssueRelatedState,
          value = _this$props3.value;

      if (!_this.state.canUpdateNullIssueRelatedState) {
        return false;
      }

      return getIn(['showIncludeObjectsWithNoAssociatedObjectsByFilterBranch', _this.getBranchHashKey()], nullIssueRelatedState) && mayIncludeObjectsWithNoAssociatedObjects(value);
    };

    _this.getShowIncludeObjectsWithNoValueSet = function () {
      var _this$props4 = _this.props,
          value = _this$props4.value,
          nullIssueRelatedState = _this$props4.nullIssueRelatedState;

      if (!_this.state.canUpdateNullIssueRelatedState) {
        return false;
      }

      var operatorHashKey = _this.getOperatorHashKey(value);

      return getIn(['showIncludeObjectsWithNoValueSetByOperator', operatorHashKey], nullIssueRelatedState);
    };

    _this.originalOperatorName = null;
    _this.originalConstraintOperatorName = null;
    _this.renderRadioInput = _this.renderRadioInput.bind(_assertThisInitialized(_this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    _this.uniqueId = memoize(uniqueId);
    _this.state = {
      canUpdateNullIssueRelatedState: false
    };
    return _this;
  }

  _createClass(FilterOperatorInput, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var value = this.props.value;
      this.originalOperatorName = value && value.constructor;
      this.originalConstraintOperatorName = value && value.refinement && value.refinement.constructor || undefined;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props5 = this.props,
          value = _this$props5.value,
          showIncludeUnknownValues = _this$props5.showIncludeUnknownValues,
          nullIssueRelatedState = _this$props5.nullIssueRelatedState,
          updateNullIssueRelatedState = _this$props5.updateNullIssueRelatedState;
      var canUpdateNullIssueRelatedState = nullIssueRelatedState && typeof updateNullIssueRelatedState === 'function';
      this.setState({
        canUpdateNullIssueRelatedState: canUpdateNullIssueRelatedState
      });

      if (showIncludeUnknownValues && canUpdateNullIssueRelatedState) {
        updateNullIssueRelatedState(this.getNullIssueRelatedStateUpdate(value));
      }
    }
  }, {
    key: "getBranchHashKey",
    value: function getBranchHashKey() {
      var nullIssueRelatedState = this.props.nullIssueRelatedState;
      return nullIssueRelatedState.conditionBranchPath.join('_');
    }
  }, {
    key: "getOperatorHashKey",
    value: function getOperatorHashKey(operator) {
      var branchHashKey = this.getBranchHashKey();
      return branchHashKey + "__" + operator.field.name + "__" + operator.constructor;
    }
  }, {
    key: "getNullIssueRelatedStateUpdate",
    value: function getNullIssueRelatedStateUpdate(nextValue) {
      var _this$props6 = this.props,
          nullIssueRelatedState = _this$props6.nullIssueRelatedState,
          filterBranch = _this$props6.filterBranch;
      var branchHashKey = this.getBranchHashKey();
      var operatorHashKey = this.getOperatorHashKey(nextValue);
      var newNullIssueRelatedState = Object.assign({}, nullIssueRelatedState); // update "null value" related state

      var cachedShowIncludeObjectsWithNoValueSet = nullIssueRelatedState.showIncludeObjectsWithNoValueSetByOperator[operatorHashKey];
      var newShouldShowNullValueCheckbox = shouldShowNullValueCheckbox(nextValue);
      var isNullValueChangedFromFalseToTrue = cachedShowIncludeObjectsWithNoValueSet === false && newShouldShowNullValueCheckbox === true;

      if (cachedShowIncludeObjectsWithNoValueSet === undefined || isNullValueChangedFromFalseToTrue) {
        newNullIssueRelatedState.showIncludeObjectsWithNoValueSetByOperator = Object.assign({}, newNullIssueRelatedState.showIncludeObjectsWithNoValueSetByOperator, _defineProperty({}, operatorHashKey, shouldShowNullValueCheckbox(nextValue)));
        newNullIssueRelatedState.defaultNullValueByOperator = Object.assign({}, newNullIssueRelatedState.defaultNullValueByOperator, _defineProperty({}, operatorHashKey, nextValue.defaultNullValue));
      } // update "null association" related state


      var cachedShowIncludeObjectsWithNoAssociatedObjects = nullIssueRelatedState.showIncludeObjectsWithNoAssociatedObjectsByFilterBranch[branchHashKey];

      if (cachedShowIncludeObjectsWithNoAssociatedObjects === undefined) {
        newNullIssueRelatedState.showIncludeObjectsWithNoAssociatedObjectsByFilterBranch = Object.assign({}, newNullIssueRelatedState.showIncludeObjectsWithNoAssociatedObjectsByFilterBranch, _defineProperty({}, branchHashKey, getIn(['includeObjectsWithNoAssociatedObjects'], filterBranch)));
      }

      return newNullIssueRelatedState;
    }
  }, {
    key: "getOperatorList",
    value: function getOperatorList() {
      var _this$props7 = this.props,
          getOperators = _this$props7.getOperators,
          _this$props7$value = _this$props7.value;
      _this$props7$value = _this$props7$value === void 0 ? {} : _this$props7$value;
      var field = _this$props7$value.field;
      var definedOperators = getOperators(field);
      return definedOperators.union(OrderedSet.of(this.originalOperatorName));
    }
  }, {
    key: "renderRadioInput",
    value: function renderRadioInput(opts) {
      var FAKE_VALUE = DATE;

      var disabled = opts.disabled,
          onEdit = opts.onEdit,
          onSelect = opts.onSelect,
          operator = opts.operator,
          text = opts.text,
          _opts$value = opts.value,
          value = _opts$value === void 0 ? FAKE_VALUE : _opts$value,
          rest = _objectWithoutProperties(opts, ["disabled", "onEdit", "onSelect", "operator", "text", "value"]);

      var _this$props8 = this.props,
          currencyCode = _this$props8.currencyCode,
          error = _this$props8.error,
          filterFamily = _this$props8.filterFamily,
          getFamilyValueResolver = _this$props8.getFamilyValueResolver,
          getFilterFamilyObjectName = _this$props8.getFilterFamilyObjectName,
          getObjectPropertyLabel = _this$props8.getObjectPropertyLabel,
          getInputComponent = _this$props8.getInputComponent,
          getPlaceholder = _this$props8.getPlaceholder,
          getReferencedObjectType = _this$props8.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props8.getSpecialOptionsForReferenceType,
          isFiscalYearEnabled = _this$props8.isFiscalYearEnabled,
          isRollingDateOffsetInputEnabled = _this$props8.isRollingDateOffsetInputEnabled,
          isXoEnabled = _this$props8.isXoEnabled,
          handleIncludeObjectsWithNoAssociatedObjectsChange = _this$props8.handleIncludeObjectsWithNoAssociatedObjectsChange;
      var isSelected = value && operator === value.constructor;
      var Input = isSelected && getInputComponent(value);
      var InputWrapper = isSelected && getInputWrapper(value.constructor.inputType);
      var showNoValueCheckbox = this.getShowIncludeObjectsWithNoValueSet();
      var showNoAssociationCheckbox = this.getShowIncludeObjectsWithNoAssociatedObjects();
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UITooltip, {
          disabled: !disabled,
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorInput.tooltipOperatorNotSupported"
          }),
          children: /*#__PURE__*/_jsx(UIRadioInput, Object.assign({}, rest, {
            checked: isSelected,
            className: "p-bottom-2",
            "data-selenium-test": "filter-operator-" + operator.toString() + "-radio",
            disabled: disabled,
            name: this.uniqueId('operator-'),
            onChange: onSelect,
            children: text
          }))
        }), isSelected && InputWrapper && /*#__PURE__*/_jsxs(Fragment, {
          children: [/*#__PURE__*/_jsx(InputWrapper, {
            className: "m-bottom-2",
            currencyCode: currencyCode,
            "data-selenium-test": "XOFilterEditor-operator-" + operator.toString() + "-input",
            error: error,
            filterFamily: filterFamily,
            getReferencedObjectType: getReferencedObjectType,
            getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
            InputComponent: Input,
            isFiscalYearEnabled: isFiscalYearEnabled,
            isRollingDateOffsetInputEnabled: isRollingDateOffsetInputEnabled,
            isXoEnabled: isXoEnabled,
            onChange: onEdit,
            placeholder: getPlaceholder(value),
            resolver: getFamilyValueResolver(value),
            value: value
          }), (showNoValueCheckbox || showNoAssociationCheckbox) && /*#__PURE__*/_jsxs("div", {
            className: "m-left-3 m-top-1 m-bottom-4",
            children: [showNoValueCheckbox && /*#__PURE__*/_jsx(FilterOperatorIncludeObjectsWithNoValueSetInput, {
              filterFamily: filterFamily,
              getObjectPropertyLabel: getObjectPropertyLabel,
              onChange: this.handleChangeDefaultNullValue,
              value: value
            }), showNoAssociationCheckbox && /*#__PURE__*/_jsx(FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput, {
              className: showNoValueCheckbox ? 'm-top-2' : '',
              filterFamily: filterFamily,
              getFilterFamilyObjectName: getFilterFamilyObjectName,
              onChange: handleIncludeObjectsWithNoAssociatedObjectsChange,
              value: this.getIncludeObjectsWithNoAssociatedObjects()
            })]
          })]
        })]
      }, operator + " " + getIn(['field', 'name'], value));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props9 = this.props,
          className = _this$props9.className,
          getOperatorLabel = _this$props9.getOperatorLabel,
          onChange = _this$props9.onChange,
          value = _this$props9.value,
          _this$props9$value = _this$props9.value;
      _this$props9$value = _this$props9$value === void 0 ? {} : _this$props9$value;
      var field = _this$props9$value.field;
      var isFieldCalculatedProperty = [CALCULATION, EQUATION, ROLLUP].includes(getPropertyType(field));
      var operatorsWithPropertyHistoryRequirement = [Operators.EverContainedAll, Operators.EverContainedAny, Operators.EverEqual, Operators.EverEqualAny, Operators.EverIn, Operators.NeverContained, Operators.NeverContainedAll, Operators.NeverEqual, Operators.NeverEqualAny, Operators.NeverIn, Operators.NotUpdatedInLastXDays, Operators.UpdatedAfter, Operators.UpdatedBefore, Operators.UpdatedInLastXDays];
      return /*#__PURE__*/_jsx(UIList, {
        className: className,
        children: this.getOperatorList().valueSeq().map(function (op) {
          return _this2.renderRadioInput({
            disabled: isFieldCalculatedProperty && operatorsWithPropertyHistoryRequirement.includes(op),
            onEdit: onChange,
            onSelect: _this2.partial(_this2.handleOperatorChange, op),
            operator: op,
            text: getOperatorLabel(op, field),
            value: value
          });
        }).toJS()
      });
    }
  }]);

  return FilterOperatorInput;
}(PureComponent);

export { FilterOperatorInput as default };
FilterOperatorInput.propTypes = {
  className: PropTypes.string,
  currencyCode: PropTypes.string.isRequired,
  error: FilterOperatorErrorType.isRequired,
  filterBranch: FilterType,
  filterFamily: PropTypes.string.isRequired,
  getFamilyValueResolver: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  getInputComponent: PropTypes.func.isRequired,
  getObjectPropertyLabel: PropTypes.func.isRequired,
  getOperatorLabel: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  getPlaceholder: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  handleIncludeObjectsWithNoAssociatedObjectsChange: PropTypes.func,
  initialValue: FilterOperatorType,
  isFiscalYearEnabled: PropTypes.bool.isRequired,
  isRollingDateOffsetInputEnabled: PropTypes.bool,
  isXoEnabled: PropTypes.bool,
  nullIssueRelatedState: NullRelatedState,
  onChange: PropTypes.func.isRequired,
  showIncludeUnknownValues: PropTypes.bool.isRequired,
  updateNullIssueRelatedState: PropTypes.func,
  value: FilterOperatorType.isRequired
};
FilterOperatorInput.defaultProps = {
  isXoEnabled: false
};