// @flow
import { ApolloLink, Observable } from 'apollo-link';
import { parseAndCheckHttpResponse } from 'apollo-link-http-common';

import { type FetchOptions, type Operation } from 'apollo-link-http';

import naptimeFetch from './naptimeFetch';

const createNaptimeLink = (linkOptions: FetchOptions) => {
  return new ApolloLink((operation: Operation) => {
    return new Observable(observer => {
      naptimeFetch(operation)
        .then(parseAndCheckHttpResponse(operation))
        .then(result => {
          // we have data and can send it to back up the link chain
          observer.next(result);
          observer.complete();
          return result;
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          if (err.result && err.result.errors && err.result.data) {
            observer.next(err.result);
          }
          observer.error(err);
        });
    });
  });
};

export default createNaptimeLink;
