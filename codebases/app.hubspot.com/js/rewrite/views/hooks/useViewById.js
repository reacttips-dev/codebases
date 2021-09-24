'use es6';

import pipe from 'transmute/pipe';
import update from 'transmute/update';
import get from 'transmute/get';
import fromJS from 'transmute/fromJS';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useIsVisibleGridColumnName } from './useIsVisibleGridColumnName';
import { useViews } from './useViews';
import { applyColumnRules } from '../utils/applyColumnRules';
import memoizeOne from 'react-utils/memoizeOne';
import { replaceInvalidAssociationColumnByName } from '../../associations/utils/replaceInvalidAssociationColumnByName';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import withGateOverride from 'crm_data/gates/withGateOverride';
export var generateView = memoizeOne(function (view, primaryDisplayLabelPropertyName, isVisibleGridColumnName, objectTypeId, isNewAssociationsUngated, isFlexibleAssociationsUngated) {
  return update('columns', pipe(function (columns) {
    return columns.reduce(function (newColumns, column) {
      var columnName = get('name', column);
      var validColumns = replaceInvalidAssociationColumnByName(columnName, objectTypeId, isNewAssociationsUngated, isFlexibleAssociationsUngated).map(function (name) {
        return {
          name: name
        };
      });
      return newColumns.concat(validColumns);
    }, []);
  }, function (columns) {
    return applyColumnRules({
      columns: columns,
      primaryDisplayLabelPropertyName: primaryDisplayLabelPropertyName,
      isVisibleGridColumnName: isVisibleGridColumnName
    });
  }, fromJS), view);
});
export var useViewById = function useViewById(id) {
  var viewId = String(id);
  var view = get(viewId, useViews());
  var hasAllGates = useHasAllGates();
  var isNewAssociationsUngated = withGateOverride('CRM:Datasets:NewAssociations', hasAllGates('CRM:Datasets:NewAssociations'));
  var isFlexibleAssociationsUngated = withGateOverride('flexible-associations', hasAllGates('flexible-associations'));

  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      objectTypeId = _useSelectedObjectTyp.objectTypeId,
      primaryDisplayLabelPropertyName = _useSelectedObjectTyp.primaryDisplayLabelPropertyName;

  var isVisibleGridColumnName = useIsVisibleGridColumnName();

  if (!view) {
    return null;
  }

  return generateView(view, primaryDisplayLabelPropertyName, isVisibleGridColumnName, objectTypeId, isNewAssociationsUngated, isFlexibleAssociationsUngated);
};