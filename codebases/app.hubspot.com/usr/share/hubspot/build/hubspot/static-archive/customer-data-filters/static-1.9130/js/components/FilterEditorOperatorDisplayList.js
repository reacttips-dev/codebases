'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _tileStyleByStatus;

import * as MatchStatus from 'customer-data-filters/filterQueryFormat/MatchStatus';
import { List, Set as ImmutableSet, is, Map as ImmutableMap } from 'immutable';
import { addToKeyPath, getKeyPath } from 'customer-data-filters/filterQueryFormat/logic/LogicGroup';
import And from 'customer-data-filters/filterQueryFormat/logic/And';
import Constraint from '../filterQueryFormat/logic/Constraint';
import FilterEditorAndSeparator from './editor/FilterEditorAndSeparator';
import FilterEditorLogicGroupStatusTag from './editor/FilterEditorLogicGroupStatusTag';
import FilterEditorOperatorCreateButton from './editor/FilterEditorOperatorCreateButton';
import FilterEditorOperatorDisplay from './FilterEditorOperatorDisplay';
import FilterEditorOrGroupCondition from './editor/FilterEditorOrGroupCondition';
import FilterType from 'customer-data-filters/components/propTypes/FilterType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import MatchStatusType from './propTypes/MatchStatusType';
import Or from 'customer-data-filters/filterQueryFormat/logic/Or';
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';
import getIn from 'transmute/getIn';
import identity from 'transmute/identity';
import isEmpty from 'transmute/isEmpty';
import memoize from 'transmute/memoize';
import partial from 'transmute/partial';
import FilterFamilyHeading from './FilterFamilyHeading';

var _isFieldNameDisplayBlacklisted = function _isFieldNameDisplayBlacklisted(operator) {
  var fieldName = getIn(['field', 'name'], operator);
  var conditionsFieldNameDisplayBlacklist = ImmutableSet(['favoriteUserList']);
  return conditionsFieldNameDisplayBlacklist.contains(fieldName);
};

var _getDisplayConditions = function _getDisplayConditions(_ref) {
  var _ref$conditions = _ref.conditions,
      conditions = _ref$conditions === void 0 ? List() : _ref$conditions;
  return conditions.filterNot(_isFieldNameDisplayBlacklisted);
};

var _pathToString = function _pathToString(path) {
  return path.size > 0 ? path.join('-') : '0';
};

var tileStyleByStatus = (_tileStyleByStatus = {}, _defineProperty(_tileStyleByStatus, MatchStatus.FAIL, {
  backgroundColor: '#fdedee',
  borderColor: '#f2545b'
}), _defineProperty(_tileStyleByStatus, MatchStatus.PASS, {
  backgroundColor: '#e5f8f6',
  borderColor: '#00bda5'
}), _defineProperty(_tileStyleByStatus, MatchStatus.PENDING, {
  backgroundColor: ''
}), _tileStyleByStatus);

var FilterEditorOperatorDisplayList = /*#__PURE__*/function (_Component) {
  _inherits(FilterEditorOperatorDisplayList, _Component);

  function FilterEditorOperatorDisplayList(props) {
    var _this;

    _classCallCheck(this, FilterEditorOperatorDisplayList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOperatorDisplayList).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleCloneOrCondition = function (index) {
      var _this$props = _this.props,
          handleOperatorClone = _this$props.handleOperatorClone,
          value = _this$props.value;

      var condition = _getDisplayConditions(value).get(index);

      var insertClone = _this.partial(Or.insertAtPosition, index, condition);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      handleOperatorClone.apply(void 0, [insertClone].concat(args));
    };

    _this.handleShowAllConditions = function () {
      var onShowAllConditionsClick = _this.props.onShowAllConditionsClick;

      _this.setState({
        didClickShowAllConditions: true
      });

      setTimeout(function () {
        return _this.setState({
          allConditionsLoaded: true
        });
      });
      onShowAllConditionsClick();
    };

    _this.partial = memoize(partial);
    _this.renderGroup = _this.renderGroup.bind(_assertThisInitialized(_this));
    _this.renderOrGroupCondition = _this.renderOrGroupCondition.bind(_assertThisInitialized(_this));
    _this.renderAndGroupConditions = _this.renderAndGroupConditions.bind(_assertThisInitialized(_this));
    _this.state = {
      allConditionsLoaded: false,
      didClickShowAllConditions: false
    };
    return _this;
  }

  _createClass(FilterEditorOperatorDisplayList, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(prevProps, prevState) {
      var _this2 = this;

      var arePropsChanged = Object.keys(this.props).some(function (key) {
        if (key === 'value') {
          if (!is(_this2.props.value, prevProps.value)) {
            return true;
          }

          return false;
        } else {
          if (_this2.props[key] !== prevProps[key]) {
            return true;
          }
        }

        return false;
      });
      var isStateChanged = Object.keys(this.state).some(function (key) {
        return _this2.state[key] !== prevState[key];
      });
      return arePropsChanged || isStateChanged;
    }
  }, {
    key: "renderGroup",
    value: function renderGroup(path, condition, key, itr) {
      var _this$props2 = this.props,
          baseFilterFamily = _this$props2.baseFilterFamily,
          currencyCode = _this$props2.currencyCode,
          getFieldDefinitions = _this$props2.getFieldDefinitions,
          getLabelString = _this$props2.getLabelString,
          getOperatorLabel = _this$props2.getOperatorLabel,
          getOperators = _this$props2.getOperators,
          getReferencedObjectType = _this$props2.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props2.getSpecialOptionsForReferenceType,
          getValueResolver = _this$props2.getValueResolver,
          handleOpenEdit = _this$props2.handleOpenEdit,
          handleOperatorRemove = _this$props2.handleOperatorRemove,
          isReadOnly = _this$props2.isReadOnly,
          isXoEnabled = _this$props2.isXoEnabled,
          showInvalidOptionErrors = _this$props2.showInvalidOptionErrors,
          validateOperator = _this$props2.validateOperator;
      var filterFamily = condition.filterFamily;
      var conditionPath = path.push(key);
      var contents = And.isAnd(condition) && filterFamily ? this.renderFilterFamilyAndGroup(conditionPath, condition) : /*#__PURE__*/_jsx(FilterEditorOperatorDisplay, {
        currencyCode: currencyCode,
        filterFamily: filterFamily || baseFilterFamily,
        getFieldDefinitions: getFieldDefinitions,
        getLabelString: getLabelString,
        getOperatorLabel: getOperatorLabel,
        getOperators: getOperators,
        getReferencedObjectType: getReferencedObjectType,
        getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
        getValueResolver: getValueResolver,
        handleOpenEdit: handleOpenEdit,
        handleOperatorRemove: handleOperatorRemove,
        isReadOnly: isReadOnly,
        isXoEnabled: isXoEnabled,
        operator: condition,
        path: path.push(key),
        showInvalidOptionErrors: showInvalidOptionErrors,
        validateOperator: validateOperator
      }, "Operator-" + key);

      if (!isXoEnabled) {
        return contents;
      }

      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UITile, {
          className: "p-x-0",
          closeable: false,
          compact: true,
          children: /*#__PURE__*/_jsx(UITileSection, {
            className: "p-all-0",
            children: contents
          })
        }), key !== itr.keySeq().last() && /*#__PURE__*/_jsx(FilterEditorAndSeparator, {})]
      }, "Group-" + conditionPath);
    }
  }, {
    key: "renderFilterFamilyAndGroup",
    value: function renderFilterFamilyAndGroup(conditionPath, group) {
      var _this$props3 = this.props,
          addConditionDisabledTooltip = _this$props3.addConditionDisabledTooltip,
          currencyCode = _this$props3.currencyCode,
          getFilterFamilyAndButtonTooltip = _this$props3.getFilterFamilyAndButtonTooltip,
          getFilterFamilyGroupHeading = _this$props3.getFilterFamilyGroupHeading,
          getFilterFamilyObjectName = _this$props3.getFilterFamilyObjectName,
          isReadOnly = _this$props3.isReadOnly,
          isXoEnabled = _this$props3.isXoEnabled,
          handleOpenCreate = _this$props3.handleOpenCreate,
          baseFilterFamily = _this$props3.baseFilterFamily,
          getFieldDefinitions = _this$props3.getFieldDefinitions,
          getLabelString = _this$props3.getLabelString,
          getOperatorLabel = _this$props3.getOperatorLabel,
          getOperators = _this$props3.getOperators,
          getReferencedObjectType = _this$props3.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props3.getSpecialOptionsForReferenceType,
          getValueResolver = _this$props3.getValueResolver,
          handleOpenEdit = _this$props3.handleOpenEdit,
          handleOperatorRemove = _this$props3.handleOperatorRemove,
          isAddConditionDisabled = _this$props3.isAddConditionDisabled,
          showInvalidOptionErrors = _this$props3.showInvalidOptionErrors,
          validateOperator = _this$props3.validateOperator,
          onBranchAssociationChange = _this$props3.onBranchAssociationChange,
          getObjectAssociationOptions = _this$props3.getObjectAssociationOptions,
          value = _this$props3.value,
          getIsUngated = _this$props3.getIsUngated,
          isAssociationSelectEnabled = _this$props3.isAssociationSelectEnabled,
          onUserAction = _this$props3.onUserAction;
      var filterFamily = group.filterFamily,
          includeObjectsWithNoAssociatedObjects = group.includeObjectsWithNoAssociatedObjects;
      var filterFamilyAndButtonTooltip = getFilterFamilyAndButtonTooltip(filterFamily);
      return /*#__PURE__*/_jsxs(UIList, {
        className: "p-y-3",
        children: [/*#__PURE__*/_jsx(FilterFamilyHeading, {
          baseFilterFamily: baseFilterFamily,
          conditionPath: conditionPath,
          data: this.props.data,
          filterFamily: filterFamily,
          getFilterFamilyGroupHeading: getFilterFamilyGroupHeading,
          getFilterFamilyObjectName: getFilterFamilyObjectName,
          getIsUngated: getIsUngated,
          getObjectAssociationOptions: getObjectAssociationOptions,
          isAssociationSelectEnabled: isAssociationSelectEnabled,
          isReadOnly: isReadOnly,
          onBranchAssociationChange: onBranchAssociationChange,
          onUserAction: onUserAction,
          value: value
        }), _getDisplayConditions(group).map(function (innerCondition, key, itr) {
          return /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(FilterEditorOperatorDisplay, {
              currencyCode: currencyCode,
              filterFamily: filterFamily || baseFilterFamily,
              getFieldDefinitions: getFieldDefinitions,
              getFilterFamilyObjectName: getFilterFamilyObjectName,
              getLabelString: getLabelString,
              getOperatorLabel: getOperatorLabel,
              getOperators: getOperators,
              getReferencedObjectType: getReferencedObjectType,
              getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
              getValueResolver: getValueResolver,
              handleOpenEdit: handleOpenEdit,
              handleOperatorRemove: handleOperatorRemove,
              includeObjectsWithNoAssociatedObjects: includeObjectsWithNoAssociatedObjects,
              isReadOnly: isReadOnly,
              isXoEnabled: isXoEnabled,
              operator: innerCondition,
              path: conditionPath.push(key),
              showInvalidOptionErrors: showInvalidOptionErrors,
              validateOperator: validateOperator
            }, "Operator-" + key), key !== itr.keySeq().last() && /*#__PURE__*/_jsx(FilterEditorAndSeparator, {
              className: "p-left-4",
              isLineDisabled: true
            })]
          }, key);
        }).valueSeq(), !isReadOnly && /*#__PURE__*/_jsx(FilterEditorOperatorCreateButton, {
          addConditionDisabledTooltip: addConditionDisabledTooltip,
          className: "m-left-4",
          "data-selenium-info": conditionPath.size > 0 ? "And-" + _pathToString(conditionPath) : "And-" + filterFamily,
          disabled: isAddConditionDisabled,
          filterFamilyAndButtonTooltip: filterFamilyAndButtonTooltip,
          isXoEnabled: isXoEnabled,
          onClick: this.partial(handleOpenCreate, this.partial(addToKeyPath, conditionPath), this.partial(getKeyPath, conditionPath), filterFamily),
          type: "and"
        })]
      }, "Group-And-" + conditionPath);
    }
  }, {
    key: "renderOrGroupCondition",
    value: function renderOrGroupCondition(condition, index) {
      var _this$props4 = this.props,
          handleOperatorRemove = _this$props4.handleOperatorRemove,
          isReadOnly = _this$props4.isReadOnly,
          matchStatus = _this$props4.matchStatus;
      var path = List.of(index);
      var appendToSubGroup = this.partial(addToKeyPath, path);
      var conditionMatchStatus = matchStatus && matchStatus[index];
      var conditionStyle = conditionMatchStatus && tileStyleByStatus[conditionMatchStatus];
      var renderAndGroupConditions = this.partial(this.renderAndGroupConditions, condition, path, appendToSubGroup, conditionMatchStatus);
      return /*#__PURE__*/_jsx(FilterEditorOrGroupCondition, {
        conditionStyle: conditionStyle,
        data: this.props.data,
        handleClone: this.partial(this.handleCloneOrCondition, index),
        handleRemove: this.partial(handleOperatorRemove, path),
        isReadOnly: isReadOnly,
        isTitleVisible: index > 0,
        renderAndGroupConditions: renderAndGroupConditions
      }, path);
    }
  }, {
    key: "renderTopLevelAndGroup",
    value: function renderTopLevelAndGroup() {
      var _this$props5 = this.props,
          matchStatus = _this$props5.matchStatus,
          value = _this$props5.value;
      var path = List.of();
      var appendToBaseGroup = this.partial(addToKeyPath, path);
      var conditionMatchStatus = matchStatus && matchStatus[0];

      if (conditionMatchStatus) {
        var conditionStyle = conditionMatchStatus && tileStyleByStatus[conditionMatchStatus];
        return /*#__PURE__*/_jsx(UITile, {
          className: "p-all-2",
          style: conditionStyle,
          children: this.renderAndGroupConditions(value, path, appendToBaseGroup, conditionMatchStatus)
        });
      }

      return this.renderAndGroupConditions(value, path, appendToBaseGroup, conditionMatchStatus);
    }
  }, {
    key: "renderTopLevelOrGroup",
    value: function renderTopLevelOrGroup() {
      var _this$props6 = this.props,
          addConditionDisabledTooltip = _this$props6.addConditionDisabledTooltip,
          getInitialConditionCountCutoff = _this$props6.getInitialConditionCountCutoff,
          handleOpenCreate = _this$props6.handleOpenCreate,
          isAddConditionDisabled = _this$props6.isAddConditionDisabled,
          isReadOnly = _this$props6.isReadOnly,
          isXoEnabled = _this$props6.isXoEnabled,
          style = _this$props6.style,
          value = _this$props6.value;
      var _this$state = this.state,
          allConditionsLoaded = _this$state.allConditionsLoaded,
          didClickShowAllConditions = _this$state.didClickShowAllConditions;

      var conditions = _getDisplayConditions(value);

      var insertInOrGroup = this.partial(Or.insertAtPosition, conditions.size);
      var initialVisibleConditionCount = getInitialConditionCountCutoff(conditions.size);
      var areAllConditionsVisible = conditions.size <= initialVisibleConditionCount || allConditionsLoaded;
      var visibleConditions = !areAllConditionsVisible ? conditions.slice(0, initialVisibleConditionCount) : conditions;
      var showAllConditionsMessageProps = {
        message: didClickShowAllConditions ? 'customerDataFilters.FilterEditor.loadingConditions' : 'customerDataFilters.FilterEditor.loadMoreConditions',
        options: didClickShowAllConditions ? undefined : {
          count: conditions.size - visibleConditions.size
        }
      };
      return /*#__PURE__*/_jsxs(UIList, {
        style: style,
        children: [visibleConditions.valueSeq().map(this.renderOrGroupCondition), !isReadOnly && /*#__PURE__*/_jsx(FilterEditorOperatorCreateButton, {
          addConditionDisabledTooltip: addConditionDisabledTooltip,
          className: "m-top-3",
          "data-selenium-info": "Or",
          disabled: isAddConditionDisabled,
          isXoEnabled: isXoEnabled,
          onClick: this.partial(handleOpenCreate, insertInOrGroup, identity, undefined),
          type: "or"
        }), !areAllConditionsVisible && /*#__PURE__*/_jsx(UIFlex, {
          justify: "center",
          children: /*#__PURE__*/_jsx(UIButton, {
            className: "justify-center m-top-3",
            disabled: didClickShowAllConditions,
            onClick: this.handleShowAllConditions,
            use: "link",
            children: /*#__PURE__*/_jsx(FormattedMessage, Object.assign({}, showAllConditionsMessageProps))
          })
        })]
      });
    }
  }, {
    key: "renderAndGroupConditions",
    value: function renderAndGroupConditions(logicGroup, path, fn, conditionMatchStatus) {
      var _this$props7 = this.props,
          addConditionDisabledTooltip = _this$props7.addConditionDisabledTooltip,
          baseFilterFamily = _this$props7.baseFilterFamily,
          getFilterFamilyObjectName = _this$props7.getFilterFamilyObjectName,
          handleOpenCreate = _this$props7.handleOpenCreate,
          isAddConditionDisabled = _this$props7.isAddConditionDisabled,
          isReadOnly = _this$props7.isReadOnly,
          isXoEnabled = _this$props7.isXoEnabled;
      return /*#__PURE__*/_jsxs(UIList, {
        children: [_getDisplayConditions(logicGroup).map(this.partial(this.renderGroup, path)).valueSeq(), /*#__PURE__*/_jsxs("div", {
          className: "flex-row align-baseline justify-between",
          children: [!isReadOnly && /*#__PURE__*/_jsx(FilterEditorOperatorCreateButton, {
            addConditionDisabledTooltip: addConditionDisabledTooltip,
            className: 'm-top-3' + (isXoEnabled ? " flex-shrink-0" : ""),
            "data-selenium-info": "And-" + _pathToString(path),
            disabled: isAddConditionDisabled,
            isXoEnabled: isXoEnabled,
            onClick: this.partial(handleOpenCreate, fn, this.partial(getKeyPath, path), undefined),
            type: "and"
          }), conditionMatchStatus && /*#__PURE__*/_jsx(FilterEditorLogicGroupStatusTag, {
            filterFamily: baseFilterFamily,
            getFilterFamilyObjectName: getFilterFamilyObjectName,
            matchStatus: conditionMatchStatus
          })]
        }, "create-button")]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          className = _this$props8.className,
          constraint = _this$props8.constraint,
          currencyCode = _this$props8.currencyCode,
          baseFilterFamily = _this$props8.baseFilterFamily,
          style = _this$props8.style,
          value = _this$props8.value,
          valueBase = _this$props8.valueBase,
          isReadOnly = _this$props8.isReadOnly,
          isXoEnabled = _this$props8.isXoEnabled,
          getFieldDefinitions = _this$props8.getFieldDefinitions,
          getFilterFamilyObjectName = _this$props8.getFilterFamilyObjectName,
          getLabelString = _this$props8.getLabelString,
          getOperatorLabel = _this$props8.getOperatorLabel,
          getOperators = _this$props8.getOperators,
          getReferencedObjectType = _this$props8.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props8.getSpecialOptionsForReferenceType,
          getValueResolver = _this$props8.getValueResolver,
          handleOpenEdit = _this$props8.handleOpenEdit,
          handleOperatorRemove = _this$props8.handleOperatorRemove,
          showInvalidOptionErrors = _this$props8.showInvalidOptionErrors,
          validateOperator = _this$props8.validateOperator,
          rest = _objectWithoutProperties(_this$props8, ["className", "constraint", "currencyCode", "baseFilterFamily", "style", "value", "valueBase", "isReadOnly", "isXoEnabled", "getFieldDefinitions", "getFilterFamilyObjectName", "getLabelString", "getOperatorLabel", "getOperators", "getReferencedObjectType", "getSpecialOptionsForReferenceType", "getValueResolver", "handleOpenEdit", "handleOperatorRemove", "showInvalidOptionErrors", "validateOperator"]);

      var dataAttributes = Object.keys(rest).filter(function (key) {
        return key.startsWith('data-');
      }).reduce(function (acc, key) {
        acc[key] = rest[key];
        return acc;
      }, {});
      /**
       * HubSpot/customer-data-filters/pull/460: this renders the constraint by
       * re-rendering this component with the constraint conditions passed in
       * as the `value` prop, the same way `valueBase` options are rendered.
       * @todo create a new component to encapsulate this once the API's finalized
       */

      var maybeConstraints = constraint && !isEmpty(constraint.conditions) ? /*#__PURE__*/_jsx(FilterEditorOperatorDisplayList, Object.assign({}, rest, {
        baseFilterFamily: baseFilterFamily,
        currencyCode: currencyCode,
        getFieldDefinitions: getFieldDefinitions,
        getFilterFamilyObjectName: getFilterFamilyObjectName,
        getLabelString: getLabelString,
        getOperatorLabel: getOperatorLabel,
        getOperators: getOperators,
        getReferencedObjectType: getReferencedObjectType,
        getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
        getValueResolver: getValueResolver,
        handleOpenEdit: handleOpenEdit,
        handleOperatorRemove: handleOperatorRemove,
        isReadOnly: true,
        isXoEnabled: isXoEnabled,
        showInvalidOptionErrors: showInvalidOptionErrors,
        validateOperator: validateOperator,
        value: constraint.conditions.first(),
        valueBase: null
      })) : undefined;
      return /*#__PURE__*/_jsxs("div", Object.assign({}, dataAttributes, {
        className: className,
        "data-selenium-test": "XOFilterEditor-operator-displaylist",
        style: style,
        children: [valueBase && (!And.isAnd(valueBase) && !Or.isOr(valueBase) || !valueBase.conditions.isEmpty()) && /*#__PURE__*/_jsx(FilterEditorOperatorDisplayList, Object.assign({}, rest, {
          baseFilterFamily: baseFilterFamily,
          currencyCode: currencyCode,
          getFieldDefinitions: getFieldDefinitions,
          getLabelString: getLabelString,
          getOperatorLabel: getOperatorLabel,
          getOperators: getOperators,
          getReferencedObjectType: getReferencedObjectType,
          getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
          getValueResolver: getValueResolver,
          handleOpenEdit: handleOpenEdit,
          handleOperatorRemove: handleOperatorRemove,
          isReadOnly: true,
          isXoEnabled: isXoEnabled,
          showInvalidOptionErrors: showInvalidOptionErrors,
          validateOperator: validateOperator,
          value: valueBase,
          valueBase: null
        })), maybeConstraints, !And.isAnd(value) && !Or.isOr(value) && !_isFieldNameDisplayBlacklisted(value) && /*#__PURE__*/_jsx(FilterEditorOperatorDisplay, {
          currencyCode: currencyCode,
          filterFamily: baseFilterFamily,
          getFieldDefinitions: getFieldDefinitions,
          getLabelString: getLabelString,
          getOperatorLabel: getOperatorLabel,
          getOperators: getOperators,
          getReferencedObjectType: getReferencedObjectType,
          getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
          getValueResolver: getValueResolver,
          handleOpenEdit: handleOpenEdit,
          handleOperatorRemove: handleOperatorRemove,
          isReadOnly: isReadOnly,
          isXoEnabled: isXoEnabled,
          isZeroLevel: true,
          operator: value,
          path: List.of(),
          showInvalidOptionErrors: showInvalidOptionErrors,
          validateOperator: validateOperator
        }), And.isAnd(value) ? this.renderTopLevelAndGroup() : this.renderTopLevelOrGroup()]
      }));
    }
  }]);

  return FilterEditorOperatorDisplayList;
}(Component);

export { FilterEditorOperatorDisplayList as default };
FilterEditorOperatorDisplayList.propTypes = {
  addConditionDisabledTooltip: PropTypes.node,
  baseFilterFamily: PropTypes.string.isRequired,
  className: PropTypes.string,
  constraint: PropTypes.instanceOf(Constraint),
  currencyCode: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(ImmutableMap),
  getFieldDefinitions: PropTypes.func.isRequired,
  getFilterFamilyAndButtonTooltip: PropTypes.func.isRequired,
  getFilterFamilyGroupHeading: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func,
  getGroupTileStyle: PropTypes.func,
  getInitialConditionCountCutoff: PropTypes.func.isRequired,
  getIsUngated: PropTypes.func.isRequired,
  getLabelString: PropTypes.func.isRequired,
  getObjectAssociationOptions: PropTypes.func,
  getOperatorLabel: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  getValueResolver: PropTypes.func.isRequired,
  handleOpenCreate: PropTypes.func.isRequired,
  handleOpenEdit: PropTypes.func.isRequired,
  handleOperatorClone: PropTypes.func.isRequired,
  handleOperatorRemove: PropTypes.func.isRequired,
  isAddConditionDisabled: PropTypes.bool,
  isAssociationSelectEnabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isXoEnabled: PropTypes.bool.isRequired,
  matchStatus: PropTypes.arrayOf(MatchStatusType),
  onBranchAssociationChange: PropTypes.func,
  onShowAllConditionsClick: PropTypes.func.isRequired,
  onUserAction: PropTypes.func,
  showInvalidOptionErrors: PropTypes.bool.isRequired,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  validateOperator: PropTypes.func.isRequired,
  value: FilterType.isRequired,

  /**
   * Allows creating "read only" portions of a filter.
   * Operators contained in `valueBase` cannot be removed or edited.
   * TODO: deprecate `valueBase`
   */
  valueBase: FilterType
};
FilterEditorOperatorDisplayList.defaultProps = {
  isXoEnabled: false,
  value: And.of()
};