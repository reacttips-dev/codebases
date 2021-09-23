'use es6';

import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import { List, OrderedMap, Record, is as defaultIs } from 'immutable';
import { isOperator, isValidOperator } from '../operator/Operator';
import either from 'transmute/either';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import isNull from 'transmute/isNull';
import isRecord from 'transmute/isRecord';
import isString from 'transmute/isString';
import isUndefined from 'transmute/isUndefined';
import protocol from 'transmute/protocol';
export function isLogicGroup(group) {
  return isRecord(group) && (OrderedMap.isOrderedMap(group.conditions) || List.isList(group.conditions));
}
export var addCondition = protocol({
  name: 'addCondition',
  args: [either(isLogicGroup, isOperator), protocol.TYPE, either(isUndefined, isString)]
});
export var getRealPath = function getRealPath(keyPath) {
  return keyPath.flatMap(function (key) {
    return List(['conditions', key]);
  });
};
export function getKeyPath(keyPath, group) {
  return group.getIn(getRealPath(keyPath), group);
}

var getKeyPathPrefix = function getKeyPathPrefix(condition) {
  return getIn(['field', 'name'], condition) + " " + get('name', condition);
};

export var getConditionKey = function getConditionKey(condition, group) {
  var conditionIsLogicGroup = isLogicGroup(condition);
  var conditionFilterFamily = getIn(['filterFamily'], condition);
  var conditionKey = conditionIsLogicGroup ? "" + conditionFilterFamily : [getKeyPathPrefix(condition), getIn(['conditions'], group).size].join(' ');
  return conditionKey;
};
export var findConditionKeyPath = function findConditionKeyPath(condition, group) {
  if (isLogicGroup(condition)) {
    return null;
  }

  var prefix = getKeyPathPrefix(condition);
  return get('conditions', group).keySeq().find(function (key) {
    return key.indexOf(prefix) === 0;
  }) || null;
};
export function addToKeyPath(keyPath, condition, group, filterFamily) {
  return group.updateIn(getRealPath(keyPath), function (subgroup) {
    return addCondition(condition, subgroup, filterFamily);
  });
}

function removeFilter(keyPath, group) {
  if (keyPath.size > 0) {
    var recursed = removeFilter(keyPath.slice(2), group.getIn(keyPath.take(2)));

    if (isNull(recursed)) {
      return group.conditions.size > 1 ? group.removeIn(keyPath.take(2)) : null;
    }

    return group.setIn(keyPath.take(2), recursed);
  }

  return null;
}

export function removeKeyPath(keyPath, group) {
  var realPath = getRealPath(keyPath);
  var recursed = removeFilter(realPath, group);
  return isNull(recursed) ? group.removeIn(realPath.take(2)) : recursed;
}
export function setKeyPath(keyPath, condition, group) {
  return group.setIn(getRealPath(keyPath), condition);
}

function isGroupsOwnPropertiesEqual(groupA, groupB) {
  var groupProperties = ['associationTypeId', 'associationCategory', 'name'];
  return groupProperties.every(function (prop) {
    return groupA.get(prop) === groupB.get(prop);
  });
}

export function is(groupA, groupB) {
  if (!isLogicGroup(groupA) || !isLogicGroup(groupB)) {
    return defaultIs(groupA, groupB);
  }

  if (!isGroupsOwnPropertiesEqual(groupA, groupB)) {
    return false;
  }

  var aConditions = groupA.conditions.valueSeq();
  var bConditions = groupB.conditions.valueSeq();
  return aConditions.every(function (condition, index) {
    return is(condition, bConditions.get(index));
  });
}
export function getLogicGroupConditionsSize(group) {
  return group && group.conditions ? group.conditions.size : undefined;
}
export function makeLogicGroup(name) {
  var conditionsValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : OrderedMap();
  var includeObjectsWithNoAssociatedObjects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // Filter Family can be any DSFilterFamily (A subset of DSAssetFamilies)
  // or (temporarily) ObjectType.
  var recordShape = {
    includeObjectsWithNoAssociatedObjects: includeObjectsWithNoAssociatedObjects,
    conditions: conditionsValue,
    filterFamily: ObjectTypes.CONTACT,
    associationTypeId: undefined,
    associationCategory: undefined,
    name: name
  };
  var Group = Record(recordShape, name);

  Group["is" + name] = function (thing) {
    return thing instanceof Group;
  };

  Group.of = function () {
    for (var _len = arguments.length, conditions = new Array(_len), _key = 0; _key < _len; _key++) {
      conditions[_key] = arguments[_key];
    }

    return conditions.reduce(function (group, condition) {
      return addCondition(condition, group);
    }, Group());
  };

  return Group;
}
export function isLogicGroupValid(group) {
  var conditionsSize = getLogicGroupConditionsSize(group);

  if (!conditionsSize) {
    return false;
  }

  var conditions = group.conditions.valueSeq().toArray();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = conditions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var condition = _step.value;

      if (isOperator(condition) && !isValidOperator(condition)) {
        return false;
      }

      if (isLogicGroup(condition)) {
        return isLogicGroupValid(condition);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
}