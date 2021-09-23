'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { fromJS } from 'immutable';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { EditColumnsModal } from '../../../modals/EditColumnsModal';
import { useProperties } from '../../properties/hooks/useProperties';
import { usePropertyGroupsWithProperties } from '../../propertyGroups/hooks/usePropertyGroupsWithProperties';
import { useViewActions } from '../../views/hooks/useViewActions';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { useModalActions } from '../hooks/useModalActions';
import { getPropertyLabel } from 'customer-data-property-utils/PropertyDisplay';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { useSupportedAssociationsForCurrentType } from '../../associations/hooks/useSupportedAssociationsForCurrentType';
import localeComparator from 'I18n/utils/localeComparator';
import withGateOverride from 'crm_data/gates/withGateOverride';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes'; // HACK: The modal detects an order of NEGATIVE_INFINITY to mean "this column cannot be moved"
// Ideally we find a better way to handle this when we rewrite the modal.

export var COLUMN_NOT_REORDERABLE = Number.NEGATIVE_INFINITY;

var EditColumnsModalContainer = function EditColumnsModalContainer() {
  var hasAllGates = useHasAllGates();
  var typeDef = useSelectedObjectTypeDef();
  var associationDefinitions = useSupportedAssociationsForCurrentType();
  var groups = usePropertyGroupsWithProperties();
  var groupsWithSortedProperties = useMemo(function () {
    return groups.map(function (group) {
      return group.update('properties', function (properties) {
        return properties.sortBy(getPropertyLabel, localeComparator);
      });
    });
  }, [groups]);
  var isUngatedForFlexibleAssociations = withGateOverride('flexible-associations', hasAllGates('flexible-associations'));
  var isUngatedForNewAssociations = withGateOverride('CRM:Datasets:NewAssociations', hasAllGates('CRM:Datasets:NewAssociations'));
  var properties = useProperties();
  var view = useCurrentView();
  var viewColumns = useMemo(function () {
    return view.columns.map(function (col) {
      return col.get('name') === typeDef.primaryDisplayLabelPropertyName ? col.set('order', COLUMN_NOT_REORDERABLE) : col;
    });
  }, [typeDef.primaryDisplayLabelPropertyName, view.columns]);

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useViewActions = useViewActions(),
      onColumnsChanged = _useViewActions.onColumnsChanged;

  var handleColumnsChanged = useCallback(function (columns) {
    return onColumnsChanged(fromJS(columns.map(function (col) {
      return {
        name: col
      };
    })));
  }, [onColumnsChanged]);
  return /*#__PURE__*/_jsx(EditColumnsModal, {
    isDefaultView: view.type === DEFAULT,
    associationDefinitions: associationDefinitions,
    columns: viewColumns,
    isUngatedForFlexibleAssociations: isUngatedForFlexibleAssociations,
    isUngatedForNewAssociations: isUngatedForNewAssociations,
    objectType: typeDef.objectTypeId,
    objectTypeDef: typeDef,
    properties: properties,
    propertyGroups: groupsWithSortedProperties,
    onClose: closeModal,
    onUpdateColumns: handleColumnsChanged
  });
};

export default EditColumnsModalContainer;