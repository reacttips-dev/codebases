export { ApolloClient, } from "./ApolloClient.js";
export { ObservableQuery, } from "./ObservableQuery.js";
export { NetworkStatus } from "./networkStatus.js";
export * from "./types.js";
export { isApolloError, ApolloError } from "../errors/index.js";
export { Cache, ApolloCache, InMemoryCache, MissingFieldError, defaultDataIdFromObject, makeVar, } from "../cache/index.js";
export * from "../cache/inmemory/types.js";
export * from "../link/core/index.js";
export * from "../link/http/index.js";
export { fromError, toPromise, fromPromise, throwServerError, } from "../link/utils/index.js";
export { Observable, isReference, makeReference, } from "../utilities/index.js";
import gql from 'graphql-tag';
export var resetCaches = gql.resetCaches, disableFragmentWarnings = gql.disableFragmentWarnings, enableExperimentalFragmentVariables = gql.enableExperimentalFragmentVariables, disableExperimentalFragmentVariables = gql.disableExperimentalFragmentVariables;
export { gql };
//# sourceMappingURL=index.js.map