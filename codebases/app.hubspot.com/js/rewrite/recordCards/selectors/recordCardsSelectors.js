'use es6';

import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { createFrozenSelector } from '../../utils/createFrozenSelector';

var getRecordCardsSlice = function getRecordCardsSlice(state) {
  return state.recordCards;
};

export var getRecordCardsStatuses = createFrozenSelector([getRecordCardsSlice], function (slice) {
  return slice.status;
});
export var getRecordCardsStatusesForCurrentType = createFrozenSelector([getRecordCardsStatuses, getCurrentObjectTypeId], function (statuses, objectTypeId) {
  return statuses[objectTypeId];
});
export var getRecordCardsData = createFrozenSelector([getRecordCardsSlice], function (slice) {
  return slice.data;
});
export var getRecordCardsDataForCurrentType = createFrozenSelector([getRecordCardsData, getCurrentObjectTypeId], function (data, objectTypeId) {
  return data[objectTypeId];
});