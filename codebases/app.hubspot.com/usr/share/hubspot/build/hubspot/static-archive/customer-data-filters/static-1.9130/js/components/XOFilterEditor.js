'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as DisplayTypes from 'customer-data-filters/filterQueryFormat/DisplayTypes';
import * as ExternalOptionTypes from 'customer-data-objects/property/ExternalOptionTypes';
import * as FieldTranslator from './FieldTranslator';
import * as LogicGroup from 'customer-data-filters/filterQueryFormat/logic/LogicGroup';
import * as PropertyDisplay from 'customer-data-property-utils/PropertyDisplay';
import { CONDITION_ADDED, CONDITION_CLONED, CONDITION_DELETED, CONDITION_DRAFT_ABANDONED, CONDITION_DRAFT_CHANGED, CONDITION_DRAFT_SAVED, SHOW_ALL_CONDITIONS_CLICKED } from 'customer-data-filters/filterQueryFormat/UsageSubActionTypes';
import { DESCRIPTION, EDITOR } from 'customer-data-filters/filterQueryFormat/DisplayMode';
import { EMAIL_SUBSCRIPTION, SITE_CONTENT, SURVEY_QUESTION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { FilterFamilyAndButtonTooltipTranslator, FilterFamilyGroupHeadingTranslator, FilterFamilyNameTranslator, LegacyFilterFamilyObjectNameTranslator } from './FilterFamilyTranslator';
import { List, Map as ImmutableMap, OrderedSet, Set as ImmutableSet, is } from 'immutable';
import { NotWildCardEqual, WildCardEqual } from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { getObjectSegOperatorsForType } from 'customer-data-filters/converters/objectSeg/ObjectSegTypeToOperator';
import { getOperatorLabelTranslationKey } from './operator/FilterOperatorLabelTranslations';
import Constraint from '../filterQueryFormat/logic/Constraint';
import DefaultFieldSelectItemComponent from './editor/FieldSelectItemComponent';
import FieldLink from './editor/FieldLink';
import FilterEditorOperatorCreate from './editor/FilterEditorOperatorCreate';
import FilterEditorOperatorDescriptionList from './description/FilterEditorOperatorDescriptionList';
import FilterEditorOperatorDisplayList from './FilterEditorOperatorDisplayList';
import FilterEditorOperatorEdit from './editor/FilterEditorOperatorEdit';
import FilterOperatorBoolInput from './operator/FilterOperatorBoolInput';
import FilterOperatorDateInput from './operator/FilterOperatorDateInput';
import FilterOperatorDurationInput from './operator/FilterOperatorDurationInput';
import FilterOperatorElasticsearchTextQueryInput from './operator/FilterOperatorElasticsearchTextQueryInput';
import FilterOperatorEmailSubscriptionInput from './operator/FilterOperatorEmailSubscriptionInput';
import FilterOperatorEnumInput from './operator/FilterOperatorEnumInput';
import FilterOperatorErrorRecord from 'customer-data-filters/filterQueryFormat/FilterOperatorErrorRecord';
import FilterOperatorMultiStringInput from './operator/FilterOperatorMultiStringInput';
import FilterOperatorNumberInput from './operator/FilterOperatorNumberInput';
import FilterOperatorOwnerInput from './operator/FilterOperatorOwnerInput';
import FilterOperatorPercentageInput from './operator/FilterOperatorPercentageInput';
import FilterOperatorTeamInput from './operator/FilterOperatorTeamInput';
import FilterOperatorTextInput from './operator/FilterOperatorTextInput';
import FilterType from 'customer-data-filters/components/propTypes/FilterType';
import FilterUserAction from '../filterQueryFormat/FilterUserAction';
import MatchStatusType from './propTypes/MatchStatusType';
import Or from 'customer-data-filters/filterQueryFormat/logic/Or';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIList from 'UIComponents/list/UIList';
import always from 'transmute/always';
import flatten from 'transmute/flatten';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import getSpecialOptionsByReferenceType from './getSpecialOptionsByReferenceType';
import hasIn from 'transmute/hasIn';
import identity from 'transmute/identity';
import invariant from 'react-utils/invariant';
import map from 'transmute/map';
import memoize from 'transmute/memoize';
import partial from 'transmute/partial';
import pipe from 'transmute/pipe';
import unescapedText from 'I18n/utils/unescapedText';
import valueSeq from 'transmute/valueSeq';
import { parseAssociationOption } from './strategies/ObjectSegStrategyUtils';
import { isExternalOptionsField } from '../utilities/isExternalOptionsField';
import { operatorSupportsExternalOptions } from '../utilities/operatorSupportsExternalOptions';
import { getPropertyResolver } from 'reference-resolvers-lite/utils/getPropertyResolver';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';

var _getActiveFieldNamesFromGroup = function _getActiveFieldNamesFromGroup(logicGroup) {
  var recurse = pipe(get('conditions'), valueSeq, map(_getActiveFieldNamesFromGroup), ImmutableSet, flatten);
  return !hasIn(['field', 'name'], logicGroup) ? ImmutableSet() : getIn(['field', 'name'], logicGroup) || recurse(logicGroup);
};

var PANEL_KEYS = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  LIST: 'LIST'
};

var _isImmutableEqual = function _isImmutableEqual(a, b) {
  return Object.keys(a).some(function (key) {
    if (key === 'style') {
      if (!is(ImmutableMap(a[key]), ImmutableMap(b[key]))) {
        return true;
      }
    }

    if (!is(a[key], b[key])) {
      return true;
    }

    return false;
  });
};

export var WEBPACK_3_FORCE_MODULE_IMPORT = 1; // eslint-disable-next-line react/no-multi-comp

var XOFilterEditor = /*#__PURE__*/function (_Component) {
  _inherits(XOFilterEditor, _Component);

  function XOFilterEditor(_props) {
    var _this;

    _classCallCheck(this, XOFilterEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XOFilterEditor).call(this, _props));

    _this.updateNullIssueRelatedState = function (newState) {
      if (newState) {
        _this.setState({
          nullIssueRelatedState: newState
        });
      }
    };

    _this.getDerivedState = function (props) {
      var prevState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _props$getFilterFamil = props.getFilterFamilyOptions,
          getFilterFamilyOptions = _props$getFilterFamil === void 0 ? function () {
        return OrderedSet();
      } : _props$getFilterFamil,
          isInitialScreenCreate = props.isInitialScreenCreate,
          isXoEnabled = props.isXoEnabled,
          value = props.value;
      var state = Object.assign({
        filterFamily: undefined,
        getGroup: identity,
        panelKey: PANEL_KEYS.LIST
      }, prevState);

      if (state.panelKey === PANEL_KEYS.LIST && state.panelKey !== prevState.panelKey && isInitialScreenCreate) {
        state.panelKey = PANEL_KEYS.CREATE;
      }

      if (state.panelKey === PANEL_KEYS.LIST && prevState.isInitialScreenCreate) {
        state.didScheduleStepInitializationCheck = true;
      }

      if (state.panelKey === PANEL_KEYS.CREATE && prevState.panelKey === PANEL_KEYS.LIST) {
        state.didScheduleStepInitializationCheck = false;
      }

      if (state.panelKey === PANEL_KEYS.CREATE) {
        var filterFamilyOptions = getFilterFamilyOptions() || OrderedSet();
        var initialFilterFamily = filterFamilyOptions.size <= 1 ? filterFamilyOptions.first() : undefined;
        var creationStateStaticAttributes = {
          draftCondition: null,
          filterFamily: isXoEnabled ? state.filterFamily || initialFilterFamily : state.filterFamily,
          originalValue: value,
          draftValue: value
        };
        var creationStateDefaultAttributes = {
          getGroup: identity,
          applyDraftToGroup: partial(LogicGroup.addToKeyPath, List())
        };
        state = Object.assign({}, creationStateDefaultAttributes, {}, state, {}, creationStateStaticAttributes);
      }

      if (state.panelKey === PANEL_KEYS.EDIT) {
        var editingStateStaticAttributes = {
          originalValue: value,
          draftValue: value
        };
        state = Object.assign({}, state, {}, editingStateStaticAttributes);
      }

      return state;
    };

    _this.getInputComponent = function (operator) {
      var field = operator.field;
      var getFieldDefinitions = _this.props.getFieldDefinitions;
      var filterFamily = _this.state.filterFamily;
      var fieldDefinitions = getFieldDefinitions(filterFamily);

      var referencedObjectType = _this.getReferencedObjectType(filterFamily, operator);

      var fieldDefinitionInputComponent = getIn([field.name, 'InputComponent'], fieldDefinitions);

      if (field.type === 'number' && field.numberDisplayHint === 'duration') {
        return FilterOperatorDurationInput;
      }

      if (field.referencedObjectType === ExternalOptionTypes.TEAM) {
        return FilterOperatorTeamInput;
      }

      if (fieldDefinitionInputComponent) {
        return fieldDefinitionInputComponent;
      }

      if (referencedObjectType === ExternalOptionTypes.OWNER) {
        return FilterOperatorOwnerInput;
      }

      var fieldType = getIn([field.name, 'inputType'], fieldDefinitions) || getIn([field.type, 'inputType'], fieldDefinitions) || field.displayType || field.type;

      if (fieldType === DisplayTypes.StringDisplayType && [WildCardEqual, NotWildCardEqual].includes(operator.constructor)) {
        return FilterOperatorElasticsearchTextQueryInput;
      } // HACK: This is for a special case in ListSegClassic and should not be
      // relied upon to remain the same.


      if (fieldType === DisplayTypes.StringDisplayType && operator.constructor.isIterableField('value')) {
        return FilterOperatorMultiStringInput;
      }

      switch (fieldType) {
        case DisplayTypes.BooleanDisplayType:
          return FilterOperatorBoolInput;

        case DisplayTypes.DateDisplayType:
        case DisplayTypes.DatetimeDisplayType:
          return FilterOperatorDateInput;

        case DisplayTypes.EnumerationDisplayType:
        case SITE_CONTENT:
        case SURVEY_QUESTION:
          return FilterOperatorEnumInput;

        case EMAIL_SUBSCRIPTION:
          return _this.props.getIsUngated('subscriptions:groupSettings') ? FilterOperatorEmailSubscriptionInput : FilterOperatorEnumInput;

        case DisplayTypes.NumberDisplayType:
          return FilterOperatorNumberInput;

        case DisplayTypes.PercentageDisplayType:
          return FilterOperatorPercentageInput;

        default:
          return FilterOperatorTextInput;
      }
    };

    _this.getReferencedObjectType = function (filterFamily, operator) {
      var _this$props = _this.props,
          baseFilterFamily = _this$props.baseFilterFamily,
          getFieldDefinitions = _this$props.getFieldDefinitions,
          getReferenceType = _this$props.getReferenceType,
          getReferenceTypeForOperator = _this$props.getReferenceTypeForOperator;
      var name = operator.field.name;
      var fieldDefinitions = getFieldDefinitions(filterFamily);
      return getIn([name, 'referencedObjectType'], fieldDefinitions) || getReferenceTypeForOperator(operator, filterFamily || baseFilterFamily) || getIn(['field', 'referencedObjectType'], operator) || getReferenceType(filterFamily || baseFilterFamily, name) || null;
    };

    _this.getSpecialOptionsForReferenceType = function (referenceType) {
      var getSpecialFieldOptions = _this.props.getSpecialFieldOptions;
      var specialOptionsByReferenceType = getSpecialFieldOptions();

      if (Object.prototype.hasOwnProperty.call(specialOptionsByReferenceType, referenceType)) {
        var getOptions = specialOptionsByReferenceType[referenceType];
        return getOptions();
      }

      return undefined;
    };

    _this.getPlaceholder = function (operator) {
      return operator.field.placeholder || '';
    };

    _this.getLabelString = function (field) {
      var _ref = field || {},
          name = _ref.name;

      var getFieldDefinitions = _this.props.getFieldDefinitions;
      var filterFamily = _this.state.filterFamily;
      var fieldDefinitions = getFieldDefinitions(filterFamily);
      var getter = getIn([name, 'getLabelString'], fieldDefinitions) || PropertyDisplay.getPropertyLabel;
      return getter(field);
    };

    _this.getDescriptionString = function (field) {
      var _ref2 = field || {},
          description = _ref2.description,
          name = _ref2.name;

      var getFieldDefinitions = _this.props.getFieldDefinitions;
      var filterFamily = _this.state.filterFamily;
      var fieldDefinitions = getFieldDefinitions(filterFamily);
      var getDescriptionString = getIn([name, 'getDescriptionString'], fieldDefinitions);
      return getDescriptionString ? getDescriptionString(field) : FieldTranslator.getTranslatedFieldDescription({
        fieldName: name,
        fieldDescription: description,
        filterFamily: filterFamily
      });
    };

    _this.getOperatorLabelString = function (Operator, field) {
      return Operator.getLabel ? Operator.getLabel(field) : unescapedText(getOperatorLabelTranslationKey(Operator, field));
    };

    _this.getEffectiveFilterFamily = function (_ref3) {
      var constraint = _ref3.constraint,
          baseFilterFamily = _ref3.baseFilterFamily,
          filterFamily = _ref3.filterFamily;
      return constraint ? filterFamily || baseFilterFamily : filterFamily;
    };

    _this.getFilterFamilyAndButtonTooltip = function (filterFamily) {
      var _this$props2 = _this.props,
          getFilterFamilyAndButtonTooltip = _this$props2.getFilterFamilyAndButtonTooltip,
          getFilterFamilyObjectName = _this$props2.getFilterFamilyObjectName;

      if (getFilterFamilyAndButtonTooltip) {
        return getFilterFamilyAndButtonTooltip(filterFamily, getFilterFamilyObjectName);
      }

      return FilterFamilyAndButtonTooltipTranslator(filterFamily, getFilterFamilyObjectName);
    };

    _this.getFilterFamilyGroupHeading = function (filterFamily) {
      var _this$props3 = _this.props,
          getFilterFamilyGroupHeading = _this$props3.getFilterFamilyGroupHeading,
          getFilterFamilyObjectName = _this$props3.getFilterFamilyObjectName;

      if (getFilterFamilyGroupHeading) {
        return getFilterFamilyGroupHeading(filterFamily, getFilterFamilyObjectName);
      }

      return FilterFamilyGroupHeadingTranslator(filterFamily, getFilterFamilyObjectName);
    };

    _this.getFilterFamilyName = function (filterFamily) {
      var _this$props4 = _this.props,
          getFilterFamilyName = _this$props4.getFilterFamilyName,
          getFilterFamilyObjectName = _this$props4.getFilterFamilyObjectName;

      if (getFilterFamilyName) {
        return getFilterFamilyName(filterFamily, getFilterFamilyObjectName);
      }

      return FilterFamilyNameTranslator(filterFamily, getFilterFamilyObjectName);
    };

    _this.getOperators = function (field, contextualFilterFamily) {
      var _this$props5 = _this.props,
          constraint = _this$props5.constraint,
          getFieldDefinitions = _this$props5.getFieldDefinitions,
          getOperatorsForType = _this$props5.getOperatorsForType,
          baseFilterFamily = _this$props5.baseFilterFamily; // When the filterEditorOperatorDisplay uses this, the state does not have
      // the filterFamily set, but the component knows the filter family

      var filterFamily = _this.state.filterFamily || contextualFilterFamily;

      var effectiveFilterFamily = _this.getEffectiveFilterFamily({
        constraint: constraint,
        filterFamily: filterFamily,
        baseFilterFamily: baseFilterFamily
      });

      var fieldDefinitions = getFieldDefinitions(effectiveFilterFamily);
      var fieldDefinitionsPath = [field.name, 'operators'];
      var operatorsByFieldDefinition = getIn(fieldDefinitionsPath, fieldDefinitions);

      if (operatorsByFieldDefinition) {
        return operatorsByFieldDefinition;
      }

      var referencedObjectTypeOperators = getOperatorsForType(field.referencedObjectType, filterFamily, _this.props.getIsUngated);
      var fieldTypeOperators = getOperatorsForType(field.type, filterFamily, _this.props.getIsUngated);
      var operators = referencedObjectTypeOperators || fieldTypeOperators;
      invariant(operators, "No operator available for field " + field.name);
      return operators;
    };

    _this.getValueResolver = function (filterFamily, operator) {
      var getReferenceResolvers = _this.props.getReferenceResolvers;

      if (isExternalOptionsField(operator.field, filterFamily) && operatorSupportsExternalOptions(operator)) {
        // Some usages of the filter still use the old object type constants as a
        // filter family. reference-resolvers-lite requires objectTypeId. This just
        // normalizes the filter family to be an objectTypeId, if the filter family
        // isn't an object type it does nothing.
        var normalizedFilterFamily = ObjectTypesToIds[filterFamily] || filterFamily;
        return getPropertyResolver({
          property: operator.field,
          objectTypeId: normalizedFilterFamily
        });
      }

      var referenceResolvers = getReferenceResolvers(filterFamily);

      var key = _this.getReferencedObjectType(filterFamily, operator);

      return getIn([key], referenceResolvers);
    };

    _this.getTeamConstraint = function (_ref4) {
      var getIsUngated = _ref4.getIsUngated,
          constraint = _ref4.constraint;
      return getIsUngated && getIsUngated('teams-partitioning-lists') ? constraint : undefined;
    };

    _this.handleChangeFilterFamily = function (evt) {
      var value = evt.target.value;
      var _this$props6 = _this.props,
          getFields = _this$props6.getFields,
          onChangeFilterFamily = _this$props6.onChangeFilterFamily;
      var fields = getFields(value);
      var defaultValue;

      if (fields && fields.size === 1) {
        var field = fields.first();
        var isFieldSelectSkipped = getIn(['metadata', 'hasNoFieldOptions'], field);

        if (isFieldSelectSkipped) {
          var Operator = _this.getOperators(field).first();

          defaultValue = Operator.of(field);
        }
      }

      _this.setState({
        filterFamily: value,
        defaultValue: defaultValue
      });

      onChangeFilterFamily(value ? evt : SyntheticEvent(undefined));
    };

    _this.handlePublicPrimaryVsAnyAssociationChange = function (branchPath, assnValue) {
      var _this$props7 = _this.props,
          onChange = _this$props7.onChange,
          value = _this$props7.value;

      var _parseAssociationOpti = parseAssociationOption(assnValue),
          id = _parseAssociationOpti.id,
          category = _parseAssociationOpti.category;

      var nextValue = value.mergeIn(LogicGroup.getRealPath(branchPath), {
        associationTypeId: id,
        associationCategory: category
      });
      onChange(nextValue);
    };

    _this.handleOpenCreate = function (applyDraftToGroup, getGroup, filterFamily) {
      _this.handleChangeFilterFamily(SyntheticEvent(filterFamily));

      var nextState = {
        applyDraftToGroup: applyDraftToGroup,
        filterFamily: filterFamily,
        getGroup: getGroup,
        panelKey: PANEL_KEYS.CREATE,
        nullIssueRelatedState: Object.assign({}, _this.state.nullIssueRelatedState, {
          conditionBranchPath: List([PANEL_KEYS.CREATE])
        }),
        isEditMode: false
      };

      _this.setState(_this.getDerivedState(_this.props, nextState));
    };

    _this.handleOpenEdit = function (keyPath, filterFamily) {
      var value = _this.props.value;
      var nextState = {
        panelKey: PANEL_KEYS.EDIT,
        draftCondition: LogicGroup.getKeyPath(keyPath, value),
        applyDraftToGroup: _this.partial(LogicGroup.setKeyPath, keyPath),
        nullIssueRelatedState: Object.assign({}, _this.state.nullIssueRelatedState, {
          conditionBranchPath: keyPath.pop()
        }),
        isEditMode: true
      };

      _this.setState(_this.getDerivedState(_this.props, nextState));

      _this.handleChangeFilterFamily(SyntheticEvent(filterFamily));
    };

    _this.handleIncludeObjectsWithNoAssociatedObjectsChange = function (includeObjectsWithNoAssociatedObjects) {
      var onDraftChange = _this.props.onDraftChange;
      var _this$state = _this.state,
          conditionBranchPath = _this$state.nullIssueRelatedState.conditionBranchPath,
          draftValue = _this$state.draftValue;
      var nextValue = draftValue.setIn(LogicGroup.getRealPath(conditionBranchPath).push('includeObjectsWithNoAssociatedObjects'), includeObjectsWithNoAssociatedObjects);

      _this.setState({
        draftValue: nextValue
      });

      if (typeof onDraftChange === 'function') {
        onDraftChange(nextValue);
      }
    };

    _this.handleDraftOperatorChange = function (evt) {
      var value = evt.target.value;

      if (value) {
        _this.setState({
          draftCondition: value,
          draftConditionChanged: true
        });
      } else {
        _this.setState(function (prevState) {
          if (prevState.defaultValue) {
            _this.handleChangeFilterFamily(SyntheticEvent(undefined));
          }

          return {
            defaultValue: value,
            draftCondition: value,
            draftConditionChanged: true
          };
        });
      }

      var _this$props8 = _this.props,
          onDraftChange = _this$props8.onDraftChange,
          onUserAction = _this$props8.onUserAction;
      var _this$state2 = _this.state,
          applyDraftToGroup = _this$state2.applyDraftToGroup,
          filterFamily = _this$state2.filterFamily,
          originalValue = _this$state2.originalValue,
          draftValue = _this$state2.draftValue,
          panelKey = _this$state2.panelKey,
          isEditMode = _this$state2.isEditMode;

      if (typeof onDraftChange === 'function') {
        var nextValue = value ? applyDraftToGroup(value, draftValue, filterFamily) : originalValue; // update draftValue only on "edit", on "create" leave untouched

        if (isEditMode) {
          _this.setState({
            draftValue: nextValue
          });
        }

        onDraftChange(nextValue);
      }

      if (typeof onUserAction === 'function') {
        onUserAction(FilterUserAction({
          condition: value,
          filterFamily: filterFamily,
          subAction: CONDITION_DRAFT_CHANGED,
          panelKey: panelKey
        }));
      }
    };

    _this.handleDraftOperatorDone = function (evt) {
      var isAborted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var nextCondition = evt.target.value;
      var _this$props9 = _this.props,
          onChange = _this$props9.onChange,
          onOperatorChangeConfirmed = _this$props9.onOperatorChangeConfirmed,
          onUserAction = _this$props9.onUserAction,
          onDraftChange = _this$props9.onDraftChange;
      var _this$state3 = _this.state,
          applyDraftToGroup = _this$state3.applyDraftToGroup,
          draftConditionChanged = _this$state3.draftConditionChanged,
          originalValue = _this$state3.originalValue,
          filterFamily = _this$state3.filterFamily,
          panelKey = _this$state3.panelKey,
          draftValue = _this$state3.draftValue;
      var nextValue; // if user clicked "back" reset to originalValue, otherwise use mutated draftValue

      if (isAborted) {
        nextValue = nextCondition ? applyDraftToGroup(nextCondition, originalValue, filterFamily) : originalValue;
        onDraftChange(nextValue);
      } else {
        nextValue = nextCondition ? applyDraftToGroup(nextCondition, draftValue, filterFamily) : originalValue;
      }

      if (draftConditionChanged) {
        onChange(nextValue);

        if (typeof onOperatorChangeConfirmed === 'function') {
          onOperatorChangeConfirmed(panelKey, filterFamily, nextCondition);
        }
      }

      var state = {
        draftConditionChanged: false,
        filterFamily: undefined,
        panelKey: PANEL_KEYS.LIST
      };

      _this.setState(_this.getDerivedState(_this.props, state));

      if (typeof onUserAction === 'function') {
        onUserAction(FilterUserAction({
          condition: get('name', nextCondition),
          filterFamily: filterFamily,
          refinement: getIn(['refinement', 'name'], nextCondition),
          subAction: isAborted ? CONDITION_DRAFT_SAVED : CONDITION_DRAFT_ABANDONED,
          panelKey: panelKey
        }));
      }
    };

    _this.handleOperatorDoneCreate = function (evt) {
      var onUserAction = _this.props.onUserAction;
      var _this$state4 = _this.state,
          filterFamily = _this$state4.filterFamily,
          panelKey = _this$state4.panelKey;

      _this.handleDraftOperatorDone(evt);

      var onOperatorConfirmed = _this.props.onOperatorConfirmed;

      if (typeof onOperatorConfirmed === 'function') {
        onOperatorConfirmed(evt);
      }

      if (typeof onUserAction === 'function') {
        onUserAction(FilterUserAction({
          condition: getIn(['target', 'value', 'name'], evt),
          filterFamily: filterFamily,
          panelKey: panelKey,
          refinement: getIn(['target', 'value', 'refinement', 'name'], evt),
          subAction: CONDITION_ADDED
        }));
      }
    };

    _this.handleOperatorClone = function (insertClone) {
      var _this$props10 = _this.props,
          onChange = _this$props10.onChange,
          onUserAction = _this$props10.onUserAction,
          value = _this$props10.value;
      var panelKey = _this.state.panelKey;
      var nextValue = typeof insertClone === 'function' ? insertClone(value) : undefined;
      onChange(nextValue);

      if (typeof onUserAction === 'function') {
        onUserAction(FilterUserAction({
          subAction: CONDITION_CLONED,
          panelKey: panelKey
        }));
      }
    };

    _this.handleOperatorRemove = function (keyPath) {
      var _this$props11 = _this.props,
          onChange = _this$props11.onChange,
          onUserAction = _this$props11.onUserAction,
          value = _this$props11.value;
      var panelKey = _this.state.panelKey;
      var nextValue = LogicGroup.removeKeyPath(keyPath, value);
      onChange(nextValue);

      if (typeof onUserAction === 'function') {
        onUserAction(FilterUserAction({
          subAction: CONDITION_DELETED,
          panelKey: panelKey
        }));
      }
    };

    _this.handleShowAllConditionsClick = function () {
      var onUserAction = _this.props.onUserAction;
      var panelKey = _this.state.panelKey;

      if (typeof onUserAction === 'function') {
        onUserAction(FilterUserAction({
          subAction: SHOW_ALL_CONDITIONS_CLICKED,
          panelKey: panelKey
        }));
      }
    };

    _this.renderFieldLink = function (_ref5) {
      var url = _ref5.url,
          value = _ref5.value;
      var _this$props12 = _this.props,
          FieldLinkComponent = _this$props12.FieldLinkComponent,
          onUserAction = _this$props12.onUserAction;
      var _this$state5 = _this.state,
          filterFamily = _this$state5.filterFamily,
          panelKey = _this$state5.panelKey;

      if (!url) {
        return null;
      }

      var fieldLinkProps = {
        filterFamily: filterFamily,
        onUserAction: onUserAction,
        panelKey: panelKey,
        url: url,
        value: value
      };
      return /*#__PURE__*/_jsx(FieldLinkComponent, Object.assign({}, fieldLinkProps));
    };

    _this.state = Object.assign({
      draftCondition: null,
      draftConditionChanged: false,

      /**
       *
       * HACK(@sdesota): Using this can break some edge cases
       *
       * When we begin editing a filter, we set `originalValue` to the current
       * value. If `back` is clicked, we revert to the originalValue.
       *
       * If:
       *
       * 1. User starts editing filter
       * 2. The parent changes the filters independently of the filter editor
       * 3. The user clicks back
       *
       * Now the parent would receive a `onChange` event with the original value
       * before the draft was created, ignoring its own changes.
       *
       * Eventually, we should find a better pattern.
       *
       */
      originalValue: null,
      draftValue: null
    }, _this.getDerivedState(_props), {
      // "null association" and "null values" related state
      nullIssueRelatedState: {
        conditionBranchPath: List([PANEL_KEYS.CREATE]),
        showIncludeObjectsWithNoValueSetByOperator: {},
        showIncludeObjectsWithNoAssociatedObjectsByFilterBranch: {},
        defaultNullValueByOperator: {}
      },
      isEditMode: undefined
    }); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(XOFilterEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props13 = this.props,
          isInitialScreenCreate = _this$props13.isInitialScreenCreate,
          onEditingChange = _this$props13.onEditingChange;
      var panelKey = this.state.panelKey;

      if (typeof onEditingChange === 'function' && panelKey === PANEL_KEYS.CREATE && isInitialScreenCreate) {
        onEditingChange(SyntheticEvent(true));
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return _isImmutableEqual(this.props, nextProps) || _isImmutableEqual(this.state, nextState);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var isInitialScreenCreate = prevProps.isInitialScreenCreate,
          onEditingChange = prevProps.onEditingChange;
      var _this$props14 = this.props,
          value = _this$props14.value,
          isReadOnly = _this$props14.isReadOnly;
      var _this$state6 = this.state,
          draftCondition = _this$state6.draftCondition,
          panelKey = _this$state6.panelKey;
      var didScheduleStepInitializationCheck = this.state.didScheduleStepInitializationCheck;

      var getConditionCount = function getConditionCount(logicGroup) {
        var conditions = getIn(['conditions'], logicGroup) || List();
        return conditions.size;
      };

      var isConditionCountEmpty = getConditionCount(value) < 1 && getConditionCount(draftCondition) < 1;
      var isStepInitializationCheckNeededThisTick = didScheduleStepInitializationCheck || panelKey === PANEL_KEYS.LIST && isInitialScreenCreate;

      if (isStepInitializationCheckNeededThisTick && value !== prevProps.value && isConditionCountEmpty) {
        var addToRoot = partial(LogicGroup.addToKeyPath, List());
        this.handleOpenCreate(addToRoot, identity, undefined);
      }

      if (prevState.panelKey && panelKey !== prevState.panelKey && typeof onEditingChange === 'function') {
        var isEditing = panelKey !== PANEL_KEYS.LIST;
        onEditingChange(SyntheticEvent(isEditing));
      }

      if (isReadOnly && panelKey !== PANEL_KEYS.LIST) {
        this.setState({
          panelKey: PANEL_KEYS.LIST
        });
      }
    }
  }, {
    key: "defaultOperatorDescription",
    value: function defaultOperatorDescription(_ref6) {
      var children = _ref6.children;
      return /*#__PURE__*/_jsx("div", {
        className: "p-left-4",
        children: children
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props15 = this.props,
          DescriptionListComponent = _this$props15.DescriptionListComponent,
          OperatorDescriptionComponent = _this$props15.OperatorDescriptionComponent,
          addConditionDisabledTooltip = _this$props15.addConditionDisabledTooltip,
          baseFilterFamily = _this$props15.baseFilterFamily,
          className = _this$props15.className,
          constraint = _this$props15.constraint,
          currencyCode = _this$props15.currencyCode,
          displayMode = _this$props15.displayMode,
          editorSubtitle = _this$props15.editorSubtitle,
          getActiveFieldNames = _this$props15.getActiveFieldNames,
          getFilterFamilyForEntity = _this$props15.getFilterFamilyForEntity,
          getFieldDefinitions = _this$props15.getFieldDefinitions,
          getFieldGroups = _this$props15.getFieldGroups,
          getFields = _this$props15.getFields,
          __getFilterFamilyAndButtonTooltip = _this$props15.getFilterFamilyAndButtonTooltip,
          __getFilterFamilyGroupHeading = _this$props15.getFilterFamilyGroupHeading,
          getFilterFamilyHasEntities = _this$props15.getFilterFamilyHasEntities,
          __getFilterFamilyName = _this$props15.getFilterFamilyName,
          getFilterFamilyObjectName = _this$props15.getFilterFamilyObjectName,
          getFilterFamilyOptions = _this$props15.getFilterFamilyOptions,
          getInitialConditionCountCutoff = _this$props15.getInitialConditionCountCutoff,
          getIsUngated = _this$props15.getIsUngated,
          getObjectPropertyLabel = _this$props15.getObjectPropertyLabel,
          __getReferenceResolvers = _this$props15.getReferenceResolvers,
          isAddConditionDisabled = _this$props15.isAddConditionDisabled,
          isFieldDescriptionVisible = _this$props15.isFieldDescriptionVisible,
          isFiscalYearEnabled = _this$props15.isFiscalYearEnabled,
          isInitialScreenCreate = _this$props15.isInitialScreenCreate,
          isReadOnly = _this$props15.isReadOnly,
          isTimezoneWarningDisabled = _this$props15.isTimezoneWarningDisabled,
          isRollingDateOffsetInputEnabled = _this$props15.isRollingDateOffsetInputEnabled,
          isXoEnabled = _this$props15.isXoEnabled,
          labelOperatorCreateSave = _this$props15.labelOperatorCreateSave,
          labelOperatorEditSave = _this$props15.labelOperatorEditSave,
          matchStatus = _this$props15.matchStatus,
          __onChangeFilterFamily = _this$props15.onChangeFilterFamily,
          onFieldSearchChange = _this$props15.onFieldSearchChange,
          onTempColumnAdd = _this$props15.onTempColumnAdd,
          onUserAction = _this$props15.onUserAction,
          searchable = _this$props15.searchable,
          showIncludeUnknownValues = _this$props15.showIncludeUnknownValues,
          showInvalidOptionErrors = _this$props15.showInvalidOptionErrors,
          showInitialStepBackButton = _this$props15.showInitialStepBackButton,
          style = _this$props15.style,
          validateOperator = _this$props15.validateOperator,
          value = _this$props15.value,
          valueBase = _this$props15.valueBase,
          getObjectAssociationOptions = _this$props15.getObjectAssociationOptions,
          isAssociationSelectEnabled = _this$props15.isAssociationSelectEnabled,
          rest = _objectWithoutProperties(_this$props15, ["DescriptionListComponent", "OperatorDescriptionComponent", "addConditionDisabledTooltip", "baseFilterFamily", "className", "constraint", "currencyCode", "displayMode", "editorSubtitle", "getActiveFieldNames", "getFilterFamilyForEntity", "getFieldDefinitions", "getFieldGroups", "getFields", "getFilterFamilyAndButtonTooltip", "getFilterFamilyGroupHeading", "getFilterFamilyHasEntities", "getFilterFamilyName", "getFilterFamilyObjectName", "getFilterFamilyOptions", "getInitialConditionCountCutoff", "getIsUngated", "getObjectPropertyLabel", "getReferenceResolvers", "isAddConditionDisabled", "isFieldDescriptionVisible", "isFiscalYearEnabled", "isInitialScreenCreate", "isReadOnly", "isTimezoneWarningDisabled", "isRollingDateOffsetInputEnabled", "isXoEnabled", "labelOperatorCreateSave", "labelOperatorEditSave", "matchStatus", "onChangeFilterFamily", "onFieldSearchChange", "onTempColumnAdd", "onUserAction", "searchable", "showIncludeUnknownValues", "showInvalidOptionErrors", "showInitialStepBackButton", "style", "validateOperator", "value", "valueBase", "getObjectAssociationOptions", "isAssociationSelectEnabled"]);

      var _this$state7 = this.state,
          defaultValue = _this$state7.defaultValue,
          draftCondition = _this$state7.draftCondition,
          conditionBranchPath = _this$state7.nullIssueRelatedState.conditionBranchPath,
          draftValue = _this$state7.draftValue,
          filterFamily = _this$state7.filterFamily,
          getGroup = _this$state7.getGroup,
          panelKey = _this$state7.panelKey;
      var filterBranch = draftValue && conditionBranchPath ? LogicGroup.getKeyPath(conditionBranchPath, draftValue) : null;
      var dataAttributes = Object.keys(rest).filter(function (key) {
        return key.startsWith('data-');
      }).reduce(function (acc, key) {
        acc[key] = rest[key];
        return acc;
      }, {});
      var activeGroup = Or.isOr(value) ? getGroup(value || {}) : value;
      var activeFieldNames = getActiveFieldNames(filterFamily)(activeGroup).union(getGroup(value) === value ? ImmutableSet() : _getActiveFieldNamesFromGroup(activeGroup || {}));
      var safeConstraint = this.getTeamConstraint({
        getIsUngated: getIsUngated,
        constraint: constraint
      });
      var editAndCreateSharedProps = Object.assign({}, rest, {
        activeFieldNames: activeFieldNames,
        className: className,
        constraint: safeConstraint,
        currencyCode: currencyCode,
        draftCondition: draftCondition,
        editorSubtitle: editorSubtitle,
        fields: getFields(filterFamily),
        fieldGroups: getFieldGroups(filterFamily),
        filterFamily: filterFamily,
        isRollingDateOffsetInputEnabled: isRollingDateOffsetInputEnabled,
        isFiscalYearEnabled: isFiscalYearEnabled,
        isTimezoneWarningDisabled: isTimezoneWarningDisabled,
        isXoEnabled: isXoEnabled,
        getDescriptionString: this.getDescriptionString,
        getFamilyValueResolver: this.partial(this.getValueResolver, filterFamily),
        getFilterFamilyForEntity: getFilterFamilyForEntity,
        getFilterFamilyHasEntities: getFilterFamilyHasEntities,
        getFilterFamilyName: this.getFilterFamilyName,
        getFilterFamilyObjectName: getFilterFamilyObjectName,
        getObjectPropertyLabel: getObjectPropertyLabel,
        getFilterFamilyGroupHeading: this.getFilterFamilyGroupHeading,
        getInputComponent: this.getInputComponent,
        getLabelString: this.getLabelString,
        getOperatorLabel: this.getOperatorLabelString,
        getOperators: this.getOperators,
        getPlaceholder: this.getPlaceholder,
        getReferencedObjectType: this.getReferencedObjectType,
        getSpecialOptionsForReferenceType: this.getSpecialOptionsForReferenceType,
        isFieldDescriptionVisible: isFieldDescriptionVisible,
        onChange: this.handleDraftOperatorChange,
        onFieldSearchChange: onFieldSearchChange,
        renderFieldLink: this.renderFieldLink,
        searchable: searchable,
        showIncludeUnknownValues: showIncludeUnknownValues,
        style: style,
        validateOperator: validateOperator,
        nullIssueRelatedState: this.state.nullIssueRelatedState,
        updateNullIssueRelatedState: this.updateNullIssueRelatedState
      });

      if (displayMode === DESCRIPTION) {
        return /*#__PURE__*/_jsx(FilterEditorOperatorDescriptionList, Object.assign({}, rest, {
          baseFilterFamily: baseFilterFamily,
          className: className,
          currencyCode: currencyCode,
          DescriptionListComponent: DescriptionListComponent,
          getFieldDefinitions: getFieldDefinitions,
          getFilterFamilyGroupHeading: this.getFilterFamilyGroupHeading,
          getLabelString: this.getLabelString,
          getOperatorLabel: this.getOperatorLabelString,
          getOperators: this.getOperators,
          getReferencedObjectType: this.getReferencedObjectType,
          getSpecialOptionsForReferenceType: this.getSpecialOptionsForReferenceType,
          getValueResolver: this.getValueResolver,
          isXoEnabled: isXoEnabled,
          OperatorDescriptionComponent: typeof OperatorDescriptionComponent === 'function' ? OperatorDescriptionComponent : this.defaultOperatorDescription,
          style: style,
          value: value
        }));
      }

      if (panelKey === PANEL_KEYS.CREATE) {
        var isValueEmpty = value && value.conditions && value.conditions.size === 0;
        return /*#__PURE__*/_jsx(FilterEditorOperatorCreate, Object.assign({}, editAndCreateSharedProps, {
          getFilterFamilyOptions: getFilterFamilyOptions,
          isInitialStepBackButtonDisabled: !showInitialStepBackButton && isInitialScreenCreate && isValueEmpty,
          labelOperatorCreateSave: labelOperatorCreateSave,
          onChangeFilterFamily: this.handleChangeFilterFamily,
          onDone: this.handleOperatorDoneCreate,
          onTempColumnAdd: onTempColumnAdd,
          value: draftCondition || defaultValue
        }));
      } else if (panelKey === PANEL_KEYS.EDIT) {
        return /*#__PURE__*/_jsx(FilterEditorOperatorEdit, Object.assign({}, editAndCreateSharedProps, {
          filterBranch: filterBranch,
          handleIncludeObjectsWithNoAssociatedObjectsChange: this.handleIncludeObjectsWithNoAssociatedObjectsChange,
          labelOperatorEditSave: labelOperatorEditSave,
          onDone: this.handleDraftOperatorDone,
          value: draftCondition
        }));
      }

      return /*#__PURE__*/_jsx(FilterEditorOperatorDisplayList, Object.assign({}, dataAttributes, {
        addConditionDisabledTooltip: addConditionDisabledTooltip,
        baseFilterFamily: baseFilterFamily,
        className: className,
        constraint: safeConstraint,
        currencyCode: currencyCode,
        data: this.props.data,
        getFieldDefinitions: getFieldDefinitions,
        getFilterFamilyAndButtonTooltip: this.getFilterFamilyAndButtonTooltip,
        getFilterFamilyGroupHeading: this.getFilterFamilyGroupHeading,
        getFilterFamilyHeading: this.getFilterFamilyGroupHeading,
        getFilterFamilyObjectName: getFilterFamilyObjectName,
        getInitialConditionCountCutoff: getInitialConditionCountCutoff,
        getIsUngated: getIsUngated,
        getLabelString: this.getLabelString,
        getObjectAssociationOptions: getObjectAssociationOptions,
        getOperatorLabel: this.getOperatorLabelString,
        getOperators: this.getOperators,
        getReferencedObjectType: this.getReferencedObjectType,
        getSpecialOptionsForReferenceType: this.getSpecialOptionsForReferenceType,
        getValueResolver: this.getValueResolver,
        handleOpenCreate: this.handleOpenCreate,
        handleOpenEdit: this.handleOpenEdit,
        handleOperatorClone: this.handleOperatorClone,
        handleOperatorRemove: this.handleOperatorRemove,
        isAddConditionDisabled: isAddConditionDisabled,
        isAssociationSelectEnabled: isAssociationSelectEnabled,
        isReadOnly: isReadOnly,
        isXoEnabled: isXoEnabled,
        matchStatus: matchStatus,
        onBranchAssociationChange: this.handlePublicPrimaryVsAnyAssociationChange,
        onShowAllConditionsClick: this.handleShowAllConditionsClick,
        onUserAction: onUserAction,
        showInvalidOptionErrors: showInvalidOptionErrors,
        style: style,
        validateOperator: validateOperator,
        value: value,
        valueBase: valueBase
      }));
    }
  }]);

  return XOFilterEditor;
}(Component);

export { XOFilterEditor as default };
XOFilterEditor.propTypes = {
  DescriptionListComponent: PropTypes.elementType.isRequired,
  FieldLinkComponent: PropTypes.elementType,
  FieldSelectItemComponent: PropTypes.elementType.isRequired,
  OperatorDescriptionComponent: PropTypes.elementType,
  addConditionDisabledTooltip: PropTypes.node,
  baseFilterFamily: PropTypes.string.isRequired,
  className: PropTypes.string,
  constraint: PropTypes.instanceOf(Constraint),
  currencyCode: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(ImmutableMap),
  displayMode: PropTypes.oneOf([DESCRIPTION, EDITOR]),
  editorSubtitle: PropTypes.node,
  getActiveFieldNames: PropTypes.func.isRequired,
  getFieldDefinitions: PropTypes.func.isRequired,
  getFieldGroups: PropTypes.func,
  getFields: PropTypes.func.isRequired,
  getFilterFamilyAndButtonTooltip: PropTypes.func,
  getFilterFamilyForEntity: PropTypes.func.isRequired,
  getFilterFamilyGroupHeading: PropTypes.func,
  getFilterFamilyHasEntities: PropTypes.func,
  getFilterFamilyName: PropTypes.func,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  getFilterFamilyOptions: PropTypes.func.isRequired,
  getInitialConditionCountCutoff: PropTypes.func,
  getIsUngated: PropTypes.func.isRequired,
  getObjectAssociationOptions: PropTypes.func,
  getObjectPropertyLabel: PropTypes.func.isRequired,
  getOperatorsForType: PropTypes.func.isRequired,
  getReferenceResolvers: PropTypes.func.isRequired,
  getReferenceType: PropTypes.func.isRequired,
  getReferenceTypeForOperator: PropTypes.func,
  getSpecialFieldOptions: PropTypes.func.isRequired,
  isAddConditionDisabled: PropTypes.bool,
  isAssociationSelectEnabled: PropTypes.bool,
  isFieldDescriptionVisible: PropTypes.bool,
  isFiscalYearEnabled: PropTypes.bool,
  isInitialScreenCreate: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRollingDateOffsetInputEnabled: PropTypes.bool.isRequired,
  isTimezoneWarningDisabled: PropTypes.bool,
  isXoEnabled: PropTypes.bool,
  labelOperatorCreateSave: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelOperatorEditSave: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loadMoreFields: PropTypes.func,
  matchStatus: PropTypes.arrayOf(MatchStatusType),
  onChange: PropTypes.func,
  onChangeFilterFamily: PropTypes.func,
  onDraftChange: PropTypes.func.isRequired,
  onEditingChange: PropTypes.func,
  onFieldSearchChange: PropTypes.func,
  onOperatorChangeConfirmed: PropTypes.func,
  onOperatorConfirmed: PropTypes.func,
  onTempColumnAdd: PropTypes.func,
  onUserAction: PropTypes.func,
  searchable: PropTypes.bool,
  showIncludeUnknownValues: PropTypes.bool.isRequired,
  showInitialStepBackButton: PropTypes.bool,
  showInvalidOptionErrors: PropTypes.bool.isRequired,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  validateOperator: PropTypes.func,
  value: FilterType.isRequired,
  valueBase: FilterType
};
XOFilterEditor.defaultProps = {
  DescriptionListComponent: UIList,
  FieldLinkComponent: FieldLink,
  FieldSelectItemComponent: DefaultFieldSelectItemComponent,
  currencyCode: 'USD',
  displayMode: EDITOR,
  getActiveFieldNames: always(always(ImmutableSet())),
  getFieldDefinitions: always(ImmutableMap),
  getFieldGroups: always(undefined),
  getFilterFamilyForEntity: always(undefined),
  getFilterFamilyHasEntities: always(false),
  getFilterFamilyObjectName: LegacyFilterFamilyObjectNameTranslator,
  getFilterFamilyOptions: always(undefined),
  getInitialConditionCountCutoff: identity,
  getIsUngated: always(false),
  getObjectPropertyLabel: always(function (assetFamily, propertyName) {
    return propertyName;
  }),
  getOperatorsForType: getObjectSegOperatorsForType,
  getReferenceResolvers: always(ImmutableMap()),
  getReferenceType: always(null),
  getReferenceTypeForOperator: always(undefined),
  getSpecialFieldOptions: getSpecialOptionsByReferenceType,
  isAddConditionDisabled: false,
  isAssociationSelectEnabled: false,
  isFieldDescriptionVisible: false,
  isFieldUrlVisible: false,
  isFiscalYearEnabled: false,
  isRollingDateOffsetInputEnabled: false,
  onChangeFilterFamily: identity,
  onDraftChange: identity,
  onFieldSearchChange: identity,
  searchable: true,
  showIncludeUnknownValues: false,
  showInitialStepBackButton: false,
  showInvalidOptionErrors: false,
  validateOperator: always(FilterOperatorErrorRecord({
    error: false
  }))
};