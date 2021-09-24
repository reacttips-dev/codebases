import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import quickFetch from 'quick-fetch';
import { stableStringify } from './internal/stableStringify';

var makeGqlEarlyRequest = function makeGqlEarlyRequest(options) {
  var operation = options.operation,
      rest = _objectWithoutProperties(options, ["operation"]);

  var requestName = stableStringify({
    operationName: operation.operationName,
    variables: operation.variables || {}
  });
  quickFetch.makeEarlyRequest(requestName, Object.assign({}, rest, {
    type: 'POST',
    data: JSON.stringify(operation),
    dataType: 'json',
    contentType: 'application/json'
  }));
};

var getGqlEarlyRequest = function getGqlEarlyRequest(_ref) {
  var operationName = _ref.operationName,
      variables = _ref.variables;
  var requestName = stableStringify({
    operationName: operationName,
    variables: variables || {}
  });
  var requestState = quickFetch.getRequestStateByName(requestName);

  if (requestState && !requestState.error) {
    return new Promise(function (resolve, reject) {
      requestState.whenFinished(function (response) {
        quickFetch.removeEarlyRequest(requestName);
        resolve(response);
      });
      requestState.onError(function (_, errorMessage) {
        quickFetch.removeEarlyRequest(requestName);
        reject(errorMessage);
      });
    });
  }

  return null;
};

export { getGqlEarlyRequest, makeGqlEarlyRequest };