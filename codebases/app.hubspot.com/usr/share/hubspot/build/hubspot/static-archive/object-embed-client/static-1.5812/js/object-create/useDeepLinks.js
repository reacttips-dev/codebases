'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { parse } from 'hub-http/helpers/params';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

var useDeepLinks = function useDeepLinks() {
  var _useLocation = useLocation(),
      search = _useLocation.search;

  var queryParams = useMemo(function () {
    return parse(search.substring(1));
  }, [search]);

  var createNewObject = queryParams.createNewObject,
      defaultPropertiesFromUrl = _objectWithoutProperties(queryParams, ["createNewObject"]);

  var showOnMount = !!createNewObject;
  var objectType = createNewObject;
  return [showOnMount, objectType, defaultPropertiesFromUrl];
};

export default useDeepLinks;