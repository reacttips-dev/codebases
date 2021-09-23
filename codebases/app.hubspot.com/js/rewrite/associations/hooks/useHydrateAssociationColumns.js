'use es6';

import { Map as ImmutableMap } from 'immutable';
import { isAssociationColumn, parseAssociationIdFromColumnName } from '../utils/associationIdUtils';
import { useMemo } from 'react';
import { getAssociationColumnLabel } from '../utils/getAssociationColumnLabel';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import { useSupportedAssociationsForCurrentType } from './useSupportedAssociationsForCurrentType';
import get from 'transmute/get';
import withGateOverride from 'crm_data/gates/withGateOverride';
/**
 * This hook is used to hydrate columns that represent associations. They
 * look like regular property columns to the view but we have to add some extra
 * data here to make sure the table has what it needs to render them.
 *
 * This mainly consists of providing the association defintion for the column
 * along with the associated object definition so the table knows how to get
 * the associated object and then how to render them.
 *
 * We also tack on a translated label so the table doesn't have to worry about
 * figuring out the name of the association along with the name and order which
 * must be persisted from the view column in order for things like drag and drop
 * to work.
 */

export var useHydrateAssociationColumns = function useHydrateAssociationColumns(columns) {
  var associations = useSupportedAssociationsForCurrentType();
  var hasAllGates = useHasAllGates();
  var isFlexibleAssociationsUngated = withGateOverride('flexible-associations', hasAllGates('flexible-associations'));
  return useMemo(function () {
    return columns.map(function (column) {
      if (!isAssociationColumn(column)) {
        return column;
      }

      var columnName = get('name', column);
      var columnOrder = get('order', column);
      var associationId = parseAssociationIdFromColumnName(columnName);
      var associationDefinition = get(associationId, associations);
      var columnLabel = getAssociationColumnLabel(associationDefinition, isFlexibleAssociationsUngated);
      return ImmutableMap({
        associationDefinition: associationDefinition,
        label: columnLabel,
        name: columnName,
        order: columnOrder
      });
    });
  }, [associations, columns, isFlexibleAssociationsUngated]);
};