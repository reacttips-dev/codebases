import { ApolloLink, Observable } from 'apollo-link';
var sha256 = require('hash.js/lib/hash/sha/256');
import { print } from 'graphql/language/printer';
export var VERSION = 1;
export var defaultGenerateHash = function (query) {
    return sha256()
        .update(print(query))
        .digest('hex');
};
export var defaultOptions = {
    generateHash: defaultGenerateHash,
    disable: function (_a) {
        var graphQLErrors = _a.graphQLErrors, operation = _a.operation;
        if (graphQLErrors &&
            graphQLErrors.some(function (_a) {
                var message = _a.message;
                return message === 'PersistedQueryNotSupported';
            })) {
            return true;
        }
        var response = operation.getContext().response;
        if (response &&
            response.status &&
            (response.status === 400 || response.status === 500)) {
            return true;
        }
        return false;
    },
    useGETForHashedQueries: false,
};
function definitionIsMutation(d) {
    return d.kind === 'OperationDefinition' && d.operation === 'mutation';
}
function operationIsQuery(operation) {
    return !operation.query.definitions.some(definitionIsMutation);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hashesKeyString = '__createPersistedQueryLink_hashes';
var hashesKey = typeof Symbol === 'function'
    ? Symbol.for(hashesKeyString)
    : hashesKeyString;
var nextHashesChildKey = 0;
export var createPersistedQueryLink = function (options) {
    if (options === void 0) { options = {}; }
    var _a = Object.assign({}, defaultOptions, options), generateHash = _a.generateHash, disable = _a.disable, useGETForHashedQueries = _a.useGETForHashedQueries;
    var supportsPersistedQueries = true;
    var hashesChildKey = 'forLink' + nextHashesChildKey++;
    function getQueryHash(query) {
        if (!query || typeof query !== "object") {
            return generateHash(query);
        }
        if (!hasOwnProperty.call(query, hashesKey)) {
            Object.defineProperty(query, hashesKey, {
                value: Object.create(null),
                enumerable: false,
            });
        }
        var hashes = query[hashesKey];
        return hasOwnProperty.call(hashes, hashesChildKey)
            ? hashes[hashesChildKey]
            : hashes[hashesChildKey] = generateHash(query);
    }
    return new ApolloLink(function (operation, forward) {
        if (!forward) {
            throw new Error('PersistedQueryLink cannot be the last link in the chain.');
        }
        var query = operation.query;
        var hashError;
        if (supportsPersistedQueries) {
            try {
                operation.extensions.persistedQuery = {
                    version: VERSION,
                    sha256Hash: getQueryHash(query),
                };
            }
            catch (e) {
                hashError = e;
            }
        }
        return new Observable(function (observer) {
            if (hashError) {
                observer.error(hashError);
                return;
            }
            var subscription;
            var retried = false;
            var originalFetchOptions;
            var setFetchOptions = false;
            var retry = function (_a, cb) {
                var response = _a.response, networkError = _a.networkError;
                if (!retried && ((response && response.errors) || networkError)) {
                    retried = true;
                    var disablePayload = {
                        response: response,
                        networkError: networkError,
                        operation: operation,
                        graphQLErrors: response ? response.errors : undefined,
                    };
                    supportsPersistedQueries = !disable(disablePayload);
                    if ((response &&
                        response.errors &&
                        response.errors.some(function (_a) {
                            var message = _a.message;
                            return message === 'PersistedQueryNotFound';
                        })) ||
                        !supportsPersistedQueries) {
                        if (subscription)
                            subscription.unsubscribe();
                        operation.setContext({
                            http: {
                                includeQuery: true,
                                includeExtensions: supportsPersistedQueries,
                            },
                        });
                        if (setFetchOptions) {
                            operation.setContext({ fetchOptions: originalFetchOptions });
                        }
                        subscription = forward(operation).subscribe(handler);
                        return;
                    }
                }
                cb();
            };
            var handler = {
                next: function (response) {
                    retry({ response: response }, function () { return observer.next(response); });
                },
                error: function (networkError) {
                    retry({ networkError: networkError }, function () { return observer.error(networkError); });
                },
                complete: observer.complete.bind(observer),
            };
            operation.setContext({
                http: {
                    includeQuery: !supportsPersistedQueries,
                    includeExtensions: supportsPersistedQueries,
                },
            });
            if (useGETForHashedQueries &&
                supportsPersistedQueries &&
                operationIsQuery(operation)) {
                operation.setContext(function (_a) {
                    var _b = _a.fetchOptions, fetchOptions = _b === void 0 ? {} : _b;
                    originalFetchOptions = fetchOptions;
                    return {
                        fetchOptions: Object.assign({}, fetchOptions, { method: 'GET' }),
                    };
                });
                setFetchOptions = true;
            }
            subscription = forward(operation).subscribe(handler);
            return function () {
                if (subscription)
                    subscription.unsubscribe();
            };
        });
    });
};
//# sourceMappingURL=index.js.map