import { equal } from "@wry/equality";
import { isNonEmptyArray, graphQLResultHasError, canUseWeakMap, } from "../utilities/index.js";
import { NetworkStatus, isNetworkRequestInFlight, } from "./networkStatus.js";
var destructiveMethodCounts = new (canUseWeakMap ? WeakMap : Map)();
function wrapDestructiveCacheMethod(cache, methodName) {
    var original = cache[methodName];
    if (typeof original === "function") {
        cache[methodName] = function () {
            destructiveMethodCounts.set(cache, (destructiveMethodCounts.get(cache) + 1) % 1e15);
            return original.apply(this, arguments);
        };
    }
}
function cancelNotifyTimeout(info) {
    if (info["notifyTimeout"]) {
        clearTimeout(info["notifyTimeout"]);
        info["notifyTimeout"] = void 0;
    }
}
var QueryInfo = (function () {
    function QueryInfo(cache) {
        this.cache = cache;
        this.listeners = new Set();
        this.document = null;
        this.lastRequestId = 1;
        this.subscriptions = new Set();
        this.stopped = false;
        this.dirty = false;
        this.diff = null;
        this.observableQuery = null;
        if (!destructiveMethodCounts.has(cache)) {
            destructiveMethodCounts.set(cache, 0);
            wrapDestructiveCacheMethod(cache, "evict");
            wrapDestructiveCacheMethod(cache, "modify");
            wrapDestructiveCacheMethod(cache, "reset");
        }
    }
    QueryInfo.prototype.init = function (query) {
        var networkStatus = query.networkStatus || NetworkStatus.loading;
        if (this.variables &&
            this.networkStatus !== NetworkStatus.loading &&
            !equal(this.variables, query.variables)) {
            networkStatus = NetworkStatus.setVariables;
        }
        if (!equal(query.variables, this.variables)) {
            this.diff = null;
        }
        Object.assign(this, {
            document: query.document,
            variables: query.variables,
            networkError: null,
            graphQLErrors: this.graphQLErrors || [],
            networkStatus: networkStatus,
        });
        if (query.observableQuery) {
            this.setObservableQuery(query.observableQuery);
        }
        if (query.lastRequestId) {
            this.lastRequestId = query.lastRequestId;
        }
        return this;
    };
    QueryInfo.prototype.reset = function () {
        cancelNotifyTimeout(this);
        this.diff = null;
        this.dirty = false;
    };
    QueryInfo.prototype.getDiff = function (variables) {
        if (variables === void 0) { variables = this.variables; }
        if (this.diff && equal(variables, this.variables)) {
            return this.diff;
        }
        this.updateWatch(this.variables = variables);
        return this.diff = this.cache.diff({
            query: this.document,
            variables: variables,
            returnPartialData: true,
            optimistic: true,
        });
    };
    QueryInfo.prototype.setDiff = function (diff) {
        var _this = this;
        var oldDiff = this.diff;
        this.diff = diff;
        if (!this.dirty &&
            (diff && diff.result) !== (oldDiff && oldDiff.result)) {
            this.dirty = true;
            if (!this.notifyTimeout) {
                this.notifyTimeout = setTimeout(function () { return _this.notify(); }, 0);
            }
        }
    };
    QueryInfo.prototype.setObservableQuery = function (oq) {
        var _this = this;
        if (oq === this.observableQuery)
            return;
        if (this.oqListener) {
            this.listeners.delete(this.oqListener);
        }
        this.observableQuery = oq;
        if (oq) {
            oq["queryInfo"] = this;
            this.listeners.add(this.oqListener = function () {
                if (_this.getDiff().fromOptimisticTransaction) {
                    oq["observe"]();
                }
                else {
                    oq.reobserve();
                }
            });
        }
        else {
            delete this.oqListener;
        }
    };
    QueryInfo.prototype.notify = function () {
        var _this = this;
        cancelNotifyTimeout(this);
        if (this.shouldNotify()) {
            this.listeners.forEach(function (listener) { return listener(_this); });
        }
        this.dirty = false;
    };
    QueryInfo.prototype.shouldNotify = function () {
        if (!this.dirty || !this.listeners.size) {
            return false;
        }
        if (isNetworkRequestInFlight(this.networkStatus) &&
            this.observableQuery) {
            var fetchPolicy = this.observableQuery.options.fetchPolicy;
            if (fetchPolicy !== "cache-only" &&
                fetchPolicy !== "cache-and-network") {
                return false;
            }
        }
        return true;
    };
    QueryInfo.prototype.stop = function () {
        if (!this.stopped) {
            this.stopped = true;
            this.reset();
            this.cancel();
            delete this.cancel;
            this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
            var oq = this.observableQuery;
            if (oq)
                oq.stopPolling();
        }
    };
    QueryInfo.prototype.cancel = function () { };
    QueryInfo.prototype.updateWatch = function (variables) {
        var _this = this;
        if (variables === void 0) { variables = this.variables; }
        var oq = this.observableQuery;
        if (oq && oq.options.fetchPolicy === "no-cache") {
            return;
        }
        if (!this.lastWatch ||
            this.lastWatch.query !== this.document ||
            !equal(variables, this.lastWatch.variables)) {
            this.cancel();
            this.cancel = this.cache.watch(this.lastWatch = {
                query: this.document,
                variables: variables,
                optimistic: true,
                callback: function (diff) { return _this.setDiff(diff); },
            });
        }
    };
    QueryInfo.prototype.shouldWrite = function (result, variables) {
        var lastWrite = this.lastWrite;
        return !(lastWrite &&
            lastWrite.dmCount === destructiveMethodCounts.get(this.cache) &&
            equal(variables, lastWrite.variables) &&
            equal(result.data, lastWrite.result.data));
    };
    QueryInfo.prototype.markResult = function (result, options, allowCacheWrite) {
        var _this = this;
        this.graphQLErrors = isNonEmptyArray(result.errors) ? result.errors : [];
        this.reset();
        if (options.fetchPolicy === 'no-cache') {
            this.diff = { result: result.data, complete: true };
        }
        else if (!this.stopped && allowCacheWrite) {
            if (shouldWriteResult(result, options.errorPolicy)) {
                this.cache.performTransaction(function (cache) {
                    if (_this.shouldWrite(result, options.variables)) {
                        cache.writeQuery({
                            query: _this.document,
                            data: result.data,
                            variables: options.variables,
                        });
                        _this.lastWrite = {
                            result: result,
                            variables: options.variables,
                            dmCount: destructiveMethodCounts.get(_this.cache),
                        };
                    }
                    else {
                        if (_this.diff && _this.diff.complete) {
                            result.data = _this.diff.result;
                            return;
                        }
                    }
                    var diff = cache.diff({
                        query: _this.document,
                        variables: options.variables,
                        returnPartialData: true,
                        optimistic: true,
                    });
                    if (!_this.stopped) {
                        _this.updateWatch(options.variables);
                    }
                    _this.diff = diff;
                    if (diff.complete) {
                        result.data = diff.result;
                    }
                });
            }
            else {
                this.lastWrite = void 0;
            }
        }
    };
    QueryInfo.prototype.markReady = function () {
        this.networkError = null;
        return this.networkStatus = NetworkStatus.ready;
    };
    QueryInfo.prototype.markError = function (error) {
        this.networkStatus = NetworkStatus.error;
        this.lastWrite = void 0;
        this.reset();
        if (error.graphQLErrors) {
            this.graphQLErrors = error.graphQLErrors;
        }
        if (error.networkError) {
            this.networkError = error.networkError;
        }
        return error;
    };
    return QueryInfo;
}());
export { QueryInfo };
export function shouldWriteResult(result, errorPolicy) {
    if (errorPolicy === void 0) { errorPolicy = "none"; }
    var ignoreErrors = errorPolicy === "ignore" ||
        errorPolicy === "all";
    var writeWithErrors = !graphQLResultHasError(result);
    if (!writeWithErrors && ignoreErrors && result.data) {
        writeWithErrors = true;
    }
    return writeWithErrors;
}
//# sourceMappingURL=QueryInfo.js.map