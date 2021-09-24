import {ApolloLink} from 'apollo-link';
import debug from 'debug';
const log = debug('gql');

const loggerLink = new ApolloLink(function(operation, forward) {
  return forward(operation).map(function(result) {
    log(`INIT ${operation.operationName}`, operation);
    log(`RESULT ${operation.operationName}`, result);
    return result;
  });
});

export {loggerLink as default};
