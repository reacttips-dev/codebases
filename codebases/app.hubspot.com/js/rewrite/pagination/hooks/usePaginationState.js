'use es6';

import { useSelector } from 'react-redux';
import { getPage, getPageSize } from '../selectors/paginationSelectors';
export var usePaginationState = function usePaginationState() {
  var page = useSelector(getPage);
  var pageSize = useSelector(getPageSize);
  return {
    page: page,
    pageSize: pageSize
  };
};