'use es6';

import { List } from 'immutable';
import { addCondition, findConditionKeyPath, getConditionKey, makeLogicGroup, removeKeyPath } from './LogicGroup';
import reduce from 'transmute/reduce';
var Constraint = makeLogicGroup('Constraint');
addCondition.implement(Constraint, function (condition, group, filterFamily) {
  var conditionKey = getConditionKey(condition, group, filterFamily);
  return group.setIn(['conditions', conditionKey], condition);
});

Constraint.applyToGroup = function (constraint) {
  return function (group) {
    return constraint && group ? addCondition(constraint.conditions.first(), group) : group;
  };
};

Constraint.removeFromGroup = function (constraint) {
  return function (group) {
    if (!(constraint && group)) return group;
    return reduce(group, function (nextGroup, condition) {
      var path = findConditionKeyPath(condition, group);
      return removeKeyPath(List.of(path), nextGroup);
    }, constraint.conditions);
  };
};

export default Constraint;