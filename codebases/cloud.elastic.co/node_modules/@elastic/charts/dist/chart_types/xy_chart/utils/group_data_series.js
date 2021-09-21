"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueKey = exports.groupBy = void 0;
function groupBy(data, keysOrKeyFn, asArray) {
    var keyFn = Array.isArray(keysOrKeyFn) ? getUniqueKey(keysOrKeyFn) : keysOrKeyFn;
    var grouped = data.reduce(function (acc, curr) {
        var key = keyFn(curr);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
    return asArray ? Object.values(grouped) : grouped;
}
exports.groupBy = groupBy;
function getUniqueKey(keys, concat) {
    if (concat === void 0) { concat = '|'; }
    return function (data) {
        return keys
            .map(function (key) {
            return data[key];
        })
            .join(concat);
    };
}
exports.getUniqueKey = getUniqueKey;
//# sourceMappingURL=group_data_series.js.map