'use es6';

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useGenerateLocation } from './useGenerateLocation';
export var useNavigate = function useNavigate() {
  var history = useHistory();
  var generateLocation = useGenerateLocation();
  return useCallback(function (_ref) {
    var objectTypeId = _ref.objectTypeId,
        viewId = _ref.viewId,
        pageType = _ref.pageType,
        query = _ref.query;
    return history.push(generateLocation({
      objectTypeId: objectTypeId,
      viewId: viewId,
      pageType: pageType,
      query: query
    }));
  }, [history, generateLocation]);
};