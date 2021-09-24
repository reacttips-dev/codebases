import { ApolloLink, Observable } from '@apollo/client';
import { print } from 'graphql/language/printer';
import promiseClient from 'hub-http/adapters/promiseClient';
import { getGqlEarlyRequest } from './quickFetch';
import enviro from 'enviro';
var earlyRequestLink = new ApolloLink(function (operation, forward) {
  var earlyRequest = getGqlEarlyRequest(operation);

  if (earlyRequest) {
    operation.setContext({
      earlyRequest: earlyRequest
    });
  }

  return forward(operation);
});

var toRequestPayload = function toRequestPayload(operation, experimentalPersistedQueries) {
  var operationName = operation.operationName,
      variables = operation.variables,
      query = operation.query;
  var executionInput = {
    operationName: operationName,
    variables: variables
  };

  if (experimentalPersistedQueries && enviro.deployed()) {
    executionInput.id = query.id;
  } else {
    executionInput.query = print(query);
  }

  return executionInput;
};

var createHubHttpLinkForClientHelper = function createHubHttpLinkForClientHelper(client, uri, experimentalPersistedQueries) {
  var httpLink = new ApolloLink(function (operation) {
    var _ref = operation.getContext(),
        hubHttpOptions = _ref.hubHttpOptions,
        earlyRequest = _ref.earlyRequest;

    var chosenURI = typeof uri === 'function' ? uri(operation) : uri;
    return new Observable(function (observer) {
      var currentXhr;

      var makeRequest = function makeRequest() {
        return client.post(chosenURI, Object.assign({}, hubHttpOptions, {
          withXhr: function withXhr(xhr) {
            currentXhr = xhr;
          },
          data: toRequestPayload(operation, experimentalPersistedQueries)
        }));
      };

      var request = earlyRequest ? earlyRequest.catch(makeRequest) : makeRequest();
      request.then(function (data) {
        observer.next(data);
        observer.complete();
      }).catch(function (err) {
        if (err.errorCode === 'ABORT') {
          return;
        }

        observer.error(err);
      });
      return function () {
        if (currentXhr && currentXhr.readyState !== 4) {
          currentXhr.abort();
        }
      };
    });
  });
  return httpLink;
};

export var createHubHttpLinkForClient = function createHubHttpLinkForClient(client) {
  return function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$uri = _ref2.uri,
        uri = _ref2$uri === void 0 ? '' : _ref2$uri,
        _ref2$experimentalPer = _ref2.experimentalPersistedQueries,
        experimentalPersistedQueries = _ref2$experimentalPer === void 0 ? false : _ref2$experimentalPer;

    var httpLink = createHubHttpLinkForClientHelper(client, uri, experimentalPersistedQueries);
    return ApolloLink.from([earlyRequestLink, httpLink]);
  };
};
export var createBatchedHubHttpLinkForClient = function createBatchedHubHttpLinkForClient(client) {
  return function () {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$uri = _ref3.uri,
        uri = _ref3$uri === void 0 ? '' : _ref3$uri,
        _ref3$batchInterval = _ref3.batchInterval,
        batchInterval = _ref3$batchInterval === void 0 ? 10 : _ref3$batchInterval,
        _ref3$batchMax = _ref3.batchMax,
        batchMax = _ref3$batchMax === void 0 ? 10 : _ref3$batchMax,
        _ref3$experimentalPer = _ref3.experimentalPersistedQueries,
        experimentalPersistedQueries = _ref3$experimentalPer === void 0 ? false : _ref3$experimentalPer;

    var queue = [];
    var dispatchTimer;

    function dispatchQueue() {
      var batch = queue;
      queue = [];
      client.post(uri, {
        data: batch.map(function (_ref4) {
          var operation = _ref4.operation;
          return toRequestPayload(operation, experimentalPersistedQueries);
        })
      }).then(function (data) {
        batch.forEach(function (_ref5, i) {
          var observer = _ref5.observer;
          observer.next(data[i]);
          observer.complete();
        });
      }).catch(function (err) {
        batch.forEach(function (_ref6) {
          var observer = _ref6.observer;
          observer.error(err);
        });
      });
    }

    var batchedHttpLink = new ApolloLink(function (operation) {
      return new Observable(function (observer) {
        queue.push({
          operation: operation,
          observer: observer
        });

        if (queue.length === batchMax) {
          clearTimeout(dispatchTimer);
          dispatchQueue();
        } else if (queue.length === 1) {
          dispatchTimer = setTimeout(function () {
            dispatchQueue();
          }, batchInterval);
        } // notice there is no cleanup function so requests won't be aborted when query is unwatched.

      });
    });
    var httpLink = createHubHttpLinkForClientHelper(client, uri, experimentalPersistedQueries);
    return ApolloLink.from([earlyRequestLink, ApolloLink.split(function (operation) {
      var context = operation.getContext(); // There are some scenarios where we want to fallback to not batching. We could
      // maintain separate queues like the official Apollo batching link but seems overkill.

      return typeof uri === 'string' && !context.noBatch && !context.hubHttpOptions && !context.earlyRequest;
    }, batchedHttpLink, httpLink)]);
  };
};
export var createHubHttpLink = function createHubHttpLink(clientStack) {
  return (// @ts-expect-error promiseClient() is untyped
    createHubHttpLinkForClient(promiseClient(clientStack))
  );
};
export var createBatchedHubHttpLink = function createBatchedHubHttpLink(clientStack) {
  return (// @ts-expect-error promiseClient() is untyped
    createBatchedHubHttpLinkForClient(promiseClient(clientStack))
  );
};