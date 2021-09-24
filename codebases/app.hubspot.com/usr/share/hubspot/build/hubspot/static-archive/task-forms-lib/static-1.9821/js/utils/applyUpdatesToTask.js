'use es6';

import { Map as ImmutableMap } from 'immutable';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
export default function applyUpdatesToTask(task, updates) {
  var taskWithAssociations = task.update('associations', ImmutableMap(), function (associations) {
    return associations.merge(updates.get('associations'));
  });
  return updates.delete('associations').reduce(function (mutatingTask, value, field) {
    return mutatingTask.updateIn(['properties', field], PropertyValueRecord({
      name: field
    }), function (propertyValue) {
      return propertyValue.set('value', value);
    });
  }, taskWithAssociations);
}