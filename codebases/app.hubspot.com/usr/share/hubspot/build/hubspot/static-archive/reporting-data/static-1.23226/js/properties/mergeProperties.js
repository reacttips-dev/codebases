'use es6';

import { fromJS, Set as ImmutableSet } from 'immutable';
export var updateExistingProperties = function updateExistingProperties(existingGroups, propertiesToUpdateOrAdd) {
  var propertiesToUpdateOrAddKeys = ImmutableSet(Object.keys(propertiesToUpdateOrAdd));
  var mergedGroups = existingGroups.map(function (existingGroup) {
    return existingGroup.update('properties', function (properties) {
      return properties.map(function (property) {
        if (propertiesToUpdateOrAdd.hasOwnProperty(property.get('name'))) {
          propertiesToUpdateOrAddKeys = propertiesToUpdateOrAddKeys.remove(property.get('name'));
          return property.merge(propertiesToUpdateOrAdd[property.get('name')]);
        }

        return property;
      });
    });
  });
  return {
    mergedGroups: mergedGroups,
    propertiesToAdd: propertiesToUpdateOrAddKeys.map(function (key) {
      return propertiesToUpdateOrAdd[key];
    })
  };
}; //Add any remaining to-be-merged properties to the fallback group.
//This code assumes that the fallbackgroup already exists

export var addNewPropertiesToFallbackGroup = function addNewPropertiesToFallbackGroup(mergedGroups, fallbackGroupName, propertiesToAdd) {
  var fallbackMergedGroupIndex = mergedGroups.findIndex(function (g) {
    return g.get('name') === fallbackGroupName;
  });
  var fallbackMergedGroup = mergedGroups.get(fallbackMergedGroupIndex);

  if (fallbackMergedGroup) {
    return mergedGroups.update(fallbackMergedGroupIndex, function (g) {
      return g.update('properties', function (existingProps) {
        return existingProps.concat(propertiesToAdd.map(function (prop) {
          return fromJS(prop);
        }));
      });
    });
  }

  return mergedGroups;
};
/**
 * This updates properties within all property group.
 * For properties that already exist within some group, their value will be updated.
 * For properties that do _not_ already exist in _any_ group:
 *    if fallbackGroupName is an existing group, the brand-new properties will
 *       be added to it
 *    if it is not an existing group, the brand-new properties will not be added
 *       anywhere
 *
 * @param {*} existingGroups the original property groups we're updating
 * @param {*} fallbackGroupName the group that we will put any _new_ properties
 * into if they do not already exist in another group
 * @param {*} propertiesToUpdateOrAdd the new property values we are merging
 * into the existing property groups
 */

export var mergeProperties = function mergeProperties(existingGroups, fallbackGroupName, propertiesToUpdateOrAdd) {
  var _updateExistingProper = updateExistingProperties(existingGroups, propertiesToUpdateOrAdd),
      mergedGroups = _updateExistingProper.mergedGroups,
      propertiesToAdd = _updateExistingProper.propertiesToAdd;

  return addNewPropertiesToFallbackGroup(mergedGroups, fallbackGroupName, propertiesToAdd);
};