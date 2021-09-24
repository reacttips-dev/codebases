'use es6';

import { useMemo } from 'react';
import { useProperties } from '../../properties/hooks/useProperties';
import { usePropertyGroups } from './usePropertyGroups';
export var usePropertyGroupsWithProperties = function usePropertyGroupsWithProperties() {
  var groups = usePropertyGroups();
  var properties = useProperties();
  return useMemo(function () {
    var groupedProperties = properties.groupBy(function (field) {
      return field.groupName;
    });
    return groups.map(function (group, groupName) {
      return group.update('properties', function (props) {
        return (groupedProperties.get(groupName) || props).toList();
      });
    });
  }, [groups, properties]);
};