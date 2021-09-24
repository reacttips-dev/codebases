'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import identity from 'transmute/identity';
import Overlay from '../components/Overlay';
import useContentSearch from '../hooks/useContentSearch';
export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      trigger = _ref.trigger,
      _ref$maximumSearch = _ref.maximumSearch,
      maximumSearch = _ref$maximumSearch === void 0 ? 10 : _ref$maximumSearch,
      portalId = _ref.portalId,
      search = _ref.search,
      ResultsComponent = _ref.ResultsComponent,
      _ref$transformData = _ref.transformData,
      transformData = _ref$transformData === void 0 ? identity : _ref$transformData;

  return function (props) {
    var _useContentSearch = useContentSearch(search, transformData, '', 1),
        _useContentSearch2 = _slicedToArray(_useContentSearch, 5),
        data = _useContentSearch2[0],
        __searchQuery = _useContentSearch2[1],
        setSearchQuery = _useContentSearch2[2],
        options = _useContentSearch2[3],
        isLoading = _useContentSearch2[4];

    return /*#__PURE__*/_jsx(Overlay, Object.assign({}, props, {
      data: data,
      setSearchQuery: setSearchQuery,
      options: options,
      isLoading: isLoading,
      trigger: trigger,
      portalId: portalId,
      maximumSearch: maximumSearch,
      ResultsComponent: ResultsComponent
    }));
  };
});