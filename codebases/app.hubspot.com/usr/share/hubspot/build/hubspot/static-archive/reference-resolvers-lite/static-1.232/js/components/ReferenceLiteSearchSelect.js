'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { OptionType } from 'UIComponents/types/OptionTypes';
import { referenceToOption } from '../utils/referenceToOption';
import { useCallback, useEffect, useRef, useState } from 'react';
import defaultFilterOptions from './internal/defaultFilterOptions';
import PropTypes from 'prop-types';
import memoizeOne from 'react-utils/memoizeOne';
import UISelect from 'UIComponents/input/UISelect';
import debounce from 'react-utils/debounce';

function getUniqueOptions(options) {
  var hasValue = {};
  return options.filter(function (_ref) {
    var value = _ref.value;

    if (hasValue[value]) {
      return false;
    }

    hasValue[value] = true;
    return true;
  });
}

var getMissingIds = memoizeOne(function (value, options) {
  if (value === undefined || value === null) {
    return [];
  }

  var valueArray = Array.isArray(value) ? value : [value];
  return valueArray.filter(function (valueElement) {
    return !options.find(function (option) {
      return option.id === valueElement;
    });
  });
});

var isFulfilledPromise = function isFulfilledPromise(promise) {
  return promise.status === 'fulfilled';
};

var getFulfilledPromiseValue = function getFulfilledPromiseValue(promise) {
  return promise.value;
};

var ReferenceLiteSearchSelect = function ReferenceLiteSearchSelect(_ref2) {
  var options = _ref2.options,
      resolver = _ref2.resolver,
      searchCount = _ref2.searchCount,
      value = _ref2.value,
      rest = _objectWithoutProperties(_ref2, ["options", "resolver", "searchCount", "value"]);

  var searchOptionsCache = useRef([]);

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      valueOptions = _useState2[0],
      setValueOptions = _useState2[1];

  useEffect(function () {
    var allOptions = options.concat(searchOptionsCache.current);
    var missingIds = getMissingIds(value, allOptions);
    var fetchPromises = missingIds.map(function (missingId) {
      return resolver.api.byId(missingId);
    });
    Promise.allSettled(fetchPromises).then(function (settledPromises) {
      var validValues = settledPromises.filter(isFulfilledPromise).map(getFulfilledPromiseValue);
      setValueOptions(validValues.map(referenceToOption));
    });
  }, [options, value, resolver]);
  var handleLoadMore = useCallback(debounce(function (query, callback) {
    var pagination = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      offset: 0
    };
    var offset = pagination.offset;
    var searchQuery = {
      count: searchCount,
      offset: offset,
      query: query
    }; // Reset the search option cache if the pagination reset

    if (offset === 0) {
      searchOptionsCache.current = [];
    }

    resolver.api.search(searchQuery).then(function (_ref3) {
      var hasMore = _ref3.hasMore,
          newOffset = _ref3.offset,
          references = _ref3.references,
          total = _ref3.total;
      searchOptionsCache.current = searchOptionsCache.current.concat(references.map(referenceToOption));
      var allOptions = getUniqueOptions(options.concat(searchOptionsCache.current));
      callback(null, {
        options: allOptions,
        pagination: {
          hasMore: hasMore,
          length: total,
          offset: newOffset
        }
      });
    });
  }, 500), [searchCount, resolver]);
  return /*#__PURE__*/_jsx(UISelect, Object.assign({}, rest, {
    anchorType: "button",
    cache: null,
    loadOptions: handleLoadMore,
    options: valueOptions,
    value: value
  }));
};

ReferenceLiteSearchSelect.propTypes = {
  autoload: PropTypes.bool.isRequired,
  filterOptions: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(OptionType.isRequired),
  resolver: PropTypes.object.isRequired,
  searchCount: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)])
};
ReferenceLiteSearchSelect.defaultProps = {
  autoload: true,
  filterOptions: defaultFilterOptions,
  options: [],
  searchCount: 25
};
export default ReferenceLiteSearchSelect;