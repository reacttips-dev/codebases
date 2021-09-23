'use es6';

import { ReferenceError } from './ReferenceError';
export var ERROR_ID_INVALID = 'Invalid ID';
export var ERROR_OBJECT_NOT_FOUND = 'Object not found';
export var ERROR_FETCH_FAILED = 'Fetch request failed';
export var ERROR_SEARCH_FAILED = 'Search request failed';
export var isError = function isError(reference) {
  return !!reference.type;
};
export var isInvalidIdError = function isInvalidIdError(error) {
  return error.type === ERROR_ID_INVALID;
};
export var toInvalidIdError = function toInvalidIdError(id) {
  return ReferenceError({
    type: ERROR_ID_INVALID,
    error: ERROR_ID_INVALID + ": " + id
  });
};
export var isObjectNotFoundError = function isObjectNotFoundError(error) {
  return error.type === ERROR_OBJECT_NOT_FOUND;
};
export var toObjectNotFoundError = function toObjectNotFoundError(id) {
  return ReferenceError({
    type: ERROR_OBJECT_NOT_FOUND,
    error: ERROR_OBJECT_NOT_FOUND + " for ID: " + id
  });
};
export var isFetchFailedError = function isFetchFailedError(error) {
  return error.type === ERROR_FETCH_FAILED;
};
export var toFetchFailedError = function toFetchFailedError(error) {
  return ReferenceError({
    type: ERROR_FETCH_FAILED,
    error: error
  });
};
export var isSearchFailedError = function isSearchFailedError(error) {
  return error.type === ERROR_SEARCH_FAILED;
};
export var toSearchFailedError = function toSearchFailedError(error) {
  return ReferenceError({
    type: ERROR_SEARCH_FAILED,
    error: error
  });
};