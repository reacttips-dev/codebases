"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monotonicHillClimb = exports.integerSnap = void 0;
function integerSnap(n) {
    return Math.floor(n);
}
exports.integerSnap = integerSnap;
function monotonicHillClimb(getResponse, maxVar, responseUpperConstraint, domainSnap, minVar) {
    if (domainSnap === void 0) { domainSnap = function (n) { return n; }; }
    if (minVar === void 0) { minVar = 0; }
    var loVar = domainSnap(minVar);
    var loResponse = getResponse(loVar);
    var hiVar = domainSnap(maxVar);
    var hiResponse = getResponse(hiVar);
    if (loResponse > responseUpperConstraint || loVar > hiVar) {
        return NaN;
    }
    if (hiResponse <= responseUpperConstraint) {
        return hiVar;
    }
    var pivotVar = NaN;
    var pivotResponse = NaN;
    var lastPivotResponse = NaN;
    while (loVar < hiVar) {
        var newPivotVar = (loVar + hiVar) / 2;
        var newPivotResponse = getResponse(domainSnap(newPivotVar));
        if (newPivotResponse === pivotResponse || newPivotResponse === lastPivotResponse) {
            return domainSnap(loVar);
        }
        pivotVar = newPivotVar;
        lastPivotResponse = pivotResponse;
        pivotResponse = newPivotResponse;
        var pivotIsCompliant = pivotResponse <= responseUpperConstraint;
        if (pivotIsCompliant) {
            loVar = pivotVar;
        }
        else {
            hiVar = pivotVar;
            hiResponse = pivotResponse;
        }
    }
    return domainSnap(pivotVar);
}
exports.monotonicHillClimb = monotonicHillClimb;
//# sourceMappingURL=monotonic_hill_climb.js.map