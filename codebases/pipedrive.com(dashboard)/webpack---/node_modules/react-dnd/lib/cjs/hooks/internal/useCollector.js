"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shallowEqual = require('shallowequal');
var react_1 = require("react");
/**
 *
 * @param monitor The monitor to colelct state from
 * @param collect The collecting function
 * @param onUpdate A method to invoke when updates occur
 */
function useCollector(monitor, collect, onUpdate) {
    var _a = react_1.useState(function () { return collect(monitor); }), collected = _a[0], setCollected = _a[1];
    var updateCollected = react_1.useCallback(function () {
        var nextValue = collect(monitor);
        if (!shallowEqual(collected, nextValue)) {
            setCollected(nextValue);
            if (onUpdate) {
                onUpdate();
            }
        }
    }, [collected, monitor, onUpdate]);
    return [collected, updateCollected];
}
exports.useCollector = useCollector;
