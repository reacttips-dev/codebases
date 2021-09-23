'use es6';

import get from 'transmute/get';
import { useScopes } from '../../auth/hooks/useScopes';
import { useProperties } from '../../properties/hooks/useProperties';
import { isVisibleGridProperty } from 'crm_data/properties/GridProperties';
import { useSupportedAssociationsForCurrentType } from '../../associations/hooks/useSupportedAssociationsForCurrentType';
import { AssociationColumnRegex, parseAssociationIdFromColumnName } from '../../associations/utils/associationIdUtils';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
import withGateOverride from 'crm_data/gates/withGateOverride';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import memoizeOne from 'react-utils/memoizeOne';
export var generateIsVisibleGridColumnName = memoizeOne(function (objectTypeId, properties, associationDefinitions, hasAllGates, scopes) {
  return function (propertyName) {
    // HACK: Contacts have a 'name' column that is not a real or magic property
    if (objectTypeId === CONTACT_TYPE_ID && propertyName === 'name') {
      return true;
    }

    var isAssociationColumn = AssociationColumnRegex.test(propertyName);

    if (isAssociationColumn) {
      var associationId = parseAssociationIdFromColumnName(propertyName);
      return withGateOverride('CRM:Datasets:NewAssociations', hasAllGates('CRM:Datasets:NewAssociations')) ? Boolean(associationDefinitions[associationId]) : false;
    }

    var property = get(propertyName, properties);

    if (!property) {
      return false;
    }

    return isVisibleGridProperty(scopes, property);
  };
});
export var useIsVisibleGridColumnName = function useIsVisibleGridColumnName() {
  var objectTypeId = useSelectedObjectTypeId();
  var properties = useProperties();
  var associationDefinitions = useSupportedAssociationsForCurrentType();
  var hasAllGates = useHasAllGates();
  var scopes = useScopes();
  return generateIsVisibleGridColumnName(objectTypeId, properties, associationDefinitions, hasAllGates, scopes);
};