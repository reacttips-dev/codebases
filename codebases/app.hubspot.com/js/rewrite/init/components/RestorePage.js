'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import get from 'transmute/get';
import { getLastAccessedPage, getUIState, reconcileWithCache } from '../../../crm_ui/grid/utils/gridStateLocalStorage';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useViews } from '../../views/hooks/useViews';
import { useDoesViewExist } from '../../views/hooks/useDoesViewExist';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import PageLoadingSpinner from './PageLoadingSpinner';
import { restoreCachedValuesAction } from '../actions/initActions';
import { getMostRecentlyUsedPageType } from '../../app/utils/mostRecentlyUsedPageType';

var RestorePage = function RestorePage() {
  var objectTypeId = useSelectedObjectTypeId();
  var views = useViews();
  var uiState = getUIState(objectTypeId);
  var query = get('query', uiState);
  var lastAccessedViewId = get('viewId', uiState);
  var doesViewToRestoreExist = useDoesViewExist(lastAccessedViewId);
  var lastAccessedPage = getLastAccessedPage({
    objectType: objectTypeId,
    viewId: String(lastAccessedViewId)
  });
  var page = get('currentPage', lastAccessedPage) || 0;
  var pageType = getMostRecentlyUsedPageType(objectTypeId);
  var dispatch = useDispatch();
  var navigate = useNavigate();
  useLayoutEffect(function () {
    if (doesViewToRestoreExist) {
      // Apply any cached changes to the corresponding views (filters, sorts, and columns)
      var reconciledViews = views.map(function (view) {
        return reconcileWithCache({
          objectType: objectTypeId,
          viewId: view.id
        }, view);
      }); // This action sets up our state just like the user left it. We intentionally
      // load pageSize in paginationReducer (not here) so that it applies on both routes.

      dispatch(restoreCachedValuesAction({
        objectTypeId: objectTypeId,
        viewId: lastAccessedViewId,
        pageType: pageType,
        searchTerm: query,
        page: page,
        views: reconciledViews,
        hasData: true
      })); // Redirect to the newly restored view since we know it is valid

      navigate({
        viewId: lastAccessedViewId,
        pageType: pageType,
        query: {
          query: query
        }
      });
    } else {
      // We have no state to set up aside from objectTypeId
      dispatch(restoreCachedValuesAction({
        objectTypeId: objectTypeId,
        hasData: false
      })); // Redirect to the non-restore version of the page, relying on the standard
      // route logic to determine the correct viewId.

      navigate({
        objectTypeId: objectTypeId
      });
    }
  }, [dispatch, doesViewToRestoreExist, lastAccessedViewId, navigate, objectTypeId, page, pageType, query, views]);
  return /*#__PURE__*/_jsx(PageLoadingSpinner, {});
};

export default RestorePage;