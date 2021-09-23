'use es6';

import { setFrom } from 'crm_data/settings/LocalSettings';
import { setLastAccessedPage } from '../../../crm_ui/grid/utils/gridStateLocalStorage';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useCurrentViewId } from '../../views/hooks/useCurrentViewId';
import { changePageAction, changePageSizeAction } from '../actions/paginationActions';
export var usePaginationActions = function usePaginationActions() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var viewId = useCurrentViewId();
  var onPageChange = useCallback(function (page) {
    dispatch(changePageAction(page)); // TODO: When fully moved over to IKEA, we can just store the current page

    setLastAccessedPage({
      objectType: objectTypeId,
      value: {
        objectType: objectTypeId,
        viewId: viewId,
        currentPage: page
      }
    });
  }, [dispatch, objectTypeId, viewId]);
  var onPageSizeChange = useCallback(function (pageSize) {
    dispatch(changePageSizeAction(pageSize));
    setFrom(localStorage, 'gridPageSize', pageSize);
  }, [dispatch]);
  return {
    onPageChange: onPageChange,
    onPageSizeChange: onPageSizeChange
  };
};