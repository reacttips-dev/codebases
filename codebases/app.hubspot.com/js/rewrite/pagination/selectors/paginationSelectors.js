'use es6';

import { createFrozenSelector } from '../../utils/createFrozenSelector';

var getPaginationSlice = function getPaginationSlice(state) {
  return state.pagination;
};

export var getPage = createFrozenSelector([getPaginationSlice], function (slice) {
  return slice.page;
});
export var getPageSize = createFrozenSelector([getPaginationSlice], function (slice) {
  return slice.pageSize;
});