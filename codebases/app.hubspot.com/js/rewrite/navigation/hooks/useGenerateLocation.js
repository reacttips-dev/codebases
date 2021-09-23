'use es6';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useQueryParams } from '../../../router/useQueryParams';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getCurrentViewId, getCurrentPageType } from '../../views/selectors/viewsSelectors';
import { stringify } from 'hub-http/helpers/params';
export var useGenerateLocation = function useGenerateLocation() {
  var params = useQueryParams();
  var currentObjectTypeId = useSelectedObjectTypeId();
  var currentViewId = useSelector(getCurrentViewId);
  var currentPageType = useSelector(getCurrentPageType);
  return useCallback(function (_ref) {
    var _ref$objectTypeId = _ref.objectTypeId,
        objectTypeId = _ref$objectTypeId === void 0 ? currentObjectTypeId : _ref$objectTypeId,
        _ref$viewId = _ref.viewId,
        viewId = _ref$viewId === void 0 ? currentViewId : _ref$viewId,
        _ref$pageType = _ref.pageType,
        pageType = _ref$pageType === void 0 ? currentPageType : _ref$pageType,
        query = _ref.query;
    var encodedTypeId = encodeURIComponent(objectTypeId);
    var encodedViewId = encodeURIComponent(viewId);
    var encodedPageType = encodeURIComponent(pageType);
    var pageTypePath = pageType ? encodedPageType : '';
    var viewPath = viewId ? "views/" + encodedViewId + "/" + pageTypePath : '';
    return {
      pathname: "/objects/" + encodedTypeId + "/" + viewPath,
      search: stringify(Object.assign({}, params, {}, query))
    };
  }, [currentObjectTypeId, currentViewId, currentPageType, params]);
};