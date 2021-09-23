'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useCallback, useState } from 'react';
export default function useEnrollmentSelection() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      selectedAllMatches = _useState2[0],
      setSelectedAllMatches = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedEnrollments = _useState4[0],
      setSelectedEnrollments = _useState4[1];

  var selectAllMatches = function selectAllMatches() {
    return setSelectedAllMatches(true);
  };

  var selectEnrollments = useCallback(function (newSelectedEnrollments) {
    return setSelectedEnrollments([].concat(_toConsumableArray(selectedEnrollments), _toConsumableArray(newSelectedEnrollments)));
  }, [selectedEnrollments]);

  var deselectEnrollments = function deselectEnrollments(newDeselectedEnrollments) {
    setSelectedAllMatches(false);
    setSelectedEnrollments(selectedEnrollments.filter(function (selected) {
      var shouldDeselect = newDeselectedEnrollments.some(function (toDeselect) {
        return toDeselect.objectId === selected.objectId;
      });
      return !shouldDeselect;
    }));
  };

  var deselectAllEnrollments = function deselectAllEnrollments() {
    setSelectedAllMatches(false);
    setSelectedEnrollments([]);
  };

  return {
    selectedEnrollments: selectedEnrollments,
    selectedAllMatches: selectedAllMatches,
    deselectAllEnrollments: deselectAllEnrollments,
    deselectEnrollments: deselectEnrollments,
    selectAllMatches: selectAllMatches,
    selectEnrollments: selectEnrollments
  };
}