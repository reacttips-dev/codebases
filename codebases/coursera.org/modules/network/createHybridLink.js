/* @flow */
import { type Operation, type FetchOptions, createHttpLink } from 'apollo-link-http';
import { selectURI } from 'apollo-link-http-common';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import createNaptimeLink from './createNaptimeLink';


type HybridLinkOptions = {
  singleOptions: FetchOptions,
  batchOptions: FetchOptions,
};

const batchKey = (operation: Operation) => {
  const context:any = operation.getContext();

  const contextConfig = {
    http: context.http,
    credentials: context.credentials,
    headers: context.headers,
  };
  // may throw error if config not serializable
  return selectURI(operation, context.uri) + JSON.stringify(contextConfig);
};

// This "hybrid" network link contains both a batching and non-batching link.
// The batching link is enabled by default.
// Passing the `__disableBatch` variable to any particular query will re-route the query to the non-batching link.
// Documents with the naptime tag will only use naptimeLink(REST endpoint).
export class HTTPHybridLink extends ApolloLink{
  constructor(opts: HybridLinkOptions) {
    super();
    this.httpLink = createHttpLink(opts.singleOptions);
    this.naptimeLink = createNaptimeLink(opts.singleOptions);
    if (opts.batchOptions) {
      this.batchedLink = new BatchHttpLink({ ...opts.batchOptions, batchKey });
    }
  }
  request(operation: Operation, forward?: ApolloLink){
    if (operation.query.fallbackToNaptime) {
      return this.naptimeLink.request(operation, forward);
    } else if (
      !this.batchedLink ||
      // $FlowFixMe custom property __disableBatch
      (operation.variables && operation.variables.__disableBatch)
    ) {
      return this.httpLink.request(operation, forward);
    }
    return this.batchedLink.request(operation, forward);
  }    
  concatBatchedLink(link: ApolloLink) {
    this.batchedLink = link.concat(this.batchedLink);
    return this;
  }
}

export function createHybridLink(opts: HybridLinkOptions) {
  return new HTTPHybridLink(opts);
}
