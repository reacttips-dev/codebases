'use es6';

import { List } from 'immutable';
import { useCallback, useContext } from 'react';
import { addToKeyPath, getRealPath, removeKeyPath, setKeyPath } from '../../filterQueryFormat/logic/LogicGroup';
import { useOnChangeHandlers } from './useOnChangeHandlers';
import { useGetOperators } from './useGetOperators';
import SegmentationFiltersContext from '../state/SegmentationFiltersContext';
import { isConditionsPseudoGroup, isEventBasedFilterFamily, shouldAddEventPageRefinement } from '../strategy/eventBasedFilters';
import { isOperator } from '../../filterQueryFormat/operator/Operator';
import { __ANY_CTA } from '../../converters/listSegClassic/ListSegConstants';
import { ASSOCIATION_DEFINITION } from '../../filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import { getDefaultAssociation } from '../../components/strategies/ObjectSegStrategyUtils';
import { useLoadMoreFieldsHandler } from './useLoadMoreFieldsHandler';

var getEventBasedFilterFamilyCondition = function getEventBasedFilterFamilyCondition(filterFamily, field, getOperators, getRefinementOperators, conditionToRefineKeyPath, draftGroupValue) {
  var existingCondition = conditionToRefineKeyPath ? draftGroupValue.getIn(getRealPath(List(conditionToRefineKeyPath))) : undefined;
  var condition; // use existing condition if `conditionToRefineKeyPath` is specified
  // (e.g. user clicked refine form submission status filter)

  if (existingCondition && isOperator(existingCondition)) {
    condition = existingCondition;
  } else {
    // otherwise create new condition
    var operators = getOperators(filterFamily, field);
    condition = operators.first().of(field);
  } // add refinements, either event date or event count filter but not both


  if (field.refinement) {
    var refinementOperators = getRefinementOperators(filterFamily, field);
    condition = condition.set('refinement', refinementOperators.first().of(field));
  } // add event page filter (e.g. page on which form was submitted)


  if (shouldAddEventPageRefinement(filterFamily, field.name)) {
    condition = condition.set('isPageSelected', true);
  }

  return condition;
};

var getCondition = function getCondition(filterFamily, field, getOperators, getRefinementOperators, conditionToRefineKeyPath, draftGroupValue, data) {
  if (isEventBasedFilterFamily(filterFamily)) {
    return getEventBasedFilterFamilyCondition(filterFamily, field, getOperators, getRefinementOperators, conditionToRefineKeyPath, draftGroupValue, data);
  }

  var operators = getOperators(filterFamily, field);
  return operators.first().of(field);
};

var addAssociationToFilterFamilySubGroup = function addAssociationToFilterFamilySubGroup(group, filterFamily, associationDefinitions) {
  var filterFamilyLogicGroupAssociationTypeId = group.getIn(['conditions', filterFamily, 'associationTypeId']);

  if (!filterFamilyLogicGroupAssociationTypeId) {
    var baseFilterFamily = group.get('filterFamily');
    var defaultAssociation = getDefaultAssociation(baseFilterFamily, filterFamily, associationDefinitions);

    if (defaultAssociation) {
      group = group.mergeIn(['conditions', filterFamily], {
        associationTypeId: defaultAssociation.id,
        associationCategory: defaultAssociation.category
      });
    }
  }

  return group;
};

var addConditionToGroup = function addConditionToGroup(draftGroupValue, condition, filterFamily, conditionToRefineKeyPath, associationDefinitions) {
  var newDraftGroupValue; // replace existing condition if `conditionToRefineKeyPath` is specified
  // (e.g. user clicked refine form submission status filter)

  if (isConditionsPseudoGroup(filterFamily) && conditionToRefineKeyPath) {
    newDraftGroupValue = setKeyPath(List(conditionToRefineKeyPath), condition, draftGroupValue);
  } else {
    // otherwise use standard `addToKeyPath` logic
    newDraftGroupValue = addToKeyPath(List(), condition, draftGroupValue, filterFamily);
  }

  return addAssociationToFilterFamilySubGroup(newDraftGroupValue, filterFamily, associationDefinitions);
};

export var useEditorActions = function useEditorActions() {
  var _useContext = useContext(SegmentationFiltersContext),
      dispatch = _useContext.dispatch,
      internalDraftValue = _useContext.internalDraftValue,
      internalOriginalValue = _useContext.internalOriginalValue,
      draftGroupValue = _useContext.draftGroupValue,
      draftGroupIndexNumber = _useContext.draftGroupIndexNumber,
      conditionToRefineKeyPath = _useContext.conditionToRefineKeyPath,
      baseFilterFamily = _useContext.props.baseFilterFamily,
      data = _useContext.data;

  var _useGetOperators = useGetOperators(),
      getOperators = _useGetOperators.getOperators,
      getRefinementOperators = _useGetOperators.getRefinementOperators;

  var _useOnChangeHandlers = useOnChangeHandlers(),
      handleOnChange = _useOnChangeHandlers.handleOnChange,
      handleOnDraftChange = _useOnChangeHandlers.handleOnDraftChange;

  var loadMoreFields = useLoadMoreFieldsHandler();
  var selectField = useCallback(function (filterFamily, field) {
    var condition = getCondition(filterFamily, field, getOperators, getRefinementOperators, conditionToRefineKeyPath, draftGroupValue, data);
    var newDraftGroupValue = addConditionToGroup(draftGroupValue, condition, filterFamily, conditionToRefineKeyPath, data.get(ASSOCIATION_DEFINITION));
    dispatch({
      type: 'selectField',
      payload: {
        newDraftGroupValue: newDraftGroupValue,
        conditionId: filterFamily + "__" + field.name
      }
    });
  }, [conditionToRefineKeyPath, data, dispatch, draftGroupValue, getOperators, getRefinementOperators]);

  var addFilter = function addFilter() {
    dispatch({
      type: 'fieldSelectMode',
      payload: true
    });
  };

  var backToEditGroup = function backToEditGroup() {
    dispatch({
      type: 'fieldSelectMode',
      payload: false
    });
  };

  var onDraftChange = useCallback(function (newDraftGroupValue) {
    var newInternalDraftValue = setKeyPath(List([draftGroupIndexNumber]), newDraftGroupValue, internalDraftValue);
    dispatch({
      type: 'internalDraftValue',
      payload: newInternalDraftValue
    });
    handleOnDraftChange(newInternalDraftValue, newDraftGroupValue);
  }, [dispatch, handleOnDraftChange, draftGroupIndexNumber, internalDraftValue]);
  var onConditionDelete = useCallback(function (filterFamily) {
    var conditionKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var conditionKeyPath = List([filterFamily === baseFilterFamily ? undefined : filterFamily, conditionKey]).filter(function (keyEl) {
      return keyEl;
    });
    var newDraftGroupValue = removeKeyPath(conditionKeyPath, draftGroupValue);
    onDraftChange(newDraftGroupValue);
  }, [baseFilterFamily, draftGroupValue, onDraftChange]);
  var onChange = useCallback(function (newInternalValue) {
    dispatch({
      type: 'save',
      payload: newInternalValue
    });
    handleOnChange(newInternalValue);
  }, [dispatch, handleOnChange]);
  var onSave = useCallback(function () {
    // remove empty filter groups
    var newInternalValue = internalDraftValue.set('conditions', internalDraftValue.conditions.filter(function (filtersGroup) {
      return filtersGroup.conditions.size;
    }));
    onChange(newInternalValue);
  }, [onChange, internalDraftValue]);
  var onCancel = useCallback(function () {
    dispatch({
      type: 'resetEditor'
    });
    handleOnDraftChange(internalOriginalValue);
  }, [dispatch, handleOnDraftChange, internalOriginalValue]);
  var onRefineFilter = useCallback(function (keyPath) {
    var filterFamily = keyPath[0];
    dispatch({
      type: 'refineFilter',
      payload: {
        conditionToRefineKeyPath: keyPath,
        filterFamily: filterFamily
      }
    });
    loadMoreFields(filterFamily).then(function () {
      return dispatch({
        type: 'fieldsLoaded'
      });
    });
  }, [dispatch, loadMoreFields]);
  var selectFilterFamily = useCallback(function (filterFamily, isRefiningFilterFamily) {
    dispatch({
      type: 'filterFamily',
      payload: {
        filterFamily: filterFamily,
        isRefiningFilterFamily: isRefiningFilterFamily
      }
    });
    loadMoreFields(filterFamily).then(function () {
      return dispatch({
        type: 'fieldsLoaded'
      });
    });
  }, [dispatch, loadMoreFields]);
  var selectFilterFamilyGroup = useCallback(function (filterFamilyGroup) {
    dispatch({
      type: 'filterFamilyGroup',
      payload: {
        filterFamilyGroup: filterFamilyGroup
      }
    });
  }, [dispatch]);
  var backToFilterFamilySelect = useCallback(function () {
    dispatch({
      type: 'fieldSelectMode',
      payload: true
    });
  }, [dispatch]);
  return {
    addFilter: addFilter,
    selectField: selectField,
    onDraftChange: onDraftChange,
    onChange: onChange,
    onSave: onSave,
    onCancel: onCancel,
    onConditionDelete: onConditionDelete,
    backToEditGroup: backToEditGroup,
    onRefineFilter: onRefineFilter,
    selectFilterFamily: selectFilterFamily,
    selectFilterFamilyGroup: selectFilterFamilyGroup,
    backToFilterFamilySelect: backToFilterFamilySelect
  };
};