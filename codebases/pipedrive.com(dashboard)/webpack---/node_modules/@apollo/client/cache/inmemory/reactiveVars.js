import { Slot } from "@wry/context";
import { dep } from "optimism";
var varDep = dep();
export var cacheSlot = new Slot();
function consumeAndIterate(set, callback) {
    var items = [];
    set.forEach(function (item) { return items.push(item); });
    set.clear();
    items.forEach(callback);
}
export function makeVar(value) {
    var caches = new Set();
    var listeners = new Set();
    var rv = function (newValue) {
        if (arguments.length > 0) {
            if (value !== newValue) {
                value = newValue;
                varDep.dirty(rv);
                caches.forEach(broadcast);
                consumeAndIterate(listeners, function (listener) { return listener(value); });
            }
        }
        else {
            var cache = cacheSlot.getValue();
            if (cache)
                caches.add(cache);
            varDep(rv);
        }
        return value;
    };
    rv.onNextChange = function (listener) {
        listeners.add(listener);
        return function () {
            listeners.delete(listener);
        };
    };
    return rv;
}
function broadcast(cache) {
    if (cache.broadcastWatches) {
        cache.broadcastWatches();
    }
}
//# sourceMappingURL=reactiveVars.js.map