"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specUnmounted = exports.specParsed = exports.removeSpec = exports.upsertSpec = exports.SPEC_UNMOUNTED = exports.SPEC_PARSED = exports.REMOVE_SPEC = exports.UPSERT_SPEC = void 0;
exports.UPSERT_SPEC = 'UPSERT_SPEC';
exports.REMOVE_SPEC = 'REMOVE_SPEC';
exports.SPEC_PARSED = 'SPEC_PARSED';
exports.SPEC_UNMOUNTED = 'SPEC_UNMOUNTED';
function upsertSpec(spec) {
    return { type: exports.UPSERT_SPEC, spec: spec };
}
exports.upsertSpec = upsertSpec;
function removeSpec(id) {
    return { type: exports.REMOVE_SPEC, id: id };
}
exports.removeSpec = removeSpec;
function specParsed() {
    return { type: exports.SPEC_PARSED };
}
exports.specParsed = specParsed;
function specUnmounted() {
    return { type: exports.SPEC_UNMOUNTED };
}
exports.specUnmounted = specUnmounted;
//# sourceMappingURL=specs.js.map