'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { DATE, NUMBER } from 'customer-data-objects/property/PropertyTypes';
import { OrderedSet } from 'immutable';
import DSFieldRecord from 'customer-data-filters/filterQueryFormat/DSFieldRecord/DSFieldRecord';
import FilterOperatorErrorRecord from 'customer-data-filters/filterQueryFormat/FilterOperatorErrorRecord';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import FilterOperatorInput from 'customer-data-filters/components/operator/FilterOperatorInput';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FilterType from '../propTypes/FilterType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H5 from 'UIComponents/elements/headings/H5';
import HR from 'UIComponents/elements/HR';
import NullRelatedState from '../propTypes/NullRelatedState';
import PropTypes from 'prop-types';
import { Fragment, Component } from 'react';
import Small from 'UIComponents/elements/Small';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
import always from 'transmute/always';
import getIn from 'transmute/getIn';
import partial from 'transmute/partial';

var _getDateRefinementOperators = function _getDateRefinementOperators(ctor) {
  var baseSet = OrderedSet([Operators.Any, Operators.LessOrEqual, Operators.GreaterOrEqual, Operators.InRange]);

  if (ctor.isRefinableExtra) {
    return baseSet.concat(OrderedSet([Operators.LessThanRolling, Operators.GreaterThanRolling]));
  } else if (ctor.isRefinable) {
    return baseSet;
  }

  return OrderedSet();
};

var numberOfTimesRefinementOperators = OrderedSet([Operators.Any, Operators.Less, Operators.Equal, Operators.Greater]);

var _getRefinementType = function _getRefinementType(value) {
  if (!value || !value.refinement) {
    return 'NONE';
  }

  var dateRefinemntOperators = _getDateRefinementOperators(value.constructor);

  var hasDateRefinement = dateRefinemntOperators.some(function (operatorConstructor) {
    return operatorConstructor === value.refinement.constructor && value.refinement.constructor !== Operators.Any;
  });
  var hasNumberOfTimesRefinement = numberOfTimesRefinementOperators.some(function (operatorConstructor) {
    return operatorConstructor === value.refinement.constructor && value.refinement.constructor !== Operators.Any;
  });

  if (hasDateRefinement) {
    return DATE;
  } else if (hasNumberOfTimesRefinement) {
    return NUMBER;
  }

  return 'NONE';
};

var FilterOperatorRefinableInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorRefinableInput, _Component);

  function FilterOperatorRefinableInput(props) {
    var _accordionOpenStatus2;

    var _this;

    _classCallCheck(this, FilterOperatorRefinableInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorRefinableInput).call(this, props));

    _this.handleChangeRefinement = function (type, evt) {
      var v = evt.target.value;
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          value = _this$props.value;

      if (_this.previousType !== 'NONE' && _this.previousType !== type) {
        var _accordionOpenStatus;

        _this.setState({
          accordionOpenStatus: (_accordionOpenStatus = {}, _defineProperty(_accordionOpenStatus, DATE, true), _defineProperty(_accordionOpenStatus, NUMBER, true), _accordionOpenStatus)
        });
      }

      _this.previousType = type;
      var nextValue = value.set('refinement', v).setIn(['refinement', 'field', 'type'], type);
      onChange(SyntheticEvent(nextValue));
    };

    _this.handleOpenChange = function (type) {
      _this.setState(function (prevState) {
        return {
          accordionOpenStatus: Object.assign({}, prevState.accordionOpenStatus, _defineProperty({}, type, !prevState.accordionOpenStatus[type]))
        };
      });
    };

    var initialRefinementType = _getRefinementType(props.value);

    _this.state = {
      accordionOpenStatus: (_accordionOpenStatus2 = {}, _defineProperty(_accordionOpenStatus2, DATE, initialRefinementType === DATE), _defineProperty(_accordionOpenStatus2, NUMBER, initialRefinementType === NUMBER), _accordionOpenStatus2)
    };
    _this.previousType = initialRefinementType;
    return _this;
  }

  _createClass(FilterOperatorRefinableInput, [{
    key: "getRefinementValueMinusOtherTypes",
    value: function getRefinementValueMinusOtherTypes(desiredType, value) {
      return getIn(['refinement', 'field', 'type'], value) === desiredType ? value.refinement : Operators.Any.of(DSFieldRecord({
        refinement: true,
        type: desiredType
      }));
    }
  }, {
    key: "renderSection",
    value: function renderSection(type, operators, title, error) {
      var _this$props2 = this.props,
          currencyCode = _this$props2.currencyCode,
          filterFamily = _this$props2.filterFamily,
          getFamilyValueResolver = _this$props2.getFamilyValueResolver,
          getInputComponent = _this$props2.getInputComponent,
          getOperatorLabel = _this$props2.getOperatorLabel,
          getPlaceholder = _this$props2.getPlaceholder,
          getReferencedObjectType = _this$props2.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props2.getSpecialOptionsForReferenceType,
          isFiscalYearEnabled = _this$props2.isFiscalYearEnabled,
          isRollingDateOffsetInputEnabled = _this$props2.isRollingDateOffsetInputEnabled,
          isXoEnabled = _this$props2.isXoEnabled,
          value = _this$props2.value,
          getFilterFamilyObjectName = _this$props2.getFilterFamilyObjectName,
          getObjectPropertyLabel = _this$props2.getObjectPropertyLabel,
          filterBranch = _this$props2.filterBranch,
          handleIncludeObjectsWithNoAssociatedObjectsChange = _this$props2.handleIncludeObjectsWithNoAssociatedObjectsChange;
      var accordionOpenStatus = this.state.accordionOpenStatus;
      return /*#__PURE__*/_jsx(UIAccordionItem, {
        className: "m-top-2 p-left-1",
        onOpenChange: partial(this.handleOpenChange, type),
        open: accordionOpenStatus[type],
        title: title,
        children: /*#__PURE__*/_jsx(FilterOperatorInput, {
          currencyCode: currencyCode,
          error: error,
          filterBranch: filterBranch,
          filterFamily: filterFamily,
          getFamilyValueResolver: getFamilyValueResolver,
          getFilterFamilyObjectName: getFilterFamilyObjectName,
          getInputComponent: getInputComponent,
          getObjectPropertyLabel: getObjectPropertyLabel,
          getOperatorLabel: getOperatorLabel,
          getOperators: always(operators),
          getPlaceholder: getPlaceholder,
          getReferencedObjectType: getReferencedObjectType,
          getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
          handleIncludeObjectsWithNoAssociatedObjectsChange: handleIncludeObjectsWithNoAssociatedObjectsChange,
          isFiscalYearEnabled: isFiscalYearEnabled,
          isRollingDateOffsetInputEnabled: isRollingDateOffsetInputEnabled,
          isXoEnabled: isXoEnabled,
          onChange: partial(this.handleChangeRefinement, type),
          showIncludeUnknownValues: false,
          value: this.getRefinementValueMinusOtherTypes(type, value)
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          error = _this$props3.error,
          filterFamily = _this$props3.filterFamily,
          getFamilyValueResolver = _this$props3.getFamilyValueResolver,
          getFilterFamilyObjectName = _this$props3.getFilterFamilyObjectName,
          getObjectPropertyLabel = _this$props3.getObjectPropertyLabel,
          getInputComponent = _this$props3.getInputComponent,
          getOperatorLabel = _this$props3.getOperatorLabel,
          getOperators = _this$props3.getOperators,
          getPlaceholder = _this$props3.getPlaceholder,
          getReferencedObjectType = _this$props3.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props3.getSpecialOptionsForReferenceType,
          isXoEnabled = _this$props3.isXoEnabled,
          value = _this$props3.value,
          onChange = _this$props3.onChange,
          initialValue = _this$props3.initialValue,
          nullIssueRelatedState = _this$props3.nullIssueRelatedState,
          updateNullIssueRelatedState = _this$props3.updateNullIssueRelatedState,
          isFiscalYearEnabled = _this$props3.isFiscalYearEnabled,
          rest = _objectWithoutProperties(_this$props3, ["error", "filterFamily", "getFamilyValueResolver", "getFilterFamilyObjectName", "getObjectPropertyLabel", "getInputComponent", "getOperatorLabel", "getOperators", "getPlaceholder", "getReferencedObjectType", "getSpecialOptionsForReferenceType", "isXoEnabled", "value", "onChange", "initialValue", "nullIssueRelatedState", "updateNullIssueRelatedState", "isFiscalYearEnabled"]);

      var errorOpts = error.get('opts');
      var errorMessage = error.get('message');
      var isError = errorOpts && errorOpts.preventDefault === true ? FilterOperatorErrorRecord({
        message: errorMessage,
        opts: errorOpts
      }) : error;
      var refinementError = errorOpts && errorOpts.isRefinement === true ? error : FilterOperatorErrorRecord({
        message: errorMessage,
        opts: errorOpts
      });
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(FilterOperatorInput, Object.assign({}, rest, {
          error: isError,
          filterFamily: filterFamily,
          getFamilyValueResolver: getFamilyValueResolver,
          getFilterFamilyObjectName: getFilterFamilyObjectName,
          getInputComponent: getInputComponent,
          getObjectPropertyLabel: getObjectPropertyLabel,
          getOperatorLabel: getOperatorLabel,
          getOperators: getOperators,
          getPlaceholder: getPlaceholder,
          getReferencedObjectType: getReferencedObjectType,
          getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
          initialValue: initialValue,
          isFiscalYearEnabled: isFiscalYearEnabled,
          isXoEnabled: isXoEnabled,
          nullIssueRelatedState: nullIssueRelatedState,
          onChange: onChange,
          updateNullIssueRelatedState: updateNullIssueRelatedState,
          value: value
        })), isXoEnabled && value.constructor.isRefinable && /*#__PURE__*/_jsxs(Fragment, {
          children: [/*#__PURE__*/_jsx(HR, {}), /*#__PURE__*/_jsx(H5, {
            className: "display-block m-bottom-2",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterOperatorInput.refineFilter"
            })
          }), /*#__PURE__*/_jsx(Small, {
            className: "display-block m-bottom-4",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterOperatorInput.refineFilterHelp"
            })
          }), this.renderSection(DATE, _getDateRefinementOperators(value.constructor), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorInput.refineByDate"
          }), refinementError)]
        }), isXoEnabled && value.constructor.isRefinableExtra && this.renderSection(NUMBER, OrderedSet([Operators.Any, Operators.Less, Operators.Equal, Operators.Greater]), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataFilters.FilterOperatorInput.refineByOccurrenceCount"
        }), refinementError)]
      });
    }
  }]);

  return FilterOperatorRefinableInput;
}(Component);

export { FilterOperatorRefinableInput as default };
FilterOperatorRefinableInput.propTypes = {
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