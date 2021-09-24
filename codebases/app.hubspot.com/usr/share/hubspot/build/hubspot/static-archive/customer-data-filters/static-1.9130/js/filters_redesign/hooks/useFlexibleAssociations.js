'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List } from 'immutable';
import { useContext } from 'react';
import { setKeyPath } from '../../filterQueryFormat/logic/LogicGroup';
import { ObjectTypeIdRegex } from '../../filterQueryFormat/ObjectTypeId';
import { getAssociationValueFromFilterBranch, isUngatedForFlexibleAssociationsSelect, parseAssociationOption } from '../../components/strategies/ObjectSegStrategyUtils';
import { useEditorActions } from './useEditorActions';
import { useStrategy } from './useStrategy';
import SegmentationFiltersContext from '../state/SegmentationFiltersContext';
export var findAssociationOptionByValue = function findAssociationOptionByValue() {
  var associationOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var associationValue = arguments.length > 1 ? arguments[1] : undefined;
  var flattenedOptions = [];
  associationOptions.forEach(function (option) {
    if (option.options) {
      flattenedOptions.push.apply(flattenedOptions, _toConsumableArray(option.options));
    } else {
      flattenedOptions.push(option);
    }
  });
  return flattenedOptions.find(function (opt) {
    return opt.value === associationValue;
  });
};
export var getAssociationLabelFromOptions = function getAssociationLabelFromOptions() {
  var associationOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var associationValue = arguments.length > 1 ? arguments[1] : undefined;
  var option = findAssociationOptionByValue(associationOptions, associationValue);
  return option ? option.text : associationValue;
};
export var useFlexibleAssociations = function useFlexibleAssociations(logicGroup) {
  var _useContext = useContext(SegmentationFiltersContext),
      draftGroupValue = _useContext.draftGroupValue,
      getIsUngated = _useContext.getIsUngated,
      baseFilterFamily = _useContext.props.baseFilterFamily;

  var _useStrategy = useStrategy(),
      getObjectAssociationOptions = _useStrategy.getObjectAssociationOptions;

  var _useEditorActions = useEditorActions(),
      onDraftChange = _useEditorActions.onDraftChange;

  var filterFamily = logicGroup.filterFamily;
  var isAssnBranch = ObjectTypeIdRegex.test(filterFamily) && baseFilterFamily !== filterFamily;
  var isUngatedForAssociationSelect = isUngatedForFlexibleAssociationsSelect(baseFilterFamily, filterFamily, getIsUngated);
  var showAssociationSelect = isAssnBranch && isUngatedForAssociationSelect;
  var associationValue = getAssociationValueFromFilterBranch(logicGroup);
  var associationOptions = isAssnBranch ? getObjectAssociationOptions(filterFamily) : [];

  var onAssociationChange = function onAssociationChange(value) {
    var _parseAssociationOpti = parseAssociationOption(value),
        id = _parseAssociationOpti.id,
        category = _parseAssociationOpti.category;

    var newDraftGroupValue = setKeyPath(List([filterFamily]), logicGroup.merge({
      associationTypeId: id,
      associationCategory: category
    }), draftGroupValue);
    onDraftChange(newDraftGroupValue);
  };

  return {
    showAssociationSelect: showAssociationSelect,
    associationValue: associationValue,
    associationOptions: associationOptions,
    onAssociationChange: onAssociationChange
  };
};