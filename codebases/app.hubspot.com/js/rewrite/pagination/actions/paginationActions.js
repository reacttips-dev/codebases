'use es6';

import { PAGE_CHANGED, PAGE_SIZE_CHANGED } from './paginationActionTypes';
export var changePageAction = function changePageAction(page) {
  return {
    type: PAGE_CHANGED,
    payload: {
      page: page
    }
  };
};
export var changePageSizeAction = function changePageSizeAction(pageSize) {
  return {
    type: PAGE_SIZE_CHANGED,
    payload: {
      pageSize: pageSize
    }
  };
};