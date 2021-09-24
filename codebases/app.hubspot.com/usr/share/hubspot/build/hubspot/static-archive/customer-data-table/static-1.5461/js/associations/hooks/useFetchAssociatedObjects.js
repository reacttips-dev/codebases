'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useContext, useEffect, useState } from 'react';
import BatchAssociationsContext from '../context/BatchAssociationsContext';
/**
 * Usage:
 *
 * const { data, loading, error } = useFetchAssociatedObjects({
 *   associationDefinition: ContactToCompanyAssociationDefinition,
 *   objectId: 12345
 * })
 *
 * if (loading) {
 *   // render loading state
 *   return <UILoadingSpinner />
 * }
 *
 * if (error) {
 *   // render error state
 *   return renderError(error);
 * }
 *
 * if (data) {
 *   // render data
 * }
 *
 * @param associationDefinition - The association definition to fetch associated
 * objects for
 * @param objectId - The objectId whose associated objects will be fetched
 */

export var useFetchAssociatedObjects = function useFetchAssociatedObjects(_ref) {
  var associationDefinition = _ref.associationDefinition,
      objectId = _ref.objectId;

  var _useState = useState(undefined),
      _useState2 = _slicedToArray(_useState, 2),
      associatedObjects = _useState2[0],
      setAssociatedObjects = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      error = _useState6[0],
      setError = _useState6[1];

  var associationCategory = associationDefinition.associationCategory,
      associationTypeId = associationDefinition.associationTypeId;
  var BatchAssociationsClient = useContext(BatchAssociationsContext);
  useEffect(function () {
    setLoading(true);
    BatchAssociationsClient.fetch({
      associationCategory: associationCategory,
      associationTypeId: associationTypeId,
      objectId: objectId
    }).then(function (response) {
      setLoading(false);
      setAssociatedObjects(response);
    }).catch(function (responseError) {
      setLoading(false);
      setError(responseError);
    });
    return function () {
      setError(false);
      setAssociatedObjects(undefined);
    };
  }, [BatchAssociationsClient, associationCategory, associationDefinition, associationTypeId, objectId]);
  return {
    data: associatedObjects,
    error: error,
    loading: loading
  };
};