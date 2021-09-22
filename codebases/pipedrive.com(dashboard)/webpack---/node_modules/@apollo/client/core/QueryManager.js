import { __assign, __awaiter, __generator } from "tslib";
import { invariant, InvariantError } from 'ts-invariant';
import { equal } from '@wry/equality';
import { execute } from "../link/core/index.js";
import { getDefaultValues, getOperationDefinition, getOperationName, hasClientExports, graphQLResultHasError, removeConnectionDirectiveFromDocument, canUseWeakMap, Observable, asyncMap, isNonEmptyArray, Concast, } from "../utilities/index.js";
import { ApolloError, isApolloError } from "../errors/index.js";
import { MutationStore } from "./MutationStore.js";
import { ObservableQuery } from "./ObservableQuery.js";
import { NetworkStatus, isNetworkRequestInFlight } from "./networkStatus.js";
import { LocalState } from "./LocalState.js";
import { QueryInfo, shouldWriteResult } from "./QueryInfo.js";
var hasOwnProperty = Object.prototype.hasOwnProperty;
var QueryManager = (function () {
    function QueryManager(_a) {
        var cache = _a.cache, link = _a.link, _b = _a.queryDeduplication, queryDeduplication = _b === void 0 ? false : _b, _c = _a.onBroadcast, onBroadcast = _c === void 0 ? function () { return undefined; } : _c, _d = _a.ssrMode, ssrMode = _d === void 0 ? false : _d, _e = _a.clientAwareness, clientAwareness = _e === void 0 ? {} : _e, localState = _a.localState, assumeImmutableResults = _a.assumeImmutableResults;
        this.mutationStore = new MutationStore();
        this.clientAwareness = {};
        this.queries = new Map();
        this.fetchCancelFns = new Map();
        this.transformCache = new (canUseWeakMap ? WeakMap : Map)();
        this.queryIdCounter = 1;
        this.requestIdCounter = 1;
        this.mutationIdCounter = 1;
        this.inFlightLinkObservables = new Map();
        this.cache = cache;
        this.link = link;
        this.queryDeduplication = queryDeduplication;
        this.onBroadcast = onBroadcast;
        this.clientAwareness = clientAwareness;
        this.localState = localState || new LocalState({ cache: cache });
        this.ssrMode = ssrMode;
        this.assumeImmutableResults = !!assumeImmutableResults;
    }
    QueryManager.prototype.stop = function () {
        var _this = this;
        this.queries.forEach(function (_info, queryId) {
            _this.stopQueryNoBroadcast(queryId);
        });
        this.cancelPendingFetches(process.env.NODE_ENV === "production" ? new InvariantError(12) : new InvariantError('QueryManager stopped while query was in flight'));
    };
    QueryManager.prototype.cancelPendingFetches = function (error) {
        this.fetchCancelFns.forEach(function (cancel) { return cancel(error); });
        this.fetchCancelFns.clear();
    };
    QueryManager.prototype.mutate = function (_a) {
        var mutation = _a.mutation, variables = _a.variables, optimisticResponse = _a.optimisticResponse, updateQueriesByName = _a.updateQueries, _b = _a.refetchQueries, refetchQueries = _b === void 0 ? [] : _b, _c = _a.awaitRefetchQueries, awaitRefetchQueries = _c === void 0 ? false : _c, updateWithProxyFn = _a.update, _d = _a.errorPolicy, errorPolicy = _d === void 0 ? 'none' : _d, fetchPolicy = _a.fetchPolicy, _e = _a.context, context = _e === void 0 ? {} : _e;
        return __awaiter(this, void 0, void 0, function () {
            var mutationId, generateUpdateQueriesInfo, optimistic_1, self;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        process.env.NODE_ENV === "production" ? invariant(mutation, 13) : invariant(mutation, 'mutation option is required. You must specify your GraphQL document in the mutation option.');
                        process.env.NODE_ENV === "production" ? invariant(!fetchPolicy || fetchPolicy === 'no-cache', 14) : invariant(!fetchPolicy || fetchPolicy === 'no-cache', "Mutations only support a 'no-cache' fetchPolicy. If you don't want to disable the cache, remove your fetchPolicy setting to proceed with the default mutation behavior.");
                        mutationId = this.generateMutationId();
                        mutation = this.transform(mutation).document;
                        variables = this.getVariables(mutation, variables);
                        if (!this.transform(mutation).hasClientExports) return [3, 2];
                        return [4, this.localState.addExportedVariables(mutation, variables, context)];
                    case 1:
                        variables = _f.sent();
                        _f.label = 2;
                    case 2:
                        generateUpdateQueriesInfo = function () {
                            var ret = {};
                            if (updateQueriesByName) {
                                _this.queries.forEach(function (_a, queryId) {
                                    var observableQuery = _a.observableQuery;
                                    if (observableQuery) {
                                        var queryName = observableQuery.queryName;
                                        if (queryName &&
                                            hasOwnProperty.call(updateQueriesByName, queryName)) {
                                            ret[queryId] = {
                                                updater: updateQueriesByName[queryName],
                                                queryInfo: _this.queries.get(queryId),
                                            };
                                        }
                                    }
                                });
                            }
                            return ret;
                        };
                        this.mutationStore.initMutation(mutationId, mutation, variables);
                        if (optimisticResponse) {
                            optimistic_1 = typeof optimisticResponse === 'function'
                                ? optimisticResponse(variables)
                                : optimisticResponse;
                            this.cache.recordOptimisticTransaction(function (cache) {
                                try {
                                    markMutationResult({
                                        mutationId: mutationId,
                                        result: { data: optimistic_1 },
                                        document: mutation,
                                        variables: variables,
                                        errorPolicy: errorPolicy,
                                        queryUpdatersById: generateUpdateQueriesInfo(),
                                        update: updateWithProxyFn,
                                    }, cache);
                                }
                                catch (error) {
                                    process.env.NODE_ENV === "production" || invariant.error(error);
                                }
                            }, mutationId);
                        }
                        this.broadcastQueries();
                        self = this;
                        return [2, new Promise(function (resolve, reject) {
                                var storeResult;
                                var error;
                                self.getObservableFromLink(mutation, __assign(__assign({}, context), { optimisticResponse: optimisticResponse }), variables, false).subscribe({
                                    next: function (result) {
                                        if (graphQLResultHasError(result) && errorPolicy === 'none') {
                                            error = new ApolloError({
                                                graphQLErrors: result.errors,
                                            });
                                            return;
                                        }
                                        self.mutationStore.markMutationResult(mutationId);
                                        if (fetchPolicy !== 'no-cache') {
                                            try {
                                                markMutationResult({
                                                    mutationId: mutationId,
                                                    result: result,
                                                    document: mutation,
                                                    variables: variables,
                                                    errorPolicy: errorPolicy,
                                                    queryUpdatersById: generateUpdateQueriesInfo(),
                                                    update: updateWithProxyFn,
                                                }, self.cache);
                                            }
                                            catch (e) {
                                                error = new ApolloError({
                                                    networkError: e,
                                                });
                                                return;
                                            }
                                        }
                                        storeResult = result;
                                    },
                                    error: function (err) {
                                        self.mutationStore.markMutationError(mutationId, err);
                                        if (optimisticResponse) {
                                            self.cache.removeOptimistic(mutationId);
                                        }
                                        self.broadcastQueries();
                                        reject(new ApolloError({
                                            networkError: err,
                                        }));
                                    },
                                    complete: function () {
                                        if (error) {
                                            self.mutationStore.markMutationError(mutationId, error);
                                        }
                                        if (optimisticResponse) {
                                            self.cache.removeOptimistic(mutationId);
                                        }
                                        self.broadcastQueries();
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        if (typeof refetchQueries === 'function') {
                                            refetchQueries = refetchQueries(storeResult);
                                        }
                                        var refetchQueryPromises = [];
                                        if (isNonEmptyArray(refetchQueries)) {
                                            refetchQueries.forEach(function (refetchQuery) {
                                                if (typeof refetchQuery === 'string') {
                                                    self.queries.forEach(function (_a) {
                                                        var observableQuery = _a.observableQuery;
                                                        if (observableQuery &&
                                                            observableQuery.queryName === refetchQuery) {
                                                            refetchQueryPromises.push(observableQuery.refetch());
                                                        }
                                                    });
                                                }
                                                else {
                                                    var queryOptions = {
                                                        query: refetchQuery.query,
                                                        variables: refetchQuery.variables,
                                                        fetchPolicy: 'network-only',
                                                    };
                                                    if (refetchQuery.context) {
                                                        queryOptions.context = refetchQuery.context;
                                                    }
                                                    refetchQueryPromises.push(self.query(queryOptions));
                                                }
                                            });
                                        }
                                        Promise.all(awaitRefetchQueries ? refetchQueryPromises : []).then(function () {
                                            if (errorPolicy === 'ignore' &&
                                                storeResult &&
                                                graphQLResultHasError(storeResult)) {
                                                delete storeResult.errors;
                                            }
                                            resolve(storeResult);
                                        }, reject);
                                    },
                                });
                            })];
                }
            });
        });
    };
    QueryManager.prototype.fetchQuery = function (queryId, options, networkStatus) {
        return this.fetchQueryObservable(queryId, options, networkStatus).promise;
    };
    QueryManager.prototype.getQueryStore = function () {
        var store = Object.create(null);
        this.queries.forEach(function (info, queryId) {
            store[queryId] = {
                variables: info.variables,
                networkStatus: info.networkStatus,
                networkError: info.networkError,
                graphQLErrors: info.graphQLErrors,
            };
        });
        return store;
    };
    QueryManager.prototype.resetErrors = function (queryId) {
        var queryInfo = this.queries.get(queryId);
        if (queryInfo) {
            queryInfo.networkError = undefined;
            queryInfo.graphQLErrors = [];
        }
    };
    QueryManager.prototype.transform = function (document) {
        var transformCache = this.transformCache;
        if (!transformCache.has(document)) {
            var transformed = this.cache.transformDocument(document);
            var forLink = removeConnectionDirectiveFromDocument(this.cache.transformForLink(transformed));
            var clientQuery = this.localState.clientQuery(transformed);
            var serverQuery = forLink && this.localState.serverQuery(forLink);
            var cacheEntry_1 = {
                document: transformed,
                hasClientExports: hasClientExports(transformed),
                hasForcedResolvers: this.localState.shouldForceResolvers(transformed),
                clientQuery: clientQuery,
                serverQuery: serverQuery,
                defaultVars: getDefaultValues(getOperationDefinition(transformed)),
            };
            var add = function (doc) {
                if (doc && !transformCache.has(doc)) {
                    transformCache.set(doc, cacheEntry_1);
                }
            };
            add(document);
            add(transformed);
            add(clientQuery);
            add(serverQuery);
        }
        return transformCache.get(document);
    };
    QueryManager.prototype.getVariables = function (document, variables) {
        return __assign(__assign({}, this.transform(document).defaultVars), variables);
    };
    QueryManager.prototype.watchQuery = function (options) {
        options = __assign(__assign({}, options), { variables: this.getVariables(options.query, options.variables) });
        if (typeof options.notifyOnNetworkStatusChange === 'undefined') {
            options.notifyOnNetworkStatusChange = false;
        }
        var queryInfo = new QueryInfo(this.cache);
        var observable = new ObservableQuery({
            queryManager: this,
            queryInfo: queryInfo,
            options: options,
        });
        this.queries.set(observable.queryId, queryInfo);
        queryInfo.init({
            document: options.query,
            observableQuery: observable,
            variables: options.variables,
        });
        return observable;
    };
    QueryManager.prototype.query = function (options) {
        var _this = this;
        process.env.NODE_ENV === "production" ? invariant(options.query, 15) : invariant(options.query, 'query option is required. You must specify your GraphQL document ' +
            'in the query option.');
        process.env.NODE_ENV === "production" ? invariant(options.query.kind === 'Document', 16) : invariant(options.query.kind === 'Document', 'You must wrap the query string in a "gql" tag.');
        process.env.NODE_ENV === "production" ? invariant(!options.returnPartialData, 17) : invariant(!options.returnPartialData, 'returnPartialData option only supported on watchQuery.');
        process.env.NODE_ENV === "production" ? invariant(!options.pollInterval, 18) : invariant(!options.pollInterval, 'pollInterval option only supported on watchQuery.');
        var queryId = this.generateQueryId();
        return this.fetchQuery(queryId, options).finally(function () { return _this.stopQuery(queryId); });
    };
    QueryManager.prototype.generateQueryId = function () {
        return String(this.queryIdCounter++);
    };
    QueryManager.prototype.generateRequestId = function () {
        return this.requestIdCounter++;
    };
    QueryManager.prototype.generateMutationId = function () {
        return String(this.mutationIdCounter++);
    };
    QueryManager.prototype.stopQueryInStore = function (queryId) {
        this.stopQueryInStoreNoBroadcast(queryId);
        this.broadcastQueries();
    };
    QueryManager.prototype.stopQueryInStoreNoBroadcast = function (queryId) {
        var queryInfo = this.queries.get(queryId);
        if (queryInfo)
            queryInfo.stop();
    };
    QueryManager.prototype.clearStore = function () {
        this.cancelPendingFetches(process.env.NODE_ENV === "production" ? new InvariantError(19) : new InvariantError('Store reset while query was in flight (not completed in link chain)'));
        this.queries.forEach(function (queryInfo) {
            if (queryInfo.observableQuery) {
                queryInfo.networkStatus = NetworkStatus.loading;
            }
            else {
                queryInfo.stop();
            }
        });
        this.mutationStore.reset();
        return this.cache.reset();
    };
    QueryManager.prototype.resetStore = function () {
        var _this = this;
        return this.clearStore().then(function () {
            return _this.reFetchObservableQueries();
        });
    };
    QueryManager.prototype.reFetchObservableQueries = function (includeStandby) {
        var _this = this;
        if (includeStandby === void 0) { includeStandby = false; }
        var observableQueryPromises = [];
        this.queries.forEach(function (_a, queryId) {
            var observableQuery = _a.observableQuery;
            if (observableQuery && observableQuery.hasObservers()) {
                var fetchPolicy = observableQuery.options.fetchPolicy;
                observableQuery.resetLastResults();
                if (fetchPolicy !== 'cache-only' &&
                    (includeStandby || fetchPolicy !== 'standby')) {
                    observableQueryPromises.push(observableQuery.refetch());
                }
                _this.getQuery(queryId).setDiff(null);
            }
        });
        this.broadcastQueries();
        return Promise.all(observableQueryPromises);
    };
    QueryManager.prototype.setObservableQuery = function (observableQuery) {
        this.getQuery(observableQuery.queryId).setObservableQuery(observableQuery);
    };
    QueryManager.prototype.startGraphQLSubscription = function (_a) {
        var _this = this;
        var query = _a.query, fetchPolicy = _a.fetchPolicy, errorPolicy = _a.errorPolicy, variables = _a.variables, _b = _a.context, context = _b === void 0 ? {} : _b;
        query = this.transform(query).document;
        variables = this.getVariables(query, variables);
        var makeObservable = function (variables) {
            return _this.getObservableFromLink(query, context, variables, false).map(function (result) {
                if (fetchPolicy !== 'no-cache') {
                    if (shouldWriteResult(result, errorPolicy)) {
                        _this.cache.write({
                            query: query,
                            result: result.data,
                            dataId: 'ROOT_SUBSCRIPTION',
                            variables: variables,
                        });
                    }
                    _this.broadcastQueries();
                }
                if (graphQLResultHasError(result)) {
                    throw new ApolloError({
                        graphQLErrors: result.errors,
                    });
                }
                return result;
            });
        };
        if (this.transform(query).hasClientExports) {
            var observablePromise_1 = this.localState.addExportedVariables(query, variables, context).then(makeObservable);
            return new Observable(function (observer) {
                var sub = null;
                observablePromise_1.then(function (observable) { return sub = observable.subscribe(observer); }, observer.error);
                return function () { return sub && sub.unsubscribe(); };
            });
        }
        return makeObservable(variables);
    };
    QueryManager.prototype.stopQuery = function (queryId) {
        this.stopQueryNoBroadcast(queryId);
        this.broadcastQueries();
    };
    QueryManager.prototype.stopQueryNoBroadcast = function (queryId) {
        this.stopQueryInStoreNoBroadcast(queryId);
        this.removeQuery(queryId);
    };
    QueryManager.prototype.removeQuery = function (queryId) {
        this.fetchCancelFns.delete(queryId);
        this.getQuery(queryId).subscriptions.forEach(function (x) { return x.unsubscribe(); });
        this.queries.delete(queryId);
    };
    QueryManager.prototype.broadcastQueries = function () {
        this.onBroadcast();
        this.queries.forEach(function (info) { return info.notify(); });
    };
    QueryManager.prototype.getLocalState = function () {
        return this.localState;
    };
    QueryManager.prototype.getObservableFromLink = function (query, context, variables, deduplication) {
        var _this = this;
        var _a;
        if (deduplication === void 0) { deduplication = (_a = context === null || context === void 0 ? void 0 : context.queryDeduplication) !== null && _a !== void 0 ? _a : this.queryDeduplication; }
        var observable;
        var serverQuery = this.transform(query).serverQuery;
        if (serverQuery) {
            var _b = this, inFlightLinkObservables_1 = _b.inFlightLinkObservables, link = _b.link;
            var operation = {
                query: serverQuery,
                variables: variables,
                operationName: getOperationName(serverQuery) || void 0,
                context: this.prepareContext(__assign(__assign({}, context), { forceFetch: !deduplication })),
            };
            context = operation.context;
            if (deduplication) {
                var byVariables_1 = inFlightLinkObservables_1.get(serverQuery) || new Map();
                inFlightLinkObservables_1.set(serverQuery, byVariables_1);
                var varJson_1 = JSON.stringify(variables);
                observable = byVariables_1.get(varJson_1);
                if (!observable) {
                    var concast = new Concast([
                        execute(link, operation)
                    ]);
                    byVariables_1.set(varJson_1, observable = concast);
                    concast.cleanup(function () {
                        if (byVariables_1.delete(varJson_1) &&
                            byVariables_1.size < 1) {
                            inFlightLinkObservables_1.delete(serverQuery);
                        }
                    });
                }
            }
            else {
                observable = new Concast([
                    execute(link, operation)
                ]);
            }
        }
        else {
            observable = new Concast([
                Observable.of({ data: {} })
            ]);
            context = this.prepareContext(context);
        }
        var clientQuery = this.transform(query).clientQuery;
        if (clientQuery) {
            observable = asyncMap(observable, function (result) {
                return _this.localState.runResolvers({
                    document: clientQuery,
                    remoteResult: result,
                    context: context,
                    variables: variables,
                });
            });
        }
        return observable;
    };
    QueryManager.prototype.getResultsFromLink = function (queryInfo, allowCacheWrite, options) {
        var lastRequestId = queryInfo.lastRequestId;
        return asyncMap(this.getObservableFromLink(queryInfo.document, options.context, options.variables), function (result) {
            var hasErrors = isNonEmptyArray(result.errors);
            if (lastRequestId >= queryInfo.lastRequestId) {
                if (hasErrors && options.errorPolicy === "none") {
                    throw queryInfo.markError(new ApolloError({
                        graphQLErrors: result.errors,
                    }));
                }
                queryInfo.markResult(result, options, allowCacheWrite);
                queryInfo.markReady();
            }
            var aqr = {
                data: result.data,
                loading: false,
                networkStatus: queryInfo.networkStatus || NetworkStatus.ready,
            };
            if (hasErrors && options.errorPolicy !== "ignore") {
                aqr.errors = result.errors;
            }
            return aqr;
        }, function (networkError) {
            var error = isApolloError(networkError)
                ? networkError
                : new ApolloError({ networkError: networkError });
            if (lastRequestId >= queryInfo.lastRequestId) {
                queryInfo.markError(error);
            }
            throw error;
        });
    };
    QueryManager.prototype.fetchQueryObservable = function (queryId, options, networkStatus) {
        var _this = this;
        if (networkStatus === void 0) { networkStatus = NetworkStatus.loading; }
        var query = this.transform(options.query).document;
        var variables = this.getVariables(query, options.variables);
        var queryInfo = this.getQuery(queryId);
        var oldNetworkStatus = queryInfo.networkStatus;
        var _a = options.fetchPolicy, fetchPolicy = _a === void 0 ? "cache-first" : _a, _b = options.errorPolicy, errorPolicy = _b === void 0 ? "none" : _b, _c = options.returnPartialData, returnPartialData = _c === void 0 ? false : _c, _d = options.notifyOnNetworkStatusChange, notifyOnNetworkStatusChange = _d === void 0 ? false : _d, _e = options.context, context = _e === void 0 ? {} : _e;
        var mightUseNetwork = fetchPolicy === "cache-first" ||
            fetchPolicy === "cache-and-network" ||
            fetchPolicy === "network-only" ||
            fetchPolicy === "no-cache";
        if (mightUseNetwork &&
            notifyOnNetworkStatusChange &&
            typeof oldNetworkStatus === "number" &&
            oldNetworkStatus !== networkStatus &&
            isNetworkRequestInFlight(networkStatus)) {
            if (fetchPolicy !== "cache-first") {
                fetchPolicy = "cache-and-network";
            }
            returnPartialData = true;
        }
        var normalized = Object.assign({}, options, {
            query: query,
            variables: variables,
            fetchPolicy: fetchPolicy,
            errorPolicy: errorPolicy,
            returnPartialData: returnPartialData,
            notifyOnNetworkStatusChange: notifyOnNetworkStatusChange,
            context: context,
        });
        var fromVariables = function (variables) {
            normalized.variables = variables;
            return _this.fetchQueryByPolicy(queryInfo, normalized, networkStatus);
        };
        this.fetchCancelFns.set(queryId, function (reason) {
            Promise.resolve().then(function () { return concast.cancel(reason); });
        });
        var concast = new Concast(this.transform(normalized.query).hasClientExports
            ? this.localState.addExportedVariables(normalized.query, normalized.variables, normalized.context).then(fromVariables)
            : fromVariables(normalized.variables));
        concast.cleanup(function () {
            _this.fetchCancelFns.delete(queryId);
            var nextFetchPolicy = options.nextFetchPolicy;
            if (nextFetchPolicy) {
                options.nextFetchPolicy = void 0;
                options.fetchPolicy = typeof nextFetchPolicy === "function"
                    ? nextFetchPolicy.call(options, options.fetchPolicy || "cache-first")
                    : nextFetchPolicy;
            }
        });
        return concast;
    };
    QueryManager.prototype.fetchQueryByPolicy = function (queryInfo, options, networkStatus) {
        var _this = this;
        var query = options.query, variables = options.variables, fetchPolicy = options.fetchPolicy, errorPolicy = options.errorPolicy, returnPartialData = options.returnPartialData, context = options.context;
        queryInfo.init({
            document: query,
            variables: variables,
            lastRequestId: this.generateRequestId(),
            networkStatus: networkStatus,
        });
        var readCache = function () { return queryInfo.getDiff(variables); };
        var resultsFromCache = function (diff, networkStatus) {
            if (networkStatus === void 0) { networkStatus = queryInfo.networkStatus || NetworkStatus.loading; }
            var data = diff.result;
            if (process.env.NODE_ENV !== 'production' &&
                isNonEmptyArray(diff.missing) &&
                !equal(data, {}) &&
                !returnPartialData) {
                process.env.NODE_ENV === "production" || invariant.warn("Missing cache result fields: " + diff.missing.map(function (m) { return m.path.join('.'); }).join(', '), diff.missing);
            }
            var fromData = function (data) { return Observable.of(__assign({ data: data, loading: isNetworkRequestInFlight(networkStatus), networkStatus: networkStatus }, (diff.complete ? null : { partial: true }))); };
            if (_this.transform(query).hasForcedResolvers) {
                return _this.localState.runResolvers({
                    document: query,
                    remoteResult: { data: data },
                    context: context,
                    variables: variables,
                    onlyRunForcedResolvers: true,
                }).then(function (resolved) { return fromData(resolved.data); });
            }
            return fromData(data);
        };
        var resultsFromLink = function (allowCacheWrite) {
            return _this.getResultsFromLink(queryInfo, allowCacheWrite, {
                variables: variables,
                context: context,
                fetchPolicy: fetchPolicy,
                errorPolicy: errorPolicy,
            });
        };
        switch (fetchPolicy) {
            default:
            case "cache-first": {
                var diff = readCache();
                if (diff.complete) {
                    return [
                        resultsFromCache(diff, queryInfo.markReady()),
                    ];
                }
                if (returnPartialData) {
                    return [
                        resultsFromCache(diff),
                        resultsFromLink(true),
                    ];
                }
                return [
                    resultsFromLink(true),
                ];
            }
            case "cache-and-network": {
                var diff = readCache();
                if (diff.complete || returnPartialData) {
                    return [
                        resultsFromCache(diff),
                        resultsFromLink(true),
                    ];
                }
                return [
                    resultsFromLink(true),
                ];
            }
            case "cache-only":
                return [
                    resultsFromCache(readCache(), queryInfo.markReady()),
                ];
            case "network-only":
                return [resultsFromLink(true)];
            case "no-cache":
                return [resultsFromLink(false)];
            case "standby":
                return [];
        }
    };
    QueryManager.prototype.getQuery = function (queryId) {
        if (queryId && !this.queries.has(queryId)) {
            this.queries.set(queryId, new QueryInfo(this.cache));
        }
        return this.queries.get(queryId);
    };
    QueryManager.prototype.prepareContext = function (context) {
        if (context === void 0) { context = {}; }
        var newContext = this.localState.prepareContext(context);
        return __assign(__assign({}, newContext), { clientAwareness: this.clientAwareness });
    };
    return QueryManager;
}());
export { QueryManager };
function markMutationResult(mutation, cache) {
    if (shouldWriteResult(mutation.result, mutation.errorPolicy)) {
        var cacheWrites_1 = [{
                result: mutation.result.data,
                dataId: 'ROOT_MUTATION',
                query: mutation.document,
                variables: mutation.variables,
            }];
        var queryUpdatersById_1 = mutation.queryUpdatersById;
        if (queryUpdatersById_1) {
            Object.keys(queryUpdatersById_1).forEach(function (id) {
                var _a = queryUpdatersById_1[id], updater = _a.updater, _b = _a.queryInfo, document = _b.document, variables = _b.variables;
                var _c = cache.diff({
                    query: document,
                    variables: variables,
                    returnPartialData: true,
                    optimistic: false,
                }), currentQueryResult = _c.result, complete = _c.complete;
                if (complete && currentQueryResult) {
                    var nextQueryResult = updater(currentQueryResult, {
                        mutationResult: mutation.result,
                        queryName: getOperationName(document) || undefined,
                        queryVariables: variables,
                    });
                    if (nextQueryResult) {
                        cacheWrites_1.push({
                            result: nextQueryResult,
                            dataId: 'ROOT_QUERY',
                            query: document,
                            variables: variables,
                        });
                    }
                }
            });
        }
        cache.performTransaction(function (c) {
            cacheWrites_1.forEach(function (write) { return c.write(write); });
            var update = mutation.update;
            if (update) {
                update(c, mutation.result);
            }
        }, null);
    }
}
//# sourceMappingURL=QueryManager.js.map