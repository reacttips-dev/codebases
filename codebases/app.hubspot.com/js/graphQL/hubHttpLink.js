'use es6';

import quickFetch from 'quick-fetch';
import { ApolloLink, Observable } from '@apollo/client';
import { createHubHttpLink } from 'apollo-link-hub-http';
import { createStack } from 'hub-http';
import { defaultTo } from 'hub-http/middlewares/core';
import hubapiStack from 'hub-http/stacks/hubapi';
import { getEarlyRequesterAsPromise } from './getEarlyRequesterAsPromise';
export var earlyRequestLink = new ApolloLink(function (operation, forward) {
  var operationName = operation.operationName,
      variables = operation.variables;
  var requestName = operationName + variables.subjectObjectTypeId + variables.subjectObjectId;
  var earlyGraphQLRequest = quickFetch.getRequestStateByName(requestName);

  if (earlyGraphQLRequest && !earlyGraphQLRequest.error) {
    operation.setContext({
      earlyRequest: getEarlyRequesterAsPromise(requestName)
    });
  }

  return forward(operation);
});
export var errorMonitoringLink = new ApolloLink(function (operation, forward) {
  return new Observable(function (observer) {
    var sub = forward(operation).subscribe({
      next: function next(result) {
        observer.next(result);
      },
      error: function error(err) {
        var operationName = operation.operationName,
            variables = operation.variables;
        var isMutation = operation.query.definitions && operation.query.definitions.some(function (definition) {
          return definition.kind === 'OperationDefinition' && definition.operation === 'mutation';
        });

        if (window.newrelic && window.newrelic.addPageAction) {
          window.newrelic.addPageAction('callingGraphQLError', {
            errorCode: err.errorCode,
            operationName: operationName,
            isMutation: isMutation
          });
        }

        if (err.errorCode === 'TIMEOUT') {
          if (window.newrelic && window.newrelic.addPageAction) {
            window.newrelic.addPageAction('callingGraphQLTimeout', {
              operationName: operationName,
              // only include variables if query is not a mutation.
              // Mutations can contain PII/GDPR-sensitive data
              variables: isMutation ? 'mutation' : JSON.stringify(variables)
            });
          }
        }

        observer.error(err);
      },
      complete: function complete() {
        observer.complete();
      }
    });
    return function () {
      if (sub) sub.unsubscribe();
    };
  });
});
export var apiLink = function apiLink(opts) {
  var apiStack = createStack(defaultTo('timeout', 180000), hubapiStack);
  return ApolloLink.from([earlyRequestLink, errorMonitoringLink, createHubHttpLink(apiStack)(opts)]);
};