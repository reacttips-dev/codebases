'use es6';

import { LOADING } from 'crm_data/constants/LoadingStatus';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import { getPropertyLabel } from 'customer-data-property-utils/PropertyDisplay';
import PropertyGroupsStore from 'crm_data/properties/PropertyGroupsStore';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import PropTypes from 'prop-types';
export var join = function join(groups, properties) {
  return groups.map(function (group) {
    return group.update('properties', function (names) {
      return names.map(function (name) {
        return properties.get(name);
      }).sortBy(getPropertyLabel);
    });
  });
};
var propertyGroupsDep = {
  propTypes: {
    objectType: PropTypes.oneOfType([ObjectTypeIdType, ObjectTypesType])
  },
  stores: [PropertiesStore, PropertyGroupsStore, IsUngatedStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType;
    var properties = PropertiesStore.get(objectType);
    var propertyGroups = PropertyGroupsStore.get(objectType);

    if (!properties || !propertyGroups) {
      return LOADING;
    }

    return join(propertyGroups, properties).sortBy(function (group) {
      return group.get('displayOrder');
    });
  }
};
export default propertyGroupsDep;