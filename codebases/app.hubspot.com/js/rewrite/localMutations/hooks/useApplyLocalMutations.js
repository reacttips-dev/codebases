'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLocallyDeletedObjectIdsForCurrentType, getLocallyUpdatedObjectsForCurrentType, getLocallyUpdatedFilterQueryMutationsForCurrentType } from '../../localMutations/selectors/localCrmObjectMutationsSelectors';
import { getLocallyCreatedObjectsForCurrentType } from '../../crmObjects/selectors/crmObjectsSelectors';
import produce from 'immer';
import { objectEntries } from '../../objectUtils/objectEntries';
import { mutableSetIn } from '../../objectUtils/mutableSetIn';
import get from 'transmute/get';
import has from 'transmute/has';
var mergeUpdatesIntoCrmObject = produce(function (draft, propertyUpdates) {
  objectEntries(propertyUpdates).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        propertyName = _ref2[0],
        value = _ref2[1];

    return mutableSetIn(['properties', propertyName, 'value'], value, draft);
  });
});
/**
 * This hook consumes a 'data' object from CrmSearch and performs three major operations on it:
 *
 * 1. It filters out any objects that have been deleted.
 * 2. It prepends any objects that have been created, regardless of whether or not they match the current query.
 * 3. It updates property values of any objects that have been mutated (via the sidebar, bulk edit modal, etc).
 *
 * On the board, we do not want to add created objects (instead they should be reconciled into the correct stage)
 * so you can disable that behavior with the "addCreates" option.
 *
 * @param {Object} data - The CrmSearch response.
 * @param {boolean} options.addCreates - Default true. Set to false to omit locally cached creates from the results.
 *
 * @returns {Object} - The same format as the data parameter.
 */

export var useApplyLocalMutations = function useApplyLocalMutations(data) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$addCreates = _ref3.addCreates,
      addCreates = _ref3$addCreates === void 0 ? true : _ref3$addCreates;

  var doesDataExist = Boolean(data);
  var results = get('results', data) || [];
  var objectIdsInResults = useMemo(function () {
    return new window.Set(results.map(function (_ref4) {
      var objectId = _ref4.objectId;
      return objectId;
    }));
  }, [results]);
  var locallyCreatedObjects = useSelector(getLocallyCreatedObjectsForCurrentType);
  var locallyDeletedObjectIds = useSelector(getLocallyDeletedObjectIdsForCurrentType);
  var localObjectPropertyUpdates = useSelector(getLocallyUpdatedObjectsForCurrentType);
  var localFilterQueryMutations = useSelector(getLocallyUpdatedFilterQueryMutationsForCurrentType); // NOTE: On the board, we do not want to add created objects

  var baseResults = useMemo(function () {
    if (!addCreates) {
      return results;
    }

    return locallyCreatedObjects //
    // Filter out newly created objects that are in the search response
    .filter(function (_ref5) {
      var objectId = _ref5.objectId;
      return !objectIdsInResults.has(objectId);
    }) //
    // Append the objects in the response to our list of created objects
    .concat(results);
  }, [addCreates, locallyCreatedObjects, objectIdsInResults, results]);
  var resultsWithLocalChanges = useMemo(function () {
    return baseResults //
    // Filter out deleted objects from the merged list
    .filter(function (_ref6) {
      var objectId = _ref6.objectId;
      return !locallyDeletedObjectIds.includes(objectId);
    }) //
    // Apply any property updates we have cached locally to objects in the list
    .map(function (object) {
      var objectId = object.objectId;
      var newObject = object; // in order to properly apply mutations in order, we apply mutations by filter first and objects second;
      // the batch mutations action also applies selected object mutations at the same time

      if (has('propertyUpdates', localFilterQueryMutations)) {
        newObject = mergeUpdatesIntoCrmObject(newObject, get('propertyUpdates', localFilterQueryMutations));
      }

      if (has(objectId, localObjectPropertyUpdates)) {
        newObject = mergeUpdatesIntoCrmObject(newObject, get(objectId, localObjectPropertyUpdates));
      }

      return newObject;
    });
  }, [baseResults, localFilterQueryMutations, localObjectPropertyUpdates, locallyDeletedObjectIds]);
  return useMemo(function () {
    // If we were given data to start with, we know it is safe to return our
    // enhanced data.
    if (doesDataExist) {
      return Object.assign({}, data, {
        results: resultsWithLocalChanges
      });
    } // Otherwise our enhancements did nothing, so we should just return undefined


    return undefined;
  }, [data, doesDataExist, resultsWithLocalChanges]);
};