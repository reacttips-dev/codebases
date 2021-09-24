'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useMemo, useState, useEffect } from 'react';
import { useViews } from '../hooks/useViews';
import { useHasCreateViewBERedesignGate } from '../hooks/useHasCreateViewBERedesignGate';
import { useViewActions } from '../hooks/useViewActions';
import set from 'transmute/set';
import has from 'transmute/has';

var cleanName = function cleanName(name) {
  return name.trim().toLowerCase();
};

export var useValidateViewName = function useValidateViewName(name) {
  var views = useViews(); // TODO: Until default views are moved to the BE, we can't rely solely on the
  // async check for view duplication.

  var existingNames = useMemo(function () {
    return views.map(function (view) {
      return cleanName(view.name);
    }).toSet();
  }, [views]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      duplicates = _useState4[0],
      setDuplicates = _useState4[1];

  var cleanedName = cleanName(name);
  var isEmpty = cleanedName.length === 0;
  var isDuplicate = Boolean(duplicates[cleanedName]) || existingNames.has(cleanedName);
  var hasViewsBERedesignGate = useHasCreateViewBERedesignGate();

  var _useViewActions = useViewActions(),
      checkIfViewExists = _useViewActions.checkIfViewExists;

  useEffect(function () {
    if (hasViewsBERedesignGate && !isEmpty && !has(cleanedName, duplicates)) {
      setIsLoading(true);
      checkIfViewExists(cleanedName, function (isDupe) {
        setDuplicates(function (currentDupes) {
          return set(name, isDupe, currentDupes);
        });
        setIsLoading(false);
      }, function () {
        return setIsLoading(false);
      });
    }
  }, [checkIfViewExists, cleanedName, duplicates, hasViewsBERedesignGate, isEmpty, name]);
  return {
    isLoading: isLoading,
    isEmpty: isEmpty,
    isDuplicate: isDuplicate
  };
};