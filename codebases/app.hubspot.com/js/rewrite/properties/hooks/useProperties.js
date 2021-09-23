'use es6';

import PropertiesStore from 'crm_data/properties/PropertiesStore';
import { useStoreDependency } from 'general-store';
import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { getProperties } from '../selectors/propertiesSelectors';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { Map as ImmutableMap } from 'immutable';
import { getMagicPropertiesForObjectType } from '../utils/getMagicPropertiesForObjectType';
import memoizeLast from 'transmute/memoizeLast';
export var propertiesDependency = {
  propTypes: {
    objectType: ObjectTypesType.isRequired
  },
  stores: [PropertiesStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType;
    return PropertiesStore.get(objectType);
  }
}; // HACK: We need to convert to a Map of PropertyRecords for compatibility with legacy UI code.

export var legacyFormatAdapter = memoizeLast(function (magicProperties, properties) {
  return ImmutableMap(Object.assign({}, magicProperties, {}, properties)).map(PropertyRecord.fromJS);
});
export var useProperties = function useProperties() {
  var isRewriteEnabled = useIsRewriteEnabled();
  var objectTypeId = useSelectedObjectTypeId();

  if (isRewriteEnabled) {
    var magicProperties = getMagicPropertiesForObjectType(objectTypeId); // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks

    var properties = useSelector(getProperties);
    return legacyFormatAdapter(magicProperties, properties);
  }

  var objectType = ObjectTypeFromIds[objectTypeId] || objectTypeId; // eslint-disable-next-line react-hooks/rules-of-hooks

  return useStoreDependency(propertiesDependency, {
    objectType: objectType
  });
};