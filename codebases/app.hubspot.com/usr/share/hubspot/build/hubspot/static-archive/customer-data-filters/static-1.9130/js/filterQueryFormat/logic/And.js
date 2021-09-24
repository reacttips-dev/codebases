'use es6';

import { OrderedMap } from 'immutable';
import { WistiaIntegrationFamilies } from '../../converters/listSegClassic/ListSegConstants';
import { addCondition, getConditionKey, isLogicGroup, makeLogicGroup } from './LogicGroup';
import getIn from 'transmute/getIn';
var And = makeLogicGroup('And', OrderedMap());

var getAndConditionKey = function getAndConditionKey(condition, group) {
  // HACK: Workaround to allow multiple And groups for the Wistia Integration
  // See: https://git.hubteam.com/HubSpot/customer-data-filters/pull/261
  // DO NOT replicate this pattern without talking to #crm-datasets
  var conditionFilterFamily = getIn(['filterFamily'], condition);

  if (isLogicGroup(condition) && WistiaIntegrationFamilies.includes(conditionFilterFamily)) {
    return [conditionFilterFamily, getIn(['conditions'], group).size].join(' ');
  }

  return getConditionKey(condition, group);
};

addCondition.implement(And, function (condition, group) {
  var filterFamily = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : group.filterFamily;
  var emptyGroup = And.of().set('filterFamily', filterFamily);

  var setInGroup = function setInGroup() {
    var g = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : emptyGroup;
    var conditionKey = getAndConditionKey(condition, g, filterFamily);
    return g.setIn(['conditions', conditionKey], condition);
  };

  return filterFamily === group.filterFamily ? setInGroup(group) : group.updateIn(['conditions', filterFamily], setInGroup);
});
export default And;