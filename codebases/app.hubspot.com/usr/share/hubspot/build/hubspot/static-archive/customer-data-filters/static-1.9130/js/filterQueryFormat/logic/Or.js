'use es6';

import { List } from 'immutable';
import { addCondition, isLogicGroup, makeLogicGroup } from './LogicGroup';
import And from './And';
var Or = makeLogicGroup('Or', List());

Or.insertAtPosition = function (index, condition, group) {
  var filterFamily = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : group.get('filterFamily');
  return group.update('conditions', function (conditions) {
    var logicGroup = isLogicGroup(condition) ? condition : And.of(condition).set('filterFamily', filterFamily);

    if (group.filterFamily !== filterFamily) {
      logicGroup = And.of(logicGroup).set('filterFamily', group.filterFamily);
    }

    return conditions.insert(index, logicGroup);
  });
};

addCondition.implement(Or, function (condition, group, filterFamily) {
  return Or.insertAtPosition(group.conditions.size, condition, group, filterFamily);
});
export default Or;